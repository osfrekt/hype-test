"use client";

import { Badge } from "@/components/ui/badge";
import { ReportView } from "@/components/report-view";
import type { ResearchResult } from "@/types/research";

const SAMPLE_RESULT: ResearchResult = {
  id: "sample",
  input: {
    productName: "FreshBrew Portable Cold Brew Maker",
    productDescription:
      "A portable cold brew coffee maker that brews in 5 minutes instead of 12-24 hours using pressure extraction. Fits in a backpack, dishwasher safe, made from BPA-free materials. Targeted at coffee enthusiasts who travel or commute. Priced at $45-65.",
  },
  panelSize: 50,
  purchaseIntent: {
    score: 68,
    distribution: [
      { label: "Definitely not", count: 4 },
      { label: "Probably not", count: 8 },
      { label: "Maybe", count: 12 },
      { label: "Probably yes", count: 16 },
      { label: "Definitely yes", count: 10 },
    ],
  },
  wtpRange: { low: 35, mid: 48, high: 65 },
  featureImportance: [
    { feature: "5-minute brew time", score: 92 },
    { feature: "Portable & backpack-friendly", score: 78 },
    { feature: "Dishwasher safe", score: 65 },
    { feature: "BPA-free materials", score: 58 },
  ],
  topConcerns: [
    "Durability concerns for travel use",
    "Taste quality vs traditional cold brew",
    "Cleaning difficulty despite dishwasher claim",
  ],
  topPositives: [
    "Speed advantage is compelling",
    "Portability fills a real gap",
    "Price point feels reasonable",
  ],
  verbatims: [
    {
      persona: "28yo female, $65k income",
      quote:
        "The 5-minute brew time is a game-changer for my morning commute. However, I'd want to see real taste tests against my usual cold brew before committing.",
    },
    {
      persona: "42yo male, $100k income",
      quote:
        "Portability is what sells it for me — I travel for work weekly. My concern is whether the pressure mechanism holds up after hundreds of uses.",
    },
    {
      persona: "35yo female, $85k income",
      quote:
        "At $48 this feels like a fair price for what you get. I'm sceptical about the dishwasher-safe claim though — pressure mechanisms and dishwashers don't always mix.",
    },
  ],
  methodology: {
    panelSize: 50,
    demographicMix:
      "US general population (varied age, income, gender, location)",
    questionsAsked: 250,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-09T14:30:00Z",
  status: "complete",
};

export function SampleReport() {
  return (
    <ReportView
      result={SAMPLE_RESULT}
      badge={
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
          Sample data
        </Badge>
      }
    />
  );
}
