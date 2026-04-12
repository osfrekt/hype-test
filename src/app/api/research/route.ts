import { runResearch } from "@/lib/research-engine";
import { createClient } from "@/lib/supabase/server";
import { sendResearchReport } from "@/lib/email";
import { sendSlackNotification } from "@/lib/slack";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isDisposableEmail } from "@/lib/email-validation";
import { verifyVerificationToken } from "@/lib/magic-link";
import type { ResearchInput, ResearchResult } from "@/types/research";

export const maxDuration = 300;

const isRateLimited = createRateLimiter(3);
const isEmailRateLimited = createRateLimiter(5);

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

    // Parse and validate body size
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 10_000) {
      return Response.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    const body: ResearchInput & { email?: string; userName?: string; userCompany?: string; userRole?: string; userCompanySize?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; referrer?: string; verificationToken?: string } = await request.json();

    // Input validation and sanitization
    const productName = body.productName?.trim().slice(0, MAX_NAME_LENGTH);
    const productDescription = body.productDescription
      ?.trim()
      .slice(0, MAX_DESCRIPTION_LENGTH);

    if (!productName || !productDescription) {
      return Response.json(
        { error: "Product name and description are required" },
        { status: 400 }
      );
    }

    // Quota check
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : null;

    // Layer 1: Block disposable emails
    if (email && isDisposableEmail(email)) {
      return Response.json(
        { error: "Please use a work or personal email address. Disposable email addresses are not accepted." },
        { status: 400 }
      );
    }

    // Layer 2: Email verification token
    const verificationToken = typeof body.verificationToken === "string" ? body.verificationToken : null;
    if (!verificationToken) {
      return Response.json({ error: "Email verification required" }, { status: 401 });
    }
    const verified = verifyVerificationToken(verificationToken);
    if (!verified || verified.email !== email?.toLowerCase()) {
      return Response.json(
        { error: "Invalid or expired verification. Please verify your email again." },
        { status: 401 }
      );
    }

    // Layer 3: Email-based rate limiting
    if (email && isEmailRateLimited(email)) {
      return Response.json(
        { error: "Too many requests from this email." },
        { status: 429 }
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

    const sanitizedInput: ResearchInput = {
      productName,
      productDescription,
      ...(body.category && {
        category: body.category.trim().slice(0, 100),
      }),
      ...(body.keyFeatures?.length && {
        keyFeatures: body.keyFeatures.slice(0, 10).map((f) => f.trim().slice(0, 200)),
      }),
      ...(body.priceRange &&
        typeof body.priceRange.min === "number" &&
        typeof body.priceRange.max === "number" && {
          priceRange: {
            min: Math.max(0, body.priceRange.min),
            max: Math.min(1_000_000, body.priceRange.max),
          },
        }),
      ...(body.priceUnit && {
        priceUnit: body.priceUnit.trim().slice(0, 100),
      }),
      ...(typeof body.unitsPerPack === "number" &&
        body.unitsPerPack > 0 && {
          unitsPerPack: Math.min(Math.round(body.unitsPerPack), 10000),
        }),
      ...(body.targetMarket && {
        targetMarket: body.targetMarket.trim().slice(0, 500),
      }),
      ...(body.competitors && {
        competitors: body.competitors.trim().slice(0, 500),
      }),
    };

    // Pro and Team plans get 100 respondents, others get 50
    let panelSize = 50;
    if (email) {
      const user = await getOrCreateUser(email);
      if (user.plan === "pro" || user.plan === "team") {
        panelSize = 100;
      }
    }

    const result = await runResearch(sanitizedInput, undefined, panelSize);

    const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 200) : null;
    const userCompany = typeof body.userCompany === "string" ? body.userCompany.trim().slice(0, 200) : null;
    const userRole = typeof body.userRole === "string" ? body.userRole.trim().slice(0, 100) : null;
    const userCompanySize = typeof body.userCompanySize === "string" ? body.userCompanySize.trim().slice(0, 50) : null;
    const utmSource = typeof body.utmSource === "string" ? body.utmSource.slice(0, 200) : null;
    const utmMedium = typeof body.utmMedium === "string" ? body.utmMedium.slice(0, 200) : null;
    const utmCampaign = typeof body.utmCampaign === "string" ? body.utmCampaign.slice(0, 200) : null;
    const referrerUrl = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    // Persist to Supabase (non-blocking — don't fail the response if DB write fails)
    persistResult(result, { email, userName, userCompany, userRole, userCompanySize, utmSource, utmMedium, utmCampaign, referrer: referrerUrl }).catch((err) =>
      console.error("Failed to persist research result:", err)
    );

    // Track usage and ensure user record exists
    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined, userCompanySize || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);

      sendResearchReport(email, sanitizedInput.productName, result.id).catch(
        (err) => console.error("Failed to send research email:", err)
      );

      // Schedule follow-up email 24 hours later (non-blocking)
      scheduleFollowUp(email, sanitizedInput.productName, result.purchaseIntent.score).catch(
        (err) => console.error("Failed to schedule follow-up:", err)
      );

      // Slack notification (non-blocking)
      notifySlack(email, sanitizedInput.productName, result).catch(
        (err) => console.error("Failed to send Slack notification:", err)
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Research engine error:", error);
    const message =
      error instanceof Error && error.message.includes("Too few persona")
        ? error.message
        : "Research failed. Please try again.";
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

async function notifySlack(email: string, productName: string, result: ResearchResult) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("slack_webhook_url")
    .eq("email", email)
    .single();

  if (data?.slack_webhook_url) {
    const resultUrl = `https://hypetest.ai/research/${result.id}`;
    await sendSlackNotification(
      data.slack_webhook_url,
      productName,
      result.purchaseIntent.score,
      result.wtpRange.mid,
      resultUrl
    );
  }
}

async function scheduleFollowUp(email: string, productName: string, intentScore: number) {
  const supabase = await createClient();
  await supabase.from("email_followups").insert({
    email,
    product_name: productName,
    intent_score: intentScore,
    send_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    sent: false,
  });
}

async function persistResult(result: ResearchResult, user: UserInfo) {
  const supabase = await createClient();
  const { error } = await supabase.from("research_results").insert({
    id: result.id,
    input: result.input,
    panel_size: result.panelSize,
    purchase_intent: result.purchaseIntent,
    wtp_range: result.wtpRange,
    feature_importance: result.featureImportance,
    top_concerns: result.topConcerns,
    top_positives: result.topPositives,
    verbatims: result.verbatims,
    methodology: result.methodology,
    competitive_position: result.competitivePosition ?? null,
    segment_breakdown: result.segmentBreakdown ?? null,
    purchase_frequency: result.purchaseFrequency ?? null,
    channel_preference: result.channelPreference ?? null,
    nps_score: result.npsScore ?? null,
    top_words: result.topWords ?? null,
    usage_occasions: result.usageOccasions ?? null,
    purchase_barriers: result.purchaseBarriers ?? null,
    improvements: result.improvements ?? null,
    price_sensitivity: result.priceSensitivity ?? null,
    persona_deep_dives: result.personaDeepDives ?? null,
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
