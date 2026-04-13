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
import type { PlatformAdResult } from "@/types/platform-ad";
import { createClient } from "@/lib/supabase/client";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: PlatformAdResult };

const SOCIAL_PLATFORMS = ["instagram", "tiktok", "facebook", "linkedin", "youtube"];

export default function PlatformAdResultPage({
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
      <PlatformAdResultContent params={params} />
    </Suspense>
  );
}

function PlatformAdResultContent({
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
          .from("platform_ad_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              input: data.input,
              platformLabel: data.platform_label,
              attention: data.attention,
              clarity: data.clarity,
              persuasion: data.persuasion,
              brandFit: data.brand_fit,
              platformFit: data.platform_fit,
              clickLikelihood: data.click_likelihood,
              scrollStopPower: data.scroll_stop_power,
              purchaseIntent: data.purchase_intent ?? undefined,
              emotionalResponses: data.emotional_responses,
              topStrengths: data.top_strengths,
              topWeaknesses: data.top_weaknesses,
              platformTips: data.platform_tips,
              verbatims: data.verbatims,
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
        const stored = sessionStorage.getItem(`platform-ad-${id}`);
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
          message: "Platform ad result not found. The link may be invalid or the result may have expired.",
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
  const isSocial = SOCIAL_PLATFORMS.includes(result.input.platform);

  const metrics = [
    { label: "Attention", value: result.attention },
    { label: "Clarity", value: result.clarity },
    { label: "Persuasion", value: result.persuasion },
    { label: "Brand Fit", value: result.brandFit },
    { label: "Platform Fit", value: result.platformFit },
  ];

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-6">
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
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-teal text-white text-xs">{result.platformLabel}</Badge>
              <h2 className="text-2xl font-bold text-primary">
                {result.input.brandName} &mdash; Platform Ad Analysis
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.platformLabel} ad tested with {result.panelSize} simulated consumers
            </p>
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {metrics.map((m) => (
              <Card key={m.label}>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{m.label}</p>
                  <p className="text-3xl font-bold text-primary">{m.value}%</p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div className="bg-teal h-1.5 rounded-full" style={{ width: `${m.value}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Click / Engage likelihood */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Click / Engage Likelihood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex rounded-full overflow-hidden h-6 text-[10px] font-medium">
                {result.clickLikelihood.yes > 0 && (
                  <div
                    className="bg-emerald-500 text-white flex items-center justify-center"
                    style={{ width: `${result.clickLikelihood.yes}%` }}
                  >
                    {result.clickLikelihood.yes}% Yes
                  </div>
                )}
                {result.clickLikelihood.maybe > 0 && (
                  <div
                    className="bg-amber-400 text-amber-900 flex items-center justify-center"
                    style={{ width: `${result.clickLikelihood.maybe}%` }}
                  >
                    {result.clickLikelihood.maybe}% Maybe
                  </div>
                )}
                {result.clickLikelihood.no > 0 && (
                  <div
                    className="bg-red-400 text-white flex items-center justify-center"
                    style={{ width: `${result.clickLikelihood.no}%` }}
                  >
                    {result.clickLikelihood.no}% No
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scroll Stop Power (social platforms) */}
          {isSocial && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Scroll Stop Power</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-bold text-primary">{result.scrollStopPower}%</p>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-teal h-3 rounded-full" style={{ width: `${result.scrollStopPower}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.scrollStopPower >= 70 ? "Strong scroll-stopping power" : result.scrollStopPower >= 50 ? "Moderate scroll-stopping power" : "Low scroll-stopping power -- consider a stronger hook"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Purchase Intent (Amazon) */}
          {result.purchaseIntent !== undefined && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Purchase Intent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-bold text-primary">{result.purchaseIntent}%</p>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: `${result.purchaseIntent}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.purchaseIntent >= 70 ? "High purchase intent" : result.purchaseIntent >= 50 ? "Moderate purchase intent" : "Low purchase intent -- listing may need optimization"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emotional responses */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Emotional Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {result.emotionalResponses.map((e) => (
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
            </CardContent>
          </Card>

          {/* Strengths + Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {result.topStrengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {result.topStrengths.map((s, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {result.topWeaknesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top Weaknesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {result.topWeaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                        <span className="text-red-500 mt-0.5 shrink-0 font-bold">-</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Platform-specific tips */}
          {result.platformTips.length > 0 && (
            <Card className="mb-6 border-teal/30 bg-teal/5">
              <CardHeader>
                <CardTitle className="text-base text-primary">
                  {result.platformLabel} Optimization Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.platformTips.map((tip, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-teal font-bold shrink-0">{i + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Verbatims */}
          {result.verbatims.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Consumer Verbatims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.verbatims.map((v, i) => (
                    <div key={i} className="border-l-2 border-teal/30 pl-3">
                      <p className="text-xs text-foreground">&ldquo;{v.quote}&rdquo;</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">&mdash; {v.persona}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Methodology */}
          <Card className="border-teal/20 bg-teal/5 mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">Methodology &amp; Limitations</CardTitle>
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
                  const res = await fetch(`/api/platform-ad/${id}`, {
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
