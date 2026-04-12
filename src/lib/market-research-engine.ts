import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { MarketResearchInput, MarketResearchResult } from "@/types/market-research";

const anthropic = new Anthropic();

export async function runMarketResearch(
  input: MarketResearchInput
): Promise<MarketResearchResult> {
  const prompt = `You are a senior market research analyst. Provide a comprehensive market analysis for the following:

Industry: ${input.category}
Geography: ${input.geography}
Specific questions: ${input.questions}

Structure your analysis as JSON with these sections:
{
  "marketOverview": "2-3 paragraph overview of the current state of this market",
  "marketSize": "Estimated market size and growth rate if known, or 'Data not available' with reasoning",
  "keyTrends": ["trend 1", "trend 2", ...] (5-8 trends),
  "consumerInsights": ["insight 1", "insight 2", ...] (5-8 insights about what consumers want),
  "competitiveLandscape": [{"name": "competitor/brand", "positioning": "1 sentence", "strength": "1 sentence", "weakness": "1 sentence"}] (5-8 key players),
  "pricingLandscape": "2-3 sentences on typical pricing in this market",
  "gaps": ["gap 1", "gap 2", ...] (3-5 unmet needs or market gaps),
  "threats": ["threat 1", "threat 2", ...] (3-5 risks or challenges),
  "recommendations": ["rec 1", "rec 2", ...] (3-5 actionable recommendations for entering this market)
}

Return ONLY valid JSON. No markdown, no explanation outside the JSON object.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    temperature: 0.7,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse market research response");

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    id: nanoid(12),
    input,
    marketOverview: parsed.marketOverview || "",
    marketSize: parsed.marketSize || "Data not available",
    keyTrends: Array.isArray(parsed.keyTrends) ? parsed.keyTrends : [],
    consumerInsights: Array.isArray(parsed.consumerInsights) ? parsed.consumerInsights : [],
    competitiveLandscape: Array.isArray(parsed.competitiveLandscape) ? parsed.competitiveLandscape : [],
    pricingLandscape: parsed.pricingLandscape || "",
    gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
    threats: Array.isArray(parsed.threats) ? parsed.threats : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}
