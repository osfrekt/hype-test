"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AbTestResult, AbTestConceptResult } from "@/types/ab-test";

const SAMPLE_RESULT: AbTestResult = {
  id: "sample-rekt",
  conceptA: {
    input: {
      productName: "Rekt Energy + Focus Powder",
      productDescription:
        "Energy and focus powder with 200mg natural caffeine, L-Theanine, and a nootropic blend for clean energy without jitters. Zero sugar, zero calories, 30 servings per tub. Available in Blue Raspberry and Cherry.",
      category: "Health & Household",
      keyFeatures: [
        "200mg natural caffeine + L-Theanine",
        "Nootropic blend for sustained focus",
        "Zero sugar, zero calories",
        "30 servings per tub (~$1/serving)",
      ],
      priceRange: { min: 25, max: 35 },
      priceUnit: "per tub (30 servings)",
      targetMarket:
        "Gamers, athletes, and professionals who want clean energy and focus",
      competitors: "Celsius, Ghost Energy, G Fuel, LMNT",
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
    wtpRange: { low: 25, mid: 30, high: 35 },
    featureImportance: [
      { feature: "Natural caffeine + L-Theanine", score: 92 },
      { feature: "Nootropic blend for focus", score: 78 },
      { feature: "Zero sugar, zero calories", score: 71 },
      { feature: "30 servings value", score: 65 },
    ],
    topConcerns: [
      "Taste of powder format may be unpleasant compared to canned drinks",
      "Skepticism about nootropic claims and whether they actually work",
      "Mixing powder is less convenient than grab-and-go options",
    ],
    topPositives: [
      "Clean caffeine with L-Theanine means energy without the jitters or crash",
      "Focus differentiation sets it apart from generic energy products",
      "~$1/serving is significantly cheaper than $3+ energy drinks",
    ],
    npsScore: 32,
    purchaseFrequency: [
      { label: "Monthly", percent: 36 },
      { label: "Weekly", percent: 24 },
      { label: "Quarterly", percent: 18 },
      { label: "One-time", percent: 14 },
      { label: "Would not buy", percent: 8 },
    ],
    verbatims: [
      "Finally a focus product that doesn't taste like chemicals. The L-Theanine pairing is exactly what I've been looking for.",
      "I'd switch from G Fuel in a heartbeat if the nootropics actually deliver on the focus claims.",
    ],
  },
  conceptB: {
    input: {
      productName: "Rekt Focus Gummies",
      productDescription:
        "Gummy-format energy supplement with 150mg natural caffeine, B-vitamins, and L-theanine for calm focus. 3 gummies per serving, convenient and portable.",
      category: "Health & Household",
      keyFeatures: [
        "Gummy format, no water needed",
        "150mg caffeine + L-theanine",
        "Pre-dosed portable format",
        "B-vitamins for sustained energy",
      ],
      priceRange: { min: 22, max: 32 },
      priceUnit: "per bag (30 servings)",
      targetMarket:
        "Gamers, athletes, and professionals who want clean energy and focus",
      competitors: "Celsius, Ghost Energy, G Fuel, LMNT",
    },
    purchaseIntent: {
      score: 59,
      distribution: [
        { label: "Definitely not", count: 4 },
        { label: "Probably not", count: 8 },
        { label: "Maybe", count: 14 },
        { label: "Probably yes", count: 15 },
        { label: "Definitely yes", count: 9 },
      ],
    },
    wtpRange: { low: 22, mid: 28, high: 32 },
    featureImportance: [
      { feature: "Convenience - no water needed", score: 88 },
      { feature: "Great taste in gummy format", score: 82 },
      { feature: "Portable format fits anywhere", score: 72 },
      { feature: "Nootropic blend for focus", score: 64 },
    ],
    topConcerns: [
      "Sugar content in gummies contradicts the clean energy positioning",
      "Lower caffeine dose (150mg) may not deliver enough energy for heavy users",
      "Gummy format feels childish and less serious as a performance product",
    ],
    topPositives: [
      "No mixing or water needed - just grab and go anytime",
      "Gummies actually taste good which improves compliance and daily use",
      "Easy to carry in a gym bag or backpack without worrying about spills",
    ],
    npsScore: 18,
    purchaseFrequency: [
      { label: "Monthly", percent: 28 },
      { label: "Weekly", percent: 18 },
      { label: "Quarterly", percent: 20 },
      { label: "One-time", percent: 22 },
      { label: "Would not buy", percent: 12 },
    ],
    verbatims: [
      "I love the idea of energy gummies but the sugar content worries me - defeats the purpose of clean energy.",
      "Perfect for throwing in my bag before a gaming session, way easier than mixing powder.",
    ],
  },
  winner: "A",
  winMargin: 9,
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix:
      "Gamers, athletes, and professionals 18-38 (80%) + general population (20%)",
    questionsAsked: 400,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Both concepts were tested against the same panel for fair comparison. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

function IntentDistributionChart({
  distribution,
  isWinner,
}: {
  distribution: { label: string; count: number }[];
  isWinner: boolean;
}) {
  const total = distribution.reduce((s, x) => s + x.count, 0) || 1;
  const maxCount = Math.max(...distribution.map((d) => d.count));

  return (
    <div className="space-y-1.5">
      {distribution.map((d) => {
        const pct = Math.round((d.count / total) * 100);
        return (
          <div key={d.label} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-24 shrink-0 truncate">
              {d.label}
            </span>
            <div className="flex-1 bg-muted rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${isWinner ? "bg-teal" : "bg-cyan-500"}`}
                style={{ width: `${(d.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-primary w-14 text-right">
              {pct}% ({d.count})
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ConceptCard({
  label,
  concept,
  isWinner,
}: {
  label: string;
  concept: AbTestConceptResult;
  isWinner: boolean;
}) {
  const featureImportance = concept.featureImportance || [];
  const topConcerns = concept.topConcerns || [];
  const topPositives = concept.topPositives || [];
  const purchaseFrequency = concept.purchaseFrequency || [];
  const verbatims = concept.verbatims || [];
  const npsScore = concept.npsScore ?? 0;

  const npsColor =
    npsScore >= 50
      ? "text-emerald-500"
      : npsScore >= 30
        ? "text-emerald-600"
        : npsScore >= 0
          ? "text-yellow-600"
          : "text-red-500";
  const npsLabel =
    npsScore >= 50
      ? "Excellent"
      : npsScore >= 30
        ? "Great"
        : npsScore >= 0
          ? "Good"
          : "Needs work";

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
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {concept.input.productDescription}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purchase Intent Score - Hero Metric */}
        <div className="text-center py-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Purchase Intent
          </p>
          <p className="text-4xl font-bold text-primary">
            {concept.purchaseIntent.score}%
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            of panelists would consider buying
          </p>
        </div>

        {/* Purchase Intent Distribution */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Intent Distribution
          </p>
          <IntentDistributionChart
            distribution={concept.purchaseIntent.distribution}
            isWinner={isWinner}
          />
        </div>

        <Separator />

        {/* WTP Range */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Willingness to Pay
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">
              ${concept.wtpRange.mid}
            </p>
            <p className="text-xs text-muted-foreground">median</p>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 h-3 bg-muted rounded-full relative">
              <div
                className="absolute h-3 bg-gradient-to-r from-cyan-500 to-teal rounded-full"
                style={{
                  left: "0%",
                  right: "0%",
                }}
              />
              <div
                className="absolute w-4 h-4 bg-primary rounded-full -top-0.5 border-2 border-background"
                style={{
                  left: `${((concept.wtpRange.mid - concept.wtpRange.low) / Math.max(concept.wtpRange.high - concept.wtpRange.low, 1)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>Low: ${concept.wtpRange.low}</span>
            <span>High: ${concept.wtpRange.high}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {concept.input.priceUnit}
          </p>
        </div>

        <Separator />

        {/* NPS Score */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Net Promoter Score
          </p>
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${npsColor}`}>
              {npsScore > 0 ? "+" : ""}
              {npsScore}
            </p>
            <Badge variant="secondary" className="text-[10px]">
              {npsLabel}
            </Badge>
          </div>
          {/* NPS gauge bar */}
          <div className="mt-2 h-2 bg-muted rounded-full relative overflow-hidden">
            <div
              className="absolute h-2 rounded-full"
              style={{
                left: "50%",
                width: `${Math.abs(npsScore) / 2}%`,
                transform: npsScore < 0 ? `translateX(-${Math.abs(npsScore) / 2}%)` : undefined,
                backgroundColor: npsScore >= 0 ? "#10b981" : "#ef4444",
              }}
            />
            <div className="absolute w-0.5 h-3 bg-muted-foreground/40 top-0 left-1/2 -translate-x-1/2 -translate-y-0.5" />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>-100</span>
            <span>0</span>
            <span>+100</span>
          </div>
        </div>

        <Separator />

        {/* Top 3 Features with Scores */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Top Features by Importance
          </p>
          <div className="space-y-2">
            {featureImportance.slice(0, 3).map((f, i) => (
              <div key={f.feature}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold ${isWinner ? "text-teal" : "text-cyan-500"}`}>
                      #{i + 1}
                    </span>
                    {f.feature}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {f.score}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isWinner ? "bg-teal" : "bg-cyan-500"}`}
                    style={{ width: `${f.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Top Concerns */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Top 3 Concerns
          </p>
          <ul className="space-y-2">
            {topConcerns.slice(0, 3).map((c, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground flex gap-2 items-start"
              >
                <span className="text-red-400 shrink-0 font-bold text-[10px] mt-0.5 w-4 h-4 rounded-full bg-red-400/10 flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Positives */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Top 3 Positives
          </p>
          <ul className="space-y-2">
            {topPositives.slice(0, 3).map((p, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground flex gap-2 items-start"
              >
                <span className="text-emerald-500 shrink-0 font-bold text-[10px] mt-0.5 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Consumer Verbatims */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Consumer Verbatims
          </p>
          <div className="space-y-3">
            {verbatims.slice(0, 2).map((v, i) => (
              <div
                key={i}
                className="rounded-lg bg-muted/50 p-3 border-l-2 border-border"
              >
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;{v}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Purchase Frequency */}
        {purchaseFrequency.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
              Purchase Frequency
            </p>
            <div className="space-y-1.5">
              {purchaseFrequency.map((f) => (
                <div key={f.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-20 shrink-0">
                    {f.label}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${isWinner ? "bg-teal" : "bg-cyan-500"}`}
                      style={{ width: `${f.percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-primary w-8 text-right">
                    {f.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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
            <Badge className="bg-muted text-muted-foreground text-xs">
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

          {/* Quick Metrics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Purchase Intent",
                a: `${result.conceptA.purchaseIntent.score}%`,
                b: `${result.conceptB.purchaseIntent.score}%`,
                aWins: result.conceptA.purchaseIntent.score > result.conceptB.purchaseIntent.score,
              },
              {
                label: "WTP (median)",
                a: `$${result.conceptA.wtpRange.mid}`,
                b: `$${result.conceptB.wtpRange.mid}`,
                aWins: result.conceptA.wtpRange.mid > result.conceptB.wtpRange.mid,
              },
              {
                label: "NPS Score",
                a: `+${result.conceptA.npsScore}`,
                b: `+${result.conceptB.npsScore}`,
                aWins: result.conceptA.npsScore > result.conceptB.npsScore,
              },
              {
                label: "Monthly Repeat",
                a: `${result.conceptA.purchaseFrequency[0]?.percent ?? 0}%`,
                b: `${result.conceptB.purchaseFrequency[0]?.percent ?? 0}%`,
                aWins: (result.conceptA.purchaseFrequency[0]?.percent ?? 0) > (result.conceptB.purchaseFrequency[0]?.percent ?? 0),
              },
            ].map((m) => (
              <Card key={m.label}>
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">
                    {m.label}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className={`text-lg font-bold ${m.aWins ? "text-teal" : "text-muted-foreground"}`}>
                        {m.a}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Powder</p>
                    </div>
                    <p className="text-xs text-muted-foreground/50 pb-0.5">vs</p>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${!m.aWins ? "text-cyan-500" : "text-muted-foreground"}`}>
                        {m.b}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Gummies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                  {
                    label: "NPS Score",
                    valueA: Math.max(0, result.conceptA.npsScore ?? 0),
                    valueB: Math.max(0, result.conceptB.npsScore ?? 0),
                    prefix: "+",
                    suffix: "",
                  },
                  {
                    label: "Monthly Repeat Rate",
                    valueA: result.conceptA.purchaseFrequency[0]?.percent ?? 0,
                    valueB: result.conceptB.purchaseFrequency[0]?.percent ?? 0,
                    suffix: "%",
                  },
                  {
                    label: "\"Definitely Yes\" Intent",
                    valueA: Math.round(
                      ((result.conceptA.purchaseIntent.distribution[4]?.count ?? 0) /
                        result.conceptA.purchaseIntent.distribution.reduce((s, x) => s + x.count, 0)) *
                        100
                    ),
                    valueB: Math.round(
                      ((result.conceptB.purchaseIntent.distribution[4]?.count ?? 0) /
                        result.conceptB.purchaseIntent.distribution.reduce((s, x) => s + x.count, 0)) *
                        100
                    ),
                    suffix: "%",
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

          {/* Winner Summary */}
          <Card className="mb-8 border-teal/20 bg-teal/5">
            <CardContent className="py-5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                Winner Summary
              </p>
              <p className="text-sm text-primary leading-relaxed">
                <strong>Rekt Energy + Focus Powder wins by 9 points</strong> on purchase intent (68% vs 59%).
                The powder format commands a higher WTP ($30 vs $28), stronger NPS (+32 vs +18), and
                significantly better repurchase intent (36% monthly vs 28% monthly). While gummies offer
                convenience, the powder&apos;s clean-label positioning and higher caffeine content resonate more
                strongly with the target audience. The powder also avoids the sugar-content concern that
                undermines the gummy&apos;s clean energy positioning.
              </p>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Key takeaway:</strong> The powder concept&apos;s 28% &ldquo;Definitely Yes&rdquo; rate
                vs the gummy&apos;s 18% signals significantly stronger core demand. The powder&apos;s top feature
                (Natural caffeine + L-Theanine at 92%) outperforms the gummy&apos;s top feature
                (Convenience at 88%), suggesting functional benefits outweigh format convenience for this audience.
              </p>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card className="border-teal/20 bg-teal/5 mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">
                Methodology & Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Panel size:</strong> {result.methodology.panelSize}{" "}
                simulated consumers
              </p>
              <p>
                <strong>Demographic mix:</strong>{" "}
                {result.methodology.demographicMix}
              </p>
              <p>
                <strong>Total survey questions:</strong>{" "}
                {result.methodology.questionsAsked}
              </p>
              <Separator className="my-3" />
              <p className="text-xs leading-relaxed">
                {result.methodology.confidenceNote}
              </p>
              <p className="text-xs leading-relaxed">
                This research uses methodology informed by Brand, Israeli &amp;
                Ngwe (2025), &ldquo;Using LLMs for Market Research,&rdquo;
                Harvard Business School Working Paper 23-062.
              </p>
              <p className="text-xs leading-relaxed font-medium">
                Important: These results are best used for directional insights
                and hypothesis generation. They should not replace high-stakes
                primary consumer research for major business decisions.
              </p>
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
