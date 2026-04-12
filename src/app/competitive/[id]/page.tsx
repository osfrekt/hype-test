"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CompetitiveResult } from "@/types/competitive";
import { CompetitiveRadarChart } from "@/components/competitive-radar-chart";
import { createClient } from "@/lib/supabase/client";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: CompetitiveResult };

export default function CompetitiveResultPage({
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
            <p className="text-muted-foreground">Loading comparison...</p>
          </main>
        </>
      }
    >
      <CompetitiveResultContent params={params} />
    </Suspense>
  );
}

function CompetitiveResultContent({
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
          .from("competitive_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              yours: data.yours,
              competitor: data.competitor,
              radarData: data.radar_data,
              winner: data.winner,
              panelSize: data.panel_size,
              methodology: data.methodology,
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
        const stored = sessionStorage.getItem(`competitive-${id}`);
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
          message: "Competitive result not found. The link may be invalid or the result may have expired.",
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
            <p className="text-muted-foreground">Loading comparison...</p>
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
  const winnerLabel = result.winner === "yours"
    ? result.yours.input.productName
    : result.winner === "competitor"
      ? result.competitor.input.productName
      : "It's a tie";

  const winnerColor = result.winner === "yours"
    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
    : result.winner === "competitor"
      ? "bg-red-100 text-red-800 border-red-300"
      : "bg-amber-100 text-amber-800 border-amber-300";

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* AI Disclaimer */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-lg px-4 py-2.5 mb-6 text-xs text-amber-800">
            <strong>Important:</strong> These results are AI-simulated, not from real consumers. Best used for directional insights.{" "}
            <Link href="/methodology#limitations" className="text-amber-900 underline">Learn more</Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-3">
              {result.yours.input.productName} vs {result.competitor.input.productName}
            </h1>
            <Badge variant="secondary" className="text-xs mb-4">
              {result.panelSize} shared respondents
            </Badge>
          </div>

          {/* Winner Banner */}
          <div className={`rounded-xl border-2 px-6 py-4 text-center mb-8 ${winnerColor}`}>
            <p className="text-sm font-medium uppercase tracking-wider mb-1">
              {result.winner === "tie" ? "Result" : "Winner"}
            </p>
            <p className="text-2xl font-bold">{winnerLabel}</p>
            {result.winner !== "tie" && (
              <p className="text-sm mt-1">
                Based on composite scoring across 5 dimensions
              </p>
            )}
          </div>

          {/* Side-by-side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ProductCard
              label="Your Product"
              product={result.yours}
              isWinner={result.winner === "yours"}
            />
            <ProductCard
              label="Competitor"
              product={result.competitor}
              isWinner={result.winner === "competitor"}
            />
          </div>

          {/* Radar Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">How You Stack Up</CardTitle>
            </CardHeader>
            <CardContent>
              <CompetitiveRadarChart
                data={result.radarData}
                yourName={result.yours.input.productName}
                competitorName={result.competitor.input.productName}
              />
            </CardContent>
          </Card>

          {/* Run Full Research Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link
              href={`/research/new?name=${encodeURIComponent(result.yours.input.productName)}&desc=${encodeURIComponent(result.yours.input.productDescription.slice(0, 500))}`}
              className={buttonVariants({ variant: "outline", size: "lg" }) + " w-full justify-center"}
            >
              Run full research on {result.yours.input.productName}
            </Link>
            <Link
              href={`/research/new?name=${encodeURIComponent(result.competitor.input.productName)}&desc=${encodeURIComponent(result.competitor.input.productDescription.slice(0, 500))}`}
              className={buttonVariants({ variant: "outline", size: "lg" }) + " w-full justify-center"}
            >
              Run full research on {result.competitor.input.productName}
            </Link>
          </div>

          {/* Methodology */}
          <Card className="border-teal/20 bg-teal/5">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">Methodology</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Panel size:</strong> {result.methodology.panelSize} simulated consumers (shared panel)</p>
              <p><strong>Demographic mix:</strong> {result.methodology.demographicMix}</p>
              <Separator className="my-3" />
              <p className="text-xs leading-relaxed">{result.methodology.confidenceNote}</p>
              <p className="text-xs leading-relaxed font-medium">
                Important: These results are best used for directional insights.
                They should not replace primary consumer research for major business decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function ProductCard({
  label,
  product,
  isWinner,
}: {
  label: string;
  product: CompetitiveResult["yours"];
  isWinner: boolean;
}) {
  return (
    <Card className={isWinner ? "border-emerald-300 ring-1 ring-emerald-200" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{product.input.productName}</CardTitle>
          {isWinner && <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">Winner</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Purchase Intent</p>
            <p className="text-2xl font-bold text-primary">{product.intentScore}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">WTP</p>
            <p className="text-2xl font-bold text-primary">${product.wtpMid}</p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Top Positive</p>
          <p className="text-sm text-foreground">{product.topPositive}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Top Concern</p>
          <p className="text-sm text-foreground">{product.topConcern}</p>
        </div>
      </CardContent>
    </Card>
  );
}
