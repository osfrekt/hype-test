export interface PersonaImpression {
  persona: string;
  quote: string;
}

export interface NameTestNameResult {
  name: string;
  appealScore: number;
  memorability: number; // % who said yes/maybe
  categoryFit: number; // % who said yes
  uniqueness: number; // % who rated it unique vs existing names
  purchaseIntent: number; // % who said likely/very likely to try
  emotions: { word: string; count: number }[];
  topPositive: string;
  topNegative: string;
  impressions: string[]; // top 2 first impressions
  personaImpressions: PersonaImpression[]; // quotes from specific personas
  brandPerception: string; // one-line brand perception summary
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
