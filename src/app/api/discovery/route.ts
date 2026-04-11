import { runDiscovery } from "@/lib/discovery-engine";
import { createClient } from "@/lib/supabase/server";
import { sendDiscoveryReport } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";
import { checkQuota, incrementUsage, getOrCreateUser } from "@/lib/users";
import type { DiscoveryInput, DiscoveryResult } from "@/types/discovery";

export const maxDuration = 300;

const isRateLimited = createRateLimiter(2);

const MAX_BRAND_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_CATEGORY_LENGTH = 100;
const MAX_TARGET_AUDIENCE_LENGTH = 500;
const MAX_EXISTING_PRODUCTS_LENGTH = 500;
const MAX_PRICE_UNIT_LENGTH = 100;
const MAX_CONSTRAINTS_LENGTH = 500;

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

    const body: DiscoveryInput & { email?: string; userName?: string; userCompany?: string; userRole?: string; userCompanySize?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; referrer?: string } = await request.json();

    // Input validation and sanitization
    const brandName = body.brandName?.trim().slice(0, MAX_BRAND_NAME_LENGTH);
    const brandDescription = body.brandDescription
      ?.trim()
      .slice(0, MAX_DESCRIPTION_LENGTH);
    const category = body.category?.trim().slice(0, MAX_CATEGORY_LENGTH);
    const targetAudience = body.targetAudience
      ?.trim()
      .slice(0, MAX_TARGET_AUDIENCE_LENGTH);

    if (!brandName || !brandDescription || !category || !targetAudience) {
      return Response.json(
        {
          error:
            "Brand name, brand description, category, and target audience are required",
        },
        { status: 400 }
      );
    }

    // Quota check
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : null;
    if (email) {
      const quota = await checkQuota(email, "discovery");
      if (!quota.allowed) {
        return Response.json({
          error: `You've used all ${quota.limit} discovery runs this month on the ${quota.plan} plan. Upgrade at hypetest.ai/pricing for more.`,
        }, { status: 403 });
      }
    }

    const sanitizedInput: DiscoveryInput = {
      brandName,
      brandDescription,
      category,
      targetAudience,
      ...(body.existingProducts && {
        existingProducts: body.existingProducts
          .trim()
          .slice(0, MAX_EXISTING_PRODUCTS_LENGTH),
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
        priceUnit: body.priceUnit.trim().slice(0, MAX_PRICE_UNIT_LENGTH),
      }),
      ...(body.constraints && {
        constraints: body.constraints.trim().slice(0, MAX_CONSTRAINTS_LENGTH),
      }),
    };

    const result = await runDiscovery(sanitizedInput);

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
      console.error("Failed to persist discovery result:", err)
    );

    // Track usage and ensure user record exists
    if (email) {
      getOrCreateUser(email, userName || undefined, userCompany || undefined, userRole || undefined, userCompanySize || undefined).catch(console.error);
      incrementUsage(email, "discovery").catch(console.error);

      sendDiscoveryReport(email, sanitizedInput.brandName, result.id).catch(
        (err) => console.error("Failed to send discovery email:", err)
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error("Discovery engine error:", error);
    const message =
      error instanceof Error && error.message.includes("concept tests failed")
        ? error.message
        : "Discovery failed. Please try again.";
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

async function persistResult(result: DiscoveryResult, user: UserInfo) {
  const supabase = await createClient();
  const { error } = await supabase.from("discovery_results").insert({
    id: result.id,
    input: result.input,
    concepts: result.concepts,
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
