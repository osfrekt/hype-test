"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AudienceTestResult } from "@/types/audience-test";
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
  Legend,
} from "recharts";

/* ── Segment colours ───────────────────────────────── */
const SEGMENT_COLORS = [
  "#1a6b5a", // best
  "#2e8b6a",
  "#0891b2",
  "#8a8a3d",
  "#c97a2e",
];

/* ── Extra data that goes beyond the shared type ───── */
interface SegmentExtra {
  audience: string;
  verbatim: string;
}

const VERBATIMS: SegmentExtra[] = [
  {
    audience: "Male gamers 18-25",
    verbatim:
      "I spend 6+ hours in ranked lobbies. If this keeps me locked in without the jitters I get from canned stuff, I\u2019m subscribing day one.",
  },
  {
    audience: "Male fitness enthusiasts 25-35",
    verbatim:
      "Zero sugar, zero calories, and actual nootropics? That slots right into my stack next to creatine. Price per serving is fair.",
  },
  {
    audience: "Female professionals 28-40",
    verbatim:
      "I like what\u2019s inside the tub, but the branding screams frat house. If a friend hadn\u2019t recommended it I\u2019d have scrolled past.",
  },
  {
    audience: "College students 18-22",
    verbatim:
      "A dollar a serving beats my two-Monster-a-day habit, but dropping $30 upfront when I\u2019m on a meal-plan budget is tough.",
  },
  {
    audience: "Adults 45-60",
    verbatim:
      "The cognitive-health angle caught my eye, but the name \u2018Rekt\u2019 made me think it was for teenagers. I almost didn\u2019t click.",
  },
];

/* ── Best-audience insight copy ─────────────────────── */
const BEST_AUDIENCE_INSIGHT = {
  title: "Why Male gamers 18-25 score highest",
  bullets: [
    "Product-market fit: the L-Theanine + caffeine stack directly maps to the sustained, jitter-free focus competitive gamers already seek. No education required \u2014 this audience instantly understands the value prop.",
    "Category gap: most gaming energy products are sugar-loaded RTD cans. A zero-sugar, zero-calorie powder at ~$1/serving fills an unmet need in their current routine.",
    "Price tolerance: at a $28 median WTP they sit comfortably inside the $25\u2013$35 launch range, and the per-serving framing ($1/day vs $3\u2013$4/can) makes the value obvious.",
    "Social amplification: gamers share stack recommendations in Discord servers and Twitch chats, giving Rekt Energy organic word-of-mouth that other segments lack.",
    "Brand resonance: unlike older or professional segments, this cohort reads \u2018Rekt\u2019 as aspirational gaming slang, not aggressive or off-putting.",
  ],
  bottomLine:
    "This segment combines the highest purchase intent (74%), strong price alignment, a clear use-case narrative, and built-in virality channels \u2014 making it the optimal launch audience for Rekt Energy + Focus Powder.",
};

/* ── Sample result (shared type) ───────────────────── */
const SAMPLE_RESULT: AudienceTestResult = {
  id: "sample-rekt",
  input: {
    productName: "Rekt Energy + Focus Powder",
    productDescription:
      "Energy and focus powder with 200mg natural caffeine, L-Theanine, and a nootropic blend. Zero sugar, zero calories, 30 servings per tub (~$1/serving). Available in Blue Raspberry and Cherry.",
    category: "Health & Household",
    priceRange: { min: 25, max: 35 },
  },
  segments: [
    {
      audience: "Male gamers 18-25",
      intentScore: 74,
      wtpMid: 28,
      topPositive:
        "L-Theanine + caffeine combo appeals to competitive gamers who need sustained focus",
      topConcern:
        "Skepticism about nootropic claims without visible proof from a newer brand",
      rank: 1,
    },
    {
      audience: "Male fitness enthusiasts 25-35",
      intentScore: 71,
      wtpMid: 32,
      topPositive:
        "Zero sugar and zero calories fit clean supplement stack alongside protein and creatine",
      topConcern:
        "Already loyal to established brands like Ghost Energy and Celsius",
      rank: 2,
    },
    {
      audience: "Female professionals 28-40",
      intentScore: 62,
      wtpMid: 30,
      topPositive:
        "Clean energy without the crash is perfect for long work days",
      topConcern:
        "Brand name Rekt feels too aggressive and male-oriented",
      rank: 3,
    },
    {
      audience: "College students 18-22",
      intentScore: 58,
      wtpMid: 22,
      topPositive:
        "$1/serving is cheaper than buying canned energy drinks daily",
      topConcern:
        "Price sensitivity at $30/tub limits trial for budget-conscious students",
      rank: 4,
    },
    {
      audience: "Adults 45-60",
      intentScore: 34,
      wtpMid: 25,
      topPositive:
        "Interest in cognitive health benefits from nootropic blend",
      topConcern:
        "Brand name Rekt feels too youth-oriented and intimidating",
      rank: 5,
    },
  ],
  bestSegment: "Male gamers 18-25",
  panelSizePerSegment: 30,
  methodology: {
    panelSizePerSegment: 30,
    totalPanelists: 150,
    demographicMix:
      "Targeted panels for each segment with demographic-appropriate personas",
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

/* ── helpers ────────────────────────────────────────── */
function verbatimFor(audience: string) {
  return VERBATIMS.find((v) => v.audience === audience)?.verbatim ?? "";
}

/* ================================================================== */
export default function SampleRektAudienceTest() {
  const result = SAMPLE_RESULT;
  const best = result.segments.find((s) => s.rank === 1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* chart data */
  const intentChartData = result.segments.map((s) => ({
    audience: s.audience,
    intent: s.intentScore,
  }));

  const wtpChartData = result.segments.map((s) => ({
    audience: s.audience,
    wtp: s.wtpMid,
  }));

  const comparisonChartData = result.segments.map((s) => ({
    audience: s.audience.length > 18 ? s.audience.slice(0, 16) + "..." : s.audience,
    "Purchase Intent": s.intentScore,
    "WTP ($)": s.wtpMid,
  }));

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
                {result.methodology.totalPanelists} total panelists
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              Audience segment comparison across {result.segments.length}{" "}
              segments &middot; {result.input.category} &middot; $
              {result.input.priceRange?.min}&ndash;$
              {result.input.priceRange?.max} price range
            </p>
          </div>

          {/* Best Segment Hero */}
          {best && (
            <Card className="mb-8 border-teal/30 bg-teal/5">
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Best Audience Segment
                  </p>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {best.audience}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {best.intentScore}% purchase intent &middot; WTP $
                    {best.wtpMid}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Comparison Charts ─────────────────────── */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Segment Comparison &mdash; Purchase Intent
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={intentChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.91 0.005 260)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      dataKey="audience"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={180}
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
                    <Bar dataKey="intent" radius={[0, 4, 4, 0]}>
                      {intentChartData.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={SEGMENT_COLORS[idx % SEGMENT_COLORS.length]}
                        />
                      ))}
                      <LabelList
                        dataKey="intent"
                        position="right"
                        formatter={(v: unknown) => `${v}%`}
                        style={{ fontSize: 12 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Segment Comparison &mdash; Willingness to Pay
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mounted && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={wtpChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.91 0.005 260)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 40]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <YAxis
                      dataKey="audience"
                      type="category"
                      tick={{ fontSize: 12 }}
                      width={180}
                    />
                    <Tooltip
                      formatter={(value: unknown) => [
                        `$${value}`,
                        "Median WTP",
                      ]}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid oklch(0.91 0.005 260)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                    />
                    <Bar dataKey="wtp" radius={[0, 4, 4, 0]}>
                      {wtpChartData.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={SEGMENT_COLORS[idx % SEGMENT_COLORS.length]}
                        />
                      ))}
                      <LabelList
                        dataKey="wtp"
                        position="right"
                        formatter={(v: unknown) => `$${v}`}
                        style={{ fontSize: 12 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* ── Segment Detail Cards ─────────────────── */}
          <h3 className="text-lg font-semibold text-primary mb-4">
            Segment Deep-Dive
          </h3>
          <div className="grid gap-4 mb-8">
            {result.segments.map((seg) => (
              <Card
                key={seg.audience}
                className={seg.rank === 1 ? "border-teal/30" : ""}
              >
                <CardContent className="py-5">
                  {/* title row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center">
                        #{seg.rank}
                      </span>
                      <h3 className="font-semibold text-primary">
                        {seg.audience}
                      </h3>
                      {seg.rank === 1 && (
                        <Badge className="bg-teal/10 text-teal border-teal/20 text-xs">
                          Best
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {seg.intentScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        purchase intent
                      </p>
                    </div>
                  </div>

                  {/* metrics row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Avg WTP
                      </p>
                      <p className="font-medium">${seg.wtpMid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Intent Score
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${seg.intentScore}%`,
                              backgroundColor:
                                SEGMENT_COLORS[
                                  (seg.rank - 1) % SEGMENT_COLORS.length
                                ],
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">
                          {seg.intentScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* qualitative row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Top Positive Reaction
                      </p>
                      <p className="text-muted-foreground">{seg.topPositive}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Top Concern
                      </p>
                      <p className="text-muted-foreground">{seg.topConcern}</p>
                    </div>
                  </div>

                  {/* verbatim */}
                  <div className="border-l-2 border-muted pl-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Consumer Verbatim
                    </p>
                    <p className="text-sm italic text-muted-foreground">
                      &ldquo;{verbatimFor(seg.audience)}&rdquo;
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Best Audience Insight ─────────────────── */}
          <Card className="mb-8 border-teal/30">
            <CardHeader>
              <CardTitle className="text-base">
                {BEST_AUDIENCE_INSIGHT.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <ul className="list-disc pl-5 space-y-2">
                {BEST_AUDIENCE_INSIGHT.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <p className="font-medium text-primary pt-2">
                {BEST_AUDIENCE_INSIGHT.bottomLine}
              </p>
            </CardContent>
          </Card>

          {/* ── Methodology ──────────────────────────── */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Methodology</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Panel size per segment:</strong>{" "}
                {result.methodology.panelSizePerSegment} simulated consumers
              </p>
              <p>
                <strong>Total panelists:</strong>{" "}
                {result.methodology.totalPanelists}
              </p>
              <p>
                <strong>Approach:</strong> {result.methodology.demographicMix}
              </p>
              <p className="text-xs">
                {result.methodology.confidenceNote}
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/audience-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own audience test
            </Link>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed mt-6">
            AI-simulated research using peer-reviewed methodology. Results are
            directional and best used for hypothesis validation, not high-stakes
            business decisions.
          </p>
        </div>
      </main>
    </>
  );
}
