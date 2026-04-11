"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ResearchResult } from "@/types/research";
import { ResultsCharts } from "@/components/results-charts";

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
  const intentColor =
    score >= 60
      ? "text-emerald-600"
      : score >= 40
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-navy">
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
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
              Purchase Intent
            </p>
            <p className={`text-3xl font-bold ${intentColor}`}>
              {score}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              of simulated consumers likely to buy
            </p>
          </CardContent>
        </Card>
        <WtpCard result={result} />
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
              Top Feature
            </p>
            <p className="text-lg font-bold text-navy leading-tight">
              {featureImportance[0]?.feature || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              most important to consumers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <ResultsCharts result={result} />

      <Separator className="my-8" />

      {/* Feature Importance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Feature Importance</CardTitle>
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
                  <span className="text-sm font-medium text-navy w-12 text-right">
                    {f.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Concerns & Positives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-700">
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
            <CardTitle className="text-base text-emerald-700">
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
          <CardTitle className="text-base">Consumer Verbatims</CardTitle>
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
          <CardTitle className="text-base text-navy">
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
        <p className="text-3xl font-bold text-navy">
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
