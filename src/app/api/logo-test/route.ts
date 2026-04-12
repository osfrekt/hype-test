import { runLogoTest } from "@/lib/logo-test-engine";
import { createClient } from "@/lib/supabase/server";
import { sendLogoTestReport } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import { isDisposableEmail } from "@/lib/email-validation";
import type { LogoTestResult } from "@/types/logo-test";

export const maxDuration = 300;

const isRateLimited = createRateLimiter(2);

const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
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
    if (contentLength > 10_000_000) { // 10MB limit for image uploads
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
    const brandDescription = body.brandDescription?.trim().slice(0, MAX_DESCRIPTION_LENGTH) || "";

    // Validate logos
    const rawLogos = body.logos;
    if (!Array.isArray(rawLogos) || rawLogos.length < 1 || rawLogos.length > 5) {
      return Response.json(
        { error: "1-5 logos are required" },
        { status: 400 }
      );
    }

    const logos = rawLogos.map((l: Record<string, unknown>) => ({
      name: (typeof l.name === "string" ? l.name.trim().slice(0, MAX_NAME_LENGTH) : "") || "Untitled",
      description: typeof l.description === "string" ? l.description.trim().slice(0, MAX_DESCRIPTION_LENGTH) : "",
      ...(typeof l.colorPalette === "string" && l.colorPalette.trim() && {
        colorPalette: l.colorPalette.trim().slice(0, 500),
      }),
      ...(typeof l.styleTags === "string" && l.styleTags.trim() && {
        styleTags: l.styleTags.trim().slice(0, 500),
      }),
      ...(typeof l.imageBase64 === "string" && l.imageBase64.startsWith("data:image/") && {
        imageBase64: l.imageBase64,
      }),
    }));

    for (const logo of logos) {
      if (!logo.description) {
        return Response.json(
          { error: "Logo description is required for each logo" },
          { status: 400 }
        );
      }
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

    const result = await runLogoTest({
      brandName,
      category,
      targetAudience,
      ...(brandDescription && { brandDescription }),
      logos,
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
    persistLogoTestResult(result, {
      email, userName, userCompany, userRole, userCompanySize,
      utmSource, utmMedium, utmCampaign, referrer: referrerUrl,
    }).catch((err) => console.error("Failed to persist logo test result:", err));

    // Track usage and ensure user record exists
    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined, userCompanySize || undefined).catch(console.error);
      incrementUsage(email, "research").catch(console.error);

      const logoNames = logos.map((l: { name: string }) => l.name);
      sendLogoTestReport(email, logoNames, result.id).catch(
        (err) => console.error("Failed to send logo test email:", err)
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Logo test engine error:", error);
    const message =
      error instanceof Error && error.message.includes("Too few persona")
        ? error.message
        : "Logo test failed. Please try again.";
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

async function persistLogoTestResult(result: LogoTestResult, user: UserInfo) {
  const supabase = await createClient();
  // Strip imageBase64 from input before storing (too large for JSONB)
  const inputForStorage = {
    ...result.input,
    logos: result.input.logos.map((l) => {
      const { imageBase64: _img, ...rest } = l;
      return rest;
    }),
  };
  // Also strip imageBase64 from results[].logo
  const resultsForStorage = result.results.map((r) => ({
    ...r,
    logo: (() => {
      const { imageBase64: _img, ...rest } = r.logo;
      return rest;
    })(),
  }));
  const { error } = await supabase.from("logo_test_results").insert({
    id: result.id,
    input: inputForStorage,
    results: resultsForStorage,
    winner: result.winner || null,
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
