"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Download, Link2, Trash2 } from "lucide-react";
import { EnhanceButton } from "@/components/enhance-button";
import type { AdTestResult, AdCreativeResult } from "@/types/ad-test";
import { createClient } from "@/lib/supabase/client";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: AdTestResult };

export default function AdTestResultPage({
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
      <AdTestResultContent params={params} />
    </Suspense>
  );
}

function AdTestResultContent({
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
          .from("ad_test_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              input: data.input,
              results: data.results,
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
        const stored = sessionStorage.getItem(`ad-test-${id}`);
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
          message: "Ad test result not found. The link may be invalid or the result may have expired.",
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
  const isAB = result.input.mode === "ab" && result.results.length === 2;

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
            <EnhanceButton
              originalResultId={result.id}
              toolType="ad-test"
              originalInput={result.input as unknown as Record<string, unknown>}
              topConcerns={result.results.flatMap((r) => r.topWeaknesses)}
              topPositives={result.results.flatMap((r) => r.topStrengths)}
              verbatims={result.results.flatMap((r) => r.keyTakeaways.map((t) => ({ text: t })))}
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {result.input.brandName} &mdash; Ad Test
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.panelSize} respondents
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {isAB ? "A/B creative test" : "Single creative test"} with simulated consumer panel
            </p>
          </div>

          {/* Winner Banner (A/B mode) */}
          {isAB && result.winner && (
            <Card className="mb-8 bg-primary text-primary-foreground border-primary">
              <CardContent className="pt-6 pb-6 text-center">
                {result.winner === "tie" ? (
                  <>
                    <p className="text-lg font-bold mb-1">It&apos;s a tie!</p>
                    <p className="text-sm text-primary-foreground/70">
                      Both creatives scored within 3 points of each other
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold mb-1">
                      {result.results[result.winner === "A" ? 0 : 1].creative.name} wins
                    </p>
                    <p className="text-sm text-primary-foreground/70">
                      {result.winMargin}pt margin on overall score
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Creative cards */}
          <div className={`grid gap-6 mb-8 ${isAB ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-2xl"}`}>
            {result.results.map((cr, idx) => (
              <CreativeCard
                key={idx}
                label={isAB ? (idx === 0 ? "Creative A" : "Creative B") : "Creative"}
                creative={cr}
                isWinner={isAB && result.winner === (idx === 0 ? "A" : "B")}
              />
            ))}
          </div>

          {/* Head-to-head comparison (A/B mode) */}
          {isAB && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Head-to-Head Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(["attention", "clarity", "persuasion", "brandFit"] as const).map((metric) => {
                    const labelMap = { attention: "Attention", clarity: "Clarity", persuasion: "Persuasion", brandFit: "Brand Fit" };
                    const valA = result.results[0][metric].score;
                    const valB = result.results[1][metric].score;
                    const max = Math.max(valA, valB, 1);
                    return (
                      <div key={metric}>
                        <p className="text-sm font-medium text-primary mb-3">{labelMap[metric]}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{result.results[0].creative.name}</span>
                            <div className="flex-1 bg-muted rounded-full h-3">
                              <div className="bg-teal h-3 rounded-full transition-all" style={{ width: `${(valA / max) * 100}%` }} />
                            </div>
                            <span className="text-sm font-medium text-primary w-12 text-right">{valA}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{result.results[1].creative.name}</span>
                            <div className="flex-1 bg-muted rounded-full h-3">
                              <div className="bg-cyan-500 h-3 rounded-full transition-all" style={{ width: `${(valB / max) * 100}%` }} />
                            </div>
                            <span className="text-sm font-medium text-primary w-12 text-right">{valB}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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
                  const res = await fetch(`/api/ad-test/${id}`, {
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

          <p className="text-[11px] text-muted-foreground leading-relaxed mt-6">
            AI-simulated research using peer-reviewed methodology. Results are directional and best used for hypothesis validation, not high-stakes business decisions.
          </p>
        </div>
      </main>
    </>
  );
}

function CreativeCard({
  label,
  creative,
  isWinner,
}: {
  label: string;
  creative: AdCreativeResult;
  isWinner: boolean;
}) {
  const metrics = [
    { label: "Attention", data: creative.attention },
    { label: "Clarity", data: creative.clarity },
    { label: "Persuasion", data: creative.persuasion },
    { label: "Brand Fit", data: creative.brandFit },
  ];

  return (
    <Card className={isWinner ? "ring-2 ring-teal" : ""}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{label}: {creative.creative.name}</CardTitle>
          {isWinner && (
            <Badge className="bg-teal text-white text-[10px]">Winner</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{creative.creative.adCopy}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Score metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-primary">{m.data.score}%</p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div className="bg-teal h-1.5 rounded-full" style={{ width: `${m.data.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Click likelihood */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Click Likelihood</p>
          <div className="flex rounded-full overflow-hidden h-5 text-[10px] font-medium">
            {creative.clickLikelihood.yes > 0 && (
              <div
                className="bg-emerald-500 text-white flex items-center justify-center"
                style={{ width: `${creative.clickLikelihood.yes}%` }}
              >
                {creative.clickLikelihood.yes}% Yes
              </div>
            )}
            {creative.clickLikelihood.maybe > 0 && (
              <div
                className="bg-amber-400 text-amber-900 flex items-center justify-center"
                style={{ width: `${creative.clickLikelihood.maybe}%` }}
              >
                {creative.clickLikelihood.maybe}% Maybe
              </div>
            )}
            {creative.clickLikelihood.no > 0 && (
              <div
                className="bg-red-400 text-white flex items-center justify-center"
                style={{ width: `${creative.clickLikelihood.no}%` }}
              >
                {creative.clickLikelihood.no}% No
              </div>
            )}
          </div>
        </div>

        {/* Emotional responses */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Emotional Responses</p>
          <div className="flex flex-wrap gap-1.5">
            {creative.emotionalResponses.map((e) => (
              <span
                key={e.word}
                className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-xs text-foreground"
                style={{ fontSize: `${Math.min(14, 10 + e.count)}px` }}
              >
                {e.word}
                <span className="text-muted-foreground">{e.count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        {creative.topStrengths.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Strengths</p>
            <ul className="space-y-1">
              {creative.topStrengths.map((s, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {creative.topWeaknesses.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Weaknesses</p>
            <ul className="space-y-1">
              {creative.topWeaknesses.map((w, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5 shrink-0">-</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key takeaways */}
        {creative.keyTakeaways.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Key Takeaways</p>
            <ul className="space-y-1">
              {creative.keyTakeaways.map((t, i) => (
                <li key={i} className="text-xs text-muted-foreground">&ldquo;{t}&rdquo;</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
