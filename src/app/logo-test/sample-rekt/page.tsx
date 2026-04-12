"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function LogoCard({
  logoResult,
  isWinner,
}: {
  logoResult: LogoOptionResult;
  isWinner: boolean;
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
            #{logoResult.rank} {logoResult.logo.name}
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
                {result.input.brandName} &mdash; Logo Test
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.panelSize} respondents
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              3 logos tested with simulated consumer panel
            </p>
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

          {/* Logo cards */}
          <div className="space-y-6 mb-8">
            {result.results.map((lr, idx) => (
              <LogoCard
                key={idx}
                logoResult={lr}
                isWinner={lr.rank === 1}
              />
            ))}
          </div>

          {/* Metric comparison */}
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
                                className={`h-3 rounded-full transition-all ${idx === 0 ? "bg-teal" : idx === 1 ? "bg-cyan-500" : "bg-violet-500"}`}
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
