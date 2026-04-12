"use client";

import { Nav } from "@/components/nav";
import { ReportView } from "@/components/report-view";
import { Badge } from "@/components/ui/badge";
import type { ResearchResult } from "@/types/research";

const SAMPLE_RESULT: ResearchResult = {
  id: "sample-rekt",
  input: {
    productName: "Rekt Energy + Focus Powder",
    productDescription:
      "Clean energy drink mix with 200mg natural caffeine, nootropics including L-Theanine for focused energy without jitters or crash. Zero sugar, zero calories, 30 servings per tub. Available in Blue Raspberry and Cherry flavors. Positioned as a clean alternative to traditional energy drinks for gamers, athletes, and professionals who need sustained focus.",
    category: "health & wellness",
    keyFeatures: [
      "200mg natural caffeine with L-Theanine for smooth energy",
      "Nootropic blend for focus and mental clarity",
      "Zero sugar, zero calories, 30 servings per tub",
    ],
    priceRange: { min: 34.99, max: 44.99 },
    priceUnit: "$34.99-$44.99 per tub (30 servings)",
    targetMarket:
      "Gamers, athletes, and professionals 18-38 who want clean energy without sugar crashes or jitters",
    competitors: "Celsius, Ghost Energy, G Fuel, LMNT",
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
  wtpRange: { low: 30, mid: 36, high: 42 },
  featureImportance: [
    { feature: "200mg natural caffeine with L-Theanine", score: 92 },
    { feature: "Nootropic blend for focus", score: 78 },
    { feature: "Zero sugar, zero calories", score: 71 },
    { feature: "30 servings per tub value", score: 65 },
    { feature: "Clean label, no artificial ingredients", score: 58 },
  ],
  topConcerns: [
    "Taste quality of powder vs. ready-to-drink energy drinks",
    "Whether nootropic ingredients deliver noticeable cognitive benefits",
    "Price per serving compared to canned alternatives like Celsius or G Fuel",
    "Convenience of mixing powder vs. grabbing a can on the go",
    "Limited flavor options compared to established competitors",
  ],
  topPositives: [
    "Clean caffeine with L-Theanine avoids jitters and crash",
    "The nootropic focus angle differentiates from generic energy drinks",
    "Zero sugar and zero calories fits health-conscious lifestyles",
    "30 servings per tub makes the per-serving cost competitive",
    "Transparent ingredient list and clean label builds trust",
  ],
  verbatims: [
    {
      persona: "24yo male, $45k income",
      quote:
        "I currently use G Fuel for gaming sessions, but the L-Theanine in this is a real upgrade. Smooth energy without the jitters would be a game-changer for long ranked sessions.",
    },
    {
      persona: "32yo female, $85k income",
      quote:
        "Zero sugar and zero calories with actual nootropics is exactly what I want for work focus. The 30-serving tub makes it cheaper per serving than buying Celsius cans every day.",
    },
    {
      persona: "27yo male, $60k income",
      quote:
        "I like the concept but I'm skeptical about powder taste. Every energy powder I've tried tastes artificial. If the Blue Raspberry is actually good, I'm in.",
    },
    {
      persona: "35yo male, $110k income",
      quote:
        "The nootropic angle is what sells it for me. I'd want to see the actual dosages of L-Theanine and know whether it's clinically effective, not just a label claim.",
    },
    {
      persona: "22yo female, $35k income",
      quote:
        "Price per serving works out to under a dollar which is way cheaper than my daily Monster. If it actually helps me focus during study sessions, it's worth trying.",
    },
  ],
  purchaseFrequency: [
    { label: "Weekly", count: 8 },
    { label: "Monthly", count: 18 },
    { label: "Every few months", count: 12 },
    { label: "One-time only", count: 7 },
    { label: "Would not purchase", count: 5 },
  ],
  channelPreference: [
    { label: "Amazon", count: 22 },
    { label: "Brand website", count: 10 },
    { label: "Grocery/retail", count: 8 },
    { label: "Convenience store", count: 3 },
    { label: "Subscription", count: 7 },
  ],
  npsScore: 34,
  topWords: [
    { word: "innovative", count: 8 },
    { word: "clean", count: 7 },
    { word: "focused", count: 6 },
    { word: "convenient", count: 5 },
    { word: "healthy", count: 4 },
    { word: "expensive", count: 3 },
    { word: "promising", count: 3 },
    { word: "natural", count: 2 },
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
    competitors: "Celsius, Ghost Energy, G Fuel, LMNT",
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
  categoryBenchmark: {
    avgIntent: 55,
    avgWtp: 28,
    avgNps: 22,
    sampleSize: 47,
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
              <Badge className="bg-muted text-muted-foreground text-xs">
                Sample report
              </Badge>
            }
          />
          <div className="mt-8 text-center" data-print-hide>
            <a
              href="https://www.amazon.com/Rekt-Energy-Focus-Powder-Cherry/dp/B0GSGB13LJ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal hover:underline"
            >
              View Rekt Energy + Focus Powder on Amazon &rarr;
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
