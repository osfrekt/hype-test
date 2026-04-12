import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona, ResearchInput } from "@/types/research";
import type { AbTestResult, AbTestConceptResult } from "@/types/ab-test";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 50;
const BATCH_SIZE = 10;

interface PanelResponse {
  personaId: number;
  purchaseIntent: number;
  wtpChoice: "low" | "mid" | "high" | "none";
  featureRankings: { feature: string; importance: number }[];
  topConcern: string;
  topPositive: string;
  nps: number; // 0-10
  purchaseFrequency: string;
  verbatim: string;
}

async function queryPersonaForConcept(
  persona: ConsumerPersona,
  input: ResearchInput,
  features: string[],
  priceRange: { min: number; max: number }
): Promise<PanelResponse> {
  const midPrice = Math.round((priceRange.min + priceRange.max) / 2);
  const lowPrice = priceRange.min;
  const highPrice = priceRange.max;
  const unit = input.priceUnit ? ` ${input.priceUnit}` : "";

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are participating in a consumer research study about a product called "${input.productName}".

Product description: ${input.productDescription}

Key features: ${features.join(", ")}

Please answer the following questions as this consumer would. Be realistic — not everyone likes every product. Consider your income, lifestyle, and actual needs.

1. PURCHASE INTENT: On a scale of 1-5, how likely would you be to purchase this product?
   1 = Definitely would not buy
   2 = Probably would not buy
   3 = Might or might not buy
   4 = Probably would buy
   5 = Definitely would buy

2. PRICE SENSITIVITY: Which of these would you choose?
   A) Buy at $${lowPrice}${unit} (basic version)
   B) Buy at $${midPrice}${unit} (standard version with all features)
   C) Buy at $${highPrice}${unit} (premium version with extras)
   D) Would not purchase at any of these prices

3. FEATURE IMPORTANCE: Rank these features from most to least important (1 = most important):
${features.map((f, i) => `   ${String.fromCharCode(65 + i)}) ${f}`).join("\n")}

4. TOP CONCERN: What is your single biggest concern or hesitation about this product? (One sentence)

5. TOP POSITIVE: What is the single most appealing thing about this product? (One sentence)

6. NPS: On a scale of 0-10, how likely would you be to recommend this product to a friend?
   0 = Not at all likely, 10 = Extremely likely

7. PURCHASE FREQUENCY: If you bought this product, how often would you repurchase?
   A) Weekly  B) Monthly  C) Quarterly  D) One-time purchase  E) Would not buy

8. VERBATIM: In one sentence, describe your honest reaction to this product concept as a real consumer would.

Respond in this exact JSON format:
{
  "purchaseIntent": <number 1-5>,
  "priceChoice": "<A, B, C, or D>",
  "featureRanking": [<list of feature letters from most to least important>],
  "topConcern": "<one sentence>",
  "topPositive": "<one sentence>",
  "nps": <number 0-10>,
  "purchaseFrequency": "<A, B, C, D, or E>",
  "verbatim": "<one sentence>"
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);

    const priceMap: Record<string, PanelResponse["wtpChoice"]> = {
      A: "low",
      B: "mid",
      C: "high",
      D: "none",
    };

    const featureRankings = (parsed.featureRanking || []).map(
      (letter: string, index: number) => {
        const featureIndex =
          typeof letter === "string"
            ? letter.charCodeAt(0) - 65
            : Number(letter);
        const fi = Math.min(Math.max(featureIndex, 0), features.length - 1);
        return {
          feature: features[fi] || features[0],
          importance: features.length - index,
        };
      }
    );

    return {
      personaId: persona.id,
      purchaseIntent: Math.min(5, Math.max(1, Number(parsed.purchaseIntent))),
      wtpChoice: priceMap[parsed.priceChoice] || "none",
      featureRankings,
      topConcern: parsed.topConcern || "No specific concern",
      topPositive: parsed.topPositive || "Interesting concept",
      nps: Math.min(10, Math.max(0, Number(parsed.nps ?? 5))),
      purchaseFrequency: parsed.purchaseFrequency || "D",
      verbatim: parsed.verbatim || "Interesting product concept.",
    };
  } catch {
    return {
      personaId: persona.id,
      purchaseIntent: 3,
      wtpChoice: "mid",
      featureRankings: features.map((f, i) => ({
        feature: f,
        importance: features.length - i,
      })),
      topConcern: "Need more information before deciding",
      topPositive: "The concept is interesting",
      nps: 5,
      purchaseFrequency: "D",
      verbatim: "Would need to learn more before deciding.",
    };
  }
}

function aggregateConceptResults(
  input: ResearchInput,
  responses: PanelResponse[],
  features: string[],
  priceRange: { min: number; max: number }
): AbTestConceptResult {
  const n = responses.length;
  const midPrice = Math.round((priceRange.min + priceRange.max) / 2);

  // Purchase intent distribution
  const intentCounts = [0, 0, 0, 0, 0];
  responses.forEach((r) => intentCounts[r.purchaseIntent - 1]++);
  const intentLabels = [
    "Definitely not",
    "Probably not",
    "Maybe",
    "Probably yes",
    "Definitely yes",
  ];
  const purchaseIntentScore = Math.round(
    (responses.reduce((sum, r) => sum + r.purchaseIntent, 0) / n / 5) * 100
  );

  // WTP
  const wtpCounts = { low: 0, mid: 0, high: 0, none: 0 };
  responses.forEach((r) => wtpCounts[r.wtpChoice]++);
  const wtpLow = priceRange.min;
  const wtpHigh = priceRange.max;
  const avgWtp =
    (wtpCounts.low * wtpLow +
      wtpCounts.mid * midPrice +
      wtpCounts.high * wtpHigh) /
    Math.max(1, wtpCounts.low + wtpCounts.mid + wtpCounts.high);

  // Feature importance
  const featureScores: Record<string, number> = {};
  features.forEach((f) => (featureScores[f] = 0));
  responses.forEach((r) => {
    r.featureRankings.forEach((fr) => {
      if (featureScores[fr.feature] !== undefined) {
        featureScores[fr.feature] += fr.importance;
      }
    });
  });
  const maxFeatureScore = Math.max(...Object.values(featureScores), 1);
  const featureImportance = Object.entries(featureScores)
    .map(([feature, score]) => ({
      feature,
      score: Math.round((score / maxFeatureScore) * 100),
    }))
    .sort((a, b) => b.score - a.score);

  // Concerns and positives - deduplicate
  const concerns = deduplicateStrings(responses.map((r) => r.topConcern));
  const positives = deduplicateStrings(responses.map((r) => r.topPositive));

  // NPS: promoters (9-10) minus detractors (0-6), as percentage
  const promoters = responses.filter((r) => r.nps >= 9).length;
  const detractors = responses.filter((r) => r.nps <= 6).length;
  const npsScore = Math.round(((promoters - detractors) / n) * 100);

  // Purchase frequency
  const freqMap: Record<string, string> = {
    A: "Weekly",
    B: "Monthly",
    C: "Quarterly",
    D: "One-time",
    E: "Would not buy",
  };
  const freqCounts: Record<string, number> = {};
  responses.forEach((r) => {
    const label = freqMap[r.purchaseFrequency] || "One-time";
    freqCounts[label] = (freqCounts[label] || 0) + 1;
  });
  const purchaseFrequency = Object.entries(freqCounts)
    .map(([label, count]) => ({ label, percent: Math.round((count / n) * 100) }))
    .sort((a, b) => b.percent - a.percent);

  // Verbatims - pick diverse, non-generic ones
  const verbatims = deduplicateStrings(
    responses
      .filter((r) => r.verbatim && r.verbatim !== "Interesting product concept." && r.verbatim !== "Would need to learn more before deciding.")
      .map((r) => r.verbatim)
  ).slice(0, 3);

  return {
    input,
    purchaseIntent: {
      score: purchaseIntentScore,
      distribution: intentLabels.map((label, i) => ({
        label,
        count: intentCounts[i],
      })),
    },
    wtpRange: {
      low: wtpLow,
      mid: Math.round(avgWtp),
      high: wtpHigh,
    },
    featureImportance,
    topConcerns: concerns,
    topPositives: positives,
    npsScore,
    purchaseFrequency,
    verbatims,
  };
}

function deduplicateStrings(items: string[]): string[] {
  const isSimilar = (a: string, b: string) =>
    a.slice(0, 40).toLowerCase() === b.slice(0, 40).toLowerCase();
  const isGeneric = (text: string) =>
    text === "Need more information before deciding" ||
    text === "The concept is interesting";

  const selected: string[] = [];
  for (const text of items) {
    if (selected.length >= 5) break;
    if (!isGeneric(text) && !selected.some((s) => isSimilar(s, text))) {
      selected.push(text);
    }
  }
  return selected;
}

async function extractFeatures(input: ResearchInput): Promise<string[]> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Extract 4-6 key features or value propositions from this product description. Return ONLY a JSON array of short feature strings (3-6 words each).

Product: ${input.productName}
Description: ${input.productDescription}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "[]";
  try {
    const match = text.match(/\[[\s\S]*\]/);
    return match
      ? JSON.parse(match[0])
      : ["Core product", "Price", "Quality", "Convenience"];
  } catch {
    return ["Core product", "Price", "Quality", "Convenience"];
  }
}

async function inferPriceRange(
  input: ResearchInput
): Promise<{ min: number; max: number }> {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: `What would be a realistic price range for this product? Return ONLY a JSON object like {"min": 10, "max": 50}.

Product: ${input.productName}
Description: ${input.productDescription}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  try {
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;
    return parsed && parsed.min && parsed.max
      ? { min: Number(parsed.min), max: Number(parsed.max) }
      : { min: 10, max: 50 };
  } catch {
    return { min: 10, max: 50 };
  }
}

export async function runAbTest(
  inputA: ResearchInput,
  inputB: ResearchInput,
  sharedCategory: string,
  sharedTarget?: string
): Promise<AbTestResult> {
  // Generate ONE shared panel
  const panel = sharedTarget
    ? await generateTargetedPanel(PANEL_SIZE, sharedCategory, sharedTarget)
    : generatePanel(PANEL_SIZE, sharedCategory);

  // Extract features for both concepts
  const featuresA = inputA.keyFeatures?.length
    ? inputA.keyFeatures
    : await extractFeatures(inputA);
  const featuresB = inputB.keyFeatures?.length
    ? inputB.keyFeatures
    : await extractFeatures(inputB);

  const priceRangeA = inputA.priceRange || (await inferPriceRange(inputA));
  const priceRangeB = inputB.priceRange || (await inferPriceRange(inputB));

  // Query all personas for concept A in batches
  const responsesA: PanelResponse[] = [];
  for (let i = 0; i < panel.length; i += BATCH_SIZE) {
    const batch = panel.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map((persona) =>
        queryPersonaForConcept(persona, inputA, featuresA, priceRangeA)
      )
    );
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        responsesA.push(result.value);
      }
    }
  }

  // Query all personas for concept B in batches
  const responsesB: PanelResponse[] = [];
  for (let i = 0; i < panel.length; i += BATCH_SIZE) {
    const batch = panel.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map((persona) =>
        queryPersonaForConcept(persona, inputB, featuresB, priceRangeB)
      )
    );
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        responsesB.push(result.value);
      }
    }
  }

  if (responsesA.length < 5 || responsesB.length < 5) {
    throw new Error(
      `Too few persona responses. The A/B test panel could not be completed.`
    );
  }

  // Aggregate both
  const conceptA = aggregateConceptResults(inputA, responsesA, featuresA, priceRangeA);
  const conceptB = aggregateConceptResults(inputB, responsesB, featuresB, priceRangeB);

  // Determine winner
  const scoreA = conceptA.purchaseIntent.score;
  const scoreB = conceptB.purchaseIntent.score;
  const diff = Math.abs(scoreA - scoreB);
  const winner: "A" | "B" | "tie" =
    diff < 3 ? "tie" : scoreA > scoreB ? "A" : "B";

  const demographicMix = sharedTarget
    ? `Targeted panel: ${sharedTarget} (80%) + general population (20%)`
    : "US general population (varied age, income, gender, location)";

  return {
    id: nanoid(12),
    conceptA,
    conceptB,
    winner,
    winMargin: diff,
    panelSize: Math.min(responsesA.length, responsesB.length),
    methodology: {
      panelSize: Math.min(responsesA.length, responsesB.length),
      demographicMix,
      questionsAsked: (responsesA.length + responsesB.length) * 5,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. Both concepts were tested against the same panel for fair comparison. Best used for directional insights and hypothesis generation.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}
