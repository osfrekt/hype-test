"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Link2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { MarketResearchResult } from "@/types/market-research";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: MarketResearchResult };

export default function MarketResearchResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <>
          <Nav />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading results...</p>
          </main>
        </>
      }
    >
      <MarketResearchResultContent params={params} />
    </Suspense>
  );
}

function MarketResearchResultContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Try Supabase first
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("market_research_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              input: data.input,
              marketOverview: data.market_overview,
              marketSize: data.market_size,
              keyTrends: data.key_trends,
              consumerInsights: data.consumer_insights,
              competitiveLandscape: data.competitive_landscape,
              pricingLandscape: data.pricing_landscape,
              gaps: data.gaps,
              threats: data.threats,
              recommendations: data.recommendations,
              status: data.status,
              createdAt: data.created_at,
            },
          });
          return;
        }
      } catch {
        // Fall through to sessionStorage
      }

      // Fallback: sessionStorage
      try {
        const stored = sessionStorage.getItem(`market-research-${id}`);
        if (stored && !cancelled) {
          setState({ status: "ok", result: JSON.parse(stored) });
          return;
        }
      } catch {
        // sessionStorage unavailable
      }

      if (!cancelled) {
        setState({
          status: "error",
          message: "Market research result not found. The link may be invalid or the result may have expired.",
        });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (state.status === "loading") {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
              <svg className="animate-spin text-teal" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </main>
      </>
    );
  }

  if (state.status === "error") {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <p className="text-lg font-medium text-primary mb-2">Result not found</p>
            <p className="text-sm text-muted-foreground">{state.message}</p>
          </div>
        </main>
      </>
    );
  }

  const result = state.result;

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6 pb-16 md:pb-0">
          {/* Action bar */}
          <div className="flex justify-end gap-2 mb-6" data-print-hide>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch { /* Clipboard not available */ }
              }}
            >
              <Link2 className="w-4 h-4 mr-1.5" />
              {copied ? "Copied!" : "Copy share link"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} data-print-hide>
              <Download className="w-4 h-4 mr-1.5" />
              Download PDF
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-primary">Market Research: {result.input.category}</h1>
              <Badge variant="secondary" className="text-xs">{result.input.geography}</Badge>
            </div>
            {result.input.questions && (
              <p className="text-sm text-muted-foreground italic">&ldquo;{result.input.questions}&rdquo;</p>
            )}
          </div>

          {/* Market Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{result.marketOverview}</p>
            </CardContent>
          </Card>

          {/* Market Size callout */}
          <Card className="mb-6 border-teal/20 bg-teal/5">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Estimated Market Size</p>
              <p className="text-sm text-foreground leading-relaxed">{result.marketSize}</p>
            </CardContent>
          </Card>

          {/* Key Trends */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Key Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {result.keyTrends.map((trend, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold text-teal bg-teal/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-foreground">{trend}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Consumer Insights */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Consumer Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {result.consumerInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-2" />
                    <span className="text-sm text-foreground">{insight}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Competitive Landscape */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Competitive Landscape</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.competitiveLandscape.map((comp, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <h4 className="text-sm font-bold text-primary mb-2">{comp.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{comp.positioning}</p>
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0 mt-0.5"><path d="M20 6 9 17l-5-5" /></svg>
                        <span className="text-xs text-muted-foreground">{comp.strength}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        <span className="text-xs text-muted-foreground">{comp.weakness}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Landscape */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Pricing Landscape</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{result.pricingLandscape}</p>
            </CardContent>
          </Card>

          {/* Market Gaps (Opportunities) */}
          <Card className="mb-6 border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardHeader>
              <CardTitle className="text-base text-emerald-800 dark:text-emerald-400">Market Gaps &amp; Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.gaps.map((gap, i) => (
                  <div key={i} className="rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 p-3">
                    <p className="text-sm text-foreground">{gap}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Threats */}
          <Card className="mb-6 border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-base text-red-800 dark:text-red-400">Threats &amp; Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {result.threats.map((threat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 mt-2" />
                    <span className="text-sm text-foreground">{threat}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-6 border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/10">
            <CardHeader>
              <CardTitle className="text-base text-emerald-800 dark:text-emerald-400">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-foreground">{rec}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Methodology */}
          <Card className="mb-8 border-teal/20 bg-teal/5">
            <CardHeader>
              <CardTitle className="text-base text-primary">Methodology Note</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                This market research report was generated using AI analysis. The data represents synthesized market intelligence based on publicly available information and trained knowledge.
              </p>
              <p className="text-xs leading-relaxed font-medium">
                Important: This analysis is best used for directional insights and hypothesis generation. It should not replace primary market research for major business decisions. Market size estimates and growth rates are approximations.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/market-research/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run another market analysis
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
