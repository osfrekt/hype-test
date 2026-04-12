import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona } from "@/types/research";
import type {
  LogoTestInput,
  LogoTestResult,
  LogoOption,
  LogoOptionResult,
} from "@/types/logo-test";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 30;
const BATCH_SIZE = 10;

interface LogoPanelResponse {
  personaId: number;
  firstImpression: number;
  memorability: number;
  brandFit: number;
  distinctiveness: number;
  trust: number;
  reaction: string;
  industry: string;
  engage: "Yes" | "No" | "Maybe";
}

async function queryPersonaForLogo(
  persona: ConsumerPersona,
  logo: LogoOption,
  brandName: string,
  category: string,
  brandDescription?: string
): Promise<LogoPanelResponse> {
  const textPrompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are shown a logo for the brand "${brandName}" (${category}).
${brandDescription ? `Brand description: ${brandDescription}` : ""}

Logo: "${logo.name}"
Description: ${logo.description}
${logo.colorPalette ? `Colors: ${logo.colorPalette}` : ""}
${logo.styleTags ? `Style: ${logo.styleTags}` : ""}
${logo.imageBase64 ? "The logo image is shown above." : ""}

Evaluate this logo honestly. Not everyone likes every design.

1. FIRST IMPRESSION (1-5): How professional and appealing does this logo look?
2. MEMORABILITY (1-5): Would you remember this logo after seeing it once?
3. BRAND FIT (1-5): Does this feel right for this type of brand?
4. DISTINCTIVENESS (1-5): Does this stand out from other logos you see?
5. TRUST (1-5): Does this make the brand feel trustworthy?
6. ONE WORD: Describe this logo in one word
7. INDUSTRY GUESS: What industry or product does this logo suggest? (2-3 words)
8. WOULD ENGAGE: Would you click on or visit a brand with this logo? Yes/No/Maybe

Respond in JSON:
{"firstImpression":1-5,"memorability":1-5,"brandFit":1-5,"distinctiveness":1-5,"trust":1-5,"reaction":"word","industry":"2-3 words","engage":"Yes/No/Maybe"}`;

  // Build multimodal content array
  const content: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

  if (logo.imageBase64) {
    const match = logo.imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: match[1] as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
          data: match[2],
        },
      });
    }
  }

  content.push({ type: "text", text: textPrompt });

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      temperature: 1.0,
      messages: [{ role: "user", content }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);

    const engageNorm = (parsed.engage || "Maybe").trim();
    const engage =
      engageNorm.toLowerCase().startsWith("y")
        ? "Yes"
        : engageNorm.toLowerCase().startsWith("n")
          ? "No"
          : "Maybe";

    return {
      personaId: persona.id,
      firstImpression: Math.min(5, Math.max(1, Number(parsed.firstImpression))),
      memorability: Math.min(5, Math.max(1, Number(parsed.memorability))),
      brandFit: Math.min(5, Math.max(1, Number(parsed.brandFit))),
      distinctiveness: Math.min(5, Math.max(1, Number(parsed.distinctiveness))),
      trust: Math.min(5, Math.max(1, Number(parsed.trust))),
      reaction: (parsed.reaction || "neutral").split(/\s+/)[0].toLowerCase(),
      industry: parsed.industry || "Unknown",
      engage,
    };
  } catch {
    return {
      personaId: persona.id,
      firstImpression: 3,
      memorability: 3,
      brandFit: 3,
      distinctiveness: 3,
      trust: 3,
      reaction: "neutral",
      industry: "Unknown",
      engage: "Maybe",
    };
  }
}

function aggregateLogoResults(
  logo: LogoOption,
  responses: LogoPanelResponse[],
  rank: number
): LogoOptionResult {
  const n = responses.length;

  function computeMetric(
    field: "firstImpression" | "memorability" | "brandFit" | "distinctiveness" | "trust"
  ) {
    const counts = [0, 0, 0, 0, 0];
    responses.forEach((r) => counts[r[field] - 1]++);
    const labels = [
      "1 - Very low",
      "2 - Low",
      "3 - Neutral",
      "4 - High",
      "5 - Very high",
    ];
    const score = Math.round(
      (responses.reduce((sum, r) => sum + r[field], 0) / n / 5) * 100
    );
    return {
      score,
      distribution: labels.map((label, i) => ({ label, count: counts[i] })),
    };
  }

  // Engage likelihood
  let yesCount = 0;
  let maybeCount = 0;
  let noCount = 0;
  responses.forEach((r) => {
    if (r.engage === "Yes") yesCount++;
    else if (r.engage === "Maybe") maybeCount++;
    else noCount++;
  });
  const engageLikelihood = {
    yes: Math.round((yesCount / n) * 100),
    maybe: Math.round((maybeCount / n) * 100),
    no: Math.round((noCount / n) * 100),
  };

  // One-word reactions
  const reactionCounts: Record<string, number> = {};
  responses.forEach((r) => {
    const word = r.reaction.toLowerCase().trim();
    if (word && word !== "neutral") reactionCounts[word] = (reactionCounts[word] || 0) + 1;
  });
  if (Object.keys(reactionCounts).length === 0) {
    reactionCounts["neutral"] = n;
  }
  const reactions = Object.entries(reactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  // Industry guesses
  const industryCounts: Record<string, number> = {};
  responses.forEach((r) => {
    const industry = r.industry.trim();
    if (industry && industry !== "Unknown") {
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    }
  });
  const industryGuesses = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([industry, count]) => ({ industry, count }));

  const fi = computeMetric("firstImpression");
  const mem = computeMetric("memorability");
  const bf = computeMetric("brandFit");
  const dist = computeMetric("distinctiveness");
  const tr = computeMetric("trust");

  const overallScore = Math.round(
    (fi.score + mem.score + bf.score + dist.score + tr.score) / 5
  );

  return {
    logo,
    firstImpression: fi,
    memorability: mem,
    brandFit: bf,
    distinctiveness: dist,
    trust: tr,
    overallScore,
    reactions,
    industryGuesses,
    engageLikelihood,
    rank,
  };
}

export async function runLogoTest(input: LogoTestInput): Promise<LogoTestResult> {
  // Generate ONE panel
  const panel = input.targetAudience
    ? await generateTargetedPanel(PANEL_SIZE, input.category, input.targetAudience)
    : generatePanel(PANEL_SIZE, input.category);

  const logoResults: LogoOptionResult[] = [];

  for (const logo of input.logos) {
    const responses: LogoPanelResponse[] = [];
    for (let i = 0; i < panel.length; i += BATCH_SIZE) {
      const batch = panel.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((persona) =>
          queryPersonaForLogo(persona, logo, input.brandName, input.category, input.brandDescription)
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
        `Too few persona responses. The logo test panel could not be completed.`
      );
    }

    logoResults.push(aggregateLogoResults(logo, responses, 0));
  }

  // Rank logos by overall score
  logoResults.sort((a, b) => b.overallScore - a.overallScore);
  logoResults.forEach((r, i) => {
    r.rank = i + 1;
  });

  const winner = logoResults.length > 1 ? logoResults[0].logo.name : undefined;

  const actualPanelSize = PANEL_SIZE;
  const demographicMix = input.targetAudience
    ? `Targeted panel: ${input.targetAudience} (80%) + general population (20%)`
    : "US general population (varied age, income, gender, location)";

  return {
    id: nanoid(12),
    input,
    results: logoResults,
    ...(winner !== undefined && { winner }),
    panelSize: actualPanelSize,
    methodology: {
      panelSize: actualPanelSize,
      demographicMix,
      questionsAsked: actualPanelSize * input.logos.length * 8,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. All logos were tested against the same panel for fair comparison. Best used for directional insights and hypothesis generation.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}
