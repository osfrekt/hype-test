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
