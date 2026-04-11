export interface DiscoveryInput {
  brandName: string;
  brandDescription: string;
  category: string;
  targetAudience: string;
  existingProducts?: string;
  priceRange?: { min: number; max: number };
  priceUnit?: string;
  constraints?: string;
}

export interface ProductConcept {
  name: string;
  description: string;
  rationale: string;
  estimatedPricePoint: { low: number; high: number };
}

export interface DiscoveryPanelResult {
  concept: ProductConcept;
  purchaseIntent: {
    score: number;
    distribution: { label: string; count: number }[];
  };
  wtpRange: { low: number; mid: number; high: number };
  topExcitement: string;
  topHesitation: string;
  demandRank: number;
}

export interface DiscoveryResult {
  id: string;
  input: DiscoveryInput;
  concepts: DiscoveryPanelResult[];
  panelSize: number;
  methodology: {
    panelSize: number;
    demographicMix: string;
    conceptsGenerated: number;
    conceptsTested: number;
    confidenceNote: string;
  };
  createdAt: string;
  status: "running" | "complete" | "error";
}
