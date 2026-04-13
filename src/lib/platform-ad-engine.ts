import Anthropic from "@anthropic-ai/sdk";
import { nanoid } from "nanoid";
import type { ConsumerPersona } from "@/types/research";
import type {
  PlatformAdInput,
  PlatformAdResult,
  PlatformSpecificMetrics,
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
  // Platform-specific fields
  pricePerception?: "overpriced" | "fair" | "bargain";
  buyBoxAppeal?: number;
  listingQuality?: number;
  saveRate?: number;
  visualImpact?: number;
  feedVsStoryFit?: "feed" | "story" | "both";
  watchThrough?: number;
  hookEffectiveness?: number;
  viralPotential?: number;
  headlineRanking?: number[];
  searchIntentMatch?: number;
  ctaStrength?: number;
  bannerBlindnessResistance?: number;
  visualHierarchy?: number;
  shareability?: number;
  adFatigueRisk?: "low" | "medium" | "high";
  audienceTargetFit?: number;
  professionalRelevance?: number;
  thoughtLeadershipFit?: number;
  b2bConversionPotential?: number;
  skipRate?: number;
  first5sEffectiveness?: number;
  audioOffComprehension?: number;
}

function getPlatformSpecificQuestions(platform: AdPlatform, platformLabel: string): { questionText: string; jsonFields: string } {
  switch (platform) {
    case "amazon":
      return {
        questionText: `
AMAZON-SPECIFIC:
13. PRICE PERCEPTION: Does this listing make the product feel "overpriced", "fair", or "bargain"?
14. BUY BOX APPEAL (1-5): How likely are you to click "Add to Cart" based on the listing?
15. LISTING QUALITY (1-5): Does this listing feel professional and trustworthy?`,
        jsonFields: `,
  "pricePerception": "<overpriced/fair/bargain>",
  "buyBoxAppeal": <1-5>,
  "listingQuality": <1-5>`,
      };
    case "instagram":
      return {
        questionText: `
INSTAGRAM-SPECIFIC:
13. SAVE RATE (1-5): Would you save this post for later?
14. VISUAL IMPACT (1-5): How visually compelling is this creative?
15. FEED VS STORY FIT: Does this creative work better as a "feed" post, "story", or "both"?`,
        jsonFields: `,
  "saveRate": <1-5>,
  "visualImpact": <1-5>,
  "feedVsStoryFit": "<feed/story/both>"`,
      };
    case "tiktok":
      return {
        questionText: `
TIKTOK-SPECIFIC:
13. WATCH-THROUGH (1-5): Would you watch this all the way through?
14. HOOK EFFECTIVENESS (1-5): Does the first 1-3 seconds grab you?
15. VIRAL POTENTIAL (1-5): Would you share this or send it to someone?`,
        jsonFields: `,
  "watchThrough": <1-5>,
  "hookEffectiveness": <1-5>,
  "viralPotential": <1-5>`,
      };
    case "google_search":
      return {
        questionText: `
GOOGLE SEARCH-SPECIFIC:
13. SEARCH INTENT MATCH (1-5): Does this ad match what you'd expect to find?
14. CTA STRENGTH (1-5): How compelling is the call to action?
15. HEADLINE RANKING: If multiple headlines shown, rank them 1-5 each (or rate the single headline 1-5 as an array)`,
        jsonFields: `,
  "searchIntentMatch": <1-5>,
  "ctaStrength": <1-5>,
  "headlineRanking": [<1-5 for each headline>]`,
      };
    case "google_display":
      return {
        questionText: `
GOOGLE DISPLAY-SPECIFIC:
13. BANNER BLINDNESS RESISTANCE (1-5): Would this break through typical banner blindness?
14. VISUAL HIERARCHY (1-5): Is the design clear on what to look at first?`,
        jsonFields: `,
  "bannerBlindnessResistance": <1-5>,
  "visualHierarchy": <1-5>`,
      };
    case "facebook":
      return {
        questionText: `
FACEBOOK-SPECIFIC:
13. SHAREABILITY (1-5): Would you share this with friends or family?
14. AD FATIGUE RISK: Does this feel like something you'd get tired of seeing? "low", "medium", or "high"
15. AUDIENCE TARGET FIT (1-5): Does this ad feel like it was made for someone like you?`,
        jsonFields: `,
  "shareability": <1-5>,
  "adFatigueRisk": "<low/medium/high>",
  "audienceTargetFit": <1-5>`,
      };
    case "linkedin":
      return {
        questionText: `
LINKEDIN-SPECIFIC:
13. PROFESSIONAL RELEVANCE (1-5): Is this relevant to your work or career?
14. THOUGHT LEADERSHIP FIT (1-5): Does this brand feel like an authority in this space?
15. B2B CONVERSION POTENTIAL (1-5): Would this drive you to request a demo, sign up, or learn more?`,
        jsonFields: `,
  "professionalRelevance": <1-5>,
  "thoughtLeadershipFit": <1-5>,
  "b2bConversionPotential": <1-5>`,
      };
    case "youtube":
      return {
        questionText: `
YOUTUBE-SPECIFIC:
13. SKIP RATE (1-5): How likely are you to skip this ad? (5 = would definitely skip)
14. FIRST 5s EFFECTIVENESS (1-5): Does the opening grab you before you can skip?
15. AUDIO-OFF COMPREHENSION (1-5): Would you understand this ad with the sound off?`,
        jsonFields: `,
  "skipRate": <1-5>,
  "first5sEffectiveness": <1-5>,
  "audioOffComprehension": <1-5>`,
      };
    default:
      return { questionText: "", jsonFields: "" };
  }
}

function buildPlatformScenario(input: PlatformAdInput): string {
  const { platform, adCopy, videoDescription, headlines, descriptions, url } = input;

  switch (platform) {
    case "amazon":
      return `You're browsing Amazon and see this sponsored product/listing ad creative:
${adCopy || ""}
${url ? `Product URL: ${url}` : ""}
Focus on your reaction to the AD CREATIVE itself: the imagery, headline, copy, and overall presentation. Does this listing stand out from competitors? Does the creative make you trust the product?`;

    case "instagram":
      return `You're scrolling your Instagram feed and see this sponsored ad creative:
${adCopy || ""}
Focus on your reaction to the AD CREATIVE: the visual design, copy, hook, and overall aesthetic. Does this feel native to Instagram? Would this make you stop scrolling? Would you engage (like, comment, save, tap through)?`;

    case "facebook":
      return `You're scrolling your Facebook feed and see this sponsored ad creative:
${adCopy || ""}
Focus on your reaction to the AD CREATIVE: the visual, headline, copy, and call-to-action. Does this feel authentic or overly promotional? Would you stop scrolling? Would you engage (like, comment, share)?`;

    case "tiktok":
      return `You're scrolling TikTok and see this ad:
${adCopy || ""}
${videoDescription ? `Video description: ${videoDescription}` : ""}
Focus on your reaction to the AD CREATIVE: the hook, pacing, tone, and authenticity. Does this feel like organic TikTok content or a forced ad? Would you watch past 3 seconds? Would you engage (like, comment, share, follow)?`;

    case "google_search":
      return `You searched for something relevant and see this search ad:
${headlines?.length ? `Headlines: ${headlines.join(" | ")}` : ""}
${descriptions?.length ? `Description: ${descriptions.join(" ")}` : ""}
${url ? `Display URL: ${url}` : ""}
Focus on your reaction to the AD COPY: do the headlines grab attention? Is the description compelling? Does the CTA make you want to click? Does this feel relevant to what you searched for?`;

    case "google_display":
      return `You're browsing a website and see this banner/display ad:
${adCopy || ""}
Focus on your reaction to the AD CREATIVE: does the design cut through banner blindness? Is the visual hierarchy clear? Does the message register quickly? Would you notice this among other page content?`;

    case "linkedin":
      return `You're scrolling your LinkedIn feed and see this sponsored post:
${adCopy || ""}
Focus on your reaction to the AD CREATIVE: does the copy feel professional and credible? Is the value proposition clear? Does this feel like thought leadership or a hard sell? Would you engage or click through?`;

    case "youtube":
      return `You're about to watch a video on YouTube and this ad plays:
${adCopy || ""}
${videoDescription ? `Video/thumbnail description: ${videoDescription}` : ""}
Focus on your reaction to the AD CREATIVE: does the opening hook you before you can skip? Is the story/message compelling? Does the production quality match the brand? Would you watch it or hit skip?`;

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

  const platformQuestions = getPlatformSpecificQuestions(input.platform, platform);

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
${platformQuestions.questionText}

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
  "verbatim": "<one sentence>"${platformQuestions.jsonFields}
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

    const base: PlatformPanelResponse = {
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

    // Extract platform-specific fields
    if (parsed.pricePerception) base.pricePerception = parsed.pricePerception;
    if (parsed.buyBoxAppeal) base.buyBoxAppeal = clamp(parsed.buyBoxAppeal);
    if (parsed.listingQuality) base.listingQuality = clamp(parsed.listingQuality);
    if (parsed.saveRate) base.saveRate = clamp(parsed.saveRate);
    if (parsed.visualImpact) base.visualImpact = clamp(parsed.visualImpact);
    if (parsed.feedVsStoryFit) base.feedVsStoryFit = parsed.feedVsStoryFit;
    if (parsed.watchThrough) base.watchThrough = clamp(parsed.watchThrough);
    if (parsed.hookEffectiveness) base.hookEffectiveness = clamp(parsed.hookEffectiveness);
    if (parsed.viralPotential) base.viralPotential = clamp(parsed.viralPotential);
    if (parsed.headlineRanking) base.headlineRanking = Array.isArray(parsed.headlineRanking) ? parsed.headlineRanking.map((v: number) => clamp(v)) : [clamp(parsed.headlineRanking)];
    if (parsed.searchIntentMatch) base.searchIntentMatch = clamp(parsed.searchIntentMatch);
    if (parsed.ctaStrength) base.ctaStrength = clamp(parsed.ctaStrength);
    if (parsed.bannerBlindnessResistance) base.bannerBlindnessResistance = clamp(parsed.bannerBlindnessResistance);
    if (parsed.visualHierarchy) base.visualHierarchy = clamp(parsed.visualHierarchy);
    if (parsed.shareability) base.shareability = clamp(parsed.shareability);
    if (parsed.adFatigueRisk) base.adFatigueRisk = parsed.adFatigueRisk;
    if (parsed.audienceTargetFit) base.audienceTargetFit = clamp(parsed.audienceTargetFit);
    if (parsed.professionalRelevance) base.professionalRelevance = clamp(parsed.professionalRelevance);
    if (parsed.thoughtLeadershipFit) base.thoughtLeadershipFit = clamp(parsed.thoughtLeadershipFit);
    if (parsed.b2bConversionPotential) base.b2bConversionPotential = clamp(parsed.b2bConversionPotential);
    if (parsed.skipRate) base.skipRate = clamp(parsed.skipRate);
    if (parsed.first5sEffectiveness) base.first5sEffectiveness = clamp(parsed.first5sEffectiveness);
    if (parsed.audioOffComprehension) base.audioOffComprehension = clamp(parsed.audioOffComprehension);

    return base;
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

function aggregatePlatformMetrics(
  platform: AdPlatform,
  responses: PlatformPanelResponse[],
  input: PlatformAdInput
): PlatformSpecificMetrics {
  const n = responses.length;
  const scoreAvg = (field: keyof PlatformPanelResponse) => {
    const vals = responses.map((r) => Number(r[field])).filter((v) => !isNaN(v) && v > 0);
    if (vals.length === 0) return 0;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length / 5) * 100);
  };

  const metrics: PlatformSpecificMetrics = {};

  switch (platform) {
    case "amazon": {
      const priceCounts = { overpriced: 0, fair: 0, bargain: 0 };
      responses.forEach((r) => {
        const p = (r.pricePerception || "fair").toLowerCase();
        if (p.includes("over")) priceCounts.overpriced++;
        else if (p.includes("barg")) priceCounts.bargain++;
        else priceCounts.fair++;
      });
      metrics.pricePerception = {
        overpriced: Math.round((priceCounts.overpriced / n) * 100),
        fair: Math.round((priceCounts.fair / n) * 100),
        bargain: Math.round((priceCounts.bargain / n) * 100),
      };
      metrics.buyBoxAppeal = scoreAvg("buyBoxAppeal");
      metrics.listingQuality = scoreAvg("listingQuality");
      break;
    }
    case "instagram": {
      metrics.saveRate = scoreAvg("saveRate");
      metrics.visualImpact = scoreAvg("visualImpact");
      const fitCounts = { feed: 0, story: 0, both: 0 };
      responses.forEach((r) => {
        const f = (r.feedVsStoryFit || "both").toLowerCase();
        if (f === "feed") fitCounts.feed++;
        else if (f === "story") fitCounts.story++;
        else fitCounts.both++;
      });
      const maxFit = Object.entries(fitCounts).sort((a, b) => b[1] - a[1])[0][0] as "feed" | "story" | "both";
      metrics.feedVsStoryFit = maxFit;
      break;
    }
    case "tiktok": {
      metrics.watchThrough = scoreAvg("watchThrough");
      metrics.hookEffectiveness = scoreAvg("hookEffectiveness");
      metrics.viralPotential = scoreAvg("viralPotential");
      break;
    }
    case "google_search": {
      metrics.searchIntentMatch = scoreAvg("searchIntentMatch");
      metrics.ctaStrength = scoreAvg("ctaStrength");
      if (input.headlines?.length) {
        const headlineScores: { headline: string; score: number }[] = [];
        input.headlines.forEach((h, idx) => {
          const scores = responses
            .map((r) => r.headlineRanking?.[idx])
            .filter((v): v is number => v !== undefined && v > 0);
          const avg = scores.length > 0
            ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length / 5) * 100)
            : 50;
          headlineScores.push({ headline: h, score: avg });
        });
        metrics.headlineRanking = headlineScores.sort((a, b) => b.score - a.score);
      }
      break;
    }
    case "google_display": {
      metrics.bannerBlindnessResistance = scoreAvg("bannerBlindnessResistance");
      metrics.visualHierarchy = scoreAvg("visualHierarchy");
      break;
    }
    case "facebook": {
      metrics.shareability = scoreAvg("shareability");
      metrics.audienceTargetFit = scoreAvg("audienceTargetFit");
      const fatigueCounts = { low: 0, medium: 0, high: 0 };
      responses.forEach((r) => {
        const f = (r.adFatigueRisk || "medium").toLowerCase();
        if (f.includes("low")) fatigueCounts.low++;
        else if (f.includes("high")) fatigueCounts.high++;
        else fatigueCounts.medium++;
      });
      const maxFatigue = Object.entries(fatigueCounts).sort((a, b) => b[1] - a[1])[0][0] as "low" | "medium" | "high";
      metrics.adFatigueRisk = maxFatigue;
      break;
    }
    case "linkedin": {
      metrics.professionalRelevance = scoreAvg("professionalRelevance");
      metrics.thoughtLeadershipFit = scoreAvg("thoughtLeadershipFit");
      metrics.b2bConversionPotential = scoreAvg("b2bConversionPotential");
      break;
    }
    case "youtube": {
      metrics.skipRate = scoreAvg("skipRate");
      metrics.first5sEffectiveness = scoreAvg("first5sEffectiveness");
      metrics.audioOffComprehension = scoreAvg("audioOffComprehension");
      break;
    }
  }

  return metrics;
}

const PLATFORM_TIP_CONTEXT: Record<AdPlatform, string> = {
  amazon: "Focus on listing optimization: title keywords, bullet point structure, A+ content, image strategy, review generation, search rank signals, and Buy Box factors.",
  instagram: "Focus on Instagram-specific creative: visual-first storytelling, Reels vs Feed vs Stories format, hashtag strategy, save-worthy content, aesthetic consistency, and influencer-style authenticity.",
  tiktok: "Focus on TikTok creative: hook in first 1-3 seconds, native/organic feel, trending sounds, creator-style content, vertical video pacing, and shareability.",
  google_search: "Focus on search ad copy: headline character limits, keyword insertion, ad extensions, quality score factors, search intent alignment, and competitive differentiation in SERPs.",
  google_display: "Focus on display creative: banner design best practices, visual hierarchy, animation timing, retargeting creative sequencing, and cutting through banner blindness.",
  facebook: "Focus on Facebook ad creative: thumb-stopping visuals, copy length optimization, social proof integration, comment section management, ad fatigue mitigation, and audience resonance.",
  linkedin: "Focus on LinkedIn ad strategy: professional tone without being dry, thought leadership positioning, B2B value props, lead gen form optimization, and executive audience engagement.",
  youtube: "Focus on YouTube ad creative: pre-roll skip-proofing, first 5-second hooks, companion banner strategy, audio-off comprehension, bumper ad alternatives, and view-through optimization.",
};

async function generatePlatformTips(
  input: PlatformAdInput,
  strengths: string[],
  weaknesses: string[]
): Promise<string[]> {
  const platform = PLATFORM_LABELS[input.platform];
  const tipContext = PLATFORM_TIP_CONTEXT[input.platform] || "";

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are an expert ${platform} advertising strategist. Based on these consumer reactions to a ${platform} ad for "${input.brandName}", give 5-7 specific, actionable tips for improving this ad on ${platform}.

${tipContext}

Top strengths from consumers:
${strengths.map((s) => `- ${s}`).join("\n")}

Top weaknesses from consumers:
${weaknesses.map((w) => `- ${w}`).join("\n")}

Ad copy: ${input.adCopy || "(no text copy)"}
${input.headlines?.length ? `Headlines: ${input.headlines.join(" | ")}` : ""}
${input.videoDescription ? `Video: ${input.videoDescription}` : ""}

Each tip must be specific to ${platform} and actionable. Do not give generic marketing advice. Reference ${platform}-specific features, formats, and best practices.

Return ONLY a JSON array of strings, each being one actionable tip. Example:
["Tip one", "Tip two", "Tip three"]`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]).slice(0, 7);
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

  // Platform-specific metrics
  const platformMetrics = aggregatePlatformMetrics(input.platform, responses, input);

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
    platformMetrics,
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
