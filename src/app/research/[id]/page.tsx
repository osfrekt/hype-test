"use client";

import { use, useEffect, useState } from "react";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { ResearchResult } from "@/types/research";
import { ResultsCharts } from "@/components/results-charts";
import { createClient } from "@/lib/supabase/client";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: ResearchResult };

export default function ResearchResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Try Supabase first
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("research_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              input: data.input,
              panelSize: data.panel_size,
              purchaseIntent: data.purchase_intent,
              wtpRange: data.wtp_range,
              featureImportance: data.feature_importance,
              topConcerns: data.top_concerns,
              topPositives: data.top_positives,
              verbatims: data.verbatims,
              methodology: data.methodology,
              ...(data.competitive_position && {
                competitivePosition: data.competitive_position,
              }),
              status: data.status,
              createdAt: data.created_at,
            },
          });
          return;
        }
      } catch {
        // Supabase fetch failed — fall through to sessionStorage
      }

      // Fallback: sessionStorage (covers mid-session before DB write completes)
      try {
        const stored = sessionStorage.getItem(`research-${id}`);
        if (stored && !cancelled) {
          setState({ status: "ok", result: JSON.parse(stored) });
          return;
        }
      } catch {
        // sessionStorage unavailable (SSR or private browsing)
      }

      if (!cancelled) {
        setState({
          status: "error",
          message: "Research result not found. The link may be invalid or the result may have expired.",
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="animate-spin text-teal"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
            <p className="text-lg font-medium text-navy mb-2">
              Result not found
            </p>
            <p className="text-sm text-muted-foreground">{state.message}</p>
          </div>
        </main>
      </>
    );
  }

  const result = state.result;

  const intentColor =
    result.purchaseIntent.score >= 60
      ? "text-emerald-600"
      : result.purchaseIntent.score >= 40
        ? "text-amber-600"
        : "text-red-600";

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-navy">
                {result.input.productName}
              </h1>
              <Badge variant="secondary" className="text-xs">
                {result.panelSize} respondents
              </Badge>
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
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  range: ${result.wtpRange.low} — ${result.wtpRange.high}
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
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-48 shrink-0 truncate">
                      {f.feature}
                    </span>
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
                      <span className="text-red-400 mt-0.5 shrink-0">
                        &bull;
                      </span>
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
                <strong>Panel size:</strong>{" "}
                {result.methodology.panelSize} simulated consumers
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
                (2025), &ldquo;Using LLMs for Market Research,&rdquo; Harvard Business
                School Working Paper 23-062. Results are generated by querying an
                LLM with diverse consumer personas at high temperature to produce
                distributional responses. Willingness-to-pay is estimated via
                conjoint-style indirect elicitation.
              </p>
              <p className="text-xs leading-relaxed font-medium">
                Important: These results are best used for directional insights
                and hypothesis generation. They should not replace high-stakes
                primary consumer research for major business decisions.
                Demographic segment estimates are directional, not precise.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
