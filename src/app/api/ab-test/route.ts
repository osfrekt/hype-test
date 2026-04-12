import { runAbTest } from "@/lib/ab-test-engine";
import { createClient } from "@/lib/supabase/server";
import { sendAbTestReport } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isDisposableEmail } from "@/lib/email-validation";
import type { ResearchInput } from "@/types/research";
import type { AbTestResult } from "@/types/ab-test";

export const maxDuration = 300;

const isRateLimited = createRateLimiter(2);

const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 20_000) {
      return Response.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const nameA = body.conceptA?.productName?.trim().slice(0, MAX_NAME_LENGTH);
    const descA = body.conceptA?.productDescription?.trim().slice(0, MAX_DESCRIPTION_LENGTH);
    const nameB = body.conceptB?.productName?.trim().slice(0, MAX_NAME_LENGTH);
    const descB = body.conceptB?.productDescription?.trim().slice(0, MAX_DESCRIPTION_LENGTH);

    if (!nameA || !descA || !nameB || !descB) {
      return Response.json(
        { error: "Both concepts require a product name and description" },
        { status: 400 }
      );
    }

    // Quota check - A/B test counts as 2 research runs
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : null;

    // Block disposable emails
    if (email && isDisposableEmail(email)) {
      return Response.json(
        { error: "Please use a work or personal email address. Disposable email addresses are not accepted." },
        { status: 400 }
      );
    }

    if (email) {
      const quota = await checkQuota(email, "research");
      if (!quota.allowed || (quota.remaining !== -1 && quota.remaining < 2)) {
        return Response.json({
          error: `A/B testing requires 2 research credits. You have ${quota.remaining} remaining on the ${quota.plan} plan. Upgrade at hypetest.ai/pricing for more.`,
        }, { status: 403 });
      }
    }

    const category = body.category?.trim().slice(0, 100) || "consumer products";

    const sanitizedA: ResearchInput = {
      productName: nameA,
      productDescription: descA,
      category,
      ...(body.conceptA?.keyFeatures?.length && {
        keyFeatures: body.conceptA.keyFeatures.slice(0, 10).map((f: string) => f.trim().slice(0, 200)),
      }),
      ...(body.conceptA?.priceRange &&
        typeof body.conceptA.priceRange.min === "number" &&
        typeof body.conceptA.priceRange.max === "number" && {
          priceRange: {
            min: Math.max(0, body.conceptA.priceRange.min),
            max: Math.min(1_000_000, body.conceptA.priceRange.max),
          },
        }),
    };

    const sanitizedB: ResearchInput = {
      productName: nameB,
      productDescription: descB,
      category,
      ...(body.conceptB?.keyFeatures?.length && {
        keyFeatures: body.conceptB.keyFeatures.slice(0, 10).map((f: string) => f.trim().slice(0, 200)),
      }),
      ...(body.conceptB?.priceRange &&
        typeof body.conceptB.priceRange.min === "number" &&
        typeof body.conceptB.priceRange.max === "number" && {
          priceRange: {
            min: Math.max(0, body.conceptB.priceRange.min),
            max: Math.min(1_000_000, body.conceptB.priceRange.max),
          },
        }),
    };

    const targetConsumer = body.targetConsumer?.trim().slice(0, 500) || undefined;

    const result = await runAbTest(sanitizedA, sanitizedB, category, targetConsumer);

    const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 200) : null;
    const userCompany = typeof body.userCompany === "string" ? body.userCompany.trim().slice(0, 200) : null;
    const userRole = typeof body.userRole === "string" ? body.userRole.trim().slice(0, 100) : null;
    const userCompanySize = typeof body.userCompanySize === "string" ? body.userCompanySize.trim().slice(0, 50) : null;
    const utmSource = typeof body.utmSource === "string" ? body.utmSource.slice(0, 200) : null;
    const utmMedium = typeof body.utmMedium === "string" ? body.utmMedium.slice(0, 200) : null;
    const utmCampaign = typeof body.utmCampaign === "string" ? body.utmCampaign.slice(0, 200) : null;
    const referrerUrl = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    // Persist to Supabase (non-blocking)
    persistAbTestResult(result, {
      email, userName, userCompany, userRole, userCompanySize,
      utmSource, utmMedium, utmCampaign, referrer: referrerUrl,
    }).catch((err) => console.error("Failed to persist A/B test result:", err));

    // Track usage (2 credits) and ensure user record exists
    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined, userCompanySize || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);
      incrementUsage(email, "research").catch(console.error);

      sendAbTestReport(email, nameA, nameB, result.id).catch(
        (err) => console.error("Failed to send A/B test email:", err)
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("A/B test engine error:", error);
    const message =
      error instanceof Error && error.message.includes("Too few persona")
        ? error.message
        : "A/B test failed. Please try again.";
    return Response.json({ error: message }, { status: 500 });
  }
}

interface UserInfo {
  email: string | null;
  userName: string | null;
  userCompany: string | null;
  userRole: string | null;
  userCompanySize: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
}

async function persistAbTestResult(result: AbTestResult, user: UserInfo) {
  const supabase = await createClient();
  const { error } = await supabase.from("ab_test_results").insert({
    id: result.id,
    concept_a: result.conceptA,
    concept_b: result.conceptB,
    winner: result.winner,
    win_margin: result.winMargin,
    panel_size: result.panelSize,
    methodology: result.methodology,
    email: user.email,
    user_name: user.userName,
    user_company: user.userCompany,
    user_role: user.userRole,
    user_company_size: user.userCompanySize,
    utm_source: user.utmSource,
    utm_medium: user.utmMedium,
    utm_campaign: user.utmCampaign,
    referrer: user.referrer,
    status: result.status,
    created_at: result.createdAt,
  });
  if (error) throw error;
}
