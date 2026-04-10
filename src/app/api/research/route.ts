import { runResearch } from "@/lib/research-engine";
import { createClient } from "@/lib/supabase/server";
import type { ResearchInput, ResearchResult } from "@/types/research";

export const maxDuration = 300;

// Simple in-memory rate limiter: max 3 requests per IP per 10 minutes
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

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

    const body: ResearchInput = await request.json();

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

    const result = await runResearch(sanitizedInput);

    // Persist to Supabase (non-blocking — don't fail the response if DB write fails)
    persistResult(result).catch((err) =>
      console.error("Failed to persist research result:", err)
    );

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

async function persistResult(result: ResearchResult) {
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
    status: result.status,
    created_at: result.createdAt,
  });
  if (error) throw error;
}
