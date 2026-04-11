import { runDiscovery } from "@/lib/discovery-engine";
import { createClient } from "@/lib/supabase/server";
import type { DiscoveryInput, DiscoveryPanelResult } from "@/types/discovery";

export const maxDuration = 300;

// Separate rate limiter for rounds: max 3 per IP per 10 minutes
const roundRateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = roundRateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  roundRateLimitMap.set(ip, recent);
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
        {
          error:
            "Too many requests. Please wait a few minutes before trying again.",
        },
        { status: 429 }
      );
    }

    // Parse and validate body size
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 100_000) {
      return Response.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    const body = await request.json();
    const {
      discoveryId,
      input,
      previousConcepts,
      roundNumber,
    }: {
      discoveryId: string;
      input: DiscoveryInput;
      previousConcepts: DiscoveryPanelResult[];
      roundNumber: number;
    } = body;

    // Validate required fields
    if (!discoveryId || !input || !previousConcepts || !roundNumber) {
      return Response.json(
        {
          error:
            "discoveryId, input, previousConcepts, and roundNumber are required",
        },
        { status: 400 }
      );
    }

    // Sanitize input
    const brandName = input.brandName?.trim().slice(0, MAX_BRAND_NAME_LENGTH);
    const brandDescription = input.brandDescription
      ?.trim()
      .slice(0, MAX_DESCRIPTION_LENGTH);
    const category = input.category?.trim().slice(0, MAX_CATEGORY_LENGTH);
    const targetAudience = input.targetAudience
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
      ...(input.existingProducts && {
        existingProducts: input.existingProducts
          .trim()
          .slice(0, MAX_EXISTING_PRODUCTS_LENGTH),
      }),
      ...(input.priceRange &&
        typeof input.priceRange.min === "number" &&
        typeof input.priceRange.max === "number" && {
          priceRange: {
            min: Math.max(0, input.priceRange.min),
            max: Math.min(1_000_000, input.priceRange.max),
          },
        }),
      ...(input.priceUnit && {
        priceUnit: input.priceUnit.trim().slice(0, MAX_PRICE_UNIT_LENGTH),
      }),
      ...(input.constraints && {
        constraints: input.constraints.trim().slice(0, MAX_CONSTRAINTS_LENGTH),
      }),
    };

    const discoveryResult = await runDiscovery(sanitizedInput);
    const newConcepts = discoveryResult.concepts;

    // Merge and re-rank all concepts
    const allConcepts = [...previousConcepts, ...newConcepts];
    allConcepts.sort(
      (a, b) => b.purchaseIntent.score - a.purchaseIntent.score
    );
    allConcepts.forEach((r, i) => (r.demandRank = i + 1));

    // Update Supabase (non-blocking)
    updateDiscoveryResult(discoveryId, allConcepts, roundNumber).catch((err) =>
      console.error("Failed to update discovery result:", err)
    );

    return Response.json({ newConcepts, allConcepts });
  } catch (error) {
    console.error("Discovery round error:", error);
    const message =
      error instanceof Error && error.message.includes("concept tests failed")
        ? error.message
        : "Discovery round failed. Please try again.";
    return Response.json({ error: message }, { status: 500 });
  }
}

async function updateDiscoveryResult(
  discoveryId: string,
  allConcepts: DiscoveryPanelResult[],
  roundNumber: number
) {
  const supabase = await createClient();

  // Get existing record to update methodology
  const { data: existing } = await supabase
    .from("discovery_results")
    .select("methodology")
    .eq("id", discoveryId)
    .single();

  const existingMethodology = existing?.methodology ?? {};
  const updatedMethodology = {
    ...existingMethodology,
    conceptsGenerated:
      (existingMethodology.conceptsGenerated ?? 0) + 8,
    conceptsTested:
      (existingMethodology.conceptsTested ?? 0) +
      allConcepts.filter((c) => c.round === roundNumber).length,
  };

  const { error } = await supabase
    .from("discovery_results")
    .update({
      concepts: allConcepts,
      methodology: updatedMethodology,
      rounds: roundNumber,
    })
    .eq("id", discoveryId);

  if (error) throw error;
}
