import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona } from "@/types/research";
import type {
  DiscoveryInput,
  DiscoveryResult,
  DiscoveryPanelResult,
  ProductConcept,
} from "@/types/discovery";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 30;
const BATCH_SIZE = 10;

// ---------------------------------------------------------------------------
// Phase 1 — Concept Generation
// ---------------------------------------------------------------------------

async function generateConcepts(
  input: DiscoveryInput
): Promise<ProductConcept[]> {
  const priceContext = input.priceRange
    ? `\nPrice range to target: $${input.priceRange.min} – $${input.priceRange.max}${input.priceUnit ? ` ${input.priceUnit}` : ""}`
    : "";
  const existingContext = input.existingProducts
    ? `\nExisting products the brand already sells: ${input.existingProducts}`
    : "";
  const constraintContext = input.constraints
    ? `\nConstraints or requirements: ${input.constraints}`
    : "";

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      temperature: 0.9,
      messages: [
        {
          role: "user",
          content: `You are a product innovation strategist. Generate 8 new product concepts for the following brand.

Brand name: ${input.brandName}
Brand description: ${input.brandDescription}
Category: ${input.category}
Target audience: ${input.targetAudience}${priceContext}${existingContext}${constraintContext}

For each concept, provide:
- name: A compelling product name
- description: 2-3 sentence description of the product
- rationale: Why this product would resonate with the target audience
- estimatedPricePoint: { low: number, high: number } realistic price range

Return ONLY a JSON array of exactly 8 objects:
[{"name": "...", "description": "...", "rationale": "...", "estimatedPricePoint": {"low": 10, "high": 25}}, ...]`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON array in response");

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Empty concepts array");
    }
    return parsed.slice(0, 8).map((c: Record<string, unknown>) => ({
      name: String(c.name || "Unnamed Concept"),
      description: String(c.description || ""),
      rationale: String(c.rationale || ""),
      estimatedPricePoint: {
        low: Number((c.estimatedPricePoint as Record<string, unknown>)?.low ?? 10),
        high: Number((c.estimatedPricePoint as Record<string, unknown>)?.high ?? 50),
      },
    }));
  } catch {
    // Fallback: 4 generic concepts for the category
    return [
      {
        name: `${input.brandName} Essential`,
        description: `A core ${input.category} product designed for everyday use by ${input.targetAudience}.`,
        rationale: "Addresses the most common needs in the category.",
        estimatedPricePoint: { low: 10, high: 30 },
      },
      {
        name: `${input.brandName} Premium`,
        description: `A premium ${input.category} offering with enhanced features and quality materials.`,
        rationale: "Targets the quality-conscious segment of the audience.",
        estimatedPricePoint: { low: 30, high: 60 },
      },
      {
        name: `${input.brandName} Starter Kit`,
        description: `An introductory bundle that makes it easy for newcomers to get started in ${input.category}.`,
        rationale: "Lowers the barrier to entry for new customers.",
        estimatedPricePoint: { low: 15, high: 35 },
      },
      {
        name: `${input.brandName} Subscription`,
        description: `A recurring delivery service for ${input.category} products tailored to individual preferences.`,
        rationale: "Creates recurring revenue and ongoing customer engagement.",
        estimatedPricePoint: { low: 20, high: 45 },
      },
    ];
  }
}

// ---------------------------------------------------------------------------
// Phase 2 — Mini Panel Testing
// ---------------------------------------------------------------------------

interface MiniPanelResponse {
  personaId: number;
  personaLabel: string;
  purchaseIntent: number; // 1-5
  priceChoice: "A" | "B" | "C" | "D";
  reaction: string;
}

async function queryPersonaMini(
  persona: ConsumerPersona,
  concept: ProductConcept,
  brandName: string
): Promise<MiniPanelResponse> {
  const lowPrice = concept.estimatedPricePoint.low;
  const highPrice = concept.estimatedPricePoint.high;
  const midPrice = Math.round((lowPrice + highPrice) / 2);

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are shown a new product concept from the brand "${brandName}":

Product: "${concept.name}"
Description: ${concept.description}

Answer these 3 questions as this consumer would. Be realistic.

1. PURCHASE INTENT: On a scale of 1-5, how likely would you be to purchase this product?
   1 = Definitely would not buy
   2 = Probably would not buy
   3 = Might or might not buy
   4 = Probably would buy
   5 = Definitely would buy

2. PRICE SENSITIVITY: Which of these would you choose?
   A) Buy at $${lowPrice} (basic)
   B) Buy at $${midPrice} (standard)
   C) Buy at $${highPrice} (premium)
   D) Would not purchase at any of these prices

3. ONE-LINE REACTION: What is your honest first reaction to this product? (One sentence)

Respond in this exact JSON format:
{
  "purchaseIntent": <number 1-5>,
  "priceChoice": "<A, B, C, or D>",
  "reaction": "<one sentence>"
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

    return {
      personaId: persona.id,
      personaLabel,
      purchaseIntent: Math.min(5, Math.max(1, Number(parsed.purchaseIntent))),
      priceChoice: (["A", "B", "C", "D"].includes(parsed.priceChoice)
        ? parsed.priceChoice
        : "D") as "A" | "B" | "C" | "D",
      reaction: parsed.reaction || "Interesting concept",
    };
  } catch {
    // Fallback for parse errors — contribute neutral data
    return {
      personaId: persona.id,
      personaLabel: `${persona.age}yo ${persona.gender}`,
      purchaseIntent: 3,
      priceChoice: "B",
      reaction: "The concept is interesting but I need more information.",
    };
  }
}

async function testConcept(
  concept: ProductConcept,
  panel: ConsumerPersona[],
  brandName: string
): Promise<MiniPanelResponse[]> {
  const allResponses: MiniPanelResponse[] = [];

  for (let i = 0; i < panel.length; i += BATCH_SIZE) {
    const batch = panel.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map((persona) => queryPersonaMini(persona, concept, brandName))
    );
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        allResponses.push(result.value);
      }
    }
  }

  return allResponses;
}

// ---------------------------------------------------------------------------
// Phase 3 — Aggregation
// ---------------------------------------------------------------------------

async function extractThemes(
  reactions: string[],
  concept: ProductConcept
): Promise<{ excitement: string; hesitation: string }> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Analyse these consumer reactions to the product "${concept.name}":

${reactions.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Identify:
1. The single most common excitement theme (what people liked most)
2. The single most common hesitation theme (what concerned people most)

Return ONLY JSON:
{"excitement": "...", "hesitation": "..."}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        excitement: parsed.excitement || "Novel concept",
        hesitation: parsed.hesitation || "Uncertain value proposition",
      };
    }
  } catch {
    // fall through
  }

  return {
    excitement: "Novel concept",
    hesitation: "Uncertain value proposition",
  };
}

function aggregateConcept(
  concept: ProductConcept,
  responses: MiniPanelResponse[],
  themes: { excitement: string; hesitation: string }
): Omit<DiscoveryPanelResult, "demandRank"> {
  const n = responses.length;

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

  // WTP range
  const priceMap: Record<string, "low" | "mid" | "high" | "none"> = {
    A: "low",
    B: "mid",
    C: "high",
    D: "none",
  };
  const wtpCounts = { low: 0, mid: 0, high: 0, none: 0 };
  responses.forEach((r) => {
    const bucket = priceMap[r.priceChoice] || "none";
    wtpCounts[bucket]++;
  });

  const lowPrice = concept.estimatedPricePoint.low;
  const highPrice = concept.estimatedPricePoint.high;
  const midPrice = Math.round((lowPrice + highPrice) / 2);

  const avgWtp =
    (wtpCounts.low * lowPrice +
      wtpCounts.mid * midPrice +
      wtpCounts.high * highPrice) /
    Math.max(1, wtpCounts.low + wtpCounts.mid + wtpCounts.high);

  return {
    concept,
    purchaseIntent: {
      score: purchaseIntentScore,
      distribution: intentLabels.map((label, i) => ({
        label,
        count: intentCounts[i],
      })),
    },
    wtpRange: {
      low: lowPrice,
      mid: Math.round(avgWtp),
      high: highPrice,
    },
    topExcitement: themes.excitement,
    topHesitation: themes.hesitation,
    round: 1,
  };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function runDiscovery(
  input: DiscoveryInput,
  onProgress?: (stage: string, progress: number) => void
): Promise<DiscoveryResult> {
  // Phase 1 — Concept Generation
  onProgress?.("Generating product concepts...", 5);
  const concepts = await generateConcepts(input);

  // Create panel once, reuse for all concepts
  onProgress?.("Assembling consumer panel...", 10);
  const panel = input.targetAudience
    ? await generateTargetedPanel(PANEL_SIZE, input.category, input.targetAudience)
    : generatePanel(PANEL_SIZE, input.category);

  // Phase 2 — Mini Panel Testing (at concept level with Promise.allSettled)
  onProgress?.("Testing concepts with consumer panel...", 15);
  const conceptTestResults = await Promise.allSettled(
    concepts.map((concept) => testConcept(concept, panel, input.brandName))
  );

  const conceptResponses: { concept: ProductConcept; responses: MiniPanelResponse[] }[] = [];
  for (let i = 0; i < concepts.length; i++) {
    const result = conceptTestResults[i];
    if (result.status === "fulfilled" && result.value.length > 0) {
      conceptResponses.push({ concept: concepts[i], responses: result.value });
    }
  }

  if (conceptResponses.length === 0) {
    throw new Error("All concept tests failed. The discovery could not be completed.");
  }

  onProgress?.("Analysing results...", 75);

  // Phase 3 — Aggregation
  const panelResults: DiscoveryPanelResult[] = [];
  for (const { concept, responses } of conceptResponses) {
    const reactions = responses
      .map((r) => r.reaction)
      .filter(
        (r) => r !== "The concept is interesting but I need more information."
      );

    const themes = await extractThemes(
      reactions.length > 0 ? reactions : ["Interesting concept"],
      concept
    );
    const aggregated = aggregateConcept(concept, responses, themes);
    panelResults.push({ ...aggregated, demandRank: 0, round: 1 });
  }

  // Rank by purchase intent descending
  panelResults.sort((a, b) => b.purchaseIntent.score - a.purchaseIntent.score);
  panelResults.forEach((r, i) => (r.demandRank = i + 1));

  onProgress?.("Complete", 100);

  const actualPanelSize = Math.max(
    ...conceptResponses.map((cr) => cr.responses.length),
    0
  );

  return {
    id: nanoid(12),
    input,
    concepts: panelResults,
    rounds: 1,
    panelSize: actualPanelSize,
    methodology: {
      panelSize: actualPanelSize,
      demographicMix: input.targetAudience
        ? `Targeted panel: ${input.targetAudience} (80%) + general population (20%)`
        : "US general population (varied age, income, gender, location)",
      conceptsGenerated: concepts.length,
      conceptsTested: conceptResponses.length,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation. See our methodology page for academic references and limitations.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}

// ---------------------------------------------------------------------------
// Iterative Round — Evolve top concepts + add wildcards
// ---------------------------------------------------------------------------

async function generateRoundConcepts(
  input: DiscoveryInput,
  previousConcepts: DiscoveryPanelResult[]
): Promise<ProductConcept[]> {
  const priceContext = input.priceRange
    ? `\nPrice range to target: $${input.priceRange.min} – $${input.priceRange.max}${input.priceUnit ? ` ${input.priceUnit}` : ""}`
    : "";
  const existingContext = input.existingProducts
    ? `\nExisting products the brand already sells: ${input.existingProducts}`
    : "";
  const constraintContext = input.constraints
    ? `\nConstraints or requirements: ${input.constraints}`
    : "";

  const sorted = [...previousConcepts].sort(
    (a, b) => b.purchaseIntent.score - a.purchaseIntent.score
  );
  const top3 = sorted.slice(0, 3);
  const previousNames = previousConcepts.map((c) => c.concept.name);

  const topConceptsSummary = top3
    .map(
      (c, i) =>
        `${i + 1}. "${c.concept.name}" — Purchase intent: ${c.purchaseIntent.score}%, Excitement: "${c.topExcitement}", Hesitation: "${c.topHesitation}", Price: $${c.wtpRange.low}-$${c.wtpRange.high}\n   Description: ${c.concept.description}`
    )
    .join("\n");

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      temperature: 0.9,
      messages: [
        {
          role: "user",
          content: `You are a product innovation strategist running an iterative discovery process. A previous round of concept testing has been completed. Your job is to evolve the best concepts and introduce fresh wildcards.

Brand name: ${input.brandName}
Brand description: ${input.brandDescription}
Category: ${input.category}
Target audience: ${input.targetAudience}${priceContext}${existingContext}${constraintContext}

TOP 3 CONCEPTS FROM PREVIOUS ROUND(S):
${topConceptsSummary}

PREVIOUS CONCEPT NAMES (do NOT reuse these names):
${previousNames.map((n) => `- "${n}"`).join("\n")}

Generate exactly 8 new product concepts:

1. EVOLVED VARIANTS (5-6 concepts): Take the top 3 concepts above and create evolved variants. Tweak their positioning, features, pricing, or target sub-audience to address the hesitations while amplifying the excitement themes. Generate roughly 2 variants per top concept, but cap at 5-6 total to maintain diversity.

2. WILDCARDS (2-3 concepts): Generate completely new concepts that are informed by what scored well and poorly in previous rounds, but take a fresh angle. These should explore adjacent opportunities.

IMPORTANT: Each concept must have a UNIQUE name that is NOT in the previous concept names list above.

For each concept, provide:
- name: A compelling product name (MUST be different from all previous names)
- description: 2-3 sentence description of the product
- rationale: Why this product would resonate, referencing learnings from previous rounds
- estimatedPricePoint: { low: number, high: number } realistic price range

Return ONLY a JSON array of exactly 8 objects:
[{"name": "...", "description": "...", "rationale": "...", "estimatedPricePoint": {"low": 10, "high": 25}}, ...]`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON array in response");

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Empty concepts array");
    }
    return parsed.slice(0, 8).map((c: Record<string, unknown>) => ({
      name: String(c.name || "Unnamed Concept"),
      description: String(c.description || ""),
      rationale: String(c.rationale || ""),
      estimatedPricePoint: {
        low: Number(
          (c.estimatedPricePoint as Record<string, unknown>)?.low ?? 10
        ),
        high: Number(
          (c.estimatedPricePoint as Record<string, unknown>)?.high ?? 50
        ),
      },
    }));
  } catch {
    const top = top3[0];
    return [
      {
        name: `${input.brandName} ${top?.concept.name ?? "Core"} Plus`,
        description: `An enhanced version of the top concept, addressing key hesitations while maintaining the core appeal.`,
        rationale:
          "Iterates on the highest-scoring concept from the previous round.",
        estimatedPricePoint: {
          low: top?.wtpRange.low ?? 10,
          high: top?.wtpRange.high ?? 50,
        },
      },
      {
        name: `${input.brandName} Next Gen`,
        description: `A next-generation ${input.category} product for ${input.targetAudience}.`,
        rationale: "Fresh concept informed by previous round learnings.",
        estimatedPricePoint: { low: 15, high: 40 },
      },
      {
        name: `${input.brandName} Flex`,
        description: `A flexible ${input.category} offering designed to adapt to different use cases.`,
        rationale: "Wildcard concept exploring adjacent opportunities.",
        estimatedPricePoint: { low: 12, high: 35 },
      },
      {
        name: `${input.brandName} Micro`,
        description: `A compact, accessible entry point into ${input.category} for first-time buyers.`,
        rationale: "Addresses price sensitivity seen in previous rounds.",
        estimatedPricePoint: { low: 5, high: 20 },
      },
    ];
  }
}

export async function runDiscoveryRound(
  input: DiscoveryInput,
  previousConcepts: DiscoveryPanelResult[],
  roundNumber: number,
  onProgress?: (stage: string, progress: number) => void
): Promise<DiscoveryPanelResult[]> {
  onProgress?.("Analysing top performers...", 5);
  onProgress?.("Evolving winning concepts...", 10);
  const concepts = await generateRoundConcepts(input, previousConcepts);

  onProgress?.("Testing new concepts with consumer panel...", 15);
  const panel = input.targetAudience
    ? await generateTargetedPanel(
        PANEL_SIZE,
        input.category,
        input.targetAudience
      )
    : generatePanel(PANEL_SIZE, input.category);

  const conceptTestResults = await Promise.allSettled(
    concepts.map((concept) => testConcept(concept, panel, input.brandName))
  );

  const conceptResponses: {
    concept: ProductConcept;
    responses: MiniPanelResponse[];
  }[] = [];
  for (let i = 0; i < concepts.length; i++) {
    const result = conceptTestResults[i];
    if (result.status === "fulfilled" && result.value.length > 0) {
      conceptResponses.push({ concept: concepts[i], responses: result.value });
    }
    onProgress?.(
      `Evaluating concept ${i + 1} of ${concepts.length}...`,
      15 + Math.round((i / concepts.length) * 55)
    );
  }

  if (conceptResponses.length === 0) {
    throw new Error(
      "All concept tests failed. The round could not be completed."
    );
  }

  onProgress?.("Ranking all concepts...", 80);

  const newResults: DiscoveryPanelResult[] = [];
  for (const { concept, responses } of conceptResponses) {
    const reactions = responses
      .map((r) => r.reaction)
      .filter(
        (r) => r !== "The concept is interesting but I need more information."
      );

    const themes = await extractThemes(
      reactions.length > 0 ? reactions : ["Interesting concept"],
      concept
    );
    const aggregated = aggregateConcept(concept, responses, themes);
    newResults.push({ ...aggregated, demandRank: 0, round: roundNumber });
  }

  const allConcepts = [...previousConcepts, ...newResults];
  allConcepts.sort((a, b) => b.purchaseIntent.score - a.purchaseIntent.score);
  allConcepts.forEach((r, i) => (r.demandRank = i + 1));

  for (const nr of newResults) {
    const match = allConcepts.find(
      (c) => c.concept.name === nr.concept.name && c.round === nr.round
    );
    if (match) nr.demandRank = match.demandRank;
  }

  onProgress?.("Complete!", 100);

  return newResults;
}
