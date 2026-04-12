"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ResearchResult } from "@/types/research";
import { ResultsCharts, SegmentCharts } from "@/components/results-charts";
import Link from "next/link";

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
  useEffect(() => {
    setFormattedDate(new Date(result.createdAt).toLocaleDateString());
  }, [result.createdAt]);

  const score = result.purchaseIntent?.score ?? 0;

  return (
    <div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/30 rounded-lg px-4 py-2.5 mb-6 text-xs text-amber-800 dark:text-amber-300">
        <strong>Important:</strong> These results are AI-simulated, not from real consumers. Best used for directional insights and hypothesis generation.
        Not a substitute for professional market research.{" "}
        <Link href="/methodology#limitations" className="text-amber-900 underline">Learn more</Link>
      </div>
      {/* Go/No-Go Scorecard */}
      <GoNoGoScorecard result={result} />

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Purchase Intent — featured with tinted background */}
        <Card className="bg-primary text-primary-foreground border-primary">
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wider mb-1 text-primary-foreground/60">
              Purchase Intent
            </p>
            <p className="text-4xl font-extrabold tracking-tight">
              {score}%
            </p>
            <p className="text-xs text-primary-foreground/50 mt-1.5">
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

      {/* Charts */}
      <ResultsCharts result={result} />

      {/* Feature Importance */}
      <Card className="mt-12 mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Feature Importance</CardTitle>
        </CardHeader>
        <CardContent>
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

      {/* Segment Breakdown */}
      {result.segmentBreakdown && (
        <SegmentCharts breakdown={result.segmentBreakdown} />
      )}

      {/* Concerns & Positives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

      {/* Verbatims */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Consumer Verbatims</CardTitle>
        </CardHeader>
        <CardContent>
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
  const unit = result.input?.priceUnit || "";
  const unitLabel = unit ? `/${unit.replace("per ", "")}` : "";
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
          range: ${result.wtpRange?.low ?? 0} — ${result.wtpRange?.high ?? 0}
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

  const wtpAbovePrice = userPriceMid !== null ? wtpMid >= userPriceMid : true;
  const wtpSignificantlyBelow = userPriceMid !== null ? wtpMid < userPriceMid * 0.75 : false;

  if (score >= 60 && wtpAbovePrice) {
    verdict = "GO";
    verdictColor = "text-emerald-700 dark:text-emerald-400";
    bgColor = "bg-emerald-50 dark:bg-emerald-950/30";
    borderColor = "border-emerald-200 dark:border-emerald-800/40";
    reasoning = `Strong purchase intent (${score}%) with willingness to pay at or above your target price. Consumer sentiment is positive, with "${topPositive}" cited most frequently.`;
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
