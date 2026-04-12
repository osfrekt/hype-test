"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CompetitiveResult } from "@/types/competitive";

const SAMPLE_RESULT: CompetitiveResult = {
  id: "sample-rekt",
  yours: {
    input: {
      productName: "Rekt Energy + Focus Powder",
      productDescription:
        "Energy and focus powder with 200mg natural caffeine, L-Theanine, and a nootropic blend. Zero sugar, zero calories, 30 servings per tub. Available in Blue Raspberry and Cherry.",
      category: "Health & Household",
      keyFeatures: [
        "200mg natural caffeine + L-Theanine",
        "Nootropic blend for sustained focus",
        "Zero sugar, zero calories, 30 servings/$30",
      ],
      priceRange: { min: 25, max: 35 },
      priceUnit: "per tub (30 servings)",
      targetMarket: "Gamers, athletes, and professionals who want clean energy and focus",
    },
    intentScore: 68,
    wtpMid: 30,
    featureAvg: 78,
    topPositive: "L-Theanine for smooth energy without jitters",
    topConcern: "Newer brand, less proven track record",
  },
  competitor: {
    input: {
      productName: "G Fuel Energy Formula",
      productDescription:
        "Powdered energy drink mix with 150mg caffeine, antioxidants, and focus complex. Available in 40+ flavors. Popular in gaming and esports communities.",
      category: "Health & Household",
      keyFeatures: [
        "150mg caffeine + focus complex",
        "40+ flavor varieties",
        "Official esports partnerships",
      ],
      priceRange: { min: 25, max: 36 },
      priceUnit: "per tub (40 servings)",
      targetMarket: "Gamers and esports enthusiasts 16-35",
    },
    intentScore: 62,
    wtpMid: 28,
    featureAvg: 72,
    topPositive: "Established brand with massive flavor selection",
    topConcern: "Artificial ingredients and food dyes",
  },
  radarData: [
    { dimension: "Purchase Intent", yours: 68, competitor: 62 },
    { dimension: "Perceived Value", yours: 72, competitor: 65 },
    { dimension: "Feature Appeal", yours: 80, competitor: 74 },
    { dimension: "Enthusiasm", yours: 70, competitor: 68 },
    { dimension: "Low Concern", yours: 55, competitor: 58 },
  ],
  winner: "yours",
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix:
      "Gamers, athletes, and professionals 18-38 (80%) + general population (20%)",
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

/* --- Extended sample data not in the CompetitiveResult type --- */

const STRENGTHS_YOURS = [
  "Clean-label formula with L-Theanine delivers smooth, jitter-free energy that appeals to health-conscious consumers",
  "Nootropic stack (Alpha-GPC, Lion's Mane) differentiates from caffeine-only competitors and justifies a premium",
  "Zero sugar, zero calorie positioning aligns with the dominant macro trend toward functional, guilt-free supplements",
];

const CONCERNS_YOURS = [
  "Limited to 2 flavors (Blue Raspberry, Cherry) -- variety seekers may churn to competitors with wider selections",
  "Newer brand with minimal social proof; consumers hesitate to switch from established names without reviews",
  "30-serving tub at $30 yields $1/serving, slightly above the psychological threshold for daily-use powders",
];

const STRENGTHS_COMPETITOR = [
  "40+ flavors create a collector/explorer dynamic that drives repeat purchases and social media content",
  "Deep esports partnerships (FaZe Clan, NRG, etc.) provide authentic credibility with the core gamer audience",
  "10-year brand tenure and 1M+ Amazon reviews provide strong social proof that lowers perceived purchase risk",
];

const CONCERNS_COMPETITOR = [
  "Artificial dyes (Red 40, Blue 1) and sucralose are increasingly scrutinised by health-conscious consumers",
  "150mg caffeine per serving is seen as underpowered by experienced users who have built tolerance",
  "Brand perception is shifting toward younger teens, alienating the 25-35 professional segment willing to pay more",
];

const VERBATIMS_YOURS = [
  {
    persona: "Male, 28, software engineer, daily energy drink user",
    quote:
      "The L-Theanine combo is what sold me. I've tried everything from Monster to Celsius and they all give me the shakes by 2pm. This actually let me code for four hours straight without the crash.",
  },
  {
    persona: "Female, 24, competitive gamer, health-conscious",
    quote:
      "I love that I can pronounce every ingredient. My only hang-up is that I've never heard of this brand -- I'd want to see some creator reviews before I commit to a full tub.",
  },
];

const VERBATIMS_COMPETITOR = [
  {
    persona: "Male, 22, college student, casual gamer",
    quote:
      "G Fuel is just what you grab when you're gaming. The flavors are insane and I trust it because literally every streamer I watch uses it. But yeah, I know the ingredient list isn't great.",
  },
  {
    persona: "Female, 31, crossfit athlete, supplement-savvy",
    quote:
      "I used G Fuel for years but switched away once I started reading labels more carefully. The artificial colors and sweeteners don't fit my routine anymore, and 150mg caffeine barely registers for me.",
  },
];

const KEY_INSIGHT =
  "Rekt holds a clear positioning advantage in the growing clean-label energy segment. Its nootropic stack and zero-sugar formula outperform G Fuel on Perceived Value (+7) and Feature Appeal (+6), the two dimensions most correlated with long-term brand switching in the category. However, G Fuel's edge in Low Concern (+3) reflects the trust premium that comes with brand tenure and massive social proof. Rekt's path to winning market share is not to out-flavor G Fuel, but to double down on the health-and-performance narrative that G Fuel cannot credibly claim. Securing creator partnerships and accumulating verified reviews should be the top priority to close the trust gap while the clean-label advantage is still differentiated.";

const WINNER_REASONING =
  "Rekt wins the composite score (69.0 vs 65.4) by leading in 4 of 5 dimensions. The largest gap is in Feature Appeal (+6), driven by the nootropic blend and clean-label positioning that resonates with health-conscious energy consumers. G Fuel's only advantage is Low Concern (+3), reflecting its established brand trust. At the stated price points, Rekt also delivers higher perceived value per serving despite a smaller tub size, because consumers weight ingredient quality over serving count.";

export default function SampleRektCompetitive() {
  const result = SAMPLE_RESULT;

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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-3">
              {result.yours.input.productName} vs{" "}
              {result.competitor.input.productName}
            </h1>
            <Badge variant="secondary" className="text-xs mb-4">
              {result.panelSize} shared respondents
            </Badge>
          </div>

          {/* Winner Banner */}
          <div className="rounded-xl border-2 px-6 py-4 text-center mb-8 bg-emerald-100 text-emerald-800 border-emerald-300">
            <p className="text-sm font-medium uppercase tracking-wider mb-1">
              Winner
            </p>
            <p className="text-2xl font-bold">
              {result.yours.input.productName}
            </p>
            <p className="text-sm mt-2 max-w-2xl mx-auto">
              {WINNER_REASONING}
            </p>
          </div>

          {/* Side-by-side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Your Product */}
            <Card className="border-emerald-300 ring-1 ring-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {result.yours.input.productName}
                  </CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                    Winner
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Your Product</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Purchase Intent
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {result.yours.intentScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      WTP
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${result.yours.wtpMid}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Top Positive
                  </p>
                  <p className="text-sm text-foreground">
                    {result.yours.topPositive}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Top Concern
                  </p>
                  <p className="text-sm text-foreground">
                    {result.yours.topConcern}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Competitor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {result.competitor.input.productName}
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">Competitor</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Purchase Intent
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {result.competitor.intentScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      WTP
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${result.competitor.wtpMid}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Top Positive
                  </p>
                  <p className="text-sm text-foreground">
                    {result.competitor.topPositive}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Top Concern
                  </p>
                  <p className="text-sm text-foreground">
                    {result.competitor.topConcern}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Data Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                How You Stack Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Dimension
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        {result.yours.input.productName}
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        {result.competitor.input.productName}
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        Advantage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.radarData.map((d) => {
                      const diff = d.yours - d.competitor;
                      return (
                        <tr
                          key={d.dimension}
                          className="border-b border-border/30"
                        >
                          <td className="py-3 px-4 font-medium">
                            {d.dimension}
                          </td>
                          <td className="py-3 px-4 text-center">{d.yours}</td>
                          <td className="py-3 px-4 text-center">
                            {d.competitor}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={
                                diff > 0
                                  ? "text-emerald-600 font-medium"
                                  : diff < 0
                                    ? "text-red-500 font-medium"
                                    : "text-muted-foreground"
                              }
                            >
                              {diff > 0 ? "+" : ""}
                              {diff}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Concerns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Rekt Strengths & Concerns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {result.yours.input.productName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
                    Top Strengths
                  </p>
                  <ul className="space-y-2">
                    {STRENGTHS_YOURS.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
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
                        <span className="text-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
                    Top Concerns
                  </p>
                  <ul className="space-y-2">
                    {CONCERNS_YOURS.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
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
                        <span className="text-foreground">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* G Fuel Strengths & Concerns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {result.competitor.input.productName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
                    Top Strengths
                  </p>
                  <ul className="space-y-2">
                    {STRENGTHS_COMPETITOR.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
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
                        <span className="text-foreground">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
                    Top Concerns
                  </p>
                  <ul className="space-y-2">
                    {CONCERNS_COMPETITOR.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
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
                        <span className="text-foreground">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Consumer Verbatims */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Consumer Verbatims
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">
                  {result.yours.input.productName}
                </p>
                <div className="space-y-4">
                  {VERBATIMS_YOURS.map((v, i) => (
                    <div
                      key={i}
                      className="border-l-2 border-emerald-300 pl-4"
                    >
                      <p className="text-sm text-foreground italic">
                        &ldquo;{v.quote}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        -- {v.persona}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">
                  {result.competitor.input.productName}
                </p>
                <div className="space-y-4">
                  {VERBATIMS_COMPETITOR.map((v, i) => (
                    <div key={i} className="border-l-2 border-red-300 pl-4">
                      <p className="text-sm text-foreground italic">
                        &ldquo;{v.quote}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        -- {v.persona}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Competitive Insight */}
          <Card className="mb-8 border-teal/20 bg-teal/5">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">
                Key Competitive Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">
                {KEY_INSIGHT}
              </p>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card className="mb-8 border-teal/20 bg-teal/5">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">
                Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Panel size:</strong>{" "}
                {result.methodology.panelSize} simulated consumers (shared
                panel)
              </p>
              <p>
                <strong>Demographic mix:</strong>{" "}
                {result.methodology.demographicMix}
              </p>
              <p>
                <strong>Scoring:</strong> Each dimension is scored 0-100 based
                on aggregated panel responses. Composite score is the
                unweighted average of all 5 dimensions.
              </p>
              <Separator className="my-3" />
              <p className="text-xs leading-relaxed">
                {result.methodology.confidenceNote}
              </p>
              <p className="text-xs leading-relaxed">
                This research uses methodology informed by Brand, Israeli &amp;
                Ngwe (2025), &ldquo;Using LLMs for Market Research,&rdquo;
                Harvard Business School Working Paper 23-062.
              </p>
              <p className="text-xs leading-relaxed font-medium">
                Important: These results are best used for directional insights.
                They should not replace primary consumer research for major
                business decisions.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/competitive/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own competitive teardown
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
