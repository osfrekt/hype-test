"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DiscoveryResult } from "@/types/discovery";

const SAMPLE_RESULT: DiscoveryResult = {
  id: "sample-rekt",
  input: {
    brandName: "Rekt",
    brandDescription:
      "Energy and focus brand for gamers, athletes, and professionals. Flagship product is Rekt Energy + Focus Powder with 200mg natural caffeine, L-Theanine, and nootropics. Zero sugar, zero calories. Sold on Amazon and rekt.com.",
    category: "Health & Household",
    targetAudience: "Gamers, athletes, and professionals who want clean energy and focus",
    existingProducts: "Rekt Energy + Focus Powder (Blue Raspberry, Cherry)",
    priceRange: { min: 18, max: 40 },
    priceUnit: "per unit",
  },
  concepts: [
    {
      concept: {
        name: "Rekt Recovery Collagen",
        description:
          "Post-workout collagen peptide powder with added electrolytes and tart cherry extract for joint and muscle recovery. Unflavored, mixes into any beverage.",
        rationale:
          "Recovery is underserved in the Rekt lineup and collagen is trending among fitness-focused consumers who already buy the Energy + Focus Powder.",
        estimatedPricePoint: { low: 30, high: 40 },
      },
      purchaseIntent: {
        score: 71,
        distribution: [
          { label: "Definitely not", count: 2 },
          { label: "Probably not", count: 5 },
          { label: "Maybe", count: 9 },
          { label: "Probably yes", count: 19 },
          { label: "Definitely yes", count: 15 },
        ],
      },
      wtpRange: { low: 28, mid: 35, high: 42 },
      topExcitement: "Collagen + electrolytes in one product fills a real gap in recovery supplements",
      topHesitation: "Unflavored collagen can have an off-putting texture in some drinks",
      demandRank: 1,
      round: 1,
    },
    {
      concept: {
        name: "Rekt Hydration Sticks",
        description:
          "Electrolyte hydration powder sticks with sodium, potassium, magnesium, and a hint of natural flavor. Zero sugar, designed for daily use during gaming sessions and workouts.",
        rationale:
          "Hydration sticks are a fast-growing category and complement the Energy + Focus Powder for all-day use.",
        estimatedPricePoint: { low: 20, high: 30 },
      },
      purchaseIntent: {
        score: 68,
        distribution: [
          { label: "Definitely not", count: 3 },
          { label: "Probably not", count: 5 },
          { label: "Maybe", count: 11 },
          { label: "Probably yes", count: 18 },
          { label: "Definitely yes", count: 13 },
        ],
      },
      wtpRange: { low: 20, mid: 25, high: 30 },
      topExcitement: "Daily hydration use case makes this a high-frequency purchase alongside the energy powder",
      topHesitation: "Crowded category with LMNT, Liquid IV, and Drip Drop already established",
      demandRank: 2,
      round: 1,
    },
    {
      concept: {
        name: "Rekt Focus Gummies",
        description:
          "Gummy-format energy supplement with 150mg natural caffeine, B-vitamins, and L-theanine for calm focus. 3 gummies per serving, no water needed.",
        rationale:
          "Gummies offer a no-water alternative to the powder format and attract convenience-driven buyers who want energy on the go.",
        estimatedPricePoint: { low: 22, high: 34 },
      },
      purchaseIntent: {
        score: 65,
        distribution: [
          { label: "Definitely not", count: 4 },
          { label: "Probably not", count: 6 },
          { label: "Maybe", count: 11 },
          { label: "Probably yes", count: 17 },
          { label: "Definitely yes", count: 12 },
        ],
      },
      wtpRange: { low: 22, mid: 28, high: 34 },
      topExcitement: "No water needed makes this ideal for commuting, travel, and LAN events",
      topHesitation: "Sugar content in gummies contradicts the zero-sugar clean-label brand promise",
      demandRank: 3,
      round: 1,
    },
    {
      concept: {
        name: "Rekt Sleep Formula",
        description:
          "Nighttime recovery powder with magnesium glycinate, L-theanine, and ashwagandha. Designed to pair with the Energy + Focus Powder as a morning/night stack.",
        rationale:
          "Sleep products complement the energy lineup and increase customer lifetime value through daily stacking routines.",
        estimatedPricePoint: { low: 25, high: 35 },
      },
      purchaseIntent: {
        score: 61,
        distribution: [
          { label: "Definitely not", count: 5 },
          { label: "Probably not", count: 7 },
          { label: "Maybe", count: 12 },
          { label: "Probably yes", count: 16 },
          { label: "Definitely yes", count: 10 },
        ],
      },
      wtpRange: { low: 25, mid: 30, high: 35 },
      topExcitement: "Morning/night stack concept makes the brand feel like a complete performance system",
      topHesitation: "Skepticism about whether a brand called Rekt should sell sleep products",
      demandRank: 4,
      round: 1,
    },
    {
      concept: {
        name: "Rekt Protein Coffee",
        description:
          "Protein-enhanced coffee powder with 20g protein, 150mg caffeine, and MCT oil. Replaces morning coffee and protein shake in one scoop.",
        rationale:
          "Protein coffee combines two daily habits into one product and appeals to the fitness-focused segment of Rekt buyers.",
        estimatedPricePoint: { low: 28, high: 38 },
      },
      purchaseIntent: {
        score: 58,
        distribution: [
          { label: "Definitely not", count: 5 },
          { label: "Probably not", count: 8 },
          { label: "Maybe", count: 13 },
          { label: "Probably yes", count: 15 },
          { label: "Definitely yes", count: 9 },
        ],
      },
      wtpRange: { low: 26, mid: 32, high: 38 },
      topExcitement: "Replacing morning coffee and protein shake with one product saves time and money",
      topHesitation: "Protein coffee flavor profiles are often disappointing compared to real coffee",
      demandRank: 5,
      round: 1,
    },
    {
      concept: {
        name: "Rekt Pre-Workout",
        description:
          "High-stim pre-workout powder with 300mg caffeine, beta-alanine, and citrulline malate. Intense formula for serious training sessions.",
        rationale:
          "Pre-workout is a natural extension of the energy brand and appeals to the gym-goer segment that already trusts Rekt for clean ingredients.",
        estimatedPricePoint: { low: 30, high: 40 },
      },
      purchaseIntent: {
        score: 54,
        distribution: [
          { label: "Definitely not", count: 6 },
          { label: "Probably not", count: 9 },
          { label: "Maybe", count: 12 },
          { label: "Probably yes", count: 14 },
          { label: "Definitely yes", count: 9 },
        ],
      },
      wtpRange: { low: 28, mid: 35, high: 42 },
      topExcitement: "Brand name Rekt feels perfectly suited for a pre-workout product",
      topHesitation: "Pre-workout market is extremely saturated with established players like Ghost and C4",
      demandRank: 6,
      round: 1,
    },
    {
      concept: {
        name: "Rekt Electrolyte Tabs",
        description:
          "Effervescent electrolyte tablets that dissolve in water. Portable tube format with 10 tablets per tube. Light citrus flavor.",
        rationale:
          "Tablets offer an ultra-portable alternative to powder sticks and appeal to athletes and travelers.",
        estimatedPricePoint: { low: 14, high: 22 },
      },
      purchaseIntent: {
        score: 49,
        distribution: [
          { label: "Definitely not", count: 7 },
          { label: "Probably not", count: 10 },
          { label: "Maybe", count: 13 },
          { label: "Probably yes", count: 12 },
          { label: "Definitely yes", count: 8 },
        ],
      },
      wtpRange: { low: 14, mid: 18, high: 22 },
      topExcitement: "Tube format is more portable than powder tubs and easy to toss in a gym bag",
      topHesitation: "Nuun and other established tab brands already dominate this niche",
      demandRank: 7,
      round: 1,
    },
    {
      concept: {
        name: "Rekt Vitamin D3+K2",
        description:
          "Daily vitamin D3 and K2 supplement in softgel format. 5000 IU D3 with 100mcg K2-MK7 for bone and immune health.",
        rationale:
          "D3+K2 is a high-demand daily supplement that builds recurring revenue and expands Rekt beyond energy into general wellness.",
        estimatedPricePoint: { low: 18, high: 28 },
      },
      purchaseIntent: {
        score: 42,
        distribution: [
          { label: "Definitely not", count: 9 },
          { label: "Probably not", count: 11 },
          { label: "Maybe", count: 14 },
          { label: "Probably yes", count: 10 },
          { label: "Definitely yes", count: 6 },
        ],
      },
      wtpRange: { low: 16, mid: 22, high: 28 },
      topExcitement: "Essential daily supplement that gamers and indoor athletes genuinely need",
      topHesitation: "Brand association with energy/gaming feels off for a basic vitamin product",
      demandRank: 8,
      round: 1,
    },
  ],
  rounds: 1,
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix:
      "Gamers, athletes, and professionals 18-38 (80%) + general population (20%)",
    conceptsGenerated: 8,
    conceptsTested: 8,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

function rankColor(rank: number) {
  if (rank <= 2) return "bg-emerald-100 text-emerald-800";
  if (rank <= 5) return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-600";
}

export default function SampleRektDiscovery() {
  const result = SAMPLE_RESULT;
  const concepts = [...result.concepts].sort(
    (a, b) => a.demandRank - b.demandRank
  );
  const topConcept = concepts[0];

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Sample badge */}
          <div className="mb-6">
            <Badge className="bg-muted text-muted-foreground text-xs">
              Sample report
            </Badge>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {result.input.brandName}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.input.category}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              {result.input.targetAudience}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Top Opportunity
                </p>
                <p className="text-lg font-bold text-primary leading-tight">
                  {topConcept?.concept.name ?? "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {topConcept?.purchaseIntent.score ?? 0}% purchase intent
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Highest WTP
                </p>
                <p className="text-lg font-bold text-primary leading-tight">
                  {topConcept?.concept.name ?? "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${topConcept?.wtpRange.mid ?? 0} estimated WTP
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Concepts Tested
                </p>
                <p className="text-lg font-bold text-primary leading-tight">
                  {concepts.length} concepts
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.panelSize} panellists each
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Concept Cards */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-bold text-primary">
              Ranked Product Concepts
            </h3>
            {concepts.map((c) => (
              <Card key={c.concept.name}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${rankColor(c.demandRank)}`}
                      >
                        #{c.demandRank}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-primary mb-1">
                        {c.concept.name}
                      </h4>
                      <p className="text-sm text-foreground mb-2">
                        {c.concept.description}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4 italic">
                        {c.concept.rationale}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            Purchase Intent
                          </span>
                          <span
                            className={`text-sm font-bold ${c.purchaseIntent.score >= 60 ? "text-emerald-600" : c.purchaseIntent.score >= 40 ? "text-amber-600" : "text-red-600"}`}
                          >
                            {c.purchaseIntent.score}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            WTP
                          </span>
                          <span className="text-sm font-bold text-primary">
                            ${c.wtpRange.low}-${c.wtpRange.high}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-emerald-500 shrink-0 mt-0.5"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <span className="text-sm text-muted-foreground">
                            {c.topExcitement}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-500 shrink-0 mt-0.5"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                          </svg>
                          <span className="text-sm text-muted-foreground">
                            {c.topHesitation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/discover/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own product discovery
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
