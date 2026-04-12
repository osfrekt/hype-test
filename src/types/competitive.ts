import type { ResearchInput } from "./research";

export interface CompetitiveProductSummary {
  input: ResearchInput;
  intentScore: number;
  wtpMid: number;
  featureAvg: number;
  topPositive: string;
  topConcern: string;
}

export interface CompetitiveResult {
  id: string;
  yours: CompetitiveProductSummary;
  competitor: CompetitiveProductSummary;
  radarData: { dimension: string; yours: number; competitor: number }[];
  winner: "yours" | "competitor" | "tie";
  panelSize: number;
  methodology: {
    panelSize: number;
    demographicMix: string;
    confidenceNote: string;
  };
  createdAt: string;
  status: "complete" | "error";
}
