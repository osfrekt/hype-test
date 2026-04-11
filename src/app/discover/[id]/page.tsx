"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

// --- Types ---

interface DiscoveryInput {
  brandName: string;
  brandDescription: string;
  category: string;
  targetAudience: string;
  existingProducts?: string;
  priceRange?: { min: number; max: number };
  priceUnit?: string;
  constraints?: string;
}

interface ProductConcept {
  name: string;
  description: string;
  rationale: string;
  estimatedPricePoint: { low: number; high: number };
}

interface DiscoveryPanelResult {
  concept: ProductConcept;
  purchaseIntent: {
    score: number;
    distribution: { label: string; count: number }[];
  };
  wtpRange: { low: number; mid: number; high: number };
  topExcitement: string;
  topHesitation: string;
  demandRank: number;
}

interface DiscoveryResult {
  id: string;
  input: DiscoveryInput;
  concepts: DiscoveryPanelResult[];
  panelSize: number;
  methodology: {
    panelSize: number;
    demographicMix: string;
    conceptsGenerated: number;
    conceptsTested: number;
    confidenceNote: string;
  };
  createdAt: string;
  status: "running" | "complete" | "error";
}

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: DiscoveryResult };

// --- Page ---

export default function DiscoverResultPage({
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
      <DiscoverResultContent params={params} />
    </Suspense>
  );
}

function DiscoverResultContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [formattedDate, setFormattedDate] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Try Supabase first
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("discovery_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              input: data.input,
              concepts: data.concepts,
              panelSize: data.panel_size,
              methodology: data.methodology,
              status: data.status,
              createdAt: data.created_at,
            },
          });
          return;
        }
      } catch {
        // Supabase fetch failed -- fall through to sessionStorage
      }

      // Fallback: sessionStorage
      try {
        const stored = sessionStorage.getItem(`discovery-${id}`);
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
          message:
            "Discovery result not found. The link may be invalid or the result may have expired.",
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Format date after mount to avoid hydration mismatch
  useEffect(() => {
    if (state.status === "ok") {
      setFormattedDate(
        new Date(state.result.createdAt).toLocaleDateString()
      );
    }
  }, [state]);

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
  const concepts = [...result.concepts].sort(
    (a, b) => a.demandRank - b.demandRank
  );

  // Summary card data
  const topConcept = concepts[0];
  const highestWtp = concepts.reduce((best, c) =>
    c.wtpRange.mid > best.wtpRange.mid ? c : best
  );

  // Chart data
  const chartData = concepts.map((c) => ({
    name: c.concept.name,
    score: c.purchaseIntent.score,
  }));

  function barColor(score: number) {
    if (score >= 60) return "#059669";
    if (score >= 40) return "#d97706";
    return "#dc2626";
  }

  function rankColor(rank: number) {
    if (rank <= 2) return "bg-emerald-100 text-emerald-800";
    if (rank <= 5) return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-600";
  }

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-navy">
                {result.input.brandName}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.input.category}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              {result.input.targetAudience}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Discovery completed {formattedDate}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Top Opportunity
                </p>
                <p className="text-lg font-bold text-navy leading-tight">
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
                <p className="text-lg font-bold text-navy leading-tight">
                  {highestWtp?.concept.name ?? "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ${highestWtp?.wtpRange.mid ?? 0} estimated WTP
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Concepts Tested
                </p>
                <p className="text-lg font-bold text-navy leading-tight">
                  {result.methodology?.conceptsTested ?? concepts.length}{" "}
                  concepts
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.methodology?.panelSize ?? result.panelSize} panellists
                  each
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Intent Comparison Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Purchase Intent by Concept
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11 }}
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        width={140}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                        }}
                        formatter={(value: unknown) => [`${value}%`, "Intent"]}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={barColor(entry.score)}
                          />
                        ))}
                        <LabelList
                          dataKey="score"
                          position="right"
                          fontSize={11}
                          fill="#374151"
                          formatter={(v: unknown) => `${v}%`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Concept Cards */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-bold text-navy">
              Ranked Product Concepts
            </h3>
            {concepts.map((c) => (
              <Card key={c.demandRank}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Rank badge */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold ${rankColor(c.demandRank)}`}
                    >
                      #{c.demandRank}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + description */}
                      <h4 className="text-base font-bold text-navy mb-1">
                        {c.concept.name}
                      </h4>
                      <p className="text-sm text-foreground mb-2">
                        {c.concept.description}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4 italic">
                        {c.concept.rationale}
                      </p>

                      {/* Metrics row */}
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
                          <span className="text-sm font-bold text-navy">
                            ${c.wtpRange.low}-${c.wtpRange.high}
                          </span>
                        </div>
                      </div>

                      {/* Excitement & Hesitation */}
                      <div className="space-y-2 mb-4">
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

                      {/* CTA */}
                      <Link
                        href={`/research/new?name=${encodeURIComponent(c.concept.name)}&desc=${encodeURIComponent(c.concept.description)}&cat=${encodeURIComponent(result.input.category)}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Test this concept
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                {result.methodology?.panelSize ?? result.panelSize} simulated
                consumers per concept
              </p>
              <p>
                <strong>Demographic mix:</strong>{" "}
                {result.methodology?.demographicMix}
              </p>
              <p>
                <strong>Concepts generated:</strong>{" "}
                {result.methodology?.conceptsGenerated}
              </p>
              <p>
                <strong>Concepts tested:</strong>{" "}
                {result.methodology?.conceptsTested}
              </p>
              <Separator className="my-3" />
              <p className="text-xs leading-relaxed">
                {result.methodology?.confidenceNote}
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
        </div>
      </main>
    </>
  );
}
