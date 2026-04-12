"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ResearchResult } from "@/types/research";
import { ResultsCharts, SegmentCharts, HorizontalBarChart } from "@/components/results-charts";
import Link from "next/link";

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <h3 className="hidden md:block text-lg font-semibold text-primary mb-3">{title}</h3>
      <div className={`${open ? "block" : "hidden"} md:block`}>
        {children}
      </div>
    </div>
  );
}

export function ReportView({
  result,
  badge,
}: {
  result: ResearchResult;
  badge?: React.ReactNode;
}) {
  // Defensive: ensure arrays exist even if data is malformed
  const featureImportance = result.featureImportance || [];
  const topConcerns = result.topConcerns || [];
  const topPositives = result.topPositives || [];
  const verbatims = result.verbatims || [];

  const [formattedDate, setFormattedDate] = useState("");
  const [benchmark, setBenchmark] = useState<{
    avgIntent: number;
    avgWtp: number;
    avgNps: number | null;
    sampleSize: number;
  } | null>(result.categoryBenchmark ?? null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);

  useEffect(() => {
    setFormattedDate(new Date(result.createdAt).toLocaleDateString());
  }, [result.createdAt]);

  // Fetch live benchmarks unless pre-populated (e.g. sample report)
  useEffect(() => {
    if (result.categoryBenchmark) return; // already have data
    const category = result.input.category;
    if (!category) return;
    setBenchmarkLoading(true);
    fetch(`/api/benchmarks?category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.benchmarks) setBenchmark(d.benchmarks);
      })
      .catch(() => {})
      .finally(() => setBenchmarkLoading(false));
  }, [result.input.category, result.categoryBenchmark]);

  const score = result.purchaseIntent?.score ?? 0;

  return (
    <div>
      {/* Go/No-Go Scorecard */}
      <GoNoGoScorecard result={result} />

      {/* Category Benchmark */}
      <CategoryBenchmark
        result={result}
        benchmark={benchmark}
        loading={benchmarkLoading}
      />

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-primary">
            {result.input.productName}
          </h2>
          <Badge variant="secondary" className="text-xs">
            {result.panelSize} respondents
          </Badge>
          {badge}
        </div>
        <p className="text-muted-foreground text-sm max-w-3xl">
          {result.input.productDescription}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Research completed {formattedDate}
        </p>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Purchase Intent — featured with tinted background */}
        <Card className="bg-navy dark:bg-navy-light text-white border-navy dark:border-navy-light">
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wider mb-1 text-white/60">
              Purchase Intent
            </p>
            <p className="text-4xl font-bold tracking-tight">
              {score}%
            </p>
            <p className="text-xs text-white/50 mt-1.5">
              of simulated consumers likely to buy
            </p>
          </CardContent>
        </Card>
        <WtpCard result={result} />
        {/* Top Feature — text-dominant, no large number */}
        <div className="flex flex-col justify-center px-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
            Top Feature
          </p>
          <p className="text-base font-bold text-primary leading-snug mb-1">
            {featureImportance[0]?.feature || "N/A"}
          </p>
          <p className="text-xs text-muted-foreground">
            most important to consumers
          </p>
        </div>
      </div>

      {/* Upgrade prompt for free-tier users */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8" data-print-hide>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary mb-1">Go deeper with Starter</p>
            <p className="text-xs text-muted-foreground">
              A/B test concepts, optimize pricing, and test product names.
              All with the same AI consumer panel.
            </p>
          </div>
          <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 h-9 hover:bg-primary/90 transition-colors shrink-0">
            See plans
          </Link>
        </div>
      </div>

      {/* Charts */}
      <ResultsCharts result={result} />

      {/* Feature Importance */}
      <div className="mt-12">
        <CollapsibleSection title="Feature Importance">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {featureImportance.map((f, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                    <span className="text-sm text-muted-foreground md:w-56 md:shrink-0 line-clamp-2">
                      {f.feature}
                    </span>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 bg-muted rounded-full h-2.5">
                        <div
                          className="bg-teal h-2.5 rounded-full transition-all"
                          style={{ width: `${f.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-primary w-12 text-right">
                        {f.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CollapsibleSection>
      </div>

      {/* Segment Breakdown */}
      {result.segmentBreakdown && (
        <CollapsibleSection title="Segment Breakdown">
          <SegmentCharts breakdown={result.segmentBreakdown} />
        </CollapsibleSection>
      )}

      {/* NPS Score */}
      {result.npsScore !== undefined && (
        <CollapsibleSection title="Net Promoter Score">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <p
                  className={`text-5xl font-bold tracking-tight ${
                    result.npsScore > 30
                      ? "text-emerald-600 dark:text-emerald-400"
                      : result.npsScore >= 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {result.npsScore > 0 ? "+" : ""}
                  {result.npsScore}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Would consumers recommend this to friends?
                </p>
              </div>
              {/* NPS Scale */}
              <div className="relative mt-4 pt-2">
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div className="bg-red-400 flex-1" />
                  <div className="bg-amber-400 flex-1" />
                  <div className="bg-emerald-300 flex-1" />
                  <div className="bg-emerald-500 flex-1" />
                </div>
                {/* Marker */}
                <div
                  className="absolute top-0 -translate-x-1/2"
                  style={{ left: `${Math.max(2, Math.min(98, ((result.npsScore + 100) / 200) * 100))}%` }}
                >
                  <div className="w-0.5 h-5 bg-foreground" />
                  <div className="w-2 h-2 rounded-full bg-foreground -mt-0.5 -ml-[3px]" />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>-100</span>
                  <span>0</span>
                  <span>+50</span>
                  <span>+100</span>
                </div>
                <div className="flex justify-between mt-0.5 text-[9px] text-muted-foreground">
                  <span>Needs work</span>
                  <span>Good</span>
                  <span>Great</span>
                  <span>Excellent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleSection>
      )}

      {/* Purchase Frequency & Channel Preference */}
      {(result.purchaseFrequency || result.channelPreference) && (
        <CollapsibleSection title="Purchase Frequency & Channel Preference">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.purchaseFrequency && (
              <HorizontalBarChart
                data={result.purchaseFrequency}
                title="Repurchase Intent"
              />
            )}
            {result.channelPreference && (
              <HorizontalBarChart
                data={result.channelPreference}
                title="Where Consumers Would Buy"
              />
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Top Words */}
      {result.topWords && result.topWords.length > 0 && (
        <CollapsibleSection title="How Consumers Describe This Product">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {result.topWords.map((w, i) => {
                  const maxCount = result.topWords![0].count;
                  const scale = 0.75 + (w.count / maxCount) * 0.5;
                  return (
                    <span
                      key={i}
                      className="inline-block bg-teal/10 text-teal border border-teal/20 rounded-full px-4 py-1.5 font-medium"
                      style={{ fontSize: `${scale}rem` }}
                    >
                      {w.word}
                      <span className="text-teal/50 ml-1.5 text-xs font-normal">
                        {w.count}
                      </span>
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </CollapsibleSection>
      )}

      {/* Concerns & Positives */}
      <CollapsibleSection title="Concerns & Positives">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-700 dark:text-red-400">
                Top Consumer Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topConcerns.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-red-400 mt-0.5 shrink-0">&bull;</span>
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                Top Consumer Positives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topPositives.map((p, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-emerald-400 mt-0.5 shrink-0">
                      &bull;
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </CollapsibleSection>

      {/* Verbatims */}
      <CollapsibleSection title="Consumer Verbatims">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {verbatims.map((v, i) => (
                <div
                  key={i}
                  className="bg-muted/50 rounded-lg p-4 border border-border/50"
                >
                  <p className="text-sm text-foreground italic leading-relaxed">
                    &ldquo;{v.quote}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    — {v.persona}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CollapsibleSection>

      {/* AI panel disclaimer */}
      <p className="text-[11px] text-muted-foreground leading-relaxed mb-8">
        AI-simulated research using peer-reviewed methodology. Results are directional and best used for hypothesis validation, not high-stakes business decisions.
      </p>

      {/* Methodology */}
      <Card className="border-teal/20 bg-teal/5">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Methodology & Limitations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Panel size:</strong> {result.methodology?.panelSize ?? result.panelSize}{" "}
            simulated consumers
          </p>
          <p>
            <strong>Demographic mix:</strong>{" "}
            {result.methodology?.demographicMix}
          </p>
          {result.methodology?.panelBreakdown && (
            <p className="text-xs text-muted-foreground">
              {result.methodology.panelBreakdown.genderSplit.female}% female, {result.methodology.panelBreakdown.genderSplit.male}% male, {result.methodology.panelBreakdown.genderSplit.nonBinary}% non-binary | Ages {result.methodology.panelBreakdown.ageRange.min}-{result.methodology.panelBreakdown.ageRange.max} (median {result.methodology.panelBreakdown.ageRange.median}) | Income ${Math.round(result.methodology.panelBreakdown.incomeRange.min / 1000)}k-${Math.round(result.methodology.panelBreakdown.incomeRange.max / 1000)}k (median ${Math.round(result.methodology.panelBreakdown.incomeRange.median / 1000)}k)
            </p>
          )}
          <p>
            <strong>Total survey questions:</strong>{" "}
            {result.methodology?.questionsAsked}
          </p>
          <Separator className="my-3" />
          <p className="text-xs leading-relaxed">
            {result.methodology?.confidenceNote}
          </p>
          <p className="text-xs leading-relaxed">
            This research uses methodology informed by Brand, Israeli &amp; Ngwe
            (2025), &ldquo;Using LLMs for Market Research,&rdquo; Harvard
            Business School Working Paper 23-062.
          </p>
          <p className="text-xs leading-relaxed font-medium">
            Important: These results are best used for directional insights and
            hypothesis generation. They should not replace high-stakes primary
            consumer research for major business decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function WtpCard({ result }: { result: ResearchResult }) {
  const rawUnit = result.input?.priceUnit || "";
  // Extract just the unit type from free-text pricing (e.g. "$39.99 per tub" -> "/tub")
  const unitMatch = rawUnit.match(/per\s+(\w+)/i);
  const unitLabel = unitMatch ? `/${unitMatch[1]}` : "";
  const mid = result.wtpRange?.mid ?? 0;

  // Determine user's actual price (midpoint of their price range)
  const userPrice = result.input.priceRange
    ? Math.round((result.input.priceRange.min + result.input.priceRange.max) / 2)
    : null;

  // Price comparison indicator
  let priceIndicator: { color: string; icon: string; label: string } | null =
    null;
  if (userPrice !== null) {
    const ratio = mid / userPrice;
    if (ratio >= 1.1) {
      priceIndicator = {
        color: "text-emerald-600",
        icon: "\u2713",
        label: `your price: $${userPrice}`,
      };
    } else if (ratio >= 0.9) {
      priceIndicator = {
        color: "text-amber-600",
        icon: "\u2248",
        label: `your price: $${userPrice}`,
      };
    } else {
      priceIndicator = {
        color: "text-red-600",
        icon: "\u2717",
        label: `your price: $${userPrice}`,
      };
    }
  }

  // Per-serving calc
  const unitsPerPack = result.input.unitsPerPack;
  const perServing =
    unitsPerPack && unitsPerPack > 1
      ? (mid / unitsPerPack).toFixed(2)
      : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          Estimated WTP
        </p>
        <p className="text-3xl font-bold text-primary">
          ${mid}
          {unitLabel && (
            <span className="text-base font-medium text-muted-foreground">
              {unitLabel}
            </span>
          )}
        </p>
        {priceIndicator && (
          <p className={`text-xs font-medium mt-1 ${priceIndicator.color}`}>
            {priceIndicator.icon} {priceIndicator.label}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          range: ${result.wtpRange?.low ?? 0} - ${result.wtpRange?.high ?? 0}
          {unitLabel}
        </p>
        {perServing && (
          <p className="text-xs text-muted-foreground mt-1">
            ${perServing}/serving
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function CategoryBenchmark({
  result,
  benchmark,
  loading,
}: {
  result: ResearchResult;
  benchmark: { avgIntent: number; avgWtp: number; avgNps: number | null; sampleSize: number } | null;
  loading: boolean;
}) {
  const category = result.input.category;
  if (!category) return null;

  if (loading) return null;

  if (!benchmark) {
    return (
      <div className="bg-muted/30 rounded-lg border border-border/50 px-4 py-3 mb-6 text-sm text-muted-foreground">
        Not enough data in this category for benchmarks yet. Run more research to build category intelligence.
      </div>
    );
  }

  const score = result.purchaseIntent?.score ?? 0;
  const wtpMid = result.wtpRange?.mid ?? 0;
  const nps = result.npsScore;

  const intentDiff = score - benchmark.avgIntent;
  const wtpDiff = wtpMid - benchmark.avgWtp;
  const npsDiff = nps !== undefined && benchmark.avgNps !== null ? nps - benchmark.avgNps : null;

  const arrow = (diff: number) =>
    diff > 0 ? (
      <span className="text-emerald-600 dark:text-emerald-400">{"\u25B2"} +{diff}</span>
    ) : diff < 0 ? (
      <span className="text-red-600 dark:text-red-400">{"\u25BC"} {diff}</span>
    ) : (
      <span className="text-muted-foreground">=</span>
    );

  return (
    <div className="bg-muted/30 rounded-lg border border-border/50 px-5 py-4 mb-6">
      <p className="text-sm font-semibold text-primary mb-0.5">Category Benchmark</p>
      <p className="text-xs text-muted-foreground mb-3">
        Based on {benchmark.sampleSize} products tested in {category}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Purchase Intent: </span>
          <span className="font-medium">{score}%</span>
          <span className="text-muted-foreground"> vs avg </span>
          <span className="font-medium">{benchmark.avgIntent}%</span>{" "}
          {arrow(intentDiff)}
          <span className="text-xs text-muted-foreground"> pts</span>
        </div>
        <div>
          <span className="text-muted-foreground">WTP: </span>
          <span className="font-medium">${wtpMid}</span>
          <span className="text-muted-foreground"> vs avg </span>
          <span className="font-medium">${benchmark.avgWtp}</span>{" "}
          {arrow(wtpDiff)}
          <span className="text-xs text-muted-foreground"> {wtpDiff > 0 ? `+$${wtpDiff}` : wtpDiff < 0 ? `-$${Math.abs(wtpDiff)}` : ""}</span>
        </div>
        {npsDiff !== null && benchmark.avgNps !== null && (
          <div>
            <span className="text-muted-foreground">NPS: </span>
            <span className="font-medium">{nps! > 0 ? "+" : ""}{nps}</span>
            <span className="text-muted-foreground"> vs avg </span>
            <span className="font-medium">{benchmark.avgNps > 0 ? "+" : ""}{benchmark.avgNps}</span>{" "}
            {arrow(npsDiff)}
            <span className="text-xs text-muted-foreground"> pts</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GoNoGoScorecard({ result }: { result: ResearchResult }) {
  const score = result.purchaseIntent?.score ?? 0;
  const wtpMid = result.wtpRange?.mid ?? 0;
  const topConcern = (result.topConcerns || [])[0] || "consumer hesitations";
  const topPositive = (result.topPositives || [])[0] || "the product concept";

  // Determine user price midpoint
  const userPriceMid = result.input.priceRange
    ? Math.round((result.input.priceRange.min + result.input.priceRange.max) / 2)
    : null;

  // Determine verdict
  let verdict: "GO" | "PROCEED WITH CAUTION" | "RECONSIDER";
  let reasoning: string;
  let verdictColor: string;
  let bgColor: string;
  let borderColor: string;

  const wtpCloseToPrice = userPriceMid !== null ? wtpMid >= userPriceMid * 0.85 : true;
  const wtpSignificantlyBelow = userPriceMid !== null ? wtpMid < userPriceMid * 0.65 : false;

  if (score >= 55 && wtpCloseToPrice) {
    verdict = "GO";
    verdictColor = "text-emerald-700 dark:text-emerald-400";
    bgColor = "bg-emerald-50 dark:bg-emerald-950/30";
    borderColor = "border-emerald-200 dark:border-emerald-800/40";
    reasoning = `Strong purchase intent (${score}%) with willingness to pay in range of your target price. Consumer sentiment is positive, with "${topPositive}" cited most frequently.`;
  } else if (score < 40 || wtpSignificantlyBelow) {
    verdict = "RECONSIDER";
    verdictColor = "text-red-700 dark:text-red-400";
    bgColor = "bg-red-50 dark:bg-red-950/30";
    borderColor = "border-red-200 dark:border-red-800/40";
    reasoning = `Low purchase intent (${score}%) indicates the current positioning may not resonate. The primary concern is "${topConcern}". Consider repositioning or testing alternative concepts.`;
  } else {
    verdict = "PROCEED WITH CAUTION";
    verdictColor = "text-amber-700 dark:text-amber-400";
    bgColor = "bg-amber-50 dark:bg-amber-950/30";
    borderColor = "border-amber-200 dark:border-amber-800/40";
    reasoning = `Moderate purchase intent (${score}%) suggests interest but not conviction. Consider addressing consumer concerns around "${topConcern}" before committing.`;
  }

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-5 mb-6`}>
      <p className={`text-2xl font-bold ${verdictColor} mb-2`}>{verdict}</p>
      <p className="text-sm text-foreground/80 leading-relaxed mb-3">{reasoning}</p>
      <p className="text-xs text-muted-foreground">
        This is a directional recommendation based on AI-simulated data. Always validate with real consumers before major decisions.
      </p>
    </div>
  );
}
