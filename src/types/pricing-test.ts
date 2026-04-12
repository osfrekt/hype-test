export interface PricingTestInput {
  productName: string;
  productDescription: string;
  category?: string;
  targetMarket?: string;
  priceUnit?: string;
  keyFeatures?: string[];
}

export interface PricingTestResult {
  id: string;
  input: {
    productName: string;
    productDescription: string;
    category?: string;
    targetMarket?: string;
    priceUnit?: string;
  };
  pricePoints: {
    price: number;
    intentScore: number;
    revenueIndex: number;
    valuePerception: number; // % who said yes/maybe for good value
    priceComparison: { tooCheap: number; aboutRight: number; tooExpensive: number };
  }[];
  keyInsight: string;
  optimalPrice: number;
  optimalIntent: number;
  panelSize: number;
  methodology: {
    panelSize: number;
    demographicMix: string;
    confidenceNote: string;
  };
  createdAt: string;
  status: "complete" | "error";
}
