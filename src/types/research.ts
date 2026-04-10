export interface ConsumerPersona {
  id: number;
  age: number;
  gender: "male" | "female" | "non-binary";
  income: number;
  location: string;
  lifestyle: string;
  categoryContext: string;
}

export interface ConjointTask {
  id: number;
  optionA: ProductConfig;
  optionB: ProductConfig;
}

export interface ProductConfig {
  name: string;
  attributes: Record<string, string>;
  price: number;
}

export interface ConjointResponse {
  personaId: number;
  taskId: number;
  choice: "A" | "B" | "neither";
}

export interface PurchaseIntentResponse {
  personaId: number;
  intent: 1 | 2 | 3 | 4 | 5;
  reasoning: string;
}

export interface OpenEndedResponse {
  personaId: number;
  positives: string;
  concerns: string;
  suggestions: string;
}

export interface FeatureRankingResponse {
  personaId: number;
  rankings: { feature: string; importance: number }[];
}

export interface ResearchInput {
  productName: string;
  productDescription: string;
  category?: string;
  keyFeatures?: string[];
  priceRange?: { min: number; max: number };
  priceUnit?: string;
  targetMarket?: string;
  competitors?: string;
}

export interface ResearchResult {
  id: string;
  input: ResearchInput;
  panelSize: number;
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
  verbatims: { persona: string; quote: string }[];
  competitivePosition?: {
    distribution: { label: string; count: number }[];
    competitors: string;
  };
  methodology: {
    panelSize: number;
    demographicMix: string;
    questionsAsked: number;
    confidenceNote: string;
    panelBreakdown?: {
      genderSplit: { male: number; female: number; nonBinary: number };
      ageRange: { min: number; max: number; median: number };
      incomeRange: { min: number; max: number; median: number };
    };
  };
  createdAt: string;
  status: "running" | "complete" | "error";
}

export type ResearchStatus = {
  stage: string;
  progress: number;
  detail: string;
};
