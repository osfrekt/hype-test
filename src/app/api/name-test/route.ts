import { runNameTest } from "@/lib/name-test-engine";
import { createClient } from "@/lib/supabase/server";
import { sendNameTestReport } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import type { NameTestResult } from "@/types/name-test";

export const maxDuration = 300;

const isRateLimited = createRateLimiter(2);

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
    if (contentLength > 10_000) {
      return Response.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    const body = await request.json();

    // Validate
    const productDescription = body.productDescription?.trim().slice(0, MAX_DESCRIPTION_LENGTH);
    if (!productDescription) {
      return Response.json(
        { error: "Product description is required" },
        { status: 400 }
      );
    }

    const names: string[] = (body.names || [])
      .map((n: string) => (typeof n === "string" ? n.trim().slice(0, 200) : ""))
      .filter((n: string) => n.length > 0);

    if (names.length < 2) {
      return Response.json(
        { error: "At least 2 name options are required" },
        { status: 400 }
      );
    }
    if (names.length > 5) {
      return Response.json(
        { error: "Maximum 5 name options allowed" },
        { status: 400 }
      );
    }

    // Quota check
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : null;
    if (email) {
      const quota = await checkQuota(email, "research");
      if (!quota.allowed) {
        return Response.json({
          error: `You've used all ${quota.limit} research runs this month on the ${quota.plan} plan. Upgrade at hypetest.ai/pricing for more.`,
        }, { status: 403 });
      }
    }

    const category = body.category?.trim().slice(0, 100) || "consumer products";
    const targetConsumer = body.targetConsumer?.trim().slice(0, 500) || undefined;

    const result = await runNameTest(productDescription, names, category, targetConsumer);

    const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 200) : null;
    const userCompany = typeof body.userCompany === "string" ? body.userCompany.trim().slice(0, 200) : null;
    const userRole = typeof body.userRole === "string" ? body.userRole.trim().slice(0, 100) : null;
    const userCompanySize = typeof body.userCompanySize === "string" ? body.userCompanySize.trim().slice(0, 50) : null;
    const utmSource = typeof body.utmSource === "string" ? body.utmSource.slice(0, 200) : null;
    const utmMedium = typeof body.utmMedium === "string" ? body.utmMedium.slice(0, 200) : null;
    const utmCampaign = typeof body.utmCampaign === "string" ? body.utmCampaign.slice(0, 200) : null;
    const referrerUrl = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    // Persist (non-blocking)
    persistNameTestResult(result, {
      email, userName, userCompany, userRole, userCompanySize,
      utmSource, utmMedium, utmCampaign, referrer: referrerUrl,
    }).catch((err) => console.error("Failed to persist name test result:", err));

    // Track usage
    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined, userCompanySize || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);

      sendNameTestReport(email, names, result.id).catch(
        (err) => console.error("Failed to send name test email:", err)
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Name test engine error:", error);
    const message =
      error instanceof Error && error.message.includes("Too few")
        ? error.message
        : "Name test failed. Please try again.";
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

async function persistNameTestResult(result: NameTestResult, user: UserInfo) {
  const supabase = await createClient();
  const { error } = await supabase.from("name_test_results").insert({
    id: result.id,
    product_description: result.productDescription,
    names: result.names,
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
