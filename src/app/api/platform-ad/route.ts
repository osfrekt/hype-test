import { runPlatformAdTest } from "@/lib/platform-ad-engine";
import { createClient } from "@/lib/supabase/server";
import { sendPlatformAdReport } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isDisposableEmail } from "@/lib/email-validation";
import type { PlatformAdResult, AdPlatform } from "@/types/platform-ad";

export const maxDuration = 300;

const isRateLimited = createRateLimiter(2);

const VALID_PLATFORMS: AdPlatform[] = [
  "amazon", "instagram", "tiktok", "google_search",
  "google_display", "facebook", "linkedin", "youtube",
];

const PLATFORM_LABELS: Record<AdPlatform, string> = {
  amazon: "Amazon",
  instagram: "Instagram",
  tiktok: "TikTok",
  google_search: "Google Search",
  google_display: "Google Display",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

const MAX_COPY_LENGTH = 5000;
const MAX_NAME_LENGTH = 200;
const MAX_AUDIENCE_LENGTH = 500;

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 5_000_000) {
      return Response.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    const body = await request.json();

    const platform = body.platform as AdPlatform;
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return Response.json({ error: "Valid platform is required" }, { status: 400 });
    }

    const brandName = typeof body.brandName === "string" ? body.brandName.trim().slice(0, MAX_NAME_LENGTH) : "";
    if (!brandName) {
      return Response.json({ error: "Brand name is required" }, { status: 400 });
    }

    const targetAudience = typeof body.targetAudience === "string" ? body.targetAudience.trim().slice(0, MAX_AUDIENCE_LENGTH) : "";
    const adCopy = typeof body.adCopy === "string" ? body.adCopy.trim().slice(0, MAX_COPY_LENGTH) : undefined;
    const url = typeof body.url === "string" ? body.url.trim().slice(0, 2000) : undefined;
    const videoDescription = typeof body.videoDescription === "string" ? body.videoDescription.trim().slice(0, MAX_COPY_LENGTH) : undefined;
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : undefined;

    const headlines = Array.isArray(body.headlines)
      ? body.headlines.filter((h: unknown) => typeof h === "string" && h.trim()).map((h: string) => h.trim().slice(0, 200))
      : undefined;
    const descriptions = Array.isArray(body.descriptions)
      ? body.descriptions.filter((d: unknown) => typeof d === "string" && d.trim()).map((d: string) => d.trim().slice(0, 500))
      : undefined;

    // Basic content check
    if (!adCopy && !headlines?.length && !url) {
      return Response.json({ error: "Ad copy, headlines, or URL is required" }, { status: 400 });
    }

    // Quota check
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : null;

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

    const result = await runPlatformAdTest({
      platform,
      brandName,
      targetAudience,
      ...(adCopy && { adCopy }),
      ...(url && { url }),
      ...(videoDescription && { videoDescription }),
      ...(imageBase64 && { imageBase64 }),
      ...(headlines && { headlines }),
      ...(descriptions && { descriptions }),
    });

    const userName = typeof body.userName === "string" ? body.userName.trim().slice(0, 200) : null;
    const userCompany = typeof body.userCompany === "string" ? body.userCompany.trim().slice(0, 200) : null;
    const userRole = typeof body.userRole === "string" ? body.userRole.trim().slice(0, 100) : null;
    const userCompanySize = typeof body.userCompanySize === "string" ? body.userCompanySize.trim().slice(0, 50) : null;
    const utmSource = typeof body.utmSource === "string" ? body.utmSource.slice(0, 200) : null;
    const utmMedium = typeof body.utmMedium === "string" ? body.utmMedium.slice(0, 200) : null;
    const utmCampaign = typeof body.utmCampaign === "string" ? body.utmCampaign.slice(0, 200) : null;
    const referrerUrl = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    // Persist (non-blocking)
    persistResult(result, {
      email, userName, userCompany, userRole, userCompanySize,
      utmSource, utmMedium, utmCampaign, referrer: referrerUrl,
    }).catch((err) => console.error("Failed to persist platform ad result:", err));

    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined, userCompanySize || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);
      sendPlatformAdReport(email, brandName, PLATFORM_LABELS[platform], result.id).catch(
        (err) => console.error("Failed to send platform ad email:", err)
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Platform ad test engine error:", error);
    const message =
      error instanceof Error && error.message.includes("Too few persona")
        ? error.message
        : "Platform ad test failed. Please try again.";
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

async function persistResult(result: PlatformAdResult, user: UserInfo) {
  const supabase = await createClient();
  // Strip imageBase64 from persisted input to save space
  const inputForStorage = { ...result.input };
  if (inputForStorage.imageBase64) {
    inputForStorage.imageBase64 = "[image uploaded]";
  }

  const { error } = await supabase.from("platform_ad_results").insert({
    id: result.id,
    input: inputForStorage,
    platform_label: result.platformLabel,
    attention: result.attention,
    clarity: result.clarity,
    persuasion: result.persuasion,
    brand_fit: result.brandFit,
    platform_fit: result.platformFit,
    click_likelihood: result.clickLikelihood,
    scroll_stop_power: result.scrollStopPower,
    purchase_intent: result.purchaseIntent ?? null,
    platform_metrics: result.platformMetrics ?? null,
    emotional_responses: result.emotionalResponses,
    top_strengths: result.topStrengths,
    top_weaknesses: result.topWeaknesses,
    platform_tips: result.platformTips,
    verbatims: result.verbatims,
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
