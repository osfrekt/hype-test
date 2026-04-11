"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
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
  round: number;
}

interface DiscoveryResult {
  id: string;
  input: DiscoveryInput;
  concepts: DiscoveryPanelResult[];
  rounds: number;
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
  const router = useRouter();
  const { id } = use(params);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [formattedDate, setFormattedDate] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isRunningRound, setIsRunningRound] = useState(false);
  const [roundProgress, setRoundProgress] = useState(0);
  const [roundStage, setRoundStage] = useState("");
  const [roundError, setRoundError] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
              rounds: data.rounds ?? 1,
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

  async function handleRunRound() {
    if (state.status !== "ok") return;
    const result = state.result;
    const nextRound = (result.rounds ?? 1) + 1;

    setIsRunningRound(true);
    setRoundError("");
    setRoundProgress(5);
    setRoundStage("Analysing top performers...");

    const stages = [
      "Analysing top performers...",
      "Evolving winning concepts...",
      "Testing new concepts with consumer panel...",
      "Evaluating concept 1 of 8...",
      "Evaluating concept 2 of 8...",
      "Evaluating concept 3 of 8...",
      "Evaluating concept 4 of 8...",
      "Evaluating concept 5 of 8...",
      "Evaluating concept 6 of 8...",
      "Evaluating concept 7 of 8...",
      "Evaluating concept 8 of 8...",
      "Ranking all concepts...",
      "Complete!",
    ];
    let stageIdx = 0;
    const progressInterval = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, stages.length - 1);
      setRoundStage(stages[stageIdx]);
      setRoundProgress((p) => (p >= 90 ? p : p + Math.random() * 7));
    }, 3500);

    try {
      const response = await fetch("/api/discovery/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discoveryId: result.id,
          input: result.input,
          previousConcepts: result.concepts,
          roundNumber: nextRound,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Round failed");
      }

      const { allConcepts } = await response.json();
      setRoundProgress(100);
      setRoundStage("Complete!");

      const newConceptsInRound = allConcepts.filter(
        (c: DiscoveryPanelResult) => c.round === nextRound
      );

      // Merge into state
      const updatedResult: DiscoveryResult = {
        ...result,
        concepts: allConcepts,
        rounds: nextRound,
        methodology: {
          ...result.methodology,
          conceptsGenerated:
            result.methodology.conceptsGenerated + newConceptsInRound.length,
          conceptsTested:
            result.methodology.conceptsTested + newConceptsInRound.length,
        },
      };

      setState({ status: "ok", result: updatedResult });

      // Update sessionStorage
      try {
        sessionStorage.setItem(
          `discovery-${result.id}`,
          JSON.stringify(updatedResult)
        );
      } catch {
        // sessionStorage unavailable
      }

      setTimeout(() => {
        setIsRunningRound(false);
        setRoundProgress(0);
        setRoundStage("");
      }, 1000);
    } catch (err) {
      clearInterval(progressInterval);
      setIsRunningRound(false);
      setRoundProgress(0);
      setRoundStage("");
      setRoundError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

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
            <p className="text-lg font-medium text-primary mb-2">
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

  const totalRounds = result.rounds ?? 1;

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Action buttons */}
          <div className="flex justify-end gap-2 mb-6" data-print-hide>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  // Clipboard API not available
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              {copied ? "Copied!" : "Copy share link"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
              Download PDF
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200/60 rounded-lg px-4 py-2.5 mb-6 text-xs text-amber-800">
            <strong>Important:</strong> Product concepts and scores are AI-simulated, not from real consumers. Best used for directional insights.
            Not a substitute for professional market research.
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
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
              {totalRounds > 1 && ` (${totalRounds} rounds)`}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                  Top Opportunity
                </p>
                <p className="text-lg font-bold text-primary leading-tight">
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
                <p className="text-lg font-bold text-primary leading-tight">
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
                <p className="text-lg font-bold text-primary leading-tight">
                  {concepts.length} concepts
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.methodology?.panelSize ?? result.panelSize} panellists
                  each
                  {totalRounds > 1 && ` across ${totalRounds} rounds`}
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
              <div style={{ height: Math.max(320, concepts.length * 36) }}>
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
            <h3 className="text-lg font-bold text-primary">
              Ranked Product Concepts
            </h3>
            {concepts.map((c) => (
              <Card key={`${c.concept.name}-${c.round ?? 1}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Rank badge + round indicator */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${rankColor(c.demandRank)}`}
                      >
                        #{c.demandRank}
                      </div>
                      {totalRounds > 1 && (
                        <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-medium">
                          Round {c.round ?? 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + description */}
                      <h4 className="text-base font-bold text-primary mb-1">
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
                          <span className="text-sm font-bold text-primary">
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
                      <div data-print-hide>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Methodology */}
          <Card className="border-teal/20 bg-teal/5">
            <CardHeader>
              <CardTitle className="text-base text-primary">
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
              {totalRounds > 1 && (
                <p>
                  <strong>Rounds completed:</strong> {totalRounds}
                </p>
              )}
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

          {/* Delete button */}
          <div className="mt-12 mb-4 text-center" data-print-hide>
            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                const email = window.prompt("Enter the email you used to create this discovery to confirm deletion:");
                if (!email) return;
                setDeleting(true);
                try {
                  const res = await fetch(`/api/discovery/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
                  if (res.ok) {
                    router.push("/");
                  } else {
                    alert("Failed to delete. Please try again.");
                    setDeleting(false);
                  }
                } catch {
                  alert("Failed to delete. Please try again.");
                  setDeleting(false);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              {deleting ? "Deleting..." : "Delete my discovery"}
            </button>
          </div>

          {/* Run Another Round */}
          <div className="mt-8 mb-8" data-print-hide>
            {isRunningRound ? (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="animate-spin text-amber-600"
                        width="24"
                        height="24"
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
                    <h3 className="text-base font-bold text-primary mb-1">
                      Running Round {(result.rounds ?? 1) + 1}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {roundStage}
                    </p>
                    <div className="w-full max-w-md mx-auto bg-amber-100 rounded-full h-2 mb-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(roundProgress, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Evolving top concepts and testing with 30 consumers each
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-amber-200/60 bg-gradient-to-r from-amber-50/50 to-orange-50/30">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <h3 className="text-base font-bold text-primary mb-1">
                      Want better results?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate &amp; test 8 more concepts based on what scored
                      best
                    </p>
                    {roundError && (
                      <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4 max-w-md mx-auto">
                        {roundError}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleRunRound}
                      className="inline-flex items-center justify-center rounded-md bg-amber-600 hover:bg-amber-700 text-white h-11 px-8 text-sm font-medium transition-colors"
                    >
                      Run another round
                    </button>
                    <p className="text-xs text-muted-foreground mt-3">
                      Evolves winning concepts and adds wildcards. Takes 2-3
                      minutes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
