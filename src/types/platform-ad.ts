export type AdPlatform =
  | "amazon"
  | "instagram"
  | "tiktok"
  | "google_search"
  | "google_display"
  | "facebook"
  | "linkedin"
  | "youtube";

export const AD_PLATFORM_LABELS: Record<AdPlatform, string> = {
  amazon: "Amazon",
  instagram: "Instagram",
  tiktok: "TikTok",
  google_search: "Google Search",
  google_display: "Google Display",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export interface PlatformAdInput {
  platform: AdPlatform;
  brandName: string;
  targetAudience: string;
  url?: string;
  adCopy?: string;
  imageBase64?: string;
  videoDescription?: string;
  headlines?: string[];
  descriptions?: string[];
}

export interface PlatformSpecificMetrics {
  // Amazon
  pricePerception?: { overpriced: number; fair: number; bargain: number };
  buyBoxAppeal?: number;
  listingQuality?: number;
  // Instagram
  saveRate?: number;
  visualImpact?: number;
  feedVsStoryFit?: "feed" | "story" | "both";
  // TikTok
  watchThrough?: number;
  hookEffectiveness?: number;
  viralPotential?: number;
  // Google Search
  headlineRanking?: { headline: string; score: number }[];
  searchIntentMatch?: number;
  ctaStrength?: number;
  // Google Display
  bannerBlindnessResistance?: number;
  visualHierarchy?: number;
  // Facebook
  shareability?: number;
  adFatigueRisk?: "low" | "medium" | "high";
  audienceTargetFit?: number;
  // LinkedIn
  professionalRelevance?: number;
  thoughtLeadershipFit?: number;
  b2bConversionPotential?: number;
  // YouTube
  skipRate?: number;
  first5sEffectiveness?: number;
  audioOffComprehension?: number;
}

export interface PlatformAdResult {
  id: string;
  input: PlatformAdInput;
  platformLabel: string;
  attention: number;
  clarity: number;
  persuasion: number;
  brandFit: number;
  platformFit: number;
  clickLikelihood: { yes: number; maybe: number; no: number };
  scrollStopPower: number;
  purchaseIntent?: number;
  platformMetrics?: PlatformSpecificMetrics;
  emotionalResponses: { word: string; count: number }[];
  topStrengths: string[];
  topWeaknesses: string[];
  platformTips: string[];
  verbatims: { persona: string; quote: string }[];
  panelSize: number;
  methodology: {
    panelSize: number;
    demographicMix: string;
    questionsAsked: number;
    confidenceNote: string;
  };
  createdAt: string;
  status: "complete" | "error";
}
