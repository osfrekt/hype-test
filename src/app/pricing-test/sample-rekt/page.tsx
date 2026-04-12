"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PricingTestResult } from "@/types/pricing-test";
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

const SAMPLE_RESULT: PricingTestResult = {
  id: "sample-rekt",
  input: {
    productName: "Rekt Energy + Focus Powder",
    productDescription:
      "Energy and focus powder with 200mg natural caffeine, L-Theanine, and a nootropic blend. Zero sugar, zero calories, 30 servings per tub. Available in Blue Raspberry and Cherry.",
    category: "Health & Household",
    targetMarket:
      "Gamers, athletes, and professionals who want clean energy and focus",
    priceUnit: "per tub (30 servings)",
  },
  pricePoints: [
    {
      price: 19.99,
      intentScore: 84,
      revenueIndex: 72,
      valuePerception: 92,
      priceComparison: { tooCheap: 28, aboutRight: 62, tooExpensive: 10 },
    },
    {
      price: 24.99,
      intentScore: 76,
      revenueIndex: 91,
      valuePerception: 86,
      priceComparison: { tooCheap: 12, aboutRight: 72, tooExpensive: 16 },
    },
    {
      price: 29.99,
      intentScore: 68,
      revenueIndex: 98,
      valuePerception: 74,
      priceComparison: { tooCheap: 4, aboutRight: 68, tooExpensive: 28 },
    },
    {
      price: 34.99,
      intentScore: 52,
      revenueIndex: 87,
      valuePerception: 48,
      priceComparison: { tooCheap: 2, aboutRight: 44, tooExpensive: 54 },
    },
    {
      price: 39.99,
      intentScore: 35,
      revenueIndex: 67,
      valuePerception: 28,
      priceComparison: { tooCheap: 0, aboutRight: 24, tooExpensive: 76 },
    },
  ],
  optimalPrice: 29.99,
  optimalIntent: 68,
  keyInsight:
    "$29.99 maximizes revenue while maintaining strong value perception. Below $25, consumers perceive 'too cheap' which could signal low quality for a premium nootropic product. Above $35, over half the panel considers it too expensive and intent drops below 50%.",
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix:
      "Gamers, athletes, and professionals 18-38 (80%) + general population (20%)",
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Each price point tested with the same panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

const CONSUMER_QUOTES = [
  {
    quote:
      "At a dollar a serving, this is right in line with what I pay for my pre-workout. The nootropic blend makes it feel like I'm getting more for my money than a basic energy drink.",
    persona: "Male, 26, competitive gamer & gym-goer",
  },
  {
    quote:
      "I was spending $4-5 a day on canned energy drinks. Thirty servings for $30 is a no-brainer, especially with the L-Theanine. That's the ingredient that makes this worth it over cheaper options.",
    persona: "Female, 31, software engineer",
  },
];

const EXECUTIVE_SUMMARY = {
  recommendation: "$29.99 per tub (30 servings)",
  revenueUplift:
    "+36% revenue index vs. the lowest price point ($19.99), with only a 16-point drop in purchase intent",
  pricePerServing: "$1.00/serving",
  competitivePosition:
    "Positioned at the premium end of mainstream energy powders ($0.67-$1.33/serving) while undercutting ultra-premium nootropic brands ($1.50+/serving)",
};

export default function SampleRektPricingTest() {
  const result = SAMPLE_RESULT;
  const optimal = result.pricePoints.find(
    (p) => p.price === result.optimalPrice
  );
  const unit = result.input.priceUnit ? ` ${result.input.priceUnit}` : "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = result.pricePoints.map((p) => ({
    price: `$${p.price}`,
    priceNum: p.price,
    intent: p.intentScore,
    revenueIndex: p.revenueIndex,
    valuePerception: p.valuePerception,
    tooCheap: p.priceComparison.tooCheap,
    aboutRight: p.priceComparison.aboutRight,
    tooExpensive: p.priceComparison.tooExpensive,
  }));

  const sweetSpot = result.pricePoints.reduce((best, cur) =>
    cur.priceComparison.aboutRight > best.priceComparison.aboutRight
      ? cur
      : best
  );

  const lowestPrice = result.pricePoints[0];
  const highestPrice = result.pricePoints[result.pricePoints.length - 1];

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Sample badge */}
          <div className="mb-6">
            <Badge className="bg-muted text-muted-foreground text-xs">
              Sample report
            </Badge>
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
              Pricing sensitivity analysis across {result.pricePoints.length}{" "}
              price points &middot; {result.input.category} &middot;{" "}
              {result.input.targetMarket}
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Generated{" "}
              {new Date(result.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Executive Summary */}
          <Card className="mb-8 border-teal/30 bg-teal/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Revenue-Maximizing Price
                </p>
                <p className="text-4xl font-bold text-primary mb-1">
                  ${result.optimalPrice}
                  {unit}
                </p>
                <p className="text-lg text-muted-foreground font-medium">
                  {EXECUTIVE_SUMMARY.pricePerServing} per serving
                </p>
              </div>

              {optimal && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-border/30">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {optimal.intentScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Purchase intent
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {optimal.revenueIndex}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Revenue index
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {optimal.valuePerception}%
                    </p>
                    <p className="text-xs text-muted-foreground">Good value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {optimal.priceComparison.aboutRight}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      &ldquo;About right&rdquo;
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                {EXECUTIVE_SUMMARY.revenueUplift}.{" "}
                {EXECUTIVE_SUMMARY.competitivePosition}.
              </p>
            </CardContent>
          </Card>

          {/* Key Insight */}
          <Card className="mb-8 border-cyan-500/20 bg-cyan-500/5">
            <CardContent className="py-5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">
                Key Insight
              </p>
              <p className="text-sm text-primary leading-relaxed">
                {result.keyInsight}
              </p>
            </CardContent>
          </Card>

          {/* Sweet Spot Callout */}
          <Card className="mb-8 border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="py-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-600 text-lg font-bold">$</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    Value Sweet Spot: ${sweetSpot.price}
                  </p>
                  <p className="text-sm text-primary leading-relaxed">
                    Value perception peaks in the ${lowestPrice.price}&ndash;$
                    {sweetSpot.price} range, where{" "}
                    {sweetSpot.priceComparison.aboutRight}% of the panel
                    considers the price &ldquo;about right.&rdquo; At $
                    {sweetSpot.price}, only{" "}
                    {sweetSpot.priceComparison.tooExpensive}% feel it&rsquo;s
                    too expensive, while the &ldquo;too cheap&rdquo; signal
                    drops to just {sweetSpot.priceComparison.tooCheap}%
                    &mdash; meaning price no longer undermines perceived quality.
                    This is the price where consumers feel they&rsquo;re getting
                    a fair deal without questioning product legitimacy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consumer Verbatims */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Consumer Voices at ${result.optimalPrice}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Representative quotes from panelists at the optimal price point
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {CONSUMER_QUOTES.map((q, i) => (
                <div
                  key={i}
                  className="border-l-2 border-teal/30 pl-4 py-1"
                >
                  <p className="text-sm text-primary italic leading-relaxed">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    &mdash; {q.persona}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Demand Curve */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Demand Curve</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Purchase intent drops steadily from {lowestPrice.intentScore}%
                at ${lowestPrice.price} to {highestPrice.intentScore}% at $
                {highestPrice.price}
              </p>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="intentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0891b2"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0891b2"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.91 0.005 260)"
                    />
                    <XAxis dataKey="price" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
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

          {/* Demand vs Value Perception */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Demand vs Value Perception
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Intent and value perception track closely until $29.99, where
                they begin to diverge significantly
              </p>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.91 0.005 260)"
                    />
                    <XAxis dataKey="price" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
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

          {/* Price Perception Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Price Perception Breakdown
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                &ldquo;About right&rdquo; peaks at ${sweetSpot.price} (
                {sweetSpot.priceComparison.aboutRight}%) &mdash;
                &ldquo;Too expensive&rdquo; crosses 50% above $34.99
              </p>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.91 0.005 260)"
                    />
                    <XAxis dataKey="price" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
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
                    <Bar
                      dataKey="tooCheap"
                      stackId="comp"
                      fill="#f59e0b"
                      name="Too Cheap"
                    />
                    <Bar
                      dataKey="aboutRight"
                      stackId="comp"
                      fill="#10b981"
                      name="About Right"
                    />
                    <Bar
                      dataKey="tooExpensive"
                      stackId="comp"
                      fill="#ef4444"
                      name="Too Expensive"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Price Point Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Price Point Comparison
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Full breakdown across all {result.pricePoints.length} tested
                price points
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground text-xs">
                        Price
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">
                        Intent
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">
                        Value
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">
                        Revenue
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">
                        Too Cheap
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">
                        About Right
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground text-xs">
                        Too Expensive
                      </th>
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
                          ${pp.price}
                          {unit}
                        </td>
                        <td className="py-3 px-3 text-center text-sm">
                          {pp.intentScore}%
                        </td>
                        <td className="py-3 px-3 text-center text-sm">
                          {pp.valuePerception}%
                        </td>
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
                        <td className="py-3 px-3 text-center text-sm text-amber-500">
                          {pp.priceComparison.tooCheap}%
                        </td>
                        <td className="py-3 px-3 text-center text-sm text-emerald-600">
                          {pp.priceComparison.aboutRight}%
                        </td>
                        <td className="py-3 px-3 text-center text-sm text-red-500">
                          {pp.priceComparison.tooExpensive}%
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

          {/* Pricing Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Pricing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="font-medium text-primary mb-1">
                    Launch Price
                  </p>
                  <p className="text-xl font-bold text-primary">$29.99</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximizes revenue index (98/100) with 68% intent and 74%
                    value perception. The strongest balance of margin and volume.
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="font-medium text-primary mb-1">
                    Penetration Price
                  </p>
                  <p className="text-xl font-bold text-primary">$24.99</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    If volume growth is the priority, $24.99 delivers 76%
                    intent with 86% value perception. Consider for launch
                    promotions.
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="font-medium text-primary mb-1">
                    Premium Ceiling
                  </p>
                  <p className="text-xl font-bold text-primary">$34.99</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Intent drops below 50% and &ldquo;too expensive&rdquo;
                    exceeds 50%. This is the upper bound before significant
                    demand destruction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Methodology</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-primary text-xs uppercase tracking-wider mb-1">
                    Panel size
                  </p>
                  <p>{result.methodology.panelSize} simulated consumers</p>
                </div>
                <div>
                  <p className="font-medium text-primary text-xs uppercase tracking-wider mb-1">
                    Demographic mix
                  </p>
                  <p>{result.methodology.demographicMix}</p>
                </div>
                <div>
                  <p className="font-medium text-primary text-xs uppercase tracking-wider mb-1">
                    Revenue index formula
                  </p>
                  <p>
                    Price x (Intent / 100), normalized so the maximum across
                    all price points = 100
                  </p>
                </div>
                <div>
                  <p className="font-medium text-primary text-xs uppercase tracking-wider mb-1">
                    Price points tested
                  </p>
                  <p>
                    {result.pricePoints.length} points from $
                    {lowestPrice.price} to ${highestPrice.price}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-border/30">
                <p className="text-xs">{result.methodology.confidenceNote}</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/pricing-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own pricing test
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
