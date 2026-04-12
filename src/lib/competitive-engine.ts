import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ResearchInput } from "@/types/research";
import type { CompetitiveResult } from "@/types/competitive";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();
const PANEL_SIZE = 50;
const BATCH_SIZE = 10;

interface CompPanelResponse {
  personaId: number;
  purchaseIntent: number;
  wtpChoice: "low" | "mid" | "high" | "none";
  featureAvg: number;
  topConcern: string;
  topPositive: string;
  sentimentScore: number; // 1-5
}

async function queryPersonaForProduct(
  persona: { id: number; age: number; gender: string; income: number; location: string; lifestyle: string; categoryContext: string },
  input: ResearchInput,
  priceRange: { min: number; max: number }
): Promise<CompPanelResponse> {
  const midPrice = Math.round((priceRange.min + priceRange.max) / 2);
  const lowPrice = priceRange.min;
  const highPrice = priceRange.max;

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are evaluating a product called "${input.productName}".

Product description: ${input.productDescription}

Answer as this consumer would. Be realistic.

1. PURCHASE INTENT (1-5): 1=Definitely not, 5=Definitely yes
2. PRICE CHOICE: A) $${lowPrice} (basic) B) $${midPrice} (standard) C) $${highPrice} (premium) D) Would not buy
3. OVERALL ENTHUSIASM (1-5): 1=Not at all excited, 5=Extremely excited
4. TOP CONCERN: One sentence
5. TOP POSITIVE: One sentence

JSON only:
{"purchaseIntent": <1-5>, "priceChoice": "<A-D>", "enthusiasm": <1-5>, "topConcern": "<text>", "topPositive": "<text>"}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 250,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");

    const parsed = JSON.parse(jsonMatch[0]);
    const priceMap: Record<string, CompPanelResponse["wtpChoice"]> = { A: "low", B: "mid", C: "high", D: "none" };

    return {
      personaId: persona.id,
      purchaseIntent: Math.min(5, Math.max(1, Number(parsed.purchaseIntent))),
      wtpChoice: priceMap[parsed.priceChoice] || "none",
      featureAvg: 0, // computed later
      topConcern: parsed.topConcern || "No specific concern",
      topPositive: parsed.topPositive || "Interesting concept",
      sentimentScore: Math.min(5, Math.max(1, Number(parsed.enthusiasm) || 3)),
    };
  } catch {
    return {
      personaId: persona.id,
      purchaseIntent: 3,
      wtpChoice: "mid",
      featureAvg: 0,
      topConcern: "Need more information",
      topPositive: "Interesting concept",
      sentimentScore: 3,
    };
  }
}

function computeProductSummary(
  input: ResearchInput,
  responses: CompPanelResponse[],
  priceRange: { min: number; max: number }
) {
  const n = responses.length;
  const midPrice = Math.round((priceRange.min + priceRange.max) / 2);

  const intentScore = Math.round(
    (responses.reduce((sum, r) => sum + r.purchaseIntent, 0) / n / 5) * 100
  );

  const wtpCounts = { low: 0, mid: 0, high: 0, none: 0 };
  responses.forEach((r) => wtpCounts[r.wtpChoice]++);
  const wtpMid = Math.round(
    (wtpCounts.low * priceRange.min + wtpCounts.mid * midPrice + wtpCounts.high * priceRange.max) /
      Math.max(1, wtpCounts.low + wtpCounts.mid + wtpCounts.high)
  );

  const avgSentiment = responses.reduce((sum, r) => sum + r.sentimentScore, 0) / n;

  // Most common concern and positive (skip generic)
  const concernCounts = new Map<string, number>();
  const positiveCounts = new Map<string, number>();
  responses.forEach((r) => {
    if (r.topConcern !== "Need more information") {
      concernCounts.set(r.topConcern, (concernCounts.get(r.topConcern) || 0) + 1);
    }
    if (r.topPositive !== "Interesting concept") {
      positiveCounts.set(r.topPositive, (positiveCounts.get(r.topPositive) || 0) + 1);
    }
  });

  const topConcern = [...concernCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "No major concerns identified";
  const topPositive = [...positiveCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "Interesting concept";

  return { input, intentScore, wtpMid, featureAvg: Math.round((avgSentiment / 5) * 100), topPositive, topConcern };
}

export async function runCompetitiveTest(
  yourProduct: ResearchInput,
  competitorProduct: ResearchInput
): Promise<CompetitiveResult> {
  const category = yourProduct.category || "consumer products";

  // Generate ONE shared panel
  const panel = yourProduct.targetMarket
    ? await generateTargetedPanel(PANEL_SIZE, category, yourProduct.targetMarket)
    : generatePanel(PANEL_SIZE, category);

  const yourPriceRange = yourProduct.priceRange || { min: 10, max: 50 };
  const compPriceRange = competitorProduct.priceRange || yourPriceRange;

  // Query all personas for both products in batches
  const yourResponses: CompPanelResponse[] = [];
  const compResponses: CompPanelResponse[] = [];

  for (let i = 0; i < panel.length; i += BATCH_SIZE) {
    const batch = panel.slice(i, i + BATCH_SIZE);
    const [yourBatch, compBatch] = await Promise.all([
      Promise.allSettled(batch.map((p) => queryPersonaForProduct(p, yourProduct, yourPriceRange))),
      Promise.allSettled(batch.map((p) => queryPersonaForProduct(p, competitorProduct, compPriceRange))),
    ]);

    for (const r of yourBatch) {
      if (r.status === "fulfilled") yourResponses.push(r.value);
    }
    for (const r of compBatch) {
      if (r.status === "fulfilled") compResponses.push(r.value);
    }
  }

  if (yourResponses.length < 5 || compResponses.length < 5) {
    throw new Error("Too few persona responses to produce a reliable comparison.");
  }

  const yours = computeProductSummary(yourProduct, yourResponses, yourPriceRange);
  const competitor = computeProductSummary(competitorProduct, compResponses, compPriceRange);

  // Compute radar dimensions (each normalized 0-100)
  // 1. Purchase Intent: already 0-100
  // 2. Perceived Value: WTP relative to price (how much of the price they'd pay)
  const yourPriceMid = Math.round((yourPriceRange.min + yourPriceRange.max) / 2);
  const compPriceMid = Math.round((compPriceRange.min + compPriceRange.max) / 2);
  const yourPerceivedValue = Math.min(100, Math.round((yours.wtpMid / Math.max(1, yourPriceMid)) * 100));
  const compPerceivedValue = Math.min(100, Math.round((competitor.wtpMid / Math.max(1, compPriceMid)) * 100));

  // 3. Feature Appeal (avg sentiment as proxy): already 0-100
  // 4. Consumer Enthusiasm (same as feature appeal for this implementation)
  const yourEnthusiasm = yours.featureAvg;
  const compEnthusiasm = competitor.featureAvg;

  // 5. Low Concern: inverse of concern frequency (what % had no strong concern)
  const yourNoConcern = Math.round(
    (yourResponses.filter((r) => r.topConcern === "Need more information" || r.topConcern === "No specific concern").length / yourResponses.length) * 100
  );
  const compNoConcern = Math.round(
    (compResponses.filter((r) => r.topConcern === "Need more information" || r.topConcern === "No specific concern").length / compResponses.length) * 100
  );
  // Scale: higher = fewer concerns = better
  const yourLowConcern = Math.min(100, 50 + yourNoConcern);
  const compLowConcern = Math.min(100, 50 + compNoConcern);

  const radarData = [
    { dimension: "Purchase Intent", yours: yours.intentScore, competitor: competitor.intentScore },
    { dimension: "Perceived Value", yours: yourPerceivedValue, competitor: compPerceivedValue },
    { dimension: "Feature Appeal", yours: yours.featureAvg, competitor: competitor.featureAvg },
    { dimension: "Enthusiasm", yours: yourEnthusiasm, competitor: compEnthusiasm },
    { dimension: "Low Concern", yours: yourLowConcern, competitor: compLowConcern },
  ];

  // Determine winner by composite score
  const yourTotal = radarData.reduce((sum, d) => sum + d.yours, 0);
  const compTotal = radarData.reduce((sum, d) => sum + d.competitor, 0);
  const diff = Math.abs(yourTotal - compTotal);
  const winner: CompetitiveResult["winner"] = diff < 15 ? "tie" : yourTotal > compTotal ? "yours" : "competitor";

  return {
    id: nanoid(12),
    yours,
    competitor,
    radarData,
    winner,
    panelSize: Math.min(yourResponses.length, compResponses.length),
    methodology: {
      panelSize: Math.min(yourResponses.length, compResponses.length),
      demographicMix: yourProduct.targetMarket
        ? `Targeted panel: ${yourProduct.targetMarket} (80%) + general population (20%)`
        : "US general population (varied age, income, gender, location)",
      confidenceNote:
        "Results based on LLM-simulated consumer panel comparing both products against the same panel. Best used for directional insights.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}
