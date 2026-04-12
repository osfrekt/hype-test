import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona } from "@/types/research";
import type { NameTestResult } from "@/types/name-test";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 30;
const BATCH_SIZE = 10;

interface NameResponse {
  personaId: number;
  appeal: number; // 1-5
  impression: string;
}

async function queryPersonaForName(
  persona: ConsumerPersona,
  name: string,
  productDescription: string
): Promise<NameResponse> {
  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You see a product called "${name}". The product is: ${productDescription}

On a scale of 1-5, how appealing is this name for this product? Be realistic — consider whether the name sounds trustworthy, memorable, and fits the product.

1 = Very unappealing
2 = Somewhat unappealing
3 = Neutral
4 = Somewhat appealing
5 = Very appealing

Also share your first impression of the name in one sentence.

Respond as JSON: {"appeal": 1-5, "impression": "one sentence"}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      personaId: persona.id,
      appeal: Math.min(5, Math.max(1, Number(parsed.appeal))),
      impression: parsed.impression || "No strong opinion",
    };
  } catch {
    return {
      personaId: persona.id,
      appeal: 3,
      impression: "No strong opinion",
    };
  }
}

export async function runNameTest(
  productDescription: string,
  names: string[],
  category: string,
  targetConsumer?: string
): Promise<NameTestResult> {
  // Generate ONE shared panel
  const panel = targetConsumer
    ? await generateTargetedPanel(PANEL_SIZE, category, targetConsumer)
    : generatePanel(PANEL_SIZE, category);

  // For each name, query each persona
  const nameResults: {
    name: string;
    responses: NameResponse[];
  }[] = [];

  for (const name of names) {
    const responses: NameResponse[] = [];
    for (let i = 0; i < panel.length; i += BATCH_SIZE) {
      const batch = panel.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((persona) =>
          queryPersonaForName(persona, name, productDescription)
        )
      );
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          responses.push(result.value);
        }
      }
    }
    nameResults.push({ name, responses });
  }

  // Aggregate: compute appeal % for each name
  const rankedNames = nameResults
    .map(({ name, responses }) => {
      const avgAppeal = responses.length > 0
        ? responses.reduce((sum, r) => sum + r.appeal, 0) / responses.length
        : 3;
      const appealScore = Math.round((avgAppeal / 5) * 100);

      // Separate positive and negative impressions
      const positiveImpressions = responses
        .filter((r) => r.appeal >= 4)
        .map((r) => r.impression)
        .filter((imp) => imp !== "No strong opinion");
      const negativeImpressions = responses
        .filter((r) => r.appeal <= 2)
        .map((r) => r.impression)
        .filter((imp) => imp !== "No strong opinion");

      const topPositive = positiveImpressions[0] || "Generally well-received";
      const topNegative = negativeImpressions[0] || "No significant concerns";

      return { name, appealScore, topPositive, topNegative, rank: 0 };
    })
    .sort((a, b) => b.appealScore - a.appealScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const actualPanelSize = Math.min(
    ...nameResults.map((nr) => nr.responses.length)
  );

  const demographicMix = targetConsumer
    ? `Targeted panel: ${targetConsumer} (80%) + general population (20%)`
    : "US general population (varied age, income, gender, location)";

  return {
    id: nanoid(12),
    productDescription,
    names: rankedNames,
    panelSize: actualPanelSize,
    methodology: {
      panelSize: actualPanelSize,
      demographicMix,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. All names were tested against the same panel for fair comparison. Best used for directional insights and hypothesis generation.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}
