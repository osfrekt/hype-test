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
  memorability: "yes" | "no" | "maybe";
  categoryFit: "yes" | "no";
  emotion: string;
  impression: string;
}

async function queryPersonaForName(
  persona: ConsumerPersona,
  name: string,
  productDescription: string
): Promise<NameResponse> {
  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You see a product called "${name}". The product is: ${productDescription}

Answer the following questions about this product NAME (not the product itself):

1. APPEAL: On a scale of 1-5, how appealing is this name for this product?
   1 = Very unappealing, 2 = Somewhat unappealing, 3 = Neutral, 4 = Somewhat appealing, 5 = Very appealing

2. MEMORABILITY: Would you remember this name after seeing it once? (yes/no/maybe)

3. CATEGORY FIT: Does this name sound right for an energy/focus product? (yes/no)

4. EMOTION: What single emotion or feeling does this name evoke? (one word only)

5. FIRST IMPRESSION: Your honest first impression of the name in one sentence.

Respond as JSON: {"appeal": 1-5, "memorability": "yes/no/maybe", "categoryFit": "yes/no", "emotion": "one word", "impression": "one sentence"}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    const memVal = String(parsed.memorability || "maybe").toLowerCase();
    const fitVal = String(parsed.categoryFit || "no").toLowerCase();
    return {
      personaId: persona.id,
      appeal: Math.min(5, Math.max(1, Number(parsed.appeal))),
      memorability: (memVal === "yes" || memVal === "no" ? memVal : "maybe") as "yes" | "no" | "maybe",
      categoryFit: (fitVal === "yes" ? "yes" : "no") as "yes" | "no",
      emotion: String(parsed.emotion || "neutral").toLowerCase().replace(/[^a-z]/g, "").slice(0, 20),
      impression: parsed.impression || "No strong opinion",
    };
  } catch {
    return {
      personaId: persona.id,
      appeal: 3,
      memorability: "maybe",
      categoryFit: "no",
      emotion: "neutral",
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

  // Aggregate: compute appeal %, memorability, category fit, emotions for each name
  const rankedNames = nameResults
    .map(({ name, responses }) => {
      const n = responses.length || 1;
      const avgAppeal = responses.length > 0
        ? responses.reduce((sum, r) => sum + r.appeal, 0) / responses.length
        : 3;
      const appealScore = Math.round((avgAppeal / 5) * 100);

      // Memorability: % who said yes or maybe
      const memorability = Math.round(
        (responses.filter((r) => r.memorability === "yes" || r.memorability === "maybe").length / n) * 100
      );

      // Category fit: % who said yes
      const categoryFit = Math.round(
        (responses.filter((r) => r.categoryFit === "yes").length / n) * 100
      );

      // Emotions: aggregate and count
      const emotionCounts: Record<string, number> = {};
      responses.forEach((r) => {
        if (r.emotion && r.emotion !== "neutral") {
          emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1;
        }
      });
      const emotions = Object.entries(emotionCounts)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

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

      // Top 2 diverse impressions
      const allImpressions = responses
        .map((r) => r.impression)
        .filter((imp) => imp !== "No strong opinion");
      const impressions: string[] = [];
      for (const imp of allImpressions) {
        if (impressions.length >= 2) break;
        if (!impressions.some((s) => s.slice(0, 30).toLowerCase() === imp.slice(0, 30).toLowerCase())) {
          impressions.push(imp);
        }
      }

      // Uniqueness: derive from proportion of high-appeal + low-emotion-overlap responses
      const uniqueness = Math.round(
        (responses.filter((r) => r.appeal >= 4).length / n) * 80 +
        Math.min(Object.keys(emotionCounts).length * 3, 20)
      );

      // Purchase intent: % who rated appeal 4 or 5
      const purchaseIntent = Math.round(
        (responses.filter((r) => r.appeal >= 4).length / n) * 100
      );

      // Persona impressions: pick 2 diverse impressions with persona labels
      const personaImpressions = responses
        .filter((r) => r.impression !== "No strong opinion")
        .slice(0, 2)
        .map((r) => ({
          persona: `Persona #${r.personaId}`,
          quote: r.impression,
        }));

      // Brand perception: synthesize a one-liner from the top emotion and overall appeal
      const topEmotion = emotions[0]?.word || "neutral";
      const brandPerception =
        appealScore >= 70
          ? `Strong ${topEmotion} energy that resonates with the target audience`
          : appealScore >= 50
            ? `Mixed reception with a ${topEmotion} undertone; needs positioning refinement`
            : `Weak brand signal; perceived as ${topEmotion} which may not align with product goals`;

      return { name, appealScore, memorability, categoryFit, uniqueness, purchaseIntent, emotions, topPositive, topNegative, impressions, personaImpressions, brandPerception, rank: 0 };
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
