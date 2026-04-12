import { runAdTest } from "@/lib/ad-test-engine";
import { createClient } from "@/lib/supabase/server";
import { sendAdTestReport } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isDisposableEmail } from "@/lib/email-validation";
import type { AdTestResult } from "@/types/ad-test";

export const maxDuration = 300;

const isRateLimited = createRateLimiter(2);

const MAX_NAME_LENGTH = 200;
const MAX_COPY_LENGTH = 5000;
const MAX_AUDIENCE_LENGTH = 500;

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
    const brandName = body.brandName?.trim().slice(0, MAX_NAME_LENGTH);
    if (!brandName) {
      return Response.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    const category = body.category?.trim().slice(0, 100) || "consumer products";
    const targetAudience = body.targetAudience?.trim().slice(0, MAX_AUDIENCE_LENGTH) || "";

    // Validate creatives
    const rawCreatives = body.creatives;
    if (!Array.isArray(rawCreatives) || rawCreatives.length < 1 || rawCreatives.length > 2) {
      return Response.json(
        { error: "1-2 creatives are required" },
        { status: 400 }
      );
    }

    const creatives = rawCreatives.map((c: Record<string, unknown>) => ({
      name: (typeof c.name === "string" ? c.name.trim().slice(0, MAX_NAME_LENGTH) : "") || "Untitled",
      adCopy: typeof c.adCopy === "string" ? c.adCopy.trim().slice(0, MAX_COPY_LENGTH) : "",
      ...(typeof c.imageUrl === "string" && c.imageUrl.trim() && {
        imageUrl: c.imageUrl.trim().slice(0, 2000),
      }),
    }));

    for (const creative of creatives) {
      if (!creative.adCopy) {
        return Response.json(
          { error: "Ad copy is required for each creative" },
          { status: 400 }
        );
      }
    }

    const mode = creatives.length === 2 ? "ab" : "single";

    // Quota check
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
      if (!quota.allowed) {
        return Response.json({
          error: `You've used all ${quota.limit} research runs this month on the ${quota.plan} plan. Upgrade at hypetest.ai/pricing for more.`,
        }, { status: 403 });
      }
    }

    const result = await runAdTest({
      brandName,
      category,
      targetAudience,
      creatives,
      mode,
    });

    const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 200) : null;
    const userCompany = typeof body.userCompany === "string" ? body.userCompany.trim().slice(0, 200) : null;
    const userRole = typeof body.userRole === "string" ? body.userRole.trim().slice(0, 100) : null;
    const userCompanySize = typeof body.userCompanySize === "string" ? body.userCompanySize.trim().slice(0, 50) : null;
    const utmSource = typeof body.utmSource === "string" ? body.utmSource.slice(0, 200) : null;
    const utmMedium = typeof body.utmMedium === "string" ? body.utmMedium.slice(0, 200) : null;
    const utmCampaign = typeof body.utmCampaign === "string" ? body.utmCampaign.slice(0, 200) : null;
    const referrerUrl = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    // Persist to Supabase (non-blocking)
    persistAdTestResult(result, {
      email, userName, userCompany, userRole, userCompanySize,
      utmSource, utmMedium, utmCampaign, referrer: referrerUrl,
    }).catch((err) => console.error("Failed to persist ad test result:", err));

    // Track usage and ensure user record exists
    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined, userCompanySize || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);

      const creativeNames = creatives.map((c: { name: string }) => c.name);
      sendAdTestReport(email, creativeNames, result.id).catch(
        (err) => console.error("Failed to send ad test email:", err)
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Ad test engine error:", error);
    const message =
      error instanceof Error && error.message.includes("Too few persona")
        ? error.message
        : "Ad test failed. Please try again.";
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

async function persistAdTestResult(result: AdTestResult, user: UserInfo) {
  const supabase = await createClient();
  const { error } = await supabase.from("ad_test_results").insert({
    id: result.id,
    input: result.input,
    results: result.results,
    winner: result.winner || null,
    win_margin: result.winMargin || null,
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
