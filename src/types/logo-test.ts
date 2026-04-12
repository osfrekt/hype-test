export interface LogoOption {
  name: string;
  description: string;
  colorPalette?: string;
  styleTags?: string;
  imageBase64?: string; // base64 data URL of uploaded image
}

export interface LogoTestInput {
  brandName: string;
  category: string;
  targetAudience: string;
  brandDescription?: string;
  logos: LogoOption[]; // 1-5 logos
}

export interface LogoOptionResult {
  logo: LogoOption;
  firstImpression: { score: number; distribution: { label: string; count: number }[] };
  memorability: { score: number; distribution: { label: string; count: number }[] };
  brandFit: { score: number; distribution: { label: string; count: number }[] };
  distinctiveness: { score: number; distribution: { label: string; count: number }[] };
  trust: { score: number; distribution: { label: string; count: number }[] };
  overallScore: number; // average of all 5 scores
  reactions: { word: string; count: number }[];
  industryGuesses: { industry: string; count: number }[];
  engageLikelihood: { yes: number; maybe: number; no: number };
  rank: number;
}

export interface LogoTestResult {
  id: string;
  input: LogoTestInput;
  results: LogoOptionResult[];
  winner?: string; // name of winning logo
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
