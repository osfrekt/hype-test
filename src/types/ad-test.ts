export interface AdCreative {
  name: string;
  adCopy: string;
  imageUrl?: string;
}

export interface AdTestInput {
  brandName: string;
  category: string;
  targetAudience: string;
  creatives: AdCreative[];
  mode: "single" | "ab";
}

export interface AdCreativeResult {
  creative: AdCreative;
  attention: { score: number; distribution: { label: string; count: number }[] };
  clarity: { score: number; distribution: { label: string; count: number }[] };
  persuasion: { score: number; distribution: { label: string; count: number }[] };
  brandFit: { score: number; distribution: { label: string; count: number }[] };
  clickLikelihood: { yes: number; maybe: number; no: number };
  emotionalResponses: { word: string; count: number }[];
  topStrengths: string[];
  topWeaknesses: string[];
  keyTakeaways: string[];
}

export interface AdTestResult {
  id: string;
  input: AdTestInput;
  results: AdCreativeResult[];
  winner?: "A" | "B" | "tie";
  winMargin?: number;
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
