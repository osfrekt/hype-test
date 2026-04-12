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
  }[];
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
