export interface AudienceTestInput {
  productName: string;
  productDescription: string;
  category?: string;
  priceRange?: { min: number; max: number };
  keyFeatures?: string[];
}

export interface AudienceTestResult {
  id: string;
  input: {
    productName: string;
    productDescription: string;
    category?: string;
    priceRange?: { min: number; max: number };
  };
  segments: {
    audience: string;
    intentScore: number;
    wtpMid: number;
    topPositive: string;
    topConcern: string;
    rank: number;
  }[];
  bestSegment: string;
  panelSizePerSegment: number;
  methodology: {
    panelSizePerSegment: number;
    totalPanelists: number;
    demographicMix: string;
    confidenceNote: string;
  };
  createdAt: string;
  status: "complete" | "error";
}
