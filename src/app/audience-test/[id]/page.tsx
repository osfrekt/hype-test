"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";
import type { AudienceTestResult } from "@/types/audience-test";
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

const SEGMENT_COLORS = [
  "#1a6b5a", // best
  "#2e8b6a",
  "#0891b2",
  "#8a8a3d",
  "#c97a2e",
];

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: AudienceTestResult };

export default function AudienceTestResultPage({
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
      <AudienceTestResultContent params={params} />
    </Suspense>
  );
}

function AudienceTestResultContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [copied, setCopied] = useState(false);
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
          .from("audience_test_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              input: data.input,
              segments: data.segments,
              bestSegment: data.best_segment,
              panelSizePerSegment: data.panel_size_per_segment,
              methodology: data.methodology,
              status: data.status,
              createdAt: data.created_at,
            },
          });
          return;
        }
      } catch {
        // fall through to sessionStorage
      }

      // Fallback: sessionStorage
      try {
        const stored = sessionStorage.getItem(`audience-test-${id}`);
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
          message: "Audience test result not found. The link may be invalid or the result may have expired.",
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
  const best = result.segments.find((s) => s.rank === 1);

  const chartData = result.segments.map((s) => ({
    audience: s.audience,
    intent: s.intentScore,
  }));

  // Link to run full research with the best audience pre-filled
  const researchParams = new URLSearchParams({
    name: result.input.productName,
    desc: result.input.productDescription.slice(0, 500),
    ...(result.input.category && { cat: result.input.category }),
  });

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-end gap-2 mb-6" data-print-hide>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {}
              }}
            >
              <Link2 className="w-4 h-4 mr-1.5" />
              {copied ? "Copied!" : "Copy share link"}
            </Button>
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {result.input.productName}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.methodology.totalPanelists} total panelists
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              Audience segment comparison across {result.segments.length} segments
            </p>
          </div>

          {/* Best Segment Card */}
          {best && (
            <Card className="mb-8 border-teal/30 bg-teal/5">
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Best Audience Segment</p>
                  <p className="text-3xl font-bold text-primary mb-2">{best.audience}</p>
                  <p className="text-sm text-muted-foreground">
                    {best.intentScore}% purchase intent
                    {best.wtpMid > 0 && ` · WTP $${best.wtpMid}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bar Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Segment Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 260)" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="audience" type="category" tick={{ fontSize: 12 }} width={120} />
                    <Tooltip
                      formatter={(value: unknown) => [`${value}%`, "Purchase Intent"]}
                      contentStyle={{
                        border: "1px solid oklch(0.91 0.005 260)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Bar dataKey="intent" radius={[0, 4, 4, 0]}>
                      {chartData.map((_, idx) => (
                        <Cell key={idx} fill={SEGMENT_COLORS[idx % SEGMENT_COLORS.length]} />
                      ))}
                      <LabelList dataKey="intent" position="right" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 12 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Segment Detail Cards */}
          <div className="grid gap-4 mb-8">
            {result.segments.map((seg) => (
              <Card key={seg.audience} className={seg.rank === 1 ? "border-teal/30" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center">
                        #{seg.rank}
                      </span>
                      <h3 className="font-semibold text-primary">{seg.audience}</h3>
                      {seg.rank === 1 && (
                        <Badge className="bg-teal/10 text-teal border-teal/20 text-xs">Best</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{seg.intentScore}%</p>
                      <p className="text-xs text-muted-foreground">purchase intent</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    {seg.wtpMid > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground">Avg WTP</p>
                        <p className="font-medium">${seg.wtpMid}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Top Positive</p>
                      <p className="text-muted-foreground">{seg.topPositive}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Top Concern</p>
                      <p className="text-muted-foreground">{seg.topConcern}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Methodology */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Methodology</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Panel size per segment:</strong> {result.methodology.panelSizePerSegment} simulated consumers</p>
              <p><strong>Total panelists:</strong> {result.methodology.totalPanelists}</p>
              <p><strong>Approach:</strong> {result.methodology.demographicMix}</p>
              <p className="text-xs">{result.methodology.confidenceNote}</p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center space-y-3" data-print-hide>
            <Link
              href={`/research/new?${researchParams.toString()}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run full research on best audience
            </Link>
            <p className="text-xs text-muted-foreground">
              Deep-dive into your best audience with full purchase intent, WTP, and feature analysis.
            </p>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed mt-6">
            AI-simulated research using peer-reviewed methodology. Results are directional and best used for hypothesis validation, not high-stakes business decisions.
          </p>
        </div>
      </main>
    </>
  );
}
