"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AbTestResult, AbTestConceptResult } from "@/types/ab-test";

const SAMPLE_RESULT: AbTestResult = {
  id: "sample-rekt",
  conceptA: {
    input: {
      productName: "Rekt Focus Powder",
      productDescription:
        "A clean energy powder with 200mg natural caffeine, Cognizin citicoline for sustained mental focus, zero sugar, 5 calories per serving. Mixes instantly in water.",
      category: "health & wellness",
      keyFeatures: [
        "200mg natural caffeine",
        "Cognizin citicoline for focus",
        "Mixes instantly in water",
      ],
      priceRange: { min: 2, max: 3 },
      priceUnit: "per stick pack",
      targetMarket: "Health-conscious professionals and gamers 18-38",
      competitors: "Celsius, Ghost Energy, LMNT",
    },
    purchaseIntent: {
      score: 68,
      distribution: [
        { label: "Definitely not", count: 3 },
        { label: "Probably not", count: 5 },
        { label: "Maybe", count: 10 },
        { label: "Probably yes", count: 18 },
        { label: "Definitely yes", count: 14 },
      ],
    },
    wtpRange: { low: 2.0, mid: 2.5, high: 3.0 },
    featureImportance: [
      { feature: "Mixes instantly in water", score: 88 },
      { feature: "Natural caffeine source", score: 82 },
      { feature: "Cognizin citicoline for focus", score: 74 },
    ],
    topConcerns: [
      "Taste quality compared to flavored energy drinks",
      "Whether powder format is convenient enough",
    ],
    topPositives: [
      "Clean ingredient profile appeals to health-conscious buyers",
      "Focus angle differentiates from standard energy products",
    ],
  },
  conceptB: {
    input: {
      productName: "Rekt Focus Gummies",
      productDescription:
        "Gummy-format energy supplement with 150mg natural caffeine, B-vitamins, and L-theanine for calm focus. 3 gummies per serving, portable pouch.",
      category: "health & wellness",
      keyFeatures: [
        "Gummy format, no water needed",
        "150mg caffeine + L-theanine",
        "Portable pouch packaging",
      ],
      priceRange: { min: 2.5, max: 4 },
      priceUnit: "per serving",
      targetMarket: "Health-conscious professionals and gamers 18-38",
      competitors: "Celsius, Ghost Energy, LMNT",
    },
    purchaseIntent: {
      score: 61,
      distribution: [
        { label: "Definitely not", count: 4 },
        { label: "Probably not", count: 7 },
        { label: "Maybe", count: 12 },
        { label: "Probably yes", count: 16 },
        { label: "Definitely yes", count: 11 },
      ],
    },
    wtpRange: { low: 2.5, mid: 3.2, high: 4.0 },
    featureImportance: [
      { feature: "No water needed, grab-and-go convenience", score: 91 },
      { feature: "L-theanine for calm focus", score: 72 },
      { feature: "Portable pouch format", score: 68 },
    ],
    topConcerns: [
      "Sugar content in gummy format",
      "Whether gummies deliver enough caffeine for real energy",
    ],
    topPositives: [
      "Gummy format is more convenient than powder",
      "L-theanine pairing reduces jitters",
    ],
  },
  winner: "A",
  winMargin: 7,
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix:
      "Health-conscious professionals and gamers 18-38 (80%) + general population (20%)",
    questionsAsked: 300,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

function ConceptCard({
  label,
  concept,
  isWinner,
}: {
  label: string;
  concept: AbTestConceptResult;
  isWinner: boolean;
}) {
  return (
    <Card className={isWinner ? "ring-2 ring-teal" : ""}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            {label}: {concept.input.productName}
          </CardTitle>
          {isWinner && (
            <Badge className="bg-teal text-white text-[10px]">Winner</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Purchase Intent
          </p>
          <p className="text-3xl font-bold text-primary">
            {concept.purchaseIntent.score}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Estimated WTP
          </p>
          <p className="text-xl font-bold text-primary">
            ${concept.wtpRange.mid}
          </p>
          <p className="text-xs text-muted-foreground">
            range: ${concept.wtpRange.low} - ${concept.wtpRange.high}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Top Feature
          </p>
          <p className="text-sm font-medium text-primary">
            {concept.featureImportance[0]?.feature || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Top Concern
          </p>
          <p className="text-sm text-muted-foreground">
            {concept.topConcerns[0] || "None"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Top Positive
          </p>
          <p className="text-sm text-muted-foreground">
            {concept.topPositives[0] || "None"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SampleRektAbTest() {
  const result = SAMPLE_RESULT;

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Sample badge */}
          <div className="mb-6">
            <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/30 text-xs">
              Sample report
            </Badge>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {result.conceptA.input.productName} vs{" "}
                {result.conceptB.input.productName}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.panelSize} respondents
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              A/B concept test with shared consumer panel
            </p>
          </div>

          {/* Winner Banner */}
          <Card className="mb-8 bg-primary text-primary-foreground border-primary">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-lg font-bold mb-1">
                {result.conceptA.input.productName} wins
              </p>
              <p className="text-sm text-primary-foreground/70">
                {result.conceptA.purchaseIntent.score}% vs{" "}
                {result.conceptB.purchaseIntent.score}% purchase intent (
                {result.winMargin}pt margin)
              </p>
            </CardContent>
          </Card>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ConceptCard
              label="Concept A"
              concept={result.conceptA}
              isWinner={result.winner === "A"}
            />
            <ConceptCard
              label="Concept B"
              concept={result.conceptB}
              isWinner={result.winner === "B"}
            />
          </div>

          {/* Head-to-Head Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Head-to-Head Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    label: "Purchase Intent",
                    valueA: result.conceptA.purchaseIntent.score,
                    valueB: result.conceptB.purchaseIntent.score,
                    suffix: "%",
                  },
                  {
                    label: "Estimated WTP",
                    valueA: result.conceptA.wtpRange.mid,
                    valueB: result.conceptB.wtpRange.mid,
                    prefix: "$",
                    suffix: "",
                  },
                ].map((m) => {
                  const max = Math.max(m.valueA, m.valueB, 1);
                  return (
                    <div key={m.label}>
                      <p className="text-sm font-medium text-primary mb-3">
                        {m.label}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">
                            {result.conceptA.input.productName}
                          </span>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div
                              className="bg-teal h-3 rounded-full transition-all"
                              style={{
                                width: `${(m.valueA / max) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-primary w-16 text-right">
                            {m.prefix || ""}
                            {m.valueA}
                            {m.suffix || ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">
                            {result.conceptB.input.productName}
                          </span>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div
                              className="bg-cyan-500 h-3 rounded-full transition-all"
                              style={{
                                width: `${(m.valueB / max) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-primary w-16 text-right">
                            {m.prefix || ""}
                            {m.valueB}
                            {m.suffix || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/ab-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own A/B test
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
