import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona } from "@/types/research";
import type {
  AdTestInput,
  AdTestResult,
  AdCreative,
  AdCreativeResult,
} from "@/types/ad-test";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 50;
const BATCH_SIZE = 10;

interface AdPanelResponse {
  personaId: number;
  attention: number;
  clarity: number;
  persuasion: number;
  brandFit: number;
  emotion: string;
  takeaway: string;
  wouldClick: "Yes" | "No" | "Maybe";
  strength: string;
  weakness: string;
}

async function queryPersonaForAd(
  persona: ConsumerPersona,
  creative: AdCreative,
  brandName: string
): Promise<AdPanelResponse> {
  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are shown an advertisement from the brand "${brandName}":

Ad creative: "${creative.adCopy}"
${creative.imageUrl ? `Visual: ${creative.imageUrl}` : ""}

Rate this ad honestly as this consumer would. Not everyone responds to every ad.

1. ATTENTION (1-5): Would this stop you scrolling? Would you notice this ad?
2. CLARITY (1-5): Do you understand what's being offered and why it matters?
3. PERSUASION (1-5): Does this make you want to learn more or take action?
4. BRAND FIT (1-5): Does this feel authentic to the brand?
5. EMOTIONAL RESPONSE: One word describing your emotional reaction
6. KEY TAKEAWAY: In one sentence, what is this ad saying to you?
7. WOULD YOU CLICK: Yes, No, or Maybe
8. BIGGEST STRENGTH: One sentence on what works
9. BIGGEST WEAKNESS: One sentence on what doesn't

Respond in JSON:
{
  "attention": <1-5>,
  "clarity": <1-5>,
  "persuasion": <1-5>,
  "brandFit": <1-5>,
  "emotion": "<one word>",
  "takeaway": "<one sentence>",
  "wouldClick": "<Yes/No/Maybe>",
  "strength": "<one sentence>",
  "weakness": "<one sentence>"
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

    const clickNorm = (parsed.wouldClick || "Maybe").trim();
    const wouldClick =
      clickNorm.toLowerCase().startsWith("y")
        ? "Yes"
        : clickNorm.toLowerCase().startsWith("n")
          ? "No"
          : "Maybe";

    return {
      personaId: persona.id,
      attention: Math.min(5, Math.max(1, Number(parsed.attention))),
      clarity: Math.min(5, Math.max(1, Number(parsed.clarity))),
      persuasion: Math.min(5, Math.max(1, Number(parsed.persuasion))),
      brandFit: Math.min(5, Math.max(1, Number(parsed.brandFit))),
      emotion: (parsed.emotion || "neutral").split(/\s+/)[0].toLowerCase(),
      takeaway: parsed.takeaway || "No clear takeaway",
      wouldClick,
      strength: parsed.strength || "Nothing stood out",
      weakness: parsed.weakness || "Nothing specific",
    };
  } catch {
    return {
      personaId: persona.id,
      attention: 3,
      clarity: 3,
      persuasion: 3,
      brandFit: 3,
      emotion: "neutral",
      takeaway: "No clear takeaway",
      wouldClick: "Maybe",
      strength: "Nothing stood out",
      weakness: "Nothing specific",
    };
  }
}

function aggregateCreativeResults(
  creative: AdCreative,
  responses: AdPanelResponse[]
): AdCreativeResult {
  const n = responses.length;

  function computeMetric(field: "attention" | "clarity" | "persuasion" | "brandFit") {
    const counts = [0, 0, 0, 0, 0];
    responses.forEach((r) => counts[r[field] - 1]++);
    const labels = ["1 - Very low", "2 - Low", "3 - Neutral", "4 - High", "5 - Very high"];
    const score = Math.round(
      (responses.reduce((sum, r) => sum + r[field], 0) / n / 5) * 100
    );
    return {
      score,
      distribution: labels.map((label, i) => ({ label, count: counts[i] })),
    };
  }

  // Click likelihood
  let yesCount = 0;
  let maybeCount = 0;
  let noCount = 0;
  responses.forEach((r) => {
    if (r.wouldClick === "Yes") yesCount++;
    else if (r.wouldClick === "Maybe") maybeCount++;
    else noCount++;
  });
  const clickLikelihood = {
    yes: Math.round((yesCount / n) * 100),
    maybe: Math.round((maybeCount / n) * 100),
    no: Math.round((noCount / n) * 100),
  };

  // Emotional responses
  const emotionCounts: Record<string, number> = {};
  responses.forEach((r) => {
    const word = r.emotion.toLowerCase().trim();
    if (word && word !== "neutral") emotionCounts[word] = (emotionCounts[word] || 0) + 1;
  });
  // Include neutral if nothing else
  if (Object.keys(emotionCounts).length === 0) {
    emotionCounts["neutral"] = n;
  }
  const emotionalResponses = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  // Deduplicated strengths and weaknesses
  const topStrengths = deduplicateStrings(
    responses.map((r) => r.strength).filter((s) => s !== "Nothing stood out")
  );
  const topWeaknesses = deduplicateStrings(
    responses.map((r) => r.weakness).filter((s) => s !== "Nothing specific")
  );

  // Key takeaways
  const keyTakeaways = deduplicateStrings(
    responses.map((r) => r.takeaway).filter((t) => t !== "No clear takeaway")
  );

  return {
    creative,
    attention: computeMetric("attention"),
    clarity: computeMetric("clarity"),
    persuasion: computeMetric("persuasion"),
    brandFit: computeMetric("brandFit"),
    clickLikelihood,
    emotionalResponses,
    topStrengths,
    topWeaknesses,
    keyTakeaways,
  };
}

function deduplicateStrings(items: string[]): string[] {
  const isSimilar = (a: string, b: string) =>
    a.slice(0, 40).toLowerCase() === b.slice(0, 40).toLowerCase();

  const selected: string[] = [];
  for (const text of items) {
    if (selected.length >= 5) break;
    if (!selected.some((s) => isSimilar(s, text))) {
      selected.push(text);
    }
  }
  return selected;
}

export async function runAdTest(input: AdTestInput): Promise<AdTestResult> {
  // Generate ONE panel
  const panel = input.targetAudience
    ? await generateTargetedPanel(PANEL_SIZE, input.category, input.targetAudience)
    : generatePanel(PANEL_SIZE, input.category);

  const creativeResults: AdCreativeResult[] = [];

  for (const creative of input.creatives) {
    const responses: AdPanelResponse[] = [];
    for (let i = 0; i < panel.length; i += BATCH_SIZE) {
      const batch = panel.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((persona) =>
          queryPersonaForAd(persona, creative, input.brandName)
        )
      );
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          responses.push(result.value);
        }
      }
    }

    if (responses.length < 5) {
      throw new Error(
        `Too few persona responses. The ad test panel could not be completed.`
      );
    }

    creativeResults.push(aggregateCreativeResults(creative, responses));
  }

  // For A/B mode: determine winner by overall score
  let winner: "A" | "B" | "tie" | undefined;
  let winMargin: number | undefined;

  if (input.mode === "ab" && creativeResults.length === 2) {
    const overallA =
      (creativeResults[0].attention.score +
        creativeResults[0].clarity.score +
        creativeResults[0].persuasion.score +
        creativeResults[0].brandFit.score) /
      4;
    const overallB =
      (creativeResults[1].attention.score +
        creativeResults[1].clarity.score +
        creativeResults[1].persuasion.score +
        creativeResults[1].brandFit.score) /
      4;
    const diff = Math.abs(overallA - overallB);
    winMargin = Math.round(diff);
    winner = diff < 3 ? "tie" : overallA > overallB ? "A" : "B";
  }

  const actualPanelSize = PANEL_SIZE;
  const demographicMix = input.targetAudience
    ? `Targeted panel: ${input.targetAudience} (80%) + general population (20%)`
    : "US general population (varied age, income, gender, location)";

  return {
    id: nanoid(12),
    input,
    results: creativeResults,
    ...(winner !== undefined && { winner }),
    ...(winMargin !== undefined && { winMargin }),
    panelSize: actualPanelSize,
    methodology: {
      panelSize: actualPanelSize,
      demographicMix,
      questionsAsked: actualPanelSize * input.creatives.length * 9,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. All creatives were tested against the same panel for fair comparison. Best used for directional insights and hypothesis generation.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}
