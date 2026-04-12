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
import type { NameTestResult } from "@/types/name-test";
import { createClient } from "@/lib/supabase/client";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: NameTestResult };

export default function NameTestResultPage({
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
      <NameTestResultContent params={params} />
    </Suspense>
  );
}

function NameTestResultContent({
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
          .from("name_test_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              productDescription: data.product_description,
              names: data.names,
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
        const stored = sessionStorage.getItem(`name-test-${id}`);
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
          message: "Name test result not found. The link may be invalid or the result may have expired.",
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
  const winner = result.names[0];
  const winnerParams = winner ? new URLSearchParams({
    name: winner.name,
    desc: result.productDescription.slice(0, 500),
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

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Name Test Results
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              {result.names.length} names tested with {result.panelSize} consumers
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl">
              {result.productDescription}
            </p>
          </div>

          {/* Winner banner */}
          {winner && (
            <Card className="mb-8 bg-primary text-primary-foreground border-primary">
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-lg font-bold mb-1">
                  &ldquo;{winner.name}&rdquo; ranks #1
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {winner.appealScore}% appeal score
                </p>
              </CardContent>
            </Card>
          )}

          {/* Ranked list */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Name Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.names.map((n) => (
                  <div key={n.name} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-3 md:w-64 shrink-0">
                      <span className={`text-lg font-bold w-8 text-center ${n.rank === 1 ? "text-teal" : "text-muted-foreground"}`}>
                        #{n.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-primary">{n.name}</p>
                        {n.rank === 1 && (
                          <Badge className="bg-teal text-white text-[10px] mt-0.5">Top Pick</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {/* Appeal bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${n.rank === 1 ? "bg-teal" : "bg-cyan-500"}`}
                            style={{ width: `${n.appealScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-primary w-12 text-right">
                          {n.appealScore}%
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-emerald-600 font-medium">Positive: </span>
                          <span className="text-muted-foreground">{n.topPositive}</span>
                        </div>
                        <div>
                          <span className="text-red-500 font-medium">Concern: </span>
                          <span className="text-muted-foreground">{n.topNegative}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test the winner */}
          {winnerParams && (
            <div className="text-center mb-8" data-print-hide>
              <Link
                href={`/research/new?${winnerParams.toString()}`}
                className={buttonVariants({ size: "lg" })}
              >
                Test the winning name in full research
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
                  const res = await fetch(`/api/name-test/${id}`, {
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
