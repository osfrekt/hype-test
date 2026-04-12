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
import type { LogoTestResult, LogoOptionResult } from "@/types/logo-test";
import { createClient } from "@/lib/supabase/client";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: LogoTestResult };

export default function LogoTestResultPage({
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
      <LogoTestResultContent params={params} />
    </Suspense>
  );
}

function LogoTestResultContent({
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
          .from("logo_test_results")
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
        const stored = sessionStorage.getItem(`logo-test-${id}`);
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
          message: "Logo test result not found. The link may be invalid or the result may have expired.",
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
  const hasMultiple = result.results.length > 1;

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
                {result.input.brandName} &mdash; Logo Test
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.panelSize} respondents
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.results.length} logo{result.results.length !== 1 ? "s" : ""} tested with simulated consumer panel
            </p>
          </div>

          {/* Winner Banner */}
          {hasMultiple && result.winner && (
            <Card className="mb-8 bg-primary text-primary-foreground border-primary">
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-lg font-bold mb-1">
                  {result.winner} ranks #1 with {result.results[0].overallScore}% overall score
                </p>
                <p className="text-sm text-primary-foreground/70">
                  Based on first impression, memorability, brand fit, distinctiveness, and trust
                </p>
              </CardContent>
            </Card>
          )}

          {/* Comparison bar chart (multiple logos) */}
          {hasMultiple && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Overall Score Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.results.map((lr, idx) => {
                    const maxScore = Math.max(...result.results.map((r) => r.overallScore), 1);
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-40 shrink-0 truncate">
                          #{lr.rank} {lr.logo.name}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-4">
                          <div
                            className={`h-4 rounded-full transition-all ${lr.rank === 1 ? "bg-teal" : "bg-cyan-500"}`}
                            style={{ width: `${(lr.overallScore / maxScore) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-primary w-12 text-right">{lr.overallScore}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Logo cards */}
          <div className="space-y-6 mb-8">
            {result.results.map((lr, idx) => (
              <LogoCard
                key={idx}
                logoResult={lr}
                isWinner={hasMultiple && lr.rank === 1}
                hasMultiple={hasMultiple}
              />
            ))}
          </div>

          {/* Head-to-head metric comparison (multiple logos) */}
          {hasMultiple && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Metric Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(["firstImpression", "memorability", "brandFit", "distinctiveness", "trust"] as const).map((metric) => {
                    const labelMap = {
                      firstImpression: "First Impression",
                      memorability: "Memorability",
                      brandFit: "Brand Fit",
                      distinctiveness: "Distinctiveness",
                      trust: "Trust",
                    };
                    const maxVal = Math.max(...result.results.map((r) => r[metric].score), 1);
                    return (
                      <div key={metric}>
                        <p className="text-sm font-medium text-primary mb-3">{labelMap[metric]}</p>
                        <div className="space-y-2">
                          {result.results.map((lr, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{lr.logo.name}</span>
                              <div className="flex-1 bg-muted rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full transition-all ${idx === 0 ? "bg-teal" : idx === 1 ? "bg-cyan-500" : idx === 2 ? "bg-violet-500" : idx === 3 ? "bg-amber-500" : "bg-rose-500"}`}
                                  style={{ width: `${(lr[metric].score / maxVal) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-primary w-12 text-right">{lr[metric].score}%</span>
                            </div>
                          ))}
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
              <p className="text-xs leading-relaxed">
                Logo images were evaluated using Claude&apos;s multimodal vision capabilities.
                Each panellist received both the image and text description for context-rich evaluation.
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
                  const res = await fetch(`/api/logo-test/${id}`, {
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

function LogoCard({
  logoResult,
  isWinner,
  hasMultiple,
}: {
  logoResult: LogoOptionResult;
  isWinner: boolean;
  hasMultiple: boolean;
}) {
  const metrics = [
    { label: "First Impression", data: logoResult.firstImpression },
    { label: "Memorability", data: logoResult.memorability },
    { label: "Brand Fit", data: logoResult.brandFit },
    { label: "Distinctiveness", data: logoResult.distinctiveness },
    { label: "Trust", data: logoResult.trust },
  ];

  return (
    <Card className={isWinner ? "ring-2 ring-teal" : ""}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            {hasMultiple && `#${logoResult.rank} `}{logoResult.logo.name}
          </CardTitle>
          {isWinner && (
            <Badge className="bg-teal text-white text-[10px]">Winner</Badge>
          )}
          <span className="ml-auto text-2xl font-bold text-primary">{logoResult.overallScore}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{logoResult.logo.description}</p>
        {(logoResult.logo.colorPalette || logoResult.logo.styleTags) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {logoResult.logo.colorPalette && <span>Colors: {logoResult.logo.colorPalette}</span>}
            {logoResult.logo.colorPalette && logoResult.logo.styleTags && <span> | </span>}
            {logoResult.logo.styleTags && <span>Style: {logoResult.logo.styleTags}</span>}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Score metrics as horizontal bars */}
        <div className="space-y-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{m.label}</p>
                <p className="text-sm font-bold text-primary">{m.data.score}%</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-teal h-2 rounded-full" style={{ width: `${m.data.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Engagement likelihood */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Would Engage</p>
          <div className="flex rounded-full overflow-hidden h-5 text-[10px] font-medium">
            {logoResult.engageLikelihood.yes > 0 && (
              <div
                className="bg-emerald-500 text-white flex items-center justify-center"
                style={{ width: `${logoResult.engageLikelihood.yes}%` }}
              >
                {logoResult.engageLikelihood.yes}% Yes
              </div>
            )}
            {logoResult.engageLikelihood.maybe > 0 && (
              <div
                className="bg-amber-400 text-amber-900 flex items-center justify-center"
                style={{ width: `${logoResult.engageLikelihood.maybe}%` }}
              >
                {logoResult.engageLikelihood.maybe}% Maybe
              </div>
            )}
            {logoResult.engageLikelihood.no > 0 && (
              <div
                className="bg-red-400 text-white flex items-center justify-center"
                style={{ width: `${logoResult.engageLikelihood.no}%` }}
              >
                {logoResult.engageLikelihood.no}% No
              </div>
            )}
          </div>
        </div>

        {/* One-word reactions */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">One-Word Reactions</p>
          <div className="flex flex-wrap gap-1.5">
            {logoResult.reactions.map((r) => (
              <span
                key={r.word}
                className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-xs text-foreground"
                style={{ fontSize: `${Math.min(14, 10 + r.count)}px` }}
              >
                {r.word}
                <span className="text-muted-foreground">{r.count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Industry guesses */}
        {logoResult.industryGuesses.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Industry Associations</p>
            <ul className="space-y-1">
              {logoResult.industryGuesses.map((g, i) => (
                <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                  <span className="text-teal shrink-0">&bull;</span>
                  {g.industry}
                  <span className="text-muted-foreground">({g.count})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
