"use client";

import { Nav } from "@/components/nav";
import { ReportView } from "@/components/report-view";
import { Badge } from "@/components/ui/badge";
import type { ResearchResult } from "@/types/research";

const SAMPLE_RESULT: ResearchResult = {
  id: "sample-rekt",
  input: {
    productName: "Rekt Focus Energy Powder",
    productDescription:
      "A clean energy powder with 200mg natural caffeine from green coffee bean, Cognizin citicoline for sustained mental focus, zero sugar, 5 calories per serving. Mixes instantly in water. Positioned between energy drinks (unhealthy) and pre-workout (too intense) for health-conscious professionals and gym-goers who want clean energy without the crash.",
    category: "health & wellness",
    keyFeatures: [
      "200mg natural caffeine from green coffee bean",
      "Cognizin citicoline for sustained mental focus",
      "Zero sugar, 5 calories, mixes in water in seconds",
    ],
    priceRange: { min: 2, max: 3 },
    priceUnit: "$2-3 per stick pack",
    targetMarket:
      "Health-conscious professionals and gym-goers 22-38, $60k+ income, who currently drink energy drinks but want something cleaner",
    competitors: "Celsius, Ghost Energy, LMNT, Liquid IV Energy",
  },
  panelSize: 50,
  purchaseIntent: {
    score: 68,
    distribution: [
      { label: "Definitely not", count: 3 },
      { label: "Probably not", count: 6 },
      { label: "Maybe", count: 11 },
      { label: "Probably yes", count: 18 },
      { label: "Definitely yes", count: 12 },
    ],
  },
  wtpRange: { low: 2, mid: 2.5, high: 3 },
  featureImportance: [
    { feature: "Natural caffeine from green coffee bean", score: 92 },
    { feature: "Cognizin citicoline for focus", score: 78 },
    { feature: "Zero sugar, mixes instantly", score: 65 },
    { feature: "Clean label positioning", score: 58 },
  ],
  topConcerns: [
    "Taste quality compared to flavored energy drinks",
    "Whether nootropic ingredients deliver noticeable results",
    "Price per serving vs. canned energy drinks",
    "Convenience of mixing powder vs. grabbing a can",
    "Long-term safety of daily citicoline supplementation",
  ],
  topPositives: [
    "Clean caffeine without artificial ingredients is appealing",
    "The focus angle differentiates from standard energy products",
    "Low calorie count fits health-conscious lifestyles",
    "Portable stick pack format is practical for commuting",
    "Transparent ingredient list builds trust",
  ],
  verbatims: [
    {
      persona: "28yo female, $65k income",
      quote:
        "The clean caffeine angle is appealing, and the focus component sets it apart from standard energy drinks. I'd try it if the price per serving is competitive with what I currently spend on Celsius.",
    },
    {
      persona: "34yo male, $95k income",
      quote:
        "I like the idea of a powder I can throw in my gym bag instead of carrying cans. My main question is whether the citicoline actually does anything noticeable or if it's just marketing.",
    },
    {
      persona: "26yo female, $55k income",
      quote:
        "Zero sugar and only 5 calories is exactly what I look for. But I've tried powders before and they never taste as good as canned drinks. Taste would make or break this for me.",
    },
    {
      persona: "41yo male, $120k income",
      quote:
        "At $2-3 per serving this is roughly what I pay for energy drinks anyway, so the price works. The focus ingredient is what interests me most. I'd want to see clinical backing for the citicoline dosage.",
    },
    {
      persona: "31yo non-binary, $80k income",
      quote:
        "I appreciate the positioning between energy drinks and pre-workout. That's a gap in the market I've felt personally. Would need to see it in stores or have easy online ordering to actually buy it.",
    },
  ],
  competitivePosition: {
    distribution: [
      { label: "Much better", count: 8 },
      { label: "Somewhat better", count: 15 },
      { label: "About the same", count: 12 },
      { label: "Somewhat worse", count: 9 },
      { label: "Much worse", count: 3 },
      { label: "Not familiar", count: 3 },
    ],
    competitors: "Celsius, Ghost Energy, LMNT, Liquid IV Energy",
  },
  methodology: {
    panelSize: 50,
    demographicMix:
      "Targeted panel: Health-conscious professionals and gym-goers 22-38, $60k+ income (80%) + general population (20%)",
    questionsAsked: 300,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation. See our methodology page for academic references and limitations.",
    panelBreakdown: {
      genderSplit: { male: 46, female: 48, nonBinary: 6 },
      ageRange: { min: 22, max: 58, median: 32 },
      incomeRange: { min: 35000, max: 180000, median: 75000 },
    },
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

export default function SampleRektReport() {
  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <ReportView
            result={SAMPLE_RESULT}
            badge={
              <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/30 text-xs">
                Sample report
              </Badge>
            }
          />
          <div className="mt-8 text-center" data-print-hide>
            <a
              href="https://www.amazon.com/dp/B0DFY2PY3G"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal hover:underline"
            >
              View Rekt Focus Energy Powder on Amazon &rarr;
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
