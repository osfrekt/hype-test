"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Download, Link2, Trash2 } from "lucide-react";
import type { AbTestResult, AbTestConceptResult } from "@/types/ab-test";
import { createClient } from "@/lib/supabase/client";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: AbTestResult };

export default function AbTestResultPage({
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
      <AbTestResultContent params={params} />
    </Suspense>
  );
}

function AbTestResultContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Try Supabase first
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("ab_test_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              conceptA: data.concept_a,
              conceptB: data.concept_b,
              winner: data.winner,
              winMargin: data.win_margin,
              panelSize: data.panel_size,
              methodology: data.methodology,
              status: data.status,
              createdAt: data.created_at,
            },
          });
          return;
        }
      } catch {
        // fall through
      }

      // Fallback: sessionStorage
      try {
        const stored = sessionStorage.getItem(`ab-test-${id}`);
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
          message: "A/B test result not found. The link may be invalid or the result may have expired.",
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
  const winnerConcept = result.winner === "A" ? result.conceptA : result.winner === "B" ? result.conceptB : null;
  const winnerName = result.winner === "A" ? result.conceptA.input.productName : result.winner === "B" ? result.conceptB.input.productName : null;
  const winnerParams = winnerConcept ? new URLSearchParams({
    name: winnerConcept.input.productName,
    desc: winnerConcept.input.productDescription.slice(0, 500),
    ...(winnerConcept.input.category && { cat: winnerConcept.input.category }),
  }) : null;

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Action buttons */}
          <div className="flex justify-end gap-2 mb-6" data-print-hide>
            <Button variant="outline" size="sm" onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch { /* clipboard unavailable */ }
            }}>
              <Link2 className="w-4 h-4 mr-1.5" />
              {copied ? "Copied!" : "Copy share link"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} data-print-hide>
              <Download className="w-4 h-4 mr-1.5" />
              Download PDF
            </Button>
          </div>

          {/* AI disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/30 rounded-lg px-4 py-2.5 mb-6 text-xs text-amber-800 dark:text-amber-300">
            <strong>Important:</strong> These results are AI-simulated, not from real consumers. Best used for directional insights and hypothesis generation.
            Not a substitute for professional market research.{" "}
            <Link href="/methodology#limitations" className="text-amber-900 underline">Learn more</Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {result.conceptA.input.productName} vs {result.conceptB.input.productName}
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
              {result.winner === "tie" ? (
                <>
                  <p className="text-lg font-bold mb-1">It&apos;s a tie!</p>
                  <p className="text-sm text-primary-foreground/70">
                    Both concepts scored within 3% of each other ({result.conceptA.purchaseIntent.score}% vs {result.conceptB.purchaseIntent.score}% purchase intent)
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold mb-1">
                    {winnerName} wins
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    {result.conceptA.purchaseIntent.score}% vs {result.conceptB.purchaseIntent.score}% purchase intent ({result.winMargin}pt margin)
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ConceptCard label="Concept A" concept={result.conceptA} isWinner={result.winner === "A"} />
            <ConceptCard label="Concept B" concept={result.conceptB} isWinner={result.winner === "B"} />
          </div>

          {/* Bar chart comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Head-to-Head Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ComparisonBars
                nameA={result.conceptA.input.productName}
                nameB={result.conceptB.input.productName}
                metrics={[
                  { label: "Purchase Intent", valueA: result.conceptA.purchaseIntent.score, valueB: result.conceptB.purchaseIntent.score, unit: "%" },
                  { label: "Estimated WTP", valueA: result.conceptA.wtpRange.mid, valueB: result.conceptB.wtpRange.mid, unit: "$", prefix: "$" },
                ]}
              />
            </CardContent>
          </Card>

          {/* Test the winner button */}
          {winnerParams && (
            <div className="text-center mb-8" data-print-hide>
              <Link
                href={`/research/new?${winnerParams.toString()}`}
                className={buttonVariants({ size: "lg" })}
              >
                Test the winner in full research
              </Link>
            </div>
          )}

          {/* Methodology */}
          <Card className="border-teal/20 bg-teal/5 mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">Methodology & Limitations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Panel size:</strong> {result.methodology.panelSize} simulated consumers</p>
              <p><strong>Demographic mix:</strong> {result.methodology.demographicMix}</p>
              <p><strong>Total survey questions:</strong> {result.methodology.questionsAsked}</p>
              <Separator className="my-3" />
              <p className="text-xs leading-relaxed">{result.methodology.confidenceNote}</p>
              <p className="text-xs leading-relaxed">
                This research uses methodology informed by Brand, Israeli &amp; Ngwe (2025),
                &ldquo;Using LLMs for Market Research,&rdquo; Harvard Business School Working Paper 23-062.
              </p>
              <p className="text-xs leading-relaxed font-medium">
                Important: These results are best used for directional insights and hypothesis generation.
                They should not replace high-stakes primary consumer research for major business decisions.
              </p>
            </CardContent>
          </Card>

          {/* Delete button */}
          <div className="mt-12 mb-8 text-center" data-print-hide>
            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                const confirmEmail = window.prompt("Enter the email you used to create this test to confirm deletion:");
                if (!confirmEmail) return;
                setDeleting(true);
                try {
                  const res = await fetch(`/api/ab-test/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: confirmEmail }),
                  });
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
              <Trash2 className="w-3.5 h-3.5" />
              {deleting ? "Deleting..." : "Delete this test"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

function ConceptCard({ label, concept, isWinner }: { label: string; concept: AbTestConceptResult; isWinner: boolean }) {
  const featureImportance = concept.featureImportance || [];
  const topConcerns = concept.topConcerns || [];
  const topPositives = concept.topPositives || [];

  return (
    <Card className={isWinner ? "ring-2 ring-teal" : ""}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{label}: {concept.input.productName}</CardTitle>
          {isWinner && (
            <Badge className="bg-teal text-white text-[10px]">Winner</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Purchase Intent */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Purchase Intent</p>
          <p className="text-3xl font-bold text-primary">{concept.purchaseIntent.score}%</p>
        </div>

        {/* WTP */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Estimated WTP</p>
          <p className="text-xl font-bold text-primary">${concept.wtpRange.mid}</p>
          <p className="text-xs text-muted-foreground">range: ${concept.wtpRange.low} - ${concept.wtpRange.high}</p>
        </div>

        {/* Top Feature */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Top Feature</p>
          <p className="text-sm font-medium text-primary">{featureImportance[0]?.feature || "N/A"}</p>
        </div>

        {/* Top Concern */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Top Concern</p>
          <p className="text-sm text-muted-foreground">{topConcerns[0] || "None"}</p>
        </div>

        {/* Top Positive */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Top Positive</p>
          <p className="text-sm text-muted-foreground">{topPositives[0] || "None"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonBars({
  nameA,
  nameB,
  metrics,
}: {
  nameA: string;
  nameB: string;
  metrics: { label: string; valueA: number; valueB: number; unit: string; prefix?: string }[];
}) {
  return (
    <div className="space-y-6">
      {metrics.map((m) => {
        const max = Math.max(m.valueA, m.valueB, 1);
        return (
          <div key={m.label}>
            <p className="text-sm font-medium text-primary mb-3">{m.label}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{nameA}</span>
                <div className="flex-1 bg-muted rounded-full h-3">
                  <div
                    className="bg-teal h-3 rounded-full transition-all"
                    style={{ width: `${(m.valueA / max) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary w-16 text-right">
                  {m.prefix || ""}{m.valueA}{m.unit !== "$" ? m.unit : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{nameB}</span>
                <div className="flex-1 bg-muted rounded-full h-3">
                  <div
                    className="bg-cyan-500 h-3 rounded-full transition-all"
                    style={{ width: `${(m.valueB / max) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary w-16 text-right">
                  {m.prefix || ""}{m.valueB}{m.unit !== "$" ? m.unit : ""}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
