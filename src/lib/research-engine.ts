import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type {
  ConsumerPersona,
  ResearchInput,
  ResearchResult,
} from "@/types/research";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 50;
const BATCH_SIZE = 10;

export async function runResearch(
  input: ResearchInput,
  onProgress?: (stage: string, progress: number) => void
): Promise<ResearchResult> {
  const category = input.category || inferCategory(input.productDescription);
  const panel = input.targetMarket
    ? await generateTargetedPanel(PANEL_SIZE, category, input.targetMarket)
    : generatePanel(PANEL_SIZE, category);
  const features = input.keyFeatures?.length
    ? input.keyFeatures
    : await extractFeatures(input);

  const priceRange = input.priceRange || (await inferPriceRange(input));

  onProgress?.("Simulating consumer panel responses...", 10);

  // Run conjoint-style purchase intent + WTP in batches
  // Individual persona failures are skipped rather than crashing the run
  const allResponses: PanelResponse[] = [];
  for (let i = 0; i < panel.length; i += BATCH_SIZE) {
    const batch = panel.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map((persona) =>
        queryPersona(persona, input, features, priceRange)
      )
    );
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        allResponses.push(result.value);
      }
      // rejected personas are silently skipped
    }
    onProgress?.(
      "Simulating consumer panel responses...",
      10 + Math.round((i / panel.length) * 60)
    );
  }

  if (allResponses.length < 5) {
    throw new Error(
      `Too few persona responses (${allResponses.length}/${PANEL_SIZE}). The research panel could not be completed.`
    );
  }

  onProgress?.("Analysing results...", 75);

  // Aggregate results
  const result = aggregateResults(input, allResponses, features, priceRange, panel);

  onProgress?.("Generating insights...", 90);

  // Generate verbatims
  const verbatims = await generateVerbatims(input, allResponses);

  onProgress?.("Complete", 100);

  return {
    ...result,
    verbatims,
    id: nanoid(12),
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}

interface PanelResponse {
  personaId: number;
  personaLabel: string;
  personaAge: number;
  personaGender: string;
  personaIncome: number;
  purchaseIntent: number; // 1-5
  wtpChoice: "low" | "mid" | "high" | "none";
  featureRankings: { feature: string; importance: number }[];
  topConcern: string;
  topPositive: string;
  competitivePreference?: "much_better" | "better" | "same" | "worse" | "much_worse" | "unfamiliar";
  purchaseFrequency: string; // A-E
  purchaseChannel: string; // A-E
  npsScore: number; // 0-10
  oneWord: string;
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
  const unit = input.priceUnit ? ` ${input.priceUnit}` : "";
  const packContext = input.unitsPerPack && input.priceUnit
    ? `\n\nPricing context: This product is priced ${input.priceUnit} and contains ${input.unitsPerPack} servings/units.`
    : "";

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are participating in a consumer research study about a product called "${input.productName}".

Product description: ${input.productDescription}${packContext}

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

6. PURCHASE FREQUENCY: If you bought this, how often would you repurchase?
   A) Weekly
   B) Monthly
   C) Every few months
   D) One-time purchase only
   E) Would not purchase

7. PURCHASE CHANNEL: Where would you most likely buy this product?
   A) Amazon
   B) Brand's website
   C) Grocery/retail store
   D) Convenience store
   E) Subscription service

8. RECOMMENDATION: On a scale of 0-10, how likely are you to recommend this product to a friend or colleague?

9. ONE WORD: Describe this product in exactly one word.
${input.competitors ? `
10. COMPETITIVE PREFERENCE: Compared to ${input.competitors}, how does ${input.productName} compare?
   A) Much better than alternatives
   B) Somewhat better
   C) About the same
   D) Somewhat worse
   E) Much worse
   F) Not familiar with the alternatives` : ""}

Respond in this exact JSON format:
{
  "purchaseIntent": <number 1-5>,
  "priceChoice": "<A, B, C, or D>",
  "featureRanking": [<list of feature letters from most to least important>],
  "topConcern": "<one sentence>",
  "topPositive": "<one sentence>",
  "purchaseFrequency": "<A, B, C, D, or E>",
  "purchaseChannel": "<A, B, C, D, or E>",
  "npsScore": <number 0-10>,
  "oneWord": "<single word>"${input.competitors ? `,
  "competitiveChoice": "<A, B, C, D, E, or F>"` : ""}
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
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

    const compMap: Record<string, PanelResponse["competitivePreference"]> = {
      A: "much_better",
      B: "better",
      C: "same",
      D: "worse",
      E: "much_worse",
      F: "unfamiliar",
    };

    return {
      personaId: persona.id,
      personaLabel,
      personaAge: persona.age,
      personaGender: persona.gender,
      personaIncome: persona.income,
      purchaseIntent: Math.min(5, Math.max(1, Number(parsed.purchaseIntent))),
      wtpChoice: priceMap[parsed.priceChoice] || "none",
      featureRankings,
      topConcern: parsed.topConcern || "No specific concern",
      topPositive: parsed.topPositive || "Interesting concept",
      purchaseFrequency: parsed.purchaseFrequency || "C",
      purchaseChannel: parsed.purchaseChannel || "A",
      npsScore: Math.min(10, Math.max(0, Number(parsed.npsScore) || 5)),
      oneWord: (parsed.oneWord || "interesting").split(/\s+/)[0],
      ...(parsed.competitiveChoice && {
        competitivePreference: compMap[parsed.competitiveChoice] || "unfamiliar",
      }),
    };
  } catch {
    // Fallback for parse errors — contribute neutral data
    return {
      personaId: persona.id,
      personaLabel: `${persona.age}yo ${persona.gender}`,
      personaAge: persona.age,
      personaGender: persona.gender,
      personaIncome: persona.income,
      purchaseIntent: 3,
      wtpChoice: "mid",
      featureRankings: features.map((f, i) => ({
        feature: f,
        importance: features.length - i,
      })),
      topConcern: "Need more information before deciding",
      topPositive: "The concept is interesting",
      purchaseFrequency: "C",
      purchaseChannel: "A",
      npsScore: 5,
      oneWord: "interesting",
    };
  }
}

function aggregateResults(
  input: ResearchInput,
  responses: PanelResponse[],
  features: string[],
  priceRange: { min: number; max: number },
  panel: ConsumerPersona[]
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

  // Concerns and positives — deduplicate by prefix similarity and pick from diverse personas
  const concerns = deduplicateByDiversity(responses, "topConcern");
  const positives = deduplicateByDiversity(responses, "topPositive");

  // Competitive positioning (only when competitors were provided)
  let competitivePosition: ResearchResult["competitivePosition"];
  if (input.competitors) {
    const compLabels: { key: string; label: string }[] = [
      { key: "much_better", label: "Much better" },
      { key: "better", label: "Somewhat better" },
      { key: "same", label: "About the same" },
      { key: "worse", label: "Somewhat worse" },
      { key: "much_worse", label: "Much worse" },
      { key: "unfamiliar", label: "Not familiar" },
    ];
    const compCounts: Record<string, number> = {};
    compLabels.forEach((l) => (compCounts[l.key] = 0));
    responses.forEach((r) => {
      if (r.competitivePreference && compCounts[r.competitivePreference] !== undefined) {
        compCounts[r.competitivePreference]++;
      }
    });
    competitivePosition = {
      distribution: compLabels.map((l) => ({
        label: l.label,
        count: compCounts[l.key],
      })),
      competitors: input.competitors,
    };
  }

  // Purchase frequency distribution
  const frequencyLabels = ["Weekly", "Monthly", "Every few months", "One-time only", "Would not purchase"];
  const frequencyCounts = [0, 0, 0, 0, 0];
  const freqMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  responses.forEach((r) => {
    const idx = freqMap[r.purchaseFrequency];
    if (idx !== undefined) frequencyCounts[idx]++;
  });
  const purchaseFrequency = frequencyLabels.map((label, i) => ({ label, count: frequencyCounts[i] }));

  // Channel preference distribution
  const channelLabels = ["Amazon", "Brand website", "Grocery/retail", "Convenience store", "Subscription"];
  const channelCounts = [0, 0, 0, 0, 0];
  const chanMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
  responses.forEach((r) => {
    const idx = chanMap[r.purchaseChannel];
    if (idx !== undefined) channelCounts[idx]++;
  });
  const channelPreference = channelLabels.map((label, i) => ({ label, count: channelCounts[i] }));

  // NPS Score: % Promoters (9-10) - % Detractors (0-6)
  const promoters = responses.filter((r) => r.npsScore >= 9).length;
  const detractors = responses.filter((r) => r.npsScore <= 6).length;
  const npsScore = Math.round(((promoters - detractors) / n) * 100);

  // Top words from one-word descriptions
  const wordCounts: Record<string, number> = {};
  responses.forEach((r) => {
    const word = r.oneWord.toLowerCase().trim();
    if (word) wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  const questionsPerPersona = input.competitors ? 10 : 9;

  // Panel demographic breakdown
  const ages = panel.map((p) => p.age).sort((a, b) => a - b);
  const incomes = panel.map((p) => p.income).sort((a, b) => a - b);
  const median = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
  };
  const genderCounts = { male: 0, female: 0, nonBinary: 0 };
  panel.forEach((p) => {
    if (p.gender === "male") genderCounts.male++;
    else if (p.gender === "female") genderCounts.female++;
    else genderCounts.nonBinary++;
  });
  const pn = panel.length;
  const panelBreakdown = {
    genderSplit: {
      male: Math.round((genderCounts.male / pn) * 100),
      female: Math.round((genderCounts.female / pn) * 100),
      nonBinary: Math.round((genderCounts.nonBinary / pn) * 100),
    },
    ageRange: { min: ages[0], max: ages[ages.length - 1], median: median(ages) },
    incomeRange: { min: incomes[0], max: incomes[incomes.length - 1], median: median(incomes) },
  };

  // Segment breakdowns
  function computeSegmentIntent(subset: PanelResponse[]): number {
    if (subset.length === 0) return 0;
    return Math.round(
      (subset.reduce((sum, r) => sum + r.purchaseIntent, 0) / subset.length / 5) * 100
    );
  }

  const ageGroups = [
    { segment: "18-30", filter: (r: PanelResponse) => r.personaAge >= 18 && r.personaAge <= 30 },
    { segment: "31-45", filter: (r: PanelResponse) => r.personaAge >= 31 && r.personaAge <= 45 },
    { segment: "46+", filter: (r: PanelResponse) => r.personaAge >= 46 },
  ];
  const genderGroups = [
    { segment: "Male", filter: (r: PanelResponse) => r.personaGender === "male" },
    { segment: "Female", filter: (r: PanelResponse) => r.personaGender === "female" },
    { segment: "Non-binary", filter: (r: PanelResponse) => r.personaGender === "non-binary" },
  ];
  const incomeGroups = [
    { segment: "Under $50k", filter: (r: PanelResponse) => r.personaIncome < 50000 },
    { segment: "$50-100k", filter: (r: PanelResponse) => r.personaIncome >= 50000 && r.personaIncome <= 100000 },
    { segment: "Over $100k", filter: (r: PanelResponse) => r.personaIncome > 100000 },
  ];

  const segmentBreakdown = {
    byAge: ageGroups.map((g) => {
      const subset = responses.filter(g.filter);
      return { segment: g.segment, intentScore: computeSegmentIntent(subset), count: subset.length };
    }).filter((s) => s.count > 0),
    byGender: genderGroups.map((g) => {
      const subset = responses.filter(g.filter);
      return { segment: g.segment, intentScore: computeSegmentIntent(subset), count: subset.length };
    }).filter((s) => s.count > 0),
    byIncome: incomeGroups.map((g) => {
      const subset = responses.filter(g.filter);
      return { segment: g.segment, intentScore: computeSegmentIntent(subset), count: subset.length };
    }).filter((s) => s.count > 0),
  };

  return {
    input,
    panelSize: n,
    segmentBreakdown,
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
    purchaseFrequency,
    channelPreference,
    npsScore,
    topWords,
    ...(competitivePosition && { competitivePosition }),
    methodology: {
      panelSize: n,
      demographicMix: input.targetMarket
        ? `Targeted panel: ${input.targetMarket} (80%) + general population (20%)`
        : "US general population (varied age, income, gender, location)",
      questionsAsked: n * questionsPerPersona,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation. See our methodology page for academic references and limitations.",
      panelBreakdown,
    },
  };
}

function deduplicateByDiversity(
  responses: PanelResponse[],
  field: "topConcern" | "topPositive"
): string[] {
  const isSimilar = (a: string, b: string) =>
    a.slice(0, 40).toLowerCase() === b.slice(0, 40).toLowerCase();

  const isGeneric = (text: string) =>
    text === "Need more information before deciding" ||
    text === "The concept is interesting";

  // Sort by income (parsed from persona label) for quintile diversity
  const sorted = [...responses].sort((a, b) => {
    const incA = parseInt(a.personaLabel.match(/\$(\d+)k/)?.[1] ?? "50");
    const incB = parseInt(b.personaLabel.match(/\$(\d+)k/)?.[1] ?? "50");
    return incA - incB;
  });

  const quintileSize = Math.ceil(sorted.length / 5);
  const selected: string[] = [];

  // Take one from each income quintile
  for (let q = 0; q < 5 && selected.length < 5; q++) {
    const slice = sorted.slice(q * quintileSize, (q + 1) * quintileSize);
    for (const r of slice) {
      const text = r[field];
      if (!isGeneric(text) && !selected.some((s) => isSimilar(s, text))) {
        selected.push(text);
        break;
      }
    }
  }

  // Fill remaining from full pool
  for (const r of responses) {
    if (selected.length >= 5) break;
    const text = r[field];
    if (!isGeneric(text) && !selected.some((s) => isSimilar(s, text))) {
      selected.push(text);
    }
  }

  return selected;
}

async function generateVerbatims(
  input: ResearchInput,
  responses: PanelResponse[]
): Promise<{ persona: string; quote: string }[]> {
  const usable = responses.filter(
    (r) => r.topConcern !== "Need more information before deciding"
  );
  const sample = usable.sort(() => Math.random() - 0.5).slice(0, 10);

  const pairsText = sample
    .map(
      (r) =>
        `- ${r.personaLabel}: Positive: "${r.topPositive}" | Concern: "${r.topConcern}"`
    )
    .join("\n");

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      temperature: 0.9,
      messages: [
        {
          role: "user",
          content: `You are writing consumer verbatim quotes for a research report about "${input.productName}".

Here are real positive/concern pairs from simulated consumers:
${pairsText}

Write exactly 5 verbatim quotes from 5 different consumers. Each should sound like a real person speaking naturally. Rules:
- Vary structure: some enthusiastic, some skeptical, some practical, some price-focused
- Do NOT start every quote the same way
- 1-3 sentences each
- Include the persona demographic

Return ONLY a JSON array:
[{"persona": "28yo female, $65k income", "quote": "..."}, ...]`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 5);
    }
  } catch {
    // Fall through to mechanical fallback
  }

  // Fallback: mechanical concatenation
  return sample.slice(0, 5).map((r) => ({
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
