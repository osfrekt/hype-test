"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
        "Clear, specific claims about caffeine dosage and L-Theanine build immediate credibility with health-literate consumers",
        "Zero sugar / zero crash message directly addresses the #1 pain point of energy drink users",
        "Multiple use cases (gaming, work, training) broadens appeal across the full 18-38 target demographic",
        "Straightforward copy is scannable in under 3 seconds -- critical for paid social placements",
        "Natural caffeine positioning creates clear differentiation from synthetic-heavy competitors like G Fuel and Celsius",
      ],
      topWeaknesses: [
        "Functional, ingredient-led messaging may feel clinical rather than exciting to younger gamers",
        "No emotional hook or storytelling element to build deeper brand connection beyond product specs",
        "Could be any supplement brand -- copy lacks Rekt Energy's distinctive personality and edge",
        "Benefit stacking ('game harder, work sharper, train longer') dilutes focus; one clear CTA would convert better",
        "Missing social proof or community signal that would increase trust for a newer DTC brand",
      ],
      keyTakeaways: [
        "This is a clean energy product that promises focus without the crash -- it leads with science, not hype",
        "A caffeine supplement with nootropics for productivity-obsessed professionals who read labels",
        "An alternative to sugary energy drinks for active people who want to feel responsible about their intake",
        "The messaging is trustworthy but forgettable -- it explains what the product is, not why it matters",
        "Best suited for bottom-of-funnel retargeting where the audience already knows the brand",
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
        "Strong emotional hook ('Stop poisoning your focus') grabs attention and creates urgency in the first 2 words",
        "Provocative, confrontational tone creates a memorable brand voice that stands out in crowded feeds",
        "Clearly positions Rekt Energy against sugar-loaded competitors, giving the audience a villain to reject",
        "Appeals to intelligence and self-improvement -- 'your brain deserves better' flatters the reader",
        "Conversational headline ('Your Brain Called') uses humour to lower defences before the hard sell",
      ],
      topWeaknesses: [
        "Confrontational tone risks alienating 30-40% of consumers who feel personally attacked for their current habits",
        "Shaming language ('stop poisoning') could feel preachy or judgemental, especially among older professionals",
        "Less specific about product contents -- no dosage, no ingredient callouts beyond 'nootropics'",
        "May backfire with loyal energy drink consumers who feel defensive rather than curious",
        "Humour in the headline sets a playful expectation that clashes with the aggressive body copy tone",
      ],
      keyTakeaways: [
        "This brand is telling me my current energy drink is poisoning me -- a bold, polarising claim",
        "A healthier energy option positioning itself as the 'smart choice' by shaming mainstream alternatives",
        "The copy has strong personality but trades credibility for attitude -- it tells me to switch without proving why",
        "Would likely perform better as a top-of-funnel awareness play where memorability matters more than conversion",
        "The provocative angle could drive high engagement (comments, shares) but may underperform on direct click-through",
      ],
    },
  ],
  winner: "A",
  winMargin: 5,
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

function DistributionBar({ distribution }: { distribution: { label: string; count: number }[] }) {
  const max = Math.max(...distribution.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-0.5 h-8 mt-1.5">
      {distribution.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-0.5">
          <span className="text-[9px] text-muted-foreground leading-none">{d.count}</span>
          <div
            className="w-full bg-teal/60 rounded-sm min-h-[2px]"
            style={{ height: `${(d.count / max) * 100}%` }}
          />
          <span className="text-[8px] text-muted-foreground leading-none">{d.label.charAt(0)}</span>
        </div>
      ))}
    </div>
  );
}

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
        {/* Score metrics with distributions */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-primary">{m.data.score}%</p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div className="bg-teal h-1.5 rounded-full" style={{ width: `${m.data.score}%` }} />
              </div>
              <DistributionBar distribution={m.data.distribution} />
            </div>
          ))}
        </div>

        {/* Click likelihood */}
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Click Likelihood</p>
          <div className="flex rounded-full overflow-hidden h-6 text-[10px] font-medium">
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
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Top Emotional Responses</p>
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
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Top 5 Strengths</p>
            <ul className="space-y-1.5">
              {creative.topStrengths.map((s, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {creative.topWeaknesses.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Top 5 Weaknesses</p>
            <ul className="space-y-1.5">
              {creative.topWeaknesses.map((w, i) => (
                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5 shrink-0 font-bold">-</span>
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
            <ul className="space-y-1.5">
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
              <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/50 mb-2">Panel Verdict</p>
              <p className="text-xl font-bold mb-2">
                &ldquo;{result.results[0].creative.name}&rdquo; wins by {result.winMargin} points
              </p>
              <p className="text-sm text-primary-foreground/70 max-w-xl mx-auto">
                Creative A scored higher on clarity (+16), attention (+4), and brand fit (+6), outweighing Creative B&apos;s edge in persuasion (+5). The functional, ingredient-led approach built more trust with the health-conscious panel, while the provocative tone of Creative B polarised respondents -- driving higher emotional engagement but also higher rejection rates.
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
              href="/ad-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own ad test
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
