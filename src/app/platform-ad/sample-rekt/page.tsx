"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PlatformAdResult, PlatformSpecificMetrics } from "@/types/platform-ad";

const SAMPLE_RESULT: PlatformAdResult = {
  id: "sample-rekt",
  input: {
    platform: "amazon",
    brandName: "Rekt Energy + Focus Powder",
    targetAudience: "Health-conscious professionals, gamers, and fitness enthusiasts 18-38",
    adCopy: `Rekt Energy + Focus Powder, Cherry - Clean Energy, Zero Sugar, Zero Calories, 200mg Natural Caffeine, Nootropics, L-Theanine, Energy Drink Mix (30 Servings)

Key Features:
- Clean energy with 200mg natural caffeine from green tea
- Nootropic stack with L-Theanine for smooth, jitter-free focus
- Zero sugar, zero calories -- no crash, no compromise
- Mixes instantly in cold water, no blender needed
- Available in Cherry and Blue Raspberry

About: From the makers of Rekt Drinks, the flavoured sparkling water brand known for bold collaborations with X Games, OpenSea, and WorldStar. Rekt Energy + Focus Powder brings the same clean ingredient philosophy to a pre-workout and focus supplement. Each tub delivers 30 servings of nootropic-powered energy designed for gamers, professionals, and athletes who refuse to settle for sugar-loaded alternatives.`,
    url: "https://www.amazon.com/Rekt-Energy-Focus-Powder-Cherry/dp/B0GSGB13LJ",
  },
  platformLabel: "Amazon",
  attention: 66,
  clarity: 72,
  persuasion: 59,
  brandFit: 74,
  platformFit: 73,
  clickLikelihood: { yes: 34, maybe: 32, no: 34 },
  scrollStopPower: 52,
  purchaseIntent: 55,
  platformMetrics: {
    pricePerception: { overpriced: 16, fair: 56, bargain: 28 },
    buyBoxAppeal: 58,
    listingQuality: 68,
  },
  emotionalResponses: [
    { word: "curious", count: 12 },
    { word: "intrigued", count: 9 },
    { word: "skeptical", count: 8 },
    { word: "interested", count: 6 },
    { word: "indifferent", count: 5 },
    { word: "excited", count: 4 },
    { word: "confused", count: 3 },
  ],
  topStrengths: [
    "Zero sugar / zero calorie positioning directly addresses the #1 consumer complaint about energy drinks and powders in Amazon reviews",
    "200mg natural caffeine from green tea is a strong differentiator vs synthetic caffeine competitors like G Fuel and Sneak",
    "L-Theanine + nootropics stack signals a more sophisticated product -- appeals to ingredient-aware shoppers who compare supplement facts panels",
    "Brand crossover from Rekt Drinks (sparkling water with X Games, WorldStar collabs) gives credibility that this isn't another generic supplement brand",
    "Cherry and Blue Raspberry flavor options cover the two most popular powder flavor profiles on Amazon in this category",
  ],
  topWeaknesses: [
    "Brand name 'Rekt' reads as gaming/crypto slang -- older demographics (30+) and female shoppers may not connect with the positioning",
    "Listing title is keyword-stuffed and hard to scan -- 'Clean Energy, Zero Sugar, Zero Calories, 200mg Natural Caffeine, Nootropics, L-Theanine' is information overload",
    "No social proof in the listing -- missing review count callout, star rating highlight, or 'Amazon's Choice' badge context",
    "The listing doesn't explain what nootropics are -- shoppers unfamiliar with the term may skip the product entirely",
    "No clear comparison to competitors -- shoppers in this category actively compare Rekt vs G Fuel vs Celsius vs Ghost",
  ],
  platformTips: [
    "Front-load the product title with the primary benefit keyword: lead with 'Energy + Focus Powder' before brand name. Amazon's A9 algorithm weights the first 80 characters most heavily for search ranking.",
    "Add A+ Content (Brand Story + Enhanced Product Description) with a comparison chart: Rekt vs G Fuel vs Ghost vs Celsius on sugar content, caffeine source, calorie count, and price per serving. Comparison tables lift conversion 5-12% on Amazon supplement listings.",
    "Create a Subscribe & Save offer at 10-15% discount. Energy powder is a repeat-purchase category and Amazon's algorithm boosts Subscribe & Save listings in search results. Products with S&S see 25-40% higher reorder rates.",
    "Add a 'How To Use' infographic as image #4 or #5 showing scoop size, water ratio, and timing (pre-workout, morning focus, gaming session). Supplement listings with usage context images reduce return rates.",
    "Include a short video (30-60s) on the listing showing the powder mixing, the cherry color, and someone drinking it. Amazon listings with video see 9-15% higher conversion vs static images only.",
    "Target Sponsored Brand Ads for category keywords like 'clean energy powder', 'nootropic drink mix', and 'zero sugar pre workout'. Bid on competitor brand names (G Fuel, Ghost, Sneak) to capture comparison shoppers.",
    "Add 'Frequently Bought Together' bundle suggestions -- pair with a shaker bottle or Rekt Drinks sparkling water variety pack to increase average order value and cross-promote the drinks line.",
  ],
  verbatims: [
    { persona: "24yo male, Austin TX", quote: "I already buy Rekt sparkling water so I'd definitely try the powder. The cherry flavor is exactly what I'd pick." },
    { persona: "33yo female, Chicago IL", quote: "The listing throws too many buzzwords at me. Just tell me what it tastes like and if it actually works without the jitters." },
    { persona: "21yo male, Los Angeles CA", quote: "200mg caffeine with L-Theanine is the perfect stack. I'd switch from G Fuel for this if the reviews are decent." },
    { persona: "38yo female, Seattle WA", quote: "I don't know what 'nootropics' means and the brand name makes me think this is for teenage gamers, not someone like me." },
    { persona: "27yo male, Miami FL", quote: "At 30 servings this is way cheaper than buying energy drinks every day. I'd subscribe and save on this for sure." },
    { persona: "29yo female, Denver CO", quote: "I want to see the supplement facts panel and third-party testing results before I'd even consider adding this to cart." },
    { persona: "19yo male, Brooklyn NY", quote: "The X Games and WorldStar collabs make Rekt feel legit. Most energy powder brands feel like drop-shipping scams." },
    { persona: "35yo male, Nashville TN", quote: "Clean ingredients are great but the listing doesn't tell me how it actually tastes. Cherry could mean anything." },
  ],
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix: "Health-conscious professionals, gamers, and fitness enthusiasts 18-38 (80%) + general population (20%)",
    questionsAsked: 750,
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-13T10:15:00Z",
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
              <div className="flex rounded-full overflow-hidden h-8 text-xs font-medium">
                <div className="bg-emerald-500 text-white flex items-center justify-center overflow-hidden whitespace-nowrap" style={{ width: `${result.clickLikelihood.yes}%` }}>
                  {result.clickLikelihood.yes}% Yes
                </div>
                <div className="bg-amber-400 text-amber-900 flex items-center justify-center overflow-hidden whitespace-nowrap" style={{ width: `${result.clickLikelihood.maybe}%` }}>
                  {result.clickLikelihood.maybe}% Maybe
                </div>
                <div className="bg-red-400 text-white flex items-center justify-center overflow-hidden whitespace-nowrap" style={{ width: `${result.clickLikelihood.no}%` }}>
                  {result.clickLikelihood.no}% No
                </div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                <span>Yes: {result.clickLikelihood.yes}%</span>
                <span>Maybe: {result.clickLikelihood.maybe}%</span>
                <span>No: {result.clickLikelihood.no}%</span>
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

          {/* Amazon-Specific Insights */}
          {result.platformMetrics && (
            <Card className="mb-6 border-teal/30">
              <CardHeader>
                <CardTitle className="text-base">Amazon-Specific Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.platformMetrics.buyBoxAppeal !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">Buy Box Appeal</span>
                      <span className="text-muted-foreground">{result.platformMetrics.buyBoxAppeal}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${result.platformMetrics.buyBoxAppeal}%` }} />
                    </div>
                  </div>
                )}
                {result.platformMetrics.listingQuality !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">Listing Quality & Trust</span>
                      <span className="text-muted-foreground">{result.platformMetrics.listingQuality}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-teal h-2 rounded-full" style={{ width: `${result.platformMetrics.listingQuality}%` }} />
                    </div>
                  </div>
                )}
                {result.platformMetrics.pricePerception && (
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">Price Perception</p>
                    <div className="flex rounded-full overflow-hidden h-6 text-[10px] font-medium">
                      {result.platformMetrics.pricePerception.bargain > 0 && (
                        <div className="bg-emerald-500 text-white flex items-center justify-center" style={{ width: `${result.platformMetrics.pricePerception.bargain}%` }}>
                          {result.platformMetrics.pricePerception.bargain >= 12 ? `${result.platformMetrics.pricePerception.bargain}% Bargain` : ""}
                        </div>
                      )}
                      {result.platformMetrics.pricePerception.fair > 0 && (
                        <div className="bg-blue-400 text-white flex items-center justify-center" style={{ width: `${result.platformMetrics.pricePerception.fair}%` }}>
                          {result.platformMetrics.pricePerception.fair >= 10 ? `${result.platformMetrics.pricePerception.fair}% Fair` : ""}
                        </div>
                      )}
                      {result.platformMetrics.pricePerception.overpriced > 0 && (
                        <div className="bg-red-400 text-white flex items-center justify-center" style={{ width: `${result.platformMetrics.pricePerception.overpriced}%` }}>
                          {result.platformMetrics.pricePerception.overpriced >= 15 ? `${result.platformMetrics.pricePerception.overpriced}% Overpriced` : ""}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                      <span>Bargain: {result.platformMetrics.pricePerception.bargain}%</span>
                      <span>Fair: {result.platformMetrics.pricePerception.fair}%</span>
                      <span>Overpriced: {result.platformMetrics.pricePerception.overpriced}%</span>
                    </div>
                  </div>
                )}
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
