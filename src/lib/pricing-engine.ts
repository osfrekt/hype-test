import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona } from "@/types/research";
import type { PricingTestInput, PricingTestResult } from "@/types/pricing-test";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 50;
const BATCH_SIZE = 10;

export async function runPricingTest(
  input: PricingTestInput,
  pricePoints: number[],
  priceUnit?: string
): Promise<PricingTestResult> {
  const category = input.category || "consumer products";
  const panel = input.targetMarket
    ? await generateTargetedPanel(PANEL_SIZE, category, input.targetMarket)
    : generatePanel(PANEL_SIZE, category);

  const unit = priceUnit || input.priceUnit || "";

  // For each price point, query the full panel
  const priceResults: {
    price: number;
    intentScore: number;
    valuePerception: number;
    priceComparison: { tooCheap: number; aboutRight: number; tooExpensive: number };
  }[] = [];

  for (const price of pricePoints) {
    const responses: PricingResponse[] = [];

    for (let i = 0; i < panel.length; i += BATCH_SIZE) {
      const batch = panel.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((persona) => queryPricingPersona(persona, input, price, unit))
      );
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          responses.push(result.value);
        }
      }
    }

    const n = responses.length || 1;
    const avgIntent = Math.round((responses.reduce((a, b) => a + b.intent, 0) / n / 5) * 100);
    const valuePerception = Math.round(
      (responses.filter((r) => r.valuePerception === "yes" || r.valuePerception === "maybe").length / n) * 100
    );
    const tooCheap = Math.round((responses.filter((r) => r.priceComparison === "too cheap").length / n) * 100);
    const aboutRight = Math.round((responses.filter((r) => r.priceComparison === "about right").length / n) * 100);
    const tooExpensive = Math.round((responses.filter((r) => r.priceComparison === "too expensive").length / n) * 100);

    priceResults.push({
      price,
      intentScore: avgIntent,
      valuePerception,
      priceComparison: { tooCheap, aboutRight, tooExpensive },
    });
  }

  // Compute revenue index: price * (intent / 100), normalized so max = 100
  const revenueRaw = priceResults.map((p) => ({
    ...p,
    rawRevenue: p.price * (p.intentScore / 100),
  }));
  const maxRevenue = Math.max(...revenueRaw.map((r) => r.rawRevenue), 1);

  const pricePointResults = revenueRaw.map((p) => ({
    price: p.price,
    intentScore: p.intentScore,
    revenueIndex: Math.round((p.rawRevenue / maxRevenue) * 100),
    valuePerception: p.valuePerception,
    priceComparison: p.priceComparison,
  }));

  // Find optimal price
  const optimal = pricePointResults.reduce((best, cur) =>
    cur.revenueIndex > best.revenueIndex ? cur : best
  );

  // Find sweet spot (where "about right" peaks)
  const sweetSpot = pricePointResults.reduce((best, cur) =>
    cur.priceComparison.aboutRight > best.priceComparison.aboutRight ? cur : best
  );

  // Generate key insight
  const keyInsight = `$${optimal.price} maximizes revenue with ${optimal.intentScore}% purchase intent and ${optimal.valuePerception}% perceiving good value. ` +
    (sweetSpot.price !== optimal.price
      ? `The "about right" perception peaks at $${sweetSpot.price} (${sweetSpot.priceComparison.aboutRight}%).`
      : `This price also has the highest "about right" perception at ${optimal.priceComparison.aboutRight}%.`);

  return {
    id: nanoid(12),
    input: {
      productName: input.productName,
      productDescription: input.productDescription,
      category: input.category,
      targetMarket: input.targetMarket,
      priceUnit: unit || undefined,
    },
    pricePoints: pricePointResults,
    optimalPrice: optimal.price,
    optimalIntent: optimal.intentScore,
    keyInsight,
    panelSize: panel.length,
    methodology: {
      panelSize: panel.length,
      demographicMix: input.targetMarket
        ? `Targeted panel: ${input.targetMarket} (80%) + general population (20%)`
        : "US general population (varied age, income, gender, location)",
      confidenceNote:
        "Results based on LLM-simulated consumer panel. Each price point tested with the same panel. Best used for directional insights and hypothesis generation.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}

interface PricingResponse {
  intent: number;
  valuePerception: "yes" | "no" | "maybe";
  priceComparison: "too cheap" | "about right" | "too expensive";
}

async function queryPricingPersona(
  persona: ConsumerPersona,
  input: PricingTestInput,
  price: number,
  unit: string
): Promise<PricingResponse> {
  const unitLabel = unit ? ` ${unit}` : "";
  const featuresText = input.keyFeatures?.length
    ? `\nKey features: ${input.keyFeatures.join(", ")}`
    : "";

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are evaluating a product called "${input.productName}".

Product description: ${input.productDescription}${featuresText}

The product is priced at $${price}${unitLabel}.

Answer the following:

1. PURCHASE INTENT: On a scale of 1-5, how likely would you be to purchase this product at this price?
   1 = Definitely would not buy, 2 = Probably would not buy, 3 = Might or might not buy, 4 = Probably would buy, 5 = Definitely would buy

2. VALUE PERCEPTION: At this price, does this product feel like good value? (yes/no/maybe)

3. PRICE COMPARISON: How does this price compare to similar products you've seen? (too cheap / about right / too expensive)

Consider your income, lifestyle, and whether this price feels fair. Be realistic.

Respond with ONLY a JSON object: {"intent": <1-5>, "value": "<yes/no/maybe>", "comparison": "<too cheap/about right/too expensive>"}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    const valStr = String(parsed.value || "maybe").toLowerCase();
    const compStr = String(parsed.comparison || "about right").toLowerCase();
    return {
      intent: Math.min(5, Math.max(1, Number(parsed.intent))),
      valuePerception: (valStr === "yes" || valStr === "no" ? valStr : "maybe") as PricingResponse["valuePerception"],
      priceComparison: (compStr.includes("cheap") ? "too cheap" : compStr.includes("expensive") ? "too expensive" : "about right") as PricingResponse["priceComparison"],
    };
  } catch {
    return { intent: 3, valuePerception: "maybe", priceComparison: "about right" };
  }
}
