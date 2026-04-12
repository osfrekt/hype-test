"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdTestResult, AdCreativeResult } from "@/types/ad-test";

const SAMPLE_RESULT: AdTestResult = {
  id: "sample-rekt",
  input: {
    brandName: "Rekt Energy",
    category: "health & wellness",
    targetAudience: "Health-conscious professionals and gamers 18-38",
    creatives: [
      {
        name: "Clean Energy. No Crash.",
        adCopy:
          "200mg natural caffeine. L-Theanine for smooth focus. Zero sugar. Zero crash. Rekt Energy + Focus Powder. Game harder, work sharper, train longer.",
      },
      {
        name: "Your Brain Called. It Wants Better Fuel.",
        adCopy:
          "Stop poisoning your focus with sugar-loaded energy drinks. Rekt Energy + Focus: nootropics, natural caffeine, zero junk. Your brain deserves better.",
      },
    ],
    mode: "ab",
  },
  results: [
    {
      creative: {
        name: "Clean Energy. No Crash.",
        adCopy:
          "200mg natural caffeine. L-Theanine for smooth focus. Zero sugar. Zero crash. Rekt Energy + Focus Powder. Game harder, work sharper, train longer.",
      },
      attention: {
        score: 72,
        distribution: [
          { label: "1 - Very low", count: 2 },
          { label: "2 - Low", count: 5 },
          { label: "3 - Neutral", count: 10 },
          { label: "4 - High", count: 20 },
          { label: "5 - Very high", count: 13 },
        ],
      },
      clarity: {
        score: 78,
        distribution: [
          { label: "1 - Very low", count: 1 },
          { label: "2 - Low", count: 3 },
          { label: "3 - Neutral", count: 8 },
          { label: "4 - High", count: 22 },
          { label: "5 - Very high", count: 16 },
        ],
      },
      persuasion: {
        score: 65,
        distribution: [
          { label: "1 - Very low", count: 3 },
          { label: "2 - Low", count: 7 },
          { label: "3 - Neutral", count: 12 },
          { label: "4 - High", count: 18 },
          { label: "5 - Very high", count: 10 },
        ],
      },
      brandFit: {
        score: 70,
        distribution: [
          { label: "1 - Very low", count: 2 },
          { label: "2 - Low", count: 5 },
          { label: "3 - Neutral", count: 11 },
          { label: "4 - High", count: 19 },
          { label: "5 - Very high", count: 13 },
        ],
      },
      clickLikelihood: { yes: 42, maybe: 28, no: 30 },
      emotionalResponses: [
        { word: "intrigued", count: 12 },
        { word: "curious", count: 9 },
        { word: "energised", count: 7 },
        { word: "interested", count: 6 },
        { word: "skeptical", count: 5 },
      ],
      topStrengths: [
        "Clear, specific claims about caffeine and L-Theanine build credibility",
        "Zero sugar/zero crash message appeals to health-conscious consumers",
        "Multiple use cases (gaming, work, training) broadens audience",
        "Straightforward and easy to understand at a glance",
        "Natural caffeine positioning differentiates from competitors",
      ],
      topWeaknesses: [
        "Functional messaging may feel clinical rather than exciting",
        "No emotional hook to build brand connection",
        "Could be any supplement brand without stronger identity",
      ],
      keyTakeaways: [
        "This is a clean energy product that promises focus without the crash",
        "A caffeine supplement with nootropics for productivity",
        "An alternative to sugary energy drinks for active people",
      ],
    },
    {
      creative: {
        name: "Your Brain Called. It Wants Better Fuel.",
        adCopy:
          "Stop poisoning your focus with sugar-loaded energy drinks. Rekt Energy + Focus: nootropics, natural caffeine, zero junk. Your brain deserves better.",
      },
      attention: {
        score: 68,
        distribution: [
          { label: "1 - Very low", count: 3 },
          { label: "2 - Low", count: 6 },
          { label: "3 - Neutral", count: 11 },
          { label: "4 - High", count: 18 },
          { label: "5 - Very high", count: 12 },
        ],
      },
      clarity: {
        score: 62,
        distribution: [
          { label: "1 - Very low", count: 4 },
          { label: "2 - Low", count: 8 },
          { label: "3 - Neutral", count: 13 },
          { label: "4 - High", count: 16 },
          { label: "5 - Very high", count: 9 },
        ],
      },
      persuasion: {
        score: 70,
        distribution: [
          { label: "1 - Very low", count: 2 },
          { label: "2 - Low", count: 5 },
          { label: "3 - Neutral", count: 10 },
          { label: "4 - High", count: 19 },
          { label: "5 - Very high", count: 14 },
        ],
      },
      brandFit: {
        score: 64,
        distribution: [
          { label: "1 - Very low", count: 3 },
          { label: "2 - Low", count: 7 },
          { label: "3 - Neutral", count: 13 },
          { label: "4 - High", count: 17 },
          { label: "5 - Very high", count: 10 },
        ],
      },
      clickLikelihood: { yes: 38, maybe: 25, no: 37 },
      emotionalResponses: [
        { word: "provoked", count: 11 },
        { word: "curious", count: 8 },
        { word: "skeptical", count: 7 },
        { word: "amused", count: 5 },
        { word: "defensive", count: 4 },
      ],
      topStrengths: [
        "Strong emotional hook grabs attention immediately",
        "Provocative tone creates memorable brand voice",
        "Clearly positions against sugar-loaded competitors",
        "Appeals to intelligence and self-improvement",
      ],
      topWeaknesses: [
        "Confrontational tone may alienate some consumers",
        "Shaming language could feel preachy or judgemental",
        "Less specific about what the product actually contains",
        "May not work well for consumers who already drink energy drinks",
      ],
      keyTakeaways: [
        "This brand is telling me my current energy drink is bad for me",
        "A healthier energy option that is trying to shame competitors",
        "A bold brand that thinks it is smarter than the alternatives",
      ],
    },
  ],
  winner: "A",
  winMargin: 4,
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix:
      "Health-conscious professionals and gamers 18-38 (80%) + general population (20%)",
    questionsAsked: 900,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Both creatives were tested against the same panel for fair comparison. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

function CreativeCard({
  label,
  creative,
  isWinner,
}: {
  label: string;
  creative: AdCreativeResult;
  isWinner: boolean;
}) {
  const metrics = [
    { label: "Attention", data: creative.attention },
    { label: "Clarity", data: creative.clarity },
    { label: "Persuasion", data: creative.persuasion },
    { label: "Brand Fit", data: creative.brandFit },
  ];

  return (
    <Card className={isWinner ? "ring-2 ring-teal" : ""}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{label}: {creative.creative.name}</CardTitle>
          {isWinner && (
            <Badge className="bg-teal text-white text-[10px]">Winner</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{creative.creative.adCopy}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Score metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-primary">{m.data.score}%</p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div className="bg-teal h-1.5 rounded-full" style={{ width: `${m.data.score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Click likelihood */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Click Likelihood</p>
          <div className="flex rounded-full overflow-hidden h-5 text-[10px] font-medium">
            {creative.clickLikelihood.yes > 0 && (
              <div
                className="bg-emerald-500 text-white flex items-center justify-center"
                style={{ width: `${creative.clickLikelihood.yes}%` }}
              >
                {creative.clickLikelihood.yes}% Yes
              </div>
            )}
            {creative.clickLikelihood.maybe > 0 && (
              <div
                className="bg-amber-400 text-amber-900 flex items-center justify-center"
                style={{ width: `${creative.clickLikelihood.maybe}%` }}
              >
                {creative.clickLikelihood.maybe}% Maybe
              </div>
            )}
            {creative.clickLikelihood.no > 0 && (
              <div
                className="bg-red-400 text-white flex items-center justify-center"
                style={{ width: `${creative.clickLikelihood.no}%` }}
              >
                {creative.clickLikelihood.no}% No
              </div>
            )}
          </div>
        </div>

        {/* Emotional responses */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Emotional Responses</p>
          <div className="flex flex-wrap gap-1.5">
            {creative.emotionalResponses.map((e) => (
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
        </div>

        {/* Strengths */}
        {creative.topStrengths.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Strengths</p>
            <ul className="space-y-1">
              {creative.topStrengths.map((s, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {creative.topWeaknesses.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Weaknesses</p>
            <ul className="space-y-1">
              {creative.topWeaknesses.map((w, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5 shrink-0">-</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key takeaways */}
        {creative.keyTakeaways.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Key Takeaways</p>
            <ul className="space-y-1">
              {creative.keyTakeaways.map((t, i) => (
                <li key={i} className="text-xs text-muted-foreground">&ldquo;{t}&rdquo;</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SampleRektAdTest() {
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
                {result.input.brandName} &mdash; Ad Test
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.panelSize} respondents
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              A/B creative test with simulated consumer panel
            </p>
          </div>

          {/* Winner Banner */}
          <Card className="mb-8 bg-primary text-primary-foreground border-primary">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-lg font-bold mb-1">
                {result.results[0].creative.name} wins
              </p>
              <p className="text-sm text-primary-foreground/70">
                {result.winMargin}pt margin on overall score (attention + clarity + persuasion + brand fit)
              </p>
            </CardContent>
          </Card>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CreativeCard
              label="Creative A"
              creative={result.results[0]}
              isWinner={result.winner === "A"}
            />
            <CreativeCard
              label="Creative B"
              creative={result.results[1]}
              isWinner={result.winner === "B"}
            />
          </div>

          {/* Head-to-Head Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Head-to-Head Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(["attention", "clarity", "persuasion", "brandFit"] as const).map((metric) => {
                  const labelMap = { attention: "Attention", clarity: "Clarity", persuasion: "Persuasion", brandFit: "Brand Fit" };
                  const valA = result.results[0][metric].score;
                  const valB = result.results[1][metric].score;
                  const max = Math.max(valA, valB, 1);
                  return (
                    <div key={metric}>
                      <p className="text-sm font-medium text-primary mb-3">{labelMap[metric]}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{result.results[0].creative.name}</span>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div className="bg-teal h-3 rounded-full transition-all" style={{ width: `${(valA / max) * 100}%` }} />
                          </div>
                          <span className="text-sm font-medium text-primary w-12 text-right">{valA}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{result.results[1].creative.name}</span>
                          <div className="flex-1 bg-muted rounded-full h-3">
                            <div className="bg-cyan-500 h-3 rounded-full transition-all" style={{ width: `${(valB / max) * 100}%` }} />
                          </div>
                          <span className="text-sm font-medium text-primary w-12 text-right">{valB}%</span>
                        </div>
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
              href="/ad-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own ad test
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
