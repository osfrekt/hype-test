import { runCompetitiveTest } from "@/lib/competitive-engine";
import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isDisposableEmail } from "@/lib/email-validation";
import type { ResearchInput } from "@/types/research";

export const maxDuration = 300;

const isRateLimited = createRateLimiter(3);

const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;

function sanitizeInput(body: Record<string, unknown>): ResearchInput {
  const productName = (typeof body.productName === "string" ? body.productName : "").trim().slice(0, MAX_NAME_LENGTH);
  const productDescription = (typeof body.productDescription === "string" ? body.productDescription : "").trim().slice(0, MAX_DESCRIPTION_LENGTH);

  const result: ResearchInput = { productName, productDescription };

  if (typeof body.category === "string" && body.category) {
    result.category = body.category.trim().slice(0, 100);
  }
  if (Array.isArray(body.keyFeatures) && body.keyFeatures.length) {
    result.keyFeatures = body.keyFeatures.slice(0, 10).map((f: unknown) => String(f).trim().slice(0, 200));
  }
  if (body.priceRange && typeof body.priceRange === "object") {
    const pr = body.priceRange as Record<string, unknown>;
    if (typeof pr.min === "number" && typeof pr.max === "number") {
      result.priceRange = { min: Math.max(0, pr.min), max: Math.min(1_000_000, pr.max) };
    }
  }
  if (typeof body.priceUnit === "string" && body.priceUnit) {
    result.priceUnit = body.priceUnit.trim().slice(0, 100);
  }
  if (typeof body.targetMarket === "string" && body.targetMarket) {
    result.targetMarket = body.targetMarket.trim().slice(0, 500);
  }

  return result;
}

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
      return Response.json({ error: "Request body too large" }, { status: 413 });
    }

    const body = await request.json();

    const yours = sanitizeInput(body.yours || {});
    const competitor = sanitizeInput(body.competitor || {});

    if (!yours.productName || !yours.productDescription) {
      return Response.json({ error: "Your product name and description are required" }, { status: 400 });
    }
    if (!competitor.productName || !competitor.productDescription) {
      return Response.json({ error: "Competitor product name and description are required" }, { status: 400 });
    }

    // Shared fields
    if (body.category && !yours.category) yours.category = String(body.category).trim().slice(0, 100);
    if (body.category && !competitor.category) competitor.category = String(body.category).trim().slice(0, 100);
    if (body.targetMarket && !yours.targetMarket) yours.targetMarket = String(body.targetMarket).trim().slice(0, 500);
    if (body.targetMarket && !competitor.targetMarket) competitor.targetMarket = String(body.targetMarket).trim().slice(0, 500);

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

    const result = await runCompetitiveTest(yours, competitor);

    // Persist to Supabase (non-blocking)
    const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 200) : null;
    const userCompany = typeof body.userCompany === "string" ? body.userCompany.trim().slice(0, 200) : null;
    const utmSource = typeof body.utmSource === "string" ? body.utmSource.slice(0, 200) : null;
    const utmMedium = typeof body.utmMedium === "string" ? body.utmMedium.slice(0, 200) : null;
    const utmCampaign = typeof body.utmCampaign === "string" ? body.utmCampaign.slice(0, 200) : null;
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    persistCompetitiveResult(result, { email, userName, userCompany, utmSource, utmMedium, utmCampaign, referrer }).catch((err) =>
      console.error("Failed to persist competitive result:", err)
    );

    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);
    }

    return Response.json(result);
  } catch (error) {
    console.error("Competitive engine error:", error);
    const message = error instanceof Error ? error.message : "Competitive test failed. Please try again.";
    return Response.json({ error: message }, { status: 500 });
  }
}

interface PersistInfo {
  email: string | null;
  userName: string | null;
  userCompany: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrer: string | null;
}

async function persistCompetitiveResult(result: import("@/types/competitive").CompetitiveResult, user: PersistInfo) {
  const supabase = await createClient();
  const { error } = await supabase.from("competitive_results").insert({
    id: result.id,
    yours: result.yours,
    competitor: result.competitor,
    radar_data: result.radarData,
    winner: result.winner,
    panel_size: result.panelSize,
    methodology: result.methodology,
    email: user.email,
    user_name: user.userName,
    user_company: user.userCompany,
    utm_source: user.utmSource,
    utm_medium: user.utmMedium,
    utm_campaign: user.utmCampaign,
    referrer: user.referrer,
    status: result.status,
    created_at: result.createdAt,
  });
  if (error) throw error;
}
