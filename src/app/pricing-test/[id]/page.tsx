"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link2 } from "lucide-react";
import type { PricingTestResult } from "@/types/pricing-test";
import { createClient } from "@/lib/supabase/client";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend,
  Line,
  ComposedChart,
} from "recharts";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: PricingTestResult };

export default function PricingTestResultPage({
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
      <PricingTestResultContent params={params} />
    </Suspense>
  );
}

function PricingTestResultContent({
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
          .from("pricing_test_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              input: data.input,
              pricePoints: data.price_points,
              optimalPrice: data.optimal_price,
              optimalIntent: data.optimal_intent,
              keyInsight: data.key_insight || "",
              panelSize: data.panel_size,
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
        const stored = sessionStorage.getItem(`pricing-test-${id}`);
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
          message: "Pricing test result not found. The link may be invalid or the result may have expired.",
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
  const optimal = result.pricePoints.find((p) => p.price === result.optimalPrice);
  const unit = result.input.priceUnit ? ` ${result.input.priceUnit}` : "";

  const chartData = result.pricePoints.map((p) => ({
    price: `$${p.price}`,
    priceNum: p.price,
    intent: p.intentScore,
    revenueIndex: p.revenueIndex,
    valuePerception: p.valuePerception ?? 0,
    tooCheap: p.priceComparison?.tooCheap ?? 0,
    aboutRight: p.priceComparison?.aboutRight ?? 0,
    tooExpensive: p.priceComparison?.tooExpensive ?? 0,
  }));

  // Find the sweet spot (highest "about right")
  const sweetSpot = result.pricePoints.reduce((best, cur) =>
    (cur.priceComparison?.aboutRight ?? 0) > (best.priceComparison?.aboutRight ?? 0) ? cur : best
  , result.pricePoints[0]);

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
                {result.panelSize} panelists
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              Pricing sensitivity analysis across {result.pricePoints.length} price points
            </p>
          </div>

          {/* Optimal Price Card */}
          {optimal && (
            <Card className="mb-8 border-teal/30 bg-teal/5">
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Revenue-Maximizing Price</p>
                  <p className="text-4xl font-bold text-primary mb-2">
                    ${result.optimalPrice}{unit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.optimalIntent}% purchase intent &middot; Revenue index {optimal.revenueIndex}/100
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demand Curve */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Demand Curve</CardTitle>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="intentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 260)" />
                    <XAxis dataKey="price" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value: unknown) => [
                        `${value}%`,
                        "Purchase Intent",
                      ]}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid oklch(0.91 0.005 260)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="intent"
                      stroke="#0891b2"
                      strokeWidth={2}
                      fill="url(#intentGradient)"
                      name="Purchase Intent"
                    />
                    {optimal && (
                      <ReferenceDot
                        x={`$${result.optimalPrice}`}
                        y={result.optimalIntent}
                        r={6}
                        fill="#0891b2"
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Key Insight */}
          {result.keyInsight && (
            <Card className="mb-8 border-cyan-500/20 bg-cyan-500/5">
              <CardContent className="py-5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Key Insight</p>
                <p className="text-sm text-primary leading-relaxed">{result.keyInsight}</p>
              </CardContent>
            </Card>
          )}

          {/* Value Perception & Demand Overlay */}
          {chartData[0]?.valuePerception > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-base">Demand vs Value Perception</CardTitle>
              </CardHeader>
              <CardContent>
                {mounted && (
                  <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 260)" />
                      <XAxis dataKey="price" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        formatter={(value: unknown, name: unknown) => [
                          `${value}%`,
                          String(name ?? ""),
                        ]}
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid oklch(0.91 0.005 260)",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="intent"
                        stroke="#0891b2"
                        strokeWidth={2}
                        fill="url(#intentGradient)"
                        name="Purchase Intent"
                      />
                      <Line
                        type="monotone"
                        dataKey="valuePerception"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4, fill: "#10b981" }}
                        name="Good Value %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* Price Comparison Breakdown */}
          {chartData[0]?.aboutRight > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-base">Price Perception Breakdown</CardTitle>
                {sweetSpot && (
                  <p className="text-xs text-muted-foreground mt-1">
                    &ldquo;About right&rdquo; peaks at ${sweetSpot.price} ({sweetSpot.priceComparison?.aboutRight ?? 0}%)
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {mounted && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 260)" />
                      <XAxis dataKey="price" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        formatter={(value: unknown, name: unknown) => [`${value}%`, String(name ?? "")]}
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid oklch(0.91 0.005 260)",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="tooCheap" stackId="comp" fill="#f59e0b" name="Too Cheap" />
                      <Bar dataKey="aboutRight" stackId="comp" fill="#10b981" name="About Right" />
                      <Bar dataKey="tooExpensive" stackId="comp" fill="#ef4444" name="Too Expensive" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* Price Point Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Price Point Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground text-xs">Price</th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">Intent</th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">Value</th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">Revenue</th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">Perception</th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.pricePoints.map((pp) => (
                      <tr
                        key={pp.price}
                        className={`border-b border-border/30 ${pp.price === result.optimalPrice ? "bg-teal/5" : ""}`}
                      >
                        <td className="py-3 px-3 font-medium text-sm">
                          ${pp.price}{unit}
                        </td>
                        <td className="py-3 px-3 text-center text-sm">{pp.intentScore}%</td>
                        <td className="py-3 px-3 text-center text-sm">{pp.valuePerception !== undefined ? `${pp.valuePerception}%` : "-"}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-1.5">
                              <div
                                className="bg-teal h-1.5 rounded-full"
                                style={{ width: `${pp.revenueIndex}%` }}
                              />
                            </div>
                            <span className="text-xs">{pp.revenueIndex}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {pp.priceComparison ? (
                            <div className="flex items-center justify-center gap-1 text-[10px]">
                              <span className="text-amber-500">{pp.priceComparison.tooCheap}%</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-emerald-600">{pp.priceComparison.aboutRight}%</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-red-500">{pp.priceComparison.tooExpensive}%</span>
                            </div>
                          ) : "-"}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {pp.price === result.optimalPrice && (
                            <Badge className="bg-teal/10 text-teal border-teal/20 text-xs">
                              Best
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Methodology</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Panel size:</strong> {result.methodology.panelSize} simulated consumers</p>
              <p><strong>Demographic mix:</strong> {result.methodology.demographicMix}</p>
              <p><strong>Revenue index:</strong> Price x (Intent / 100), normalized so max = 100</p>
              <p className="text-xs">{result.methodology.confidenceNote}</p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run full product research
            </Link>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed mt-6">
            AI-simulated research using peer-reviewed methodology. Results are directional and best used for hypothesis validation, not high-stakes business decisions.
          </p>
        </div>
      </main>
    </>
  );
}
