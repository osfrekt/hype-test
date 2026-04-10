"use client";

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
  const intentColor =
    result.purchaseIntent.score >= 60
      ? "text-emerald-600"
      : result.purchaseIntent.score >= 40
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
          Research completed {new Date(result.createdAt).toLocaleDateString()}
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
              {result.purchaseIntent.score}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              of simulated consumers likely to buy
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
              Estimated WTP
            </p>
            <p className="text-3xl font-bold text-navy">
              ${result.wtpRange.mid}
              {result.input.priceUnit && (
                <span className="text-base font-medium text-muted-foreground ml-1">
                  {result.input.priceUnit}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              range: ${result.wtpRange.low} — ${result.wtpRange.high}
              {result.input.priceUnit ? ` ${result.input.priceUnit}` : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
              Top Feature
            </p>
            <p className="text-lg font-bold text-navy leading-tight">
              {result.featureImportance[0]?.feature || "N/A"}
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
            {result.featureImportance.map((f, i) => (
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
              {result.topConcerns.map((c, i) => (
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
              {result.topPositives.map((p, i) => (
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
            {result.verbatims.map((v, i) => (
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
