"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MarketResearchResult } from "@/types/market-research";

const SAMPLE_RESULT: MarketResearchResult = {
  id: "sample-rekt",
  input: {
    category: "Energy + Focus Supplements",
    geography: "US",
    questions: "What are consumers looking for that doesn't exist yet? What's driving purchase decisions? What price points work?",
  },
  marketOverview: "The US energy and focus supplement market has experienced explosive growth over the past five years, driven by a cultural shift toward functional beverages and cognitive enhancement. The category has expanded beyond traditional energy drinks to include powders, gummies, shots, and nootropic stacks. Consumers are increasingly health-conscious, rejecting high-sugar formulations in favor of clean-label, science-backed alternatives.\n\nThe market is bifurcating into two distinct segments: performance-focused products targeting athletes and gamers, and everyday productivity products targeting professionals and students. This split is creating opportunities for brands that can straddle both segments with a unified clean-label positioning.\n\nDTC and Amazon channels have become the primary battleground, with brands like Celsius, Ghost, and LMNT proving that category insurgents can capture significant market share from legacy players like Red Bull and Monster through digital-first strategies and community-driven marketing.",
  marketSize: "The US energy drink and supplement market is estimated at $21.1 billion in 2025, growing at approximately 8.2% CAGR. The functional powder/stick pack subsegment is estimated at $3.4 billion, growing at 14-16% CAGR, making it the fastest-growing format in the category. The nootropic/cognitive focus subsegment adds approximately $2.8 billion, with projected growth of 12% CAGR through 2028.",
  keyTrends: [
    "Clean-label demand: 67% of energy consumers say they actively check ingredient labels, up from 42% in 2021. Sugar-free, natural caffeine, and transparent dosing are now table stakes.",
    "Nootropic stacking: Consumers are combining caffeine with L-theanine, alpha-GPC, and citicoline for 'calm focus' rather than pure stimulation. This functional stacking trend is moving from biohacker niche to mainstream.",
    "Format diversification: Stick packs are growing 3x faster than cans. Consumers want portability, lower per-serving cost, and the ability to control dosing by mixing into their own water.",
    "Gaming and esports crossover: The gaming demographic (18-34, predominantly male, high supplement spend) is emerging as a key growth driver, with brands like Ghost and G Fuel capturing this audience through streamer partnerships.",
    "Subscription models: 40% of DTC supplement purchases are now subscription-based. Brands that nail the subscription experience see 3-4x higher LTV than one-time purchasers.",
    "Transparency and third-party testing: NSF, Informed Sport, and USP certifications are becoming purchase drivers, particularly among fitness-focused consumers who want reassurance about banned substance testing.",
    "Caffeine moderation: A growing segment wants moderate caffeine (100-200mg) rather than extreme doses (300mg+). This 'just enough' positioning appeals to daily users who want to avoid tolerance buildup.",
    "Women's health positioning: The energy supplement market has historically skewed male. Brands repositioning with inclusive marketing and addressing women-specific needs (hormonal energy fluctuations, pregnancy-safe options) are finding underserved demand.",
  ],
  consumerInsights: [
    "Price sensitivity is lower than expected: Consumers report willingness to pay 20-30% more for clean-label energy vs. traditional options, but only when ingredient quality is clearly communicated.",
    "The 'afternoon slump' is the #1 usage occasion, surpassing pre-workout. 58% of energy supplement users say 2-4 PM is their primary consumption window.",
    "Taste is the #1 purchase barrier for powders. Consumers who try a product with poor taste have only a 12% repurchase rate regardless of efficacy.",
    "Brand trust is built through education, not advertising. Consumers rank ingredient explainers, dosage transparency, and founder stories above celebrity endorsements.",
    "Bundling drives trial: Consumers are 2.3x more likely to try a new brand when offered a variety pack or starter kit vs. committing to a single flavor.",
    "Social proof from micro-influencers (10k-100k followers) converts 4x better than macro-influencers for supplement brands, due to perceived authenticity.",
    "Caffeine source matters: 'Natural caffeine from green coffee bean' tests 35% higher in purchase intent than 'caffeine anhydrous' among health-conscious consumers, despite being pharmacologically identical.",
    "Consumers want fewer products, not more: The most common complaint about supplement brands is 'too many SKUs, don't know where to start.' Focused portfolios with clear use-case differentiation outperform sprawling product lines.",
  ],
  competitiveLandscape: [
    {
      name: "Celsius",
      positioning: "Clean energy for active lifestyles, positioned as the healthy alternative to Monster/Red Bull",
      strength: "Massive retail distribution (400k+ doors) and strong brand recognition among fitness consumers",
      weakness: "Premium pricing ($2.50+/can) creates opening for more affordable powder alternatives",
    },
    {
      name: "Ghost Lifestyle",
      positioning: "Gaming and lifestyle energy with transparent labels and licensed flavors (Sour Patch Kids, Warheads)",
      strength: "Exceptional brand affinity with 18-30 demographic through authentic community building",
      weakness: "Licensed flavors create margin pressure and reliance on partner brand equity",
    },
    {
      name: "LMNT",
      positioning: "Science-backed electrolytes for performance and fasting, zero sugar",
      strength: "Dominant podcast advertising strategy and strong repeat purchase rates (60%+)",
      weakness: "Narrow positioning limits TAM; electrolyte-only without caffeine/energy",
    },
    {
      name: "Athletic Greens (AG1)",
      positioning: "All-in-one daily nutrition with greens, vitamins, and adaptogens",
      strength: "Premium pricing ($79/mo) with high LTV and category-defining marketing spend",
      weakness: "Not positioned as energy/focus specifically; broad positioning dilutes functional claims",
    },
    {
      name: "G Fuel",
      positioning: "OG gaming energy powder with massive SKU portfolio",
      strength: "First-mover advantage in gaming energy with deep Twitch/YouTube integrations",
      weakness: "Aging brand perception; younger consumers see it as 'old school' compared to Ghost",
    },
    {
      name: "Liquid IV",
      positioning: "Hydration multiplier using Cellular Transport Technology",
      strength: "Costco and mass retail penetration; $450M acquisition by Unilever validated category",
      weakness: "Contains sugar (11g per serving), creating vulnerability to zero-sugar competitors",
    },
  ],
  pricingLandscape: "Powder stick packs typically retail at $1.50-$3.00 per serving, with premium clean-label brands commanding the higher end. Subscription pricing typically offers 15-25% discount, bringing per-serving cost to $1.25-$2.50. The sweet spot for trial pricing is $24.99-$34.99 for a 20-30 serving tub or stick pack box, with subscription pricing at $19.99-$29.99/month proving optimal for retention.",
  gaps: [
    "No major brand owns the 'moderate caffeine + nootropics' daily driver position. Most brands push 200-300mg caffeine while a growing segment wants 100-150mg for all-day use without jitters.",
    "Women-focused energy supplements are almost nonexistent at scale. The market is dominated by male-oriented branding (skulls, lightning bolts, aggressive naming) while women represent 45% of energy drink consumers.",
    "There is no clear 'energy + hydration + focus' all-in-one stick pack at a $1.50-2.00 price point. Consumers currently buy 2-3 separate products (LMNT for electrolytes, coffee for caffeine, nootropic capsules for focus).",
    "The 'just clean energy for work' positioning is unoccupied. Most brands lean into fitness or gaming, leaving white-collar professionals without a brand that speaks to their use case (long meetings, deep work sessions, travel fatigue).",
    "Nighttime recovery/sleep paired with daytime energy as a brand ecosystem. No brand has successfully created a morning/night stack system at a mainstream price point.",
  ],
  threats: [
    "Regulatory scrutiny on nootropic and adaptogen claims is increasing. The FDA is paying closer attention to supplement marketing claims, particularly around cognitive enhancement.",
    "Category commoditization as private-label entries from Amazon Basics, Kirkland, and store brands erode margins in the basic energy powder segment.",
    "Caffeine fatigue: Consumer sentiment data shows growing concern about caffeine dependency, which could slow category growth if health media amplifies this narrative.",
    "Supply chain volatility for specialty ingredients (citicoline, alpha-GPC) could impact margins or force reformulations during shortage periods.",
    "Channel concentration risk: brands overly dependent on Amazon (70%+ of revenue) face margin compression from rising ad costs and algorithm changes.",
  ],
  recommendations: [
    "Position as 'daily clean energy for work and training' with 150-200mg natural caffeine + clinical-dose nootropics. Own the moderate-caffeine, all-day-use positioning gap.",
    "Launch with 3 SKUs maximum (2 flavors + unflavored) to reduce choice paralysis. Expand flavors only after achieving 40%+ repeat purchase rate on core SKUs.",
    "Price at $1.99-2.49 per serving (30-count box at $34.99, subscription at $29.99/month) to sit below Celsius cans but above commodity powders, signaling quality without triggering price objection.",
    "Build distribution through Amazon + DTC first, targeting a 60/40 split. Use Amazon for discovery and DTC for subscription conversion and margin protection.",
    "Invest in content-led marketing (ingredient deep-dives, dosage explainers, third-party testing transparency) rather than influencer spend. Education-first brands see 2x higher conversion rates in supplements.",
  ],
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

export default function SampleMarketResearch() {
  const result = SAMPLE_RESULT;

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Sample badge */}
          <div className="mb-6">
            <Badge className="bg-muted text-muted-foreground text-xs">Sample report</Badge>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-primary">Market Research: {result.input.category}</h1>
              <Badge variant="secondary" className="text-xs">{result.input.geography}</Badge>
            </div>
            <p className="text-sm text-muted-foreground italic">&ldquo;{result.input.questions}&rdquo;</p>
          </div>

          {/* Market Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{result.marketOverview}</p>
            </CardContent>
          </Card>

          {/* Market Size callout */}
          <Card className="mb-6 border-teal/20 bg-teal/5">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Estimated Market Size</p>
              <p className="text-sm text-foreground leading-relaxed">{result.marketSize}</p>
            </CardContent>
          </Card>

          {/* Key Trends */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Key Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {result.keyTrends.map((trend, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold text-teal bg-teal/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-foreground">{trend}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Consumer Insights */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Consumer Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {result.consumerInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-2" />
                    <span className="text-sm text-foreground">{insight}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Competitive Landscape */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Competitive Landscape</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.competitiveLandscape.map((comp, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <h4 className="text-sm font-bold text-primary mb-2">{comp.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{comp.positioning}</p>
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0 mt-0.5"><path d="M20 6 9 17l-5-5" /></svg>
                        <span className="text-xs text-muted-foreground">{comp.strength}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        <span className="text-xs text-muted-foreground">{comp.weakness}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Landscape */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Pricing Landscape</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{result.pricingLandscape}</p>
            </CardContent>
          </Card>

          {/* Market Gaps */}
          <Card className="mb-6 border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardHeader>
              <CardTitle className="text-base text-emerald-800 dark:text-emerald-400">Market Gaps &amp; Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.gaps.map((gap, i) => (
                  <div key={i} className="rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 p-3">
                    <p className="text-sm text-foreground">{gap}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Threats */}
          <Card className="mb-6 border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-base text-red-800 dark:text-red-400">Threats &amp; Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {result.threats.map((threat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 mt-2" />
                    <span className="text-sm text-foreground">{threat}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-6 border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/10">
            <CardHeader>
              <CardTitle className="text-base text-emerald-800 dark:text-emerald-400">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-foreground">{rec}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Methodology */}
          <Card className="mb-8 border-teal/20 bg-teal/5">
            <CardHeader>
              <CardTitle className="text-base text-primary">Methodology Note</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                This market research report was generated using AI analysis. The data represents synthesized market intelligence based on publicly available information and trained knowledge.
              </p>
              <p className="text-xs leading-relaxed font-medium">
                Important: This analysis is best used for directional insights and hypothesis generation. It should not replace primary market research for major business decisions. Market size estimates and growth rates are approximations.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/market-research/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own market research
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
