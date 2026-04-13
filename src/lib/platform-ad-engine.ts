import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona } from "@/types/research";
import type {
  PlatformAdInput,
  PlatformAdResult,
  AdPlatform,
} from "@/types/platform-ad";
import { generatePanel, generateTargetedPanel } from "./personas";

const anthropic = new Anthropic();

const PANEL_SIZE = 50;
const BATCH_SIZE = 10;

const PLATFORM_LABELS: Record<AdPlatform, string> = {
  amazon: "Amazon",
  instagram: "Instagram",
  tiktok: "TikTok",
  google_search: "Google Search",
  google_display: "Google Display",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

const SOCIAL_PLATFORMS: AdPlatform[] = ["instagram", "tiktok", "facebook", "linkedin", "youtube"];

interface PlatformPanelResponse {
  personaId: number;
  attention: number;
  clarity: number;
  persuasion: number;
  brandFit: number;
  platformFit: number;
  emotion: string;
  wouldClick: "Yes" | "No" | "Maybe";
  scrollStop: number;
  purchaseIntent: number;
  strength: string;
  weakness: string;
  verbatim: string;
}

function buildPlatformScenario(input: PlatformAdInput): string {
  const { platform, adCopy, videoDescription, headlines, descriptions, url } = input;

  switch (platform) {
    case "amazon":
      return `You're browsing Amazon looking for products. You see this product listing:
${adCopy || ""}
${url ? `Product URL: ${url}` : ""}
Would you click on it? Would you buy it?`;

    case "instagram":
      return `You're scrolling your Instagram feed. You see this sponsored ad:
${adCopy || ""}
Would this stop you scrolling? Would you engage with it (like, comment, save)?`;

    case "facebook":
      return `You're scrolling your Facebook feed. You see this sponsored ad:
${adCopy || ""}
Would this stop you scrolling? Would you engage with it (like, comment, share)?`;

    case "tiktok":
      return `You're scrolling TikTok. You see an ad with this hook/caption:
${adCopy || ""}
${videoDescription ? `Video description: ${videoDescription}` : ""}
Would you watch past 3 seconds? Would you engage (like, comment, share)?`;

    case "google_search":
      return `You searched for something relevant and see this search ad:
${headlines?.length ? `Headlines: ${headlines.join(" | ")}` : ""}
${descriptions?.length ? `Description: ${descriptions.join(" ")}` : ""}
${url ? `Display URL: ${url}` : ""}
Would you click on this ad?`;

    case "google_display":
      return `You're browsing a website and see this banner/display ad:
${adCopy || ""}
Would you notice it? Would you click on it?`;

    case "linkedin":
      return `You're scrolling your LinkedIn feed. You see this sponsored post:
${adCopy || ""}
Would you engage with it? Is this relevant to your professional life?`;

    case "youtube":
      return `You're about to watch a video on YouTube and this ad plays:
${adCopy || ""}
${videoDescription ? `Video/thumbnail description: ${videoDescription}` : ""}
Would you watch it or skip it?`;

    default:
      return `You see this ad: ${adCopy || ""}`;
  }
}

async function queryPersonaForPlatformAd(
  persona: ConsumerPersona,
  input: PlatformAdInput
): Promise<PlatformPanelResponse> {
  const platform = PLATFORM_LABELS[input.platform];
  const isSocial = SOCIAL_PLATFORMS.includes(input.platform);
  const isAmazon = input.platform === "amazon";
  const scenario = buildPlatformScenario(input);

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are shown an advertisement from the brand "${input.brandName}" on ${platform}:

${scenario}

${input.imageBase64 ? "An image is shown above for this ad." : ""}

Rate this ad honestly as this consumer would. Not everyone responds to every ad.

1. ATTENTION (1-5): Would you notice/stop for this?
2. CLARITY (1-5): Do you understand the offer?
3. PERSUASION (1-5): Does this make you want to act?
4. BRAND FIT (1-5): Does this feel authentic?
5. PLATFORM FIT (1-5): Does this belong on ${platform}?
6. WOULD CLICK/ENGAGE: Yes, No, or Maybe
7. SCROLL STOP (1-5): Would this stop you scrolling?${!isSocial ? " (rate 3 if not applicable)" : ""}
8. PURCHASE INTENT (1-5): Would you buy this?${!isAmazon ? " (rate based on ad interest)" : ""}
9. EMOTION: One word describing your emotional reaction
10. STRENGTH: One sentence on what works
11. WEAKNESS: One sentence on what doesn't work
12. VERBATIM: One sentence reaction as if speaking to a friend

Respond in JSON:
{
  "attention": <1-5>,
  "clarity": <1-5>,
  "persuasion": <1-5>,
  "brandFit": <1-5>,
  "platformFit": <1-5>,
  "wouldClick": "<Yes/No/Maybe>",
  "scrollStop": <1-5>,
  "purchaseIntent": <1-5>,
  "emotion": "<one word>",
  "strength": "<one sentence>",
  "weakness": "<one sentence>",
  "verbatim": "<one sentence>"
}`;

  try {
    const contentParts: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

    if (input.imageBase64) {
      const match = input.imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        contentParts.push({
          type: "image",
          source: {
            type: "base64",
            media_type: match[1] as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
            data: match[2],
          },
        });
      }
    }

    contentParts.push({ type: "text", text: prompt });

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      temperature: 1.0,
      messages: [{ role: "user", content: contentParts }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);

    const clickNorm = (parsed.wouldClick || "Maybe").trim();
    const wouldClick = clickNorm.toLowerCase().startsWith("y")
      ? "Yes"
      : clickNorm.toLowerCase().startsWith("n")
        ? "No"
        : "Maybe";

    const clamp = (v: number) => Math.min(5, Math.max(1, Number(v) || 3));

    return {
      personaId: persona.id,
      attention: clamp(parsed.attention),
      clarity: clamp(parsed.clarity),
      persuasion: clamp(parsed.persuasion),
      brandFit: clamp(parsed.brandFit),
      platformFit: clamp(parsed.platformFit),
      emotion: (parsed.emotion || "neutral").split(/\s+/)[0].toLowerCase(),
      wouldClick,
      scrollStop: clamp(parsed.scrollStop),
      purchaseIntent: clamp(parsed.purchaseIntent),
      strength: parsed.strength || "Nothing stood out",
      weakness: parsed.weakness || "Nothing specific",
      verbatim: parsed.verbatim || "",
    };
  } catch {
    return {
      personaId: persona.id,
      attention: 3,
      clarity: 3,
      persuasion: 3,
      brandFit: 3,
      platformFit: 3,
      emotion: "neutral",
      wouldClick: "Maybe",
      scrollStop: 3,
      purchaseIntent: 3,
      strength: "Nothing stood out",
      weakness: "Nothing specific",
      verbatim: "",
    };
  }
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

async function generatePlatformTips(
  input: PlatformAdInput,
  strengths: string[],
  weaknesses: string[]
): Promise<string[]> {
  const platform = PLATFORM_LABELS[input.platform];

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Based on these consumer reactions to a ${platform} ad for "${input.brandName}", give 3-5 specific, actionable tips for improving this ad on ${platform}.

Top strengths from consumers:
${strengths.map((s) => `- ${s}`).join("\n")}

Top weaknesses from consumers:
${weaknesses.map((w) => `- ${w}`).join("\n")}

Ad copy: ${input.adCopy || "(no text copy)"}
${input.headlines?.length ? `Headlines: ${input.headlines.join(" | ")}` : ""}

Return ONLY a JSON array of strings, each being one actionable tip. Example:
["Tip one", "Tip two", "Tip three"]`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]).slice(0, 5);
  } catch {
    return [];
  }
}

export async function runPlatformAdTest(
  input: PlatformAdInput
): Promise<PlatformAdResult> {
  const category = "consumer products";
  const panel = input.targetAudience
    ? await generateTargetedPanel(PANEL_SIZE, category, input.targetAudience)
    : generatePanel(PANEL_SIZE, category);

  const responses: PlatformPanelResponse[] = [];
  for (let i = 0; i < panel.length; i += BATCH_SIZE) {
    const batch = panel.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map((persona) => queryPersonaForPlatformAd(persona, input))
    );
    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        responses.push(result.value);
      }
    }
  }

  if (responses.length < 5) {
    throw new Error("Too few persona responses. The platform ad test could not be completed.");
  }

  const n = responses.length;

  const scoreMetric = (field: "attention" | "clarity" | "persuasion" | "brandFit" | "platformFit") =>
    Math.round((responses.reduce((sum, r) => sum + r[field], 0) / n / 5) * 100);

  const attention = scoreMetric("attention");
  const clarity = scoreMetric("clarity");
  const persuasion = scoreMetric("persuasion");
  const brandFit = scoreMetric("brandFit");
  const platformFit = scoreMetric("platformFit");

  // Click likelihood
  let yesCount = 0, maybeCount = 0, noCount = 0;
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

  // Scroll stop power
  const scrollStopPower = Math.round(
    (responses.reduce((sum, r) => sum + r.scrollStop, 0) / n / 5) * 100
  );

  // Purchase intent (Amazon only)
  const isSocial = SOCIAL_PLATFORMS.includes(input.platform);
  const isAmazon = input.platform === "amazon";
  const purchaseIntent = isAmazon
    ? Math.round((responses.reduce((sum, r) => sum + r.purchaseIntent, 0) / n / 5) * 100)
    : undefined;

  // Emotions
  const emotionCounts: Record<string, number> = {};
  responses.forEach((r) => {
    const word = r.emotion.toLowerCase().trim();
    if (word && word !== "neutral") emotionCounts[word] = (emotionCounts[word] || 0) + 1;
  });
  if (Object.keys(emotionCounts).length === 0) emotionCounts["neutral"] = n;
  const emotionalResponses = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  const topStrengths = deduplicateStrings(
    responses.map((r) => r.strength).filter((s) => s !== "Nothing stood out")
  );
  const topWeaknesses = deduplicateStrings(
    responses.map((r) => r.weakness).filter((s) => s !== "Nothing specific")
  );

  // Verbatims
  const verbatims = responses
    .filter((r) => r.verbatim && r.verbatim.length > 10)
    .slice(0, 8)
    .map((r) => {
      const persona = panel.find((p) => p.id === r.personaId);
      return {
        persona: persona ? `${persona.age}yo ${persona.gender}, ${persona.location}` : "Panelist",
        quote: r.verbatim,
      };
    });

  // Platform-specific tips
  const platformTips = await generatePlatformTips(input, topStrengths, topWeaknesses);

  const platformLabel = PLATFORM_LABELS[input.platform];
  const demographicMix = input.targetAudience
    ? `Targeted panel: ${input.targetAudience} (80%) + general population (20%)`
    : "US general population (varied age, income, gender, location)";

  return {
    id: nanoid(12),
    input,
    platformLabel,
    attention,
    clarity,
    persuasion,
    brandFit,
    platformFit,
    clickLikelihood,
    scrollStopPower,
    ...(purchaseIntent !== undefined && { purchaseIntent }),
    emotionalResponses,
    topStrengths,
    topWeaknesses,
    platformTips,
    verbatims,
    panelSize: n,
    methodology: {
      panelSize: n,
      demographicMix,
      questionsAsked: n * 12,
      confidenceNote:
        "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
    },
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}
