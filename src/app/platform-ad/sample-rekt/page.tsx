"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PlatformAdResult } from "@/types/platform-ad";

const SAMPLE_RESULT: PlatformAdResult = {
  id: "sample-rekt",
  input: {
    platform: "amazon",
    brandName: "Rekt Energy + Focus Powder",
    targetAudience: "Health-conscious professionals and gamers 18-38",
    adCopy: `Product: Rekt Energy + Focus Powder - Natural Caffeine & Nootropics
Price: $34.99 (30 servings)

Key Features:
- 200mg natural caffeine from green tea extract
- L-Theanine + Alpha-GPC for smooth, jitter-free focus
- Zero sugar, zero crash, zero artificial colors
- Mixes instantly in cold water - no blender needed
- NSF Certified for Sport

About: Clean energy powder designed for gamers, professionals, and athletes who want sustained focus without the crash of traditional energy drinks. Each tub contains 30 servings of science-backed nootropics and natural caffeine.`,
  },
  platformLabel: "Amazon",
  attention: 68,
  clarity: 74,
  persuasion: 62,
  brandFit: 71,
  platformFit: 76,
  clickLikelihood: { yes: 38, maybe: 30, no: 32 },
  scrollStopPower: 55,
  purchaseIntent: 58,
  emotionalResponses: [
    { word: "intrigued", count: 11 },
    { word: "curious", count: 9 },
    { word: "skeptical", count: 7 },
    { word: "interested", count: 6 },
    { word: "indifferent", count: 5 },
    { word: "excited", count: 4 },
  ],
  topStrengths: [
    "NSF Certified for Sport badge instantly builds credibility with fitness-oriented shoppers who check certifications",
    "Clear ingredient callouts (200mg caffeine, L-Theanine, Alpha-GPC) appeal to label-readers who compare supplements",
    "Zero sugar / zero crash messaging directly addresses the #1 complaint about energy drinks in Amazon reviews",
    "30 servings at $34.99 ($1.17/serving) is competitive with Monster and Red Bull on a per-serving basis",
    "Multiple use cases (gamers, professionals, athletes) broadens the consideration set for Amazon's recommendation engine",
  ],
  topWeaknesses: [
    "Bullet points lead with ingredients instead of benefits -- move 'zero crash energy' to the first bullet for scanners",
    "No social proof in the listing copy -- missing star rating callout, review count, or 'Amazon's Choice' context",
    "Brand name 'Rekt' may confuse older demographics who associate the word with negative connotations",
    "Listing reads like a supplement facts panel rather than a compelling product story -- needs more emotional hooks",
    "Missing comparison table or 'vs competitors' section that drives conversion on Amazon supplement listings",
  ],
  platformTips: [
    "Your bullet points focus on ingredients but don't lead with the benefit. Move 'zero crash energy' to the first bullet -- Amazon shoppers scan the first 2-3 words of each bullet.",
    "Add A+ Content with a comparison chart showing Rekt vs Red Bull vs G Fuel vs Celsius on sugar, caffeine source, and price per serving. Amazon shoppers convert 5-10% higher with comparison tables.",
    "Include a 'Subscribe & Save' callout in the description. Repeat-purchase supplements perform 30-40% better with subscription pricing on Amazon.",
    "Your product title should front-load the category keyword: 'Energy + Focus Powder' should come before the brand name for Amazon SEO.",
    "Add lifestyle images showing the product being used in gaming, office, and gym contexts. Amazon listings with 6+ images see significantly higher conversion rates.",
  ],
  verbatims: [
    { persona: "28yo male, Austin TX", quote: "The ingredients look legit but I'd need to see reviews before buying. Too many supplement brands overpromise on Amazon." },
    { persona: "34yo female, Chicago IL", quote: "I like that it's NSF certified -- that's the first thing I look for in supplements. But the brand name 'Rekt' feels very bro-culture." },
    { persona: "22yo male, Los Angeles CA", quote: "This is exactly what I've been looking for. Natural caffeine, no sugar, and it works for gaming sessions. I'd buy this." },
    { persona: "41yo female, Seattle WA", quote: "Too many supplements make these same claims. What makes this one different from Athletic Greens or Mudwater?" },
    { persona: "26yo male, Miami FL", quote: "The price is fair for 30 servings. I spend more than that on energy drinks in a week. I'd try it." },
    { persona: "31yo female, Denver CO", quote: "I'd want to see the supplement facts panel and third-party testing before adding to cart." },
  ],
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix: "Health-conscious professionals and gamers 18-38 (80%) + general population (20%)",
    questionsAsked: 600,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-11T14:30:00Z",
  status: "complete",
};

export default function SampleRektPlatformAd() {
  const result = SAMPLE_RESULT;

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
          {/* Sample badge */}
          <div className="mb-6">
            <Badge className="bg-muted text-muted-foreground text-xs">
              Sample report
            </Badge>
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
              {result.platformLabel} listing tested with {result.panelSize} simulated consumers
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
                <div className="bg-emerald-500 text-white flex items-center justify-center" style={{ width: `${result.clickLikelihood.yes}%` }}>
                  {result.clickLikelihood.yes}% Yes
                </div>
                <div className="bg-amber-400 text-amber-900 flex items-center justify-center" style={{ width: `${result.clickLikelihood.maybe}%` }}>
                  {result.clickLikelihood.maybe}% Maybe
                </div>
                <div className="bg-red-400 text-white flex items-center justify-center" style={{ width: `${result.clickLikelihood.no}%` }}>
                  {result.clickLikelihood.no}% No
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Intent */}
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
                    <p className="text-xs text-muted-foreground mt-1">Moderate purchase intent -- listing may need optimization</p>
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
          </div>

          {/* Platform-specific tips */}
          <Card className="mb-6 border-teal/30 bg-teal/5">
            <CardHeader>
              <CardTitle className="text-base text-primary">
                Amazon Optimization Tips
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

          {/* Verbatims */}
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

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/platform-ad/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own platform ad analysis
            </Link>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed mt-6 text-center">
            AI-simulated research using peer-reviewed methodology. Results are directional and best used for hypothesis validation, not high-stakes business decisions.
          </p>
        </div>
      </main>
    </>
  );
}
