import type { ResearchInput } from "./research";

export interface AbTestConceptResult {
  input: ResearchInput;
  purchaseIntent: {
    score: number;
    distribution: { label: string; count: number }[];
  };
  wtpRange: {
    low: number;
    mid: number;
    high: number;
  };
  featureImportance: { feature: string; score: number }[];
  topConcerns: string[];
  topPositives: string[];
  npsScore: number;
  purchaseFrequency: { label: string; percent: number }[];
  verbatims: string[];
}

export interface AbTestResult {
  id: string;
  conceptA: AbTestConceptResult;
  conceptB: AbTestConceptResult;
  winner: "A" | "B" | "tie";
  winMargin: number;
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
