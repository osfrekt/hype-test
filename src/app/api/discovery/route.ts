import { runDiscovery } from "@/lib/discovery-engine";
import { createClient } from "@/lib/supabase/server";
import type { DiscoveryInput, DiscoveryResult } from "@/types/discovery";

export const maxDuration = 300;

// Simple in-memory rate limiter: max 2 requests per IP per 10 minutes
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 2;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

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

    const body: DiscoveryInput = await request.json();

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

    // Persist to Supabase (non-blocking — don't fail the response if DB write fails)
    persistResult(result).catch((err) =>
      console.error("Failed to persist discovery result:", err)
    );

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

async function persistResult(result: DiscoveryResult) {
  const supabase = await createClient();
  const { error } = await supabase.from("discovery_results").insert({
    id: result.id,
    input: result.input,
    concepts: result.concepts,
    panel_size: result.panelSize,
    methodology: result.methodology,
    status: result.status,
    created_at: result.createdAt,
  });
  if (error) throw error;
}
