import { runPricingTest } from "@/lib/pricing-engine";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isDisposableEmail } from "@/lib/email-validation";
import type { PricingTestInput } from "@/types/pricing-test";

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
    if (contentLength > 10_000) {
      return Response.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    const body: PricingTestInput & {
      pricePoints?: number[];
      email?: string;
      userName?: string;
      userCompany?: string;
      userRole?: string;
      userCompanySize?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      referrer?: string;
    } = await request.json();

    // Input validation
    const productName = body.productName?.trim().slice(0, MAX_NAME_LENGTH);
    const productDescription = body.productDescription?.trim().slice(0, MAX_DESCRIPTION_LENGTH);

    if (!productName || !productDescription) {
      return Response.json(
        { error: "Product name and description are required" },
        { status: 400 }
      );
    }

    const pricePoints = body.pricePoints;
    if (!pricePoints || !Array.isArray(pricePoints) || pricePoints.length < 2 || pricePoints.length > 5) {
      return Response.json(
        { error: "Between 2 and 5 price points are required" },
        { status: 400 }
      );
    }

    const sanitizedPrices = pricePoints
      .map((p) => Math.max(0, Math.min(1_000_000, Number(p))))
      .filter((p) => !isNaN(p) && p > 0);

    if (sanitizedPrices.length < 2) {
      return Response.json(
        { error: "At least 2 valid price points are required" },
        { status: 400 }
      );
    }

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

    const sanitizedInput: PricingTestInput = {
      productName,
      productDescription,
      ...(body.category && { category: body.category.trim().slice(0, 100) }),
      ...(body.targetMarket && { targetMarket: body.targetMarket.trim().slice(0, 500) }),
      ...(body.priceUnit && { priceUnit: body.priceUnit.trim().slice(0, 100) }),
      ...(body.keyFeatures?.length && {
        keyFeatures: body.keyFeatures.slice(0, 10).map((f) => f.trim().slice(0, 200)),
      }),
    };

    const result = await runPricingTest(sanitizedInput, sanitizedPrices, body.priceUnit);

    const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 200) : null;
    const userCompany = typeof body.userCompany === "string" ? body.userCompany.trim().slice(0, 200) : null;
    const userRole = typeof body.userRole === "string" ? body.userRole.trim().slice(0, 100) : null;
    const userCompanySize = typeof body.userCompanySize === "string" ? body.userCompanySize.trim().slice(0, 50) : null;
    const utmSource = typeof body.utmSource === "string" ? body.utmSource.slice(0, 200) : null;
    const utmMedium = typeof body.utmMedium === "string" ? body.utmMedium.slice(0, 200) : null;
    const utmCampaign = typeof body.utmCampaign === "string" ? body.utmCampaign.slice(0, 200) : null;
    const referrerUrl = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    // Persist to Supabase (non-blocking)
    persistResult(result, {
      email, userName, userCompany, userRole, userCompanySize,
      utmSource, utmMedium, utmCampaign, referrer: referrerUrl,
    }).catch((err) => console.error("Failed to persist pricing test result:", err));

    // Track usage
    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined, userCompanySize || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);
    }

    return Response.json(result);
  } catch (error) {
    console.error("Pricing test engine error:", error);
    return Response.json({ error: "Pricing test failed. Please try again." }, { status: 500 });
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

async function persistResult(result: import("@/types/pricing-test").PricingTestResult, user: UserInfo) {
  const supabase = await createClient();
  const { error } = await supabase.from("pricing_test_results").insert({
    id: result.id,
    input: result.input,
    price_points: result.pricePoints,
    optimal_price: result.optimalPrice,
    optimal_intent: result.optimalIntent,
    key_insight: result.keyInsight,
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
