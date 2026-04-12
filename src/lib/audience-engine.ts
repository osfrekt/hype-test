import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona } from "@/types/research";
import type { AudienceTestInput, AudienceTestResult } from "@/types/audience-test";
import { generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE_PER_SEGMENT = 20;
const BATCH_SIZE = 10;

export async function runAudienceTest(
  input: AudienceTestInput,
  segments: string[]
): Promise<AudienceTestResult> {
  const category = input.category || "consumer products";

  const segmentResults: {
    audience: string;
    intentScore: number;
    wtpMid: number;
    topPositive: string;
    topConcern: string;
  }[] = [];

  for (const segment of segments) {
    const panel = await generateTargetedPanel(
      PANEL_SIZE_PER_SEGMENT,
      category,
      segment
    );

    const responses: AudiencePersonaResponse[] = [];

    for (let i = 0; i < panel.length; i += BATCH_SIZE) {
      const batch = panel.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((persona) => queryAudiencePersona(persona, input))
      );
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          responses.push(result.value);
        }
      }
    }

    if (responses.length === 0) {
      segmentResults.push({
        audience: segment,
        intentScore: 0,
        wtpMid: 0,
        topPositive: "Insufficient data",
        topConcern: "Insufficient data",
      });
      continue;
    }

    const avgIntent = Math.round(
      (responses.reduce((sum, r) => sum + r.intent, 0) / responses.length / 5) * 100
    );

    const wtpValues = responses.filter((r) => r.wtp > 0).map((r) => r.wtp);
    const wtpMid = wtpValues.length > 0
      ? Math.round(wtpValues.reduce((a, b) => a + b, 0) / wtpValues.length)
      : 0;

    // Pick diverse top positive and concern
    const positives = responses
      .map((r) => r.topPositive)
      .filter((t) => t !== "Interesting concept");
    const concerns = responses
      .map((r) => r.topConcern)
      .filter((t) => t !== "Need more information");

    segmentResults.push({
      audience: segment,
      intentScore: avgIntent,
      wtpMid,
      topPositive: positives[0] || "Interesting concept",
      topConcern: concerns[0] || "Need more information",
    });
  }

  // Rank by intent score
  const ranked = segmentResults
    .sort((a, b) => b.intentScore - a.intentScore)
    .map((seg, idx) => ({ ...seg, rank: idx + 1 }));

  const best = ranked[0];

  return {
    id: nanoid(12),
    input: {
      productName: input.productName,
      productDescription: input.productDescription,
      category: input.category,
      priceRange: input.priceRange,
    },
    segments: ranked,
    bestSegment: best.audience,
    panelSizePerSegment: PANEL_SIZE_PER_SEGMENT,
    methodology: {
      panelSizePerSegment: PANEL_SIZE_PER_SEGMENT,
      totalPanelists: PANEL_SIZE_PER_SEGMENT * segments.length,
      demographicMix: `${segments.length} audience segments, each tested with ${PANEL_SIZE_PER_SEGMENT} targeted personas`,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. Each segment tested with demographically targeted personas. Best used for directional insights and hypothesis generation.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}

interface AudiencePersonaResponse {
  intent: number;
  wtp: number;
  topPositive: string;
  topConcern: string;
}

async function queryAudiencePersona(
  persona: ConsumerPersona,
  input: AudienceTestInput
): Promise<AudiencePersonaResponse> {
  const featuresText = input.keyFeatures?.length
    ? `\nKey features: ${input.keyFeatures.join(", ")}`
    : "";
  const priceText = input.priceRange
    ? `\nPrice range: $${input.priceRange.min}-$${input.priceRange.max}`
    : "";

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are evaluating a product called "${input.productName}".

Product description: ${input.productDescription}${featuresText}${priceText}

Answer these questions as this consumer would. Be realistic.

1. PURCHASE INTENT: On a scale of 1-5, how likely would you buy this product?
   1 = Definitely not, 2 = Probably not, 3 = Maybe, 4 = Probably yes, 5 = Definitely yes

2. WILLINGNESS TO PAY: What is the most you would pay for this product in dollars? (0 if you would not buy)

3. TOP POSITIVE: What is the single most appealing thing about this product? (One sentence)

4. TOP CONCERN: What is your single biggest concern or hesitation? (One sentence)

Respond with ONLY a JSON object:
{"intent": <1-5>, "wtp": <number>, "topPositive": "<sentence>", "topConcern": "<sentence>"}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      intent: Math.min(5, Math.max(1, Number(parsed.intent))),
      wtp: Math.max(0, Number(parsed.wtp) || 0),
      topPositive: parsed.topPositive || "Interesting concept",
      topConcern: parsed.topConcern || "Need more information",
    };
  } catch {
    return {
      intent: 3,
      wtp: 0,
      topPositive: "Interesting concept",
      topConcern: "Need more information",
    };
  }
}
