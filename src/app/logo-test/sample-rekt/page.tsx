"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { LogoTestResult, LogoOptionResult } from "@/types/logo-test";

const SAMPLE_RESULT: LogoTestResult = {
  id: "sample-rekt",
  input: {
    brandName: "Rekt Energy",
    category: "health & wellness",
    targetAudience: "Health-conscious professionals and gamers 18-38",
    brandDescription: "A bold energy drink brand targeting gamers and fitness enthusiasts with clean ingredients.",
    logos: [
      {
        name: "Bold Angular",
        description: "The word 'REKT' in a heavy, angular sans-serif typeface. Electric yellow text on black background. The 'E' is replaced with a stylized lightning bolt.",
        colorPalette: "Black, electric yellow",
        styleTags: "bold, edgy, gaming",
      },
      {
        name: "Clean Minimalist",
        description: "Lowercase 'rekt' in a clean geometric sans-serif. All black on white. Small green dot above the 'i' (if there was one). Very Apple-like minimal.",
        colorPalette: "Black, white, green accent",
        styleTags: "minimal, clean, premium",
      },
      {
        name: "Mascot",
        description: "A cartoon skull wearing sunglasses and headphones, with 'REKT' written below in graffiti-style font. Neon green and purple color scheme.",
        colorPalette: "Neon green, purple, black",
        styleTags: "playful, streetwear, youth",
      },
    ],
  },
  results: [
    {
      logo: {
        name: "Bold Angular",
        description: "The word 'REKT' in a heavy, angular sans-serif typeface. Electric yellow text on black background. The 'E' is replaced with a stylized lightning bolt.",
        colorPalette: "Black, electric yellow",
        styleTags: "bold, edgy, gaming",
      },
      firstImpression: {
        score: 76,
        distribution: [
          { label: "1 - Very low", count: 1 },
          { label: "2 - Low", count: 3 },
          { label: "3 - Neutral", count: 5 },
          { label: "4 - High", count: 12 },
          { label: "5 - Very high", count: 9 },
        ],
      },
      memorability: {
        score: 82,
        distribution: [
          { label: "1 - Very low", count: 0 },
          { label: "2 - Low", count: 2 },
          { label: "3 - Neutral", count: 4 },
          { label: "4 - High", count: 11 },
          { label: "5 - Very high", count: 13 },
        ],
      },
      brandFit: {
        score: 78,
        distribution: [
          { label: "1 - Very low", count: 1 },
          { label: "2 - Low", count: 2 },
          { label: "3 - Neutral", count: 5 },
          { label: "4 - High", count: 13 },
          { label: "5 - Very high", count: 9 },
        ],
      },
      distinctiveness: {
        score: 74,
        distribution: [
          { label: "1 - Very low", count: 1 },
          { label: "2 - Low", count: 3 },
          { label: "3 - Neutral", count: 7 },
          { label: "4 - High", count: 11 },
          { label: "5 - Very high", count: 8 },
        ],
      },
      trust: {
        score: 62,
        distribution: [
          { label: "1 - Very low", count: 2 },
          { label: "2 - Low", count: 5 },
          { label: "3 - Neutral", count: 8 },
          { label: "4 - High", count: 10 },
          { label: "5 - Very high", count: 5 },
        ],
      },
      overallScore: 74,
      reactions: [
        { word: "bold", count: 8 },
        { word: "energetic", count: 6 },
        { word: "loud", count: 4 },
        { word: "gaming", count: 3 },
        { word: "striking", count: 3 },
      ],
      industryGuesses: [
        { industry: "Energy drinks", count: 12 },
        { industry: "Gaming", count: 9 },
        { industry: "Esports", count: 5 },
      ],
      engageLikelihood: { yes: 48, maybe: 28, no: 24 },
      rank: 1,
    },
    {
      logo: {
        name: "Mascot",
        description: "A cartoon skull wearing sunglasses and headphones, with 'REKT' written below in graffiti-style font. Neon green and purple color scheme.",
        colorPalette: "Neon green, purple, black",
        styleTags: "playful, streetwear, youth",
      },
      firstImpression: {
        score: 68,
        distribution: [
          { label: "1 - Very low", count: 2 },
          { label: "2 - Low", count: 4 },
          { label: "3 - Neutral", count: 7 },
          { label: "4 - High", count: 10 },
          { label: "5 - Very high", count: 7 },
        ],
      },
      memorability: {
        score: 86,
        distribution: [
          { label: "1 - Very low", count: 0 },
          { label: "2 - Low", count: 1 },
          { label: "3 - Neutral", count: 3 },
          { label: "4 - High", count: 10 },
          { label: "5 - Very high", count: 16 },
        ],
      },
      brandFit: {
        score: 70,
        distribution: [
          { label: "1 - Very low", count: 2 },
          { label: "2 - Low", count: 3 },
          { label: "3 - Neutral", count: 6 },
          { label: "4 - High", count: 12 },
          { label: "5 - Very high", count: 7 },
        ],
      },
      distinctiveness: {
        score: 80,
        distribution: [
          { label: "1 - Very low", count: 1 },
          { label: "2 - Low", count: 2 },
          { label: "3 - Neutral", count: 4 },
          { label: "4 - High", count: 11 },
          { label: "5 - Very high", count: 12 },
        ],
      },
      trust: {
        score: 44,
        distribution: [
          { label: "1 - Very low", count: 5 },
          { label: "2 - Low", count: 8 },
          { label: "3 - Neutral", count: 9 },
          { label: "4 - High", count: 5 },
          { label: "5 - Very high", count: 3 },
        ],
      },
      overallScore: 70,
      reactions: [
        { word: "fun", count: 7 },
        { word: "childish", count: 5 },
        { word: "memorable", count: 4 },
        { word: "loud", count: 3 },
        { word: "gamer", count: 3 },
      ],
      industryGuesses: [
        { industry: "Gaming", count: 14 },
        { industry: "Streetwear", count: 7 },
        { industry: "Energy drinks", count: 5 },
      ],
      engageLikelihood: { yes: 40, maybe: 30, no: 30 },
      rank: 2,
    },
    {
      logo: {
        name: "Clean Minimalist",
        description: "Lowercase 'rekt' in a clean geometric sans-serif. All black on white. Small green dot above the 'i' (if there was one). Very Apple-like minimal.",
        colorPalette: "Black, white, green accent",
        styleTags: "minimal, clean, premium",
      },
      firstImpression: {
        score: 72,
        distribution: [
          { label: "1 - Very low", count: 1 },
          { label: "2 - Low", count: 3 },
          { label: "3 - Neutral", count: 6 },
          { label: "4 - High", count: 12 },
          { label: "5 - Very high", count: 8 },
        ],
      },
      memorability: {
        score: 58,
        distribution: [
          { label: "1 - Very low", count: 2 },
          { label: "2 - Low", count: 6 },
          { label: "3 - Neutral", count: 9 },
          { label: "4 - High", count: 8 },
          { label: "5 - Very high", count: 5 },
        ],
      },
      brandFit: {
        score: 54,
        distribution: [
          { label: "1 - Very low", count: 3 },
          { label: "2 - Low", count: 6 },
          { label: "3 - Neutral", count: 8 },
          { label: "4 - High", count: 9 },
          { label: "5 - Very high", count: 4 },
        ],
      },
      distinctiveness: {
        score: 48,
        distribution: [
          { label: "1 - Very low", count: 4 },
          { label: "2 - Low", count: 7 },
          { label: "3 - Neutral", count: 9 },
          { label: "4 - High", count: 7 },
          { label: "5 - Very high", count: 3 },
        ],
      },
      trust: {
        score: 78,
        distribution: [
          { label: "1 - Very low", count: 1 },
          { label: "2 - Low", count: 2 },
          { label: "3 - Neutral", count: 5 },
          { label: "4 - High", count: 13 },
          { label: "5 - Very high", count: 9 },
        ],
      },
      overallScore: 62,
      reactions: [
        { word: "clean", count: 8 },
        { word: "generic", count: 5 },
        { word: "professional", count: 4 },
        { word: "boring", count: 3 },
        { word: "safe", count: 3 },
      ],
      industryGuesses: [
        { industry: "Tech", count: 11 },
        { industry: "Finance", count: 8 },
        { industry: "SaaS", count: 6 },
      ],
      engageLikelihood: { yes: 34, maybe: 32, no: 34 },
      rank: 3,
    },
  ],
  winner: "Bold Angular",
  panelSize: 30,
  methodology: {
    panelSize: 30,
    demographicMix:
      "Health-conscious professionals and gamers 18-38 (80%) + general population (20%)",
    questionsAsked: 720,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. All logos were tested against the same panel for fair comparison. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

const LOGO_COLORS = ["bg-teal", "bg-cyan-500", "bg-violet-500"];

function DistributionBar({ distribution, panelSize }: { distribution: { label: string; count: number }[]; panelSize: number }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {distribution.map((d, i) => {
        const pct = panelSize > 0 ? (d.count / panelSize) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className="w-full bg-teal/60 rounded-sm min-h-[2px]"
              style={{ height: `${Math.max(2, pct * 0.8)}px` }}
              title={`${d.label}: ${d.count} (${Math.round(pct)}%)`}
            />
            <span className="text-[8px] text-muted-foreground leading-none">{d.count}</span>
          </div>
        );
      })}
    </div>
  );
}

const LOGO_IMAGES: Record<string, { light: string; dark?: string }> = {
  "Bold Angular": { light: "/brands/rekt-black.svg", dark: "/brands/rekt-yellow.svg" },
  "Clean Minimalist": { light: "/brands/rekt-logo-b-minimal.svg" },
  "Mascot": { light: "/brands/rekt-logo-c-mascot.svg" },
};

function LogoCard({
  logoResult,
  isWinner,
  panelSize,
}: {
  logoResult: LogoOptionResult;
  isWinner: boolean;
  panelSize: number;
}) {
  const metrics = [
    { label: "First Impression", data: logoResult.firstImpression },
    { label: "Memorability", data: logoResult.memorability },
    { label: "Brand Fit", data: logoResult.brandFit },
    { label: "Distinctiveness", data: logoResult.distinctiveness },
    { label: "Trust", data: logoResult.trust },
  ];

  const logoImg = LOGO_IMAGES[logoResult.logo.name];

  return (
    <Card className={isWinner ? "ring-2 ring-teal" : ""}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            #{logoResult.rank} {logoResult.logo.name}
          </CardTitle>
          {isWinner && (
            <Badge className="bg-teal text-white text-[10px]">Winner</Badge>
          )}
          <span className="ml-auto text-2xl font-bold text-primary">{logoResult.overallScore}%</span>
        </div>
        {/* Logo image preview */}
        {logoImg && (
          <div className="my-3 flex justify-center">
            <div className="bg-muted/50 rounded-xl p-4 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoImg.light}
                alt={logoResult.logo.name}
                className={`h-12 object-contain dark:hidden`}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoImg.dark || logoImg.light}
                alt={logoResult.logo.name}
                className={`h-12 object-contain hidden dark:block`}
              />
            </div>
          </div>
        )}
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
        {/* Score metrics with bars and distributions */}
        <div className="space-y-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{m.label}</p>
                <p className="text-sm font-bold text-primary">{m.data.score}%</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div className="bg-teal h-2 rounded-full" style={{ width: `${m.data.score}%` }} />
              </div>
              {/* Distribution histogram */}
              <div className="px-1">
                <DistributionBar distribution={m.data.distribution} panelSize={panelSize} />
                <div className="flex gap-0.5 mt-0.5">
                  {["1", "2", "3", "4", "5"].map((n) => (
                    <span key={n} className="flex-1 text-center text-[7px] text-muted-foreground/60">{n}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Engagement likelihood */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Would Engage</p>
          <div className="flex rounded-full overflow-hidden h-6 text-[10px] font-medium">
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
          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span>Yes: {logoResult.engageLikelihood.yes}%</span>
            <span>Maybe: {logoResult.engageLikelihood.maybe}%</span>
            <span>No: {logoResult.engageLikelihood.no}%</span>
          </div>
        </div>

        <Separator />

        {/* One-word reactions */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Top 5 One-Word Reactions</p>
          <div className="space-y-1.5">
            {logoResult.reactions.slice(0, 5).map((r) => {
              const maxCount = logoResult.reactions[0]?.count ?? 1;
              return (
                <div key={r.word} className="flex items-center gap-2">
                  <span className="text-xs text-foreground w-24 shrink-0 capitalize">{r.word}</span>
                  <div className="flex-1 bg-muted rounded-full h-2.5">
                    <div
                      className="bg-teal/70 h-2.5 rounded-full"
                      style={{ width: `${(r.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-right">{r.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Industry guesses */}
        {logoResult.industryGuesses.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Top 3 Industry Guesses</p>
            <div className="space-y-1.5">
              {logoResult.industryGuesses.slice(0, 3).map((g, i) => {
                const maxCount = logoResult.industryGuesses[0]?.count ?? 1;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-foreground w-28 shrink-0">{g.industry}</span>
                    <div className="flex-1 bg-muted rounded-full h-2.5">
                      <div
                        className="bg-cyan-500/70 h-2.5 rounded-full"
                        style={{ width: `${(g.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{g.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SampleRektLogoTest() {
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {result.input.brandName} | Logo Test
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.panelSize} respondents
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              3 logos tested with simulated consumer panel
            </p>
            {result.input.brandDescription && (
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Brand:</span> {result.input.brandDescription}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-0.5">
              <span className="font-medium">Category:</span> {result.input.category} | <span className="font-medium">Audience:</span> {result.input.targetAudience}
            </p>
          </div>

          {/* Visual Logo Comparison */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-primary mb-4">Logos tested</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.results.map((lr) => {
                const img = LOGO_IMAGES[lr.logo.name];
                return (
                  <div
                    key={lr.logo.name}
                    className={`bg-card rounded-xl border p-6 text-center ${
                      lr.rank === 1 ? "border-teal ring-2 ring-teal/30" : "border-border"
                    }`}
                  >
                    <div className="h-16 flex items-center justify-center mb-3">
                      {img && (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.light} alt={lr.logo.name} className="h-14 object-contain dark:hidden" />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.dark || img.light} alt={lr.logo.name} className="h-14 object-contain hidden dark:block" />
                        </>
                      )}
                    </div>
                    <p className="text-sm font-bold text-primary">{lr.logo.name}</p>
                    <p className="text-2xl font-bold text-primary mt-1">{lr.overallScore}%</p>
                    <p className="text-[10px] text-muted-foreground">overall score</p>
                    {lr.rank === 1 && (
                      <span className="inline-block mt-2 text-[10px] bg-teal text-white px-2 py-0.5 rounded-full font-medium">Winner</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Winner Banner */}
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

          {/* Overall comparison */}
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
                          className={`h-4 rounded-full transition-all ${LOGO_COLORS[idx] ?? "bg-teal"}`}
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

          {/* Engagement Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Engagement Likelihood Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.results.map((lr, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-muted-foreground font-medium mb-1.5">{lr.logo.name}</p>
                    <div className="flex rounded-full overflow-hidden h-5 text-[10px] font-medium">
                      {lr.engageLikelihood.yes > 0 && (
                        <div
                          className="bg-emerald-500 text-white flex items-center justify-center"
                          style={{ width: `${lr.engageLikelihood.yes}%` }}
                        >
                          {lr.engageLikelihood.yes}%
                        </div>
                      )}
                      {lr.engageLikelihood.maybe > 0 && (
                        <div
                          className="bg-amber-400 text-amber-900 flex items-center justify-center"
                          style={{ width: `${lr.engageLikelihood.maybe}%` }}
                        >
                          {lr.engageLikelihood.maybe}%
                        </div>
                      )}
                      {lr.engageLikelihood.no > 0 && (
                        <div
                          className="bg-red-400 text-white flex items-center justify-center"
                          style={{ width: `${lr.engageLikelihood.no}%` }}
                        >
                          {lr.engageLikelihood.no}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Yes</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Maybe</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> No</span>
              </div>
            </CardContent>
          </Card>

          {/* Logo cards (detailed per-logo) */}
          <div className="space-y-6 mb-8">
            {result.results.map((lr, idx) => (
              <LogoCard
                key={idx}
                logoResult={lr}
                isWinner={lr.rank === 1}
                panelSize={result.panelSize}
              />
            ))}
          </div>

          {/* Head-to-head metric comparison */}
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
                                className={`h-3 rounded-full transition-all ${LOGO_COLORS[idx] ?? "bg-teal"}`}
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

          {/* Reactions Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reactions Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.results.map((lr, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium text-primary mb-3">{lr.logo.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lr.reactions.slice(0, 5).map((r) => (
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industry Guesses Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Industry Associations Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.results.map((lr, idx) => (
                  <div key={idx}>
                    <p className="text-sm font-medium text-primary mb-3">{lr.logo.name}</p>
                    <ul className="space-y-1.5">
                      {lr.industryGuesses.slice(0, 3).map((g, i) => (
                        <li key={i} className="text-xs text-foreground flex items-center gap-1.5">
                          <span className={`shrink-0 ${idx === 0 ? "text-teal" : idx === 1 ? "text-cyan-500" : "text-violet-500"}`}>&bull;</span>
                          {g.industry}
                          <span className="text-muted-foreground">({g.count}/{result.panelSize})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/logo-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own logo test
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
