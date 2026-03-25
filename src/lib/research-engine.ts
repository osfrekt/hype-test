import Anthropic from "@anthropic-ai/sdk";
import type {
  ConsumerPersona,
  ResearchInput,
  ResearchResult,
} from "@/types/research";
import { generatePanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 50;
const BATCH_SIZE = 10;

export async function runResearch(
  input: ResearchInput,
  onProgress?: (stage: string, progress: number) => void
): Promise<ResearchResult> {
  const category = input.category || inferCategory(input.productDescription);
  const panel = generatePanel(PANEL_SIZE, category);
  const features = input.keyFeatures?.length
    ? input.keyFeatures
    : await extractFeatures(input);

  const priceRange = input.priceRange || (await inferPriceRange(input));

  onProgress?.("Simulating consumer panel responses...", 10);

  // Run conjoint-style purchase intent + WTP in batches
  const allResponses: PanelResponse[] = [];
  for (let i = 0; i < panel.length; i += BATCH_SIZE) {
    const batch = panel.slice(i, i + BATCH_SIZE);
    const batchResponses = await Promise.all(
      batch.map((persona) =>
        queryPersona(persona, input, features, priceRange)
      )
    );
    allResponses.push(...batchResponses);
    onProgress?.(
      "Simulating consumer panel responses...",
      10 + Math.round((i / panel.length) * 60)
    );
  }

  onProgress?.("Analysing results...", 75);

  // Aggregate results
  const result = aggregateResults(input, allResponses, features, priceRange);

  onProgress?.("Generating insights...", 90);

  // Generate verbatims
  const verbatims = await generateVerbatims(input, allResponses);

  onProgress?.("Complete", 100);

  return {
    ...result,
    verbatims,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}

interface PanelResponse {
  personaId: number;
  personaLabel: string;
  purchaseIntent: number; // 1-5
  wtpChoice: "low" | "mid" | "high" | "none";
  featureRankings: { feature: string; importance: number }[];
  topConcern: string;
  topPositive: string;
}

async function queryPersona(
  persona: ConsumerPersona,
  input: ResearchInput,
  features: string[],
  priceRange: { min: number; max: number }
): Promise<PanelResponse> {
  const midPrice = Math.round((priceRange.min + priceRange.max) / 2);
  const lowPrice = priceRange.min;
  const highPrice = priceRange.max;

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
   A) Buy at $${lowPrice} (basic version)
   B) Buy at $${midPrice} (standard version with all features)
   C) Buy at $${highPrice} (premium version with extras)
   D) Would not purchase at any of these prices

3. FEATURE IMPORTANCE: Rank these features from most to least important (1 = most important):
${features.map((f, i) => `   ${String.fromCharCode(65 + i)}) ${f}`).join("\n")}

4. TOP CONCERN: What is your single biggest concern or hesitation about this product? (One sentence)

5. TOP POSITIVE: What is the single most appealing thing about this product? (One sentence)

Respond in this exact JSON format:
{
  "purchaseIntent": <number 1-5>,
  "priceChoice": "<A, B, C, or D>",
  "featureRanking": [<list of feature letters from most to least important>],
  "topConcern": "<one sentence>",
  "topPositive": "<one sentence>"
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    const personaLabel = `${persona.age}yo ${persona.gender}, $${(persona.income / 1000).toFixed(0)}k income`;

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
      personaLabel,
      purchaseIntent: Math.min(5, Math.max(1, Number(parsed.purchaseIntent))),
      wtpChoice: priceMap[parsed.priceChoice] || "none",
      featureRankings,
      topConcern: parsed.topConcern || "No specific concern",
      topPositive: parsed.topPositive || "Interesting concept",
    };
  } catch {
    // Fallback for parse errors — contribute neutral data
    return {
      personaId: persona.id,
      personaLabel: `${persona.age}yo ${persona.gender}`,
      purchaseIntent: 3,
      wtpChoice: "mid",
      featureRankings: features.map((f, i) => ({
        feature: f,
        importance: features.length - i,
      })),
      topConcern: "Need more information before deciding",
      topPositive: "The concept is interesting",
    };
  }
}

function aggregateResults(
  input: ResearchInput,
  responses: PanelResponse[],
  features: string[],
  priceRange: { min: number; max: number }
): Omit<ResearchResult, "verbatims" | "id" | "createdAt" | "status"> {
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

  // Concerns and positives — deduplicate by similarity (simple approach: take unique)
  const concerns = [...new Set(responses.map((r) => r.topConcern))].slice(
    0,
    5
  );
  const positives = [...new Set(responses.map((r) => r.topPositive))].slice(
    0,
    5
  );

  return {
    input,
    panelSize: n,
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
    methodology: {
      panelSize: n,
      demographicMix:
        "US general population (varied age, income, gender, location)",
      questionsAsked: n * 5,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation. See our methodology page for academic references and limitations.",
    },
  };
}

async function generateVerbatims(
  input: ResearchInput,
  responses: PanelResponse[]
): Promise<{ persona: string; quote: string }[]> {
  // Pick 5 diverse responses
  const selected = responses
    .filter((r) => r.topConcern !== "Need more information before deciding")
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return selected.map((r) => ({
    persona: r.personaLabel,
    quote: `${r.topPositive} However, ${r.topConcern.charAt(0).toLowerCase()}${r.topConcern.slice(1)}`,
  }));
}

async function extractFeatures(
  input: ResearchInput
): Promise<string[]> {
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
    return match ? JSON.parse(match[0]) : ["Core product", "Price", "Quality", "Convenience"];
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

function inferCategory(description: string): string {
  const lower = description.toLowerCase();
  const categories: Record<string, string[]> = {
    "food & beverage": ["food", "drink", "snack", "meal", "coffee", "tea", "beverage"],
    "health & wellness": ["health", "fitness", "supplement", "vitamin", "workout", "wellness"],
    "technology": ["app", "software", "tech", "device", "gadget", "platform", "digital"],
    "fashion & apparel": ["clothing", "fashion", "wear", "shoe", "apparel", "accessory"],
    "home & garden": ["home", "furniture", "decor", "garden", "kitchen", "cleaning"],
    "beauty & personal care": ["beauty", "skincare", "cosmetic", "hair", "grooming"],
    "education": ["learn", "course", "education", "training", "tutorial", "class"],
    "finance": ["finance", "invest", "bank", "money", "payment", "budget"],
  };

  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some((k) => lower.includes(k))) return cat;
  }
  return "consumer products";
}
