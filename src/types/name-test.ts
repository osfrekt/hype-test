export interface NameTestNameResult {
  name: string;
  appealScore: number;
  topPositive: string;
  topNegative: string;
  rank: number;
}

export interface NameTestResult {
  id: string;
  productDescription: string;
  names: NameTestNameResult[];
  panelSize: number;
  methodology: {
    panelSize: number;
    demographicMix: string;
    confidenceNote: string;
  };
  createdAt: string;
  status: "complete" | "error";
}
