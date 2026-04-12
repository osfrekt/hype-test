export interface MarketResearchInput {
  category: string;
  geography: string;
  questions: string;
}

export interface MarketResearchResult {
  id: string;
  input: MarketResearchInput;
  marketOverview: string;
  marketSize: string;
  keyTrends: string[];
  consumerInsights: string[];
  competitiveLandscape: { name: string; positioning: string; strength: string; weakness: string }[];
  pricingLandscape: string;
  gaps: string[];
  threats: string[];
  recommendations: string[];
  createdAt: string;
  status: "complete" | "error";
}
