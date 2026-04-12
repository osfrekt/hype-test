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
  const priceResults: { price: number; intentScore: number }[] = [];

  for (const price of pricePoints) {
    const intents: number[] = [];

    for (let i = 0; i < panel.length; i += BATCH_SIZE) {
      const batch = panel.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((persona) => queryPricingPersona(persona, input, price, unit))
      );
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          intents.push(result.value);
        }
      }
    }

    const avgIntent = intents.length > 0
      ? Math.round((intents.reduce((a, b) => a + b, 0) / intents.length / 5) * 100)
      : 0;

    priceResults.push({ price, intentScore: avgIntent });
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
  }));

  // Find optimal price
  const optimal = pricePointResults.reduce((best, cur) =>
    cur.revenueIndex > best.revenueIndex ? cur : best
  );

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

async function queryPricingPersona(
  persona: ConsumerPersona,
  input: PricingTestInput,
  price: number,
  unit: string
): Promise<number> {
  const unitLabel = unit ? ` ${unit}` : "";
  const featuresText = input.keyFeatures?.length
    ? `\nKey features: ${input.keyFeatures.join(", ")}`
    : "";

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are evaluating a product called "${input.productName}".

Product description: ${input.productDescription}${featuresText}

The product is priced at $${price}${unitLabel}.

On a scale of 1-5, how likely would you be to purchase this product at this price?
1 = Definitely would not buy
2 = Probably would not buy
3 = Might or might not buy
4 = Probably would buy
5 = Definitely would buy

Consider your income, lifestyle, and whether this price feels fair for what the product offers. Be realistic.

Respond with ONLY a JSON object: {"intent": <number 1-5>}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 50,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return Math.min(5, Math.max(1, Number(parsed.intent)));
  } catch {
    return 3; // neutral fallback
  }
}
