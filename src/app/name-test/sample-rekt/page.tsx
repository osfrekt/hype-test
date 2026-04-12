"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { NameTestResult } from "@/types/name-test";

const SAMPLE_RESULT: NameTestResult = {
  id: "sample-rekt",
  productDescription:
    "Energy and focus powder with 200mg natural caffeine, L-Theanine, and a nootropic blend. Zero sugar, zero calories, 30 servings per tub (~$1/serving). Targeted at gamers, athletes, and professionals who want clean energy and focus.",
  names: [
    {
      name: "Rekt Energy + Focus",
      appealScore: 78,
      memorability: 84,
      categoryFit: 72,
      uniqueness: 66,
      purchaseIntent: 73,
      emotions: [
        { word: "bold", count: 9 },
        { word: "energetic", count: 7 },
        { word: "direct", count: 5 },
      ],
      topPositive:
        "Clearly communicates both energy and cognitive benefits in one name",
      topNegative:
        "The plus sign may look awkward in some marketing contexts",
      impressions: [
        "Straightforward name that tells me exactly what I'm getting - energy and focus in one product.",
        "Bold and confident, fits the edgy Rekt brand perfectly.",
      ],
      personaImpressions: [
        {
          persona: "Male, 24, Competitive gamer, $45K income",
          quote:
            "This is exactly what I'd look for on the shelf next to G Fuel. The name tells me it's serious about both energy AND focus - not just one or the other.",
        },
        {
          persona: "Female, 31, Software engineer, $120K income",
          quote:
            "I like that it's upfront about what it does. I don't have to guess if this is a pre-workout or a focus supplement. Clean and direct.",
        },
      ],
      brandPerception:
        "Projects confident, no-nonsense energy brand identity that appeals broadly across target segments",
      rank: 1,
    },
    {
      name: "Rekt Neuro Fuel",
      appealScore: 71,
      memorability: 68,
      categoryFit: 78,
      uniqueness: 74,
      purchaseIntent: 62,
      emotions: [
        { word: "scientific", count: 8 },
        { word: "clinical", count: 6 },
        { word: "smart", count: 4 },
      ],
      topPositive:
        "Neuro prefix signals nootropic benefits and appeals to biohacker audience",
      topNegative:
        "Sounds too clinical or pharmaceutical for casual gamers",
      impressions: [
        "Feels like a product for serious biohackers, not your average energy drink consumer.",
        "Neuro Fuel sounds premium but might scare off people who just want energy.",
      ],
      personaImpressions: [
        {
          persona: "Male, 29, Biohacker/fitness enthusiast, $85K income",
          quote:
            "Neuro Fuel instantly tells me there's real nootropic science behind this. I'd pick this over generic 'energy' any day.",
        },
        {
          persona: "Female, 22, College student, $15K income",
          quote:
            "Sounds like something from a pharmacy. I'd probably walk past it looking for something that feels more fun and approachable.",
        },
      ],
      brandPerception:
        "Positions as a premium cognitive performance brand, but risks alienating casual energy drink consumers",
      rank: 2,
    },
    {
      name: "Rekt Clean Energy",
      appealScore: 65,
      memorability: 72,
      categoryFit: 88,
      uniqueness: 42,
      purchaseIntent: 58,
      emotions: [
        { word: "healthy", count: 10 },
        { word: "safe", count: 5 },
        { word: "generic", count: 4 },
      ],
      topPositive:
        "Clean energy positioning differentiates from artificial competitors like G Fuel",
      topNegative:
        "Undersells the focus/nootropic angle which is a key differentiator",
      impressions: [
        "Clean Energy is a strong category claim but it doesn't stand out from Celsius or other clean brands.",
        "Sounds healthy but a bit boring - I'd expect this from a mainstream brand, not Rekt.",
      ],
      personaImpressions: [
        {
          persona: "Female, 34, Yoga instructor/wellness coach, $55K income",
          quote:
            "Clean Energy speaks my language - I care about what goes in my body. But the Rekt brand name seems at odds with the 'clean' message.",
        },
        {
          persona: "Male, 19, Esports amateur, $20K income",
          quote:
            "Sounds like every other health drink at Whole Foods. If I wanted 'clean' I wouldn't be looking at something called Rekt.",
        },
      ],
      brandPerception:
        "Strong health positioning but creates brand tension with the edgy Rekt identity; low differentiation in a crowded 'clean' market",
      rank: 3,
    },
    {
      name: "Rekt Power Focus",
      appealScore: 58,
      memorability: 62,
      categoryFit: 68,
      uniqueness: 38,
      purchaseIntent: 44,
      emotions: [
        { word: "aggressive", count: 7 },
        { word: "gym", count: 5 },
        { word: "intense", count: 4 },
      ],
      topPositive:
        "Power conveys strength and intensity that fits the Rekt brand",
      topNegative:
        "Sounds generic and could be confused with pre-workout products",
      impressions: [
        "Power Focus sounds like a pre-workout supplement, not an energy/focus product.",
        "Too aggressive for the everyday use case - I wouldn't want this on my desk at work.",
      ],
      personaImpressions: [
        {
          persona: "Male, 27, CrossFit athlete, $70K income",
          quote:
            "Power Focus makes me think of a pre-workout I'd chug before deadlifts. If that's not what this is, the name is misleading.",
        },
        {
          persona: "Female, 36, Marketing director, $130K income",
          quote:
            "I can't picture having this on my desk during a client meeting. 'Power Focus' screams gym bro energy, not professional productivity.",
        },
      ],
      brandPerception:
        "Over-indexes on physical intensity; strong gym association limits appeal for knowledge workers and casual users",
      rank: 4,
    },
    {
      name: "Rekt Brain Boost",
      appealScore: 45,
      memorability: 56,
      categoryFit: 52,
      uniqueness: 30,
      purchaseIntent: 28,
      emotions: [
        { word: "cheesy", count: 8 },
        { word: "supplement", count: 5 },
        { word: "gimmick", count: 4 },
      ],
      topPositive:
        "Brain Boost clearly signals cognitive enhancement benefits",
      topNegative:
        "Feels too supplement-y and lacks the edgy energy that Rekt brand needs",
      impressions: [
        "Brain Boost sounds like something my grandma would take - doesn't fit the Rekt brand at all.",
        "Immediately makes me think of cheap supplements at a gas station.",
      ],
      personaImpressions: [
        {
          persona: "Male, 21, College gamer, $12K income",
          quote:
            "Brain Boost? Hard pass. Sounds like those sketchy pills you see ads for on YouTube. Doesn't feel like something a real brand would sell.",
        },
        {
          persona: "Female, 28, UX designer, $95K income",
          quote:
            "The name feels dated and gimmicky. 'Brain Boost' was a fine name in 2015 but today it just signals a low-quality supplement.",
        },
      ],
      brandPerception:
        "Weak brand signal with strong negative associations to cheap supplements; fundamentally misaligned with the edgy Rekt identity",
      rank: 5,
    },
  ],
  panelSize: 30,
  methodology: {
    panelSize: 30,
    demographicMix:
      "Gamers, athletes, and professionals 18-38 (80%) + general population (20%)",
    confidenceNote:
      "Results based on LLM-simulated consumer panel. All names tested against the same panel for fair comparison. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

function MetricBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted-foreground w-24 shrink-0">
        {label}
      </span>
      <div className="flex-1 bg-muted rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium text-primary w-10 text-right">
        {value}%
      </span>
    </div>
  );
}

function ScoreCell({ value, best }: { value: number; best: boolean }) {
  return (
    <td
      className={`py-3 px-3 text-center tabular-nums ${best ? "font-bold text-teal" : ""}`}
    >
      {value}%
    </td>
  );
}

export default function SampleRektNameTest() {
  const result = SAMPLE_RESULT;
  const winner = result.names[0];

  // Pre-compute best-in-class for each metric
  const bestAppeal = Math.max(...result.names.map((n) => n.appealScore));
  const bestMemo = Math.max(...result.names.map((n) => n.memorability));
  const bestFit = Math.max(...result.names.map((n) => n.categoryFit));
  const bestUnique = Math.max(...result.names.map((n) => n.uniqueness));
  const bestIntent = Math.max(...result.names.map((n) => n.purchaseIntent));

  // Compute composite score (weighted average)
  const compositeScores = result.names.map((n) => ({
    name: n.name,
    score: Math.round(
      n.appealScore * 0.3 +
        n.memorability * 0.2 +
        n.categoryFit * 0.2 +
        n.uniqueness * 0.15 +
        n.purchaseIntent * 0.15
    ),
  }));
  const bestComposite = Math.max(...compositeScores.map((c) => c.score));

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
            <h2 className="text-2xl font-bold text-primary mb-2">
              Naming Research Report
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              {result.names.length} names tested with {result.panelSize}{" "}
              simulated consumers
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl">
              {result.productDescription}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Panel: {result.methodology.demographicMix}
            </p>
          </div>

          {/* Executive Summary */}
          <Card className="mb-8 border-teal/30">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                <strong className="text-primary">
                  &ldquo;{winner.name}&rdquo;
                </strong>{" "}
                emerged as the clear winner with a {winner.appealScore}% appeal
                score and {winner.purchaseIntent}% purchase intent - the highest
                on both metrics. It strikes the best balance between
                communicating product benefits and fitting the Rekt brand
                identity.
              </p>
              <p>
                <strong className="text-primary">
                  &ldquo;{result.names[1].name}&rdquo;
                </strong>{" "}
                placed second with strong category fit ({result.names[1].categoryFit}%)
                and the highest uniqueness score ({result.names[1].uniqueness}%),
                but lower purchase intent ({result.names[1].purchaseIntent}%) suggests
                it may appeal more to a niche biohacker audience than the broader target market.
              </p>
              <p>
                The bottom two names -{" "}
                <strong className="text-primary">
                  &ldquo;{result.names[3].name}&rdquo;
                </strong>{" "}
                and{" "}
                <strong className="text-primary">
                  &ldquo;{result.names[4].name}&rdquo;
                </strong>{" "}
                - both suffered from strong negative associations (pre-workout confusion
                and cheap supplement perception respectively) that undermine the
                intended brand positioning.
              </p>
            </CardContent>
          </Card>

          {/* Winner banner */}
          <Card className="mb-8 bg-primary text-primary-foreground border-primary">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/60 mb-1">
                Recommended Name
              </p>
              <p className="text-xl font-bold mb-2">
                &ldquo;{winner.name}&rdquo;
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/80">
                <span>{winner.appealScore}% appeal</span>
                <span>&middot;</span>
                <span>{winner.memorability}% memorability</span>
                <span>&middot;</span>
                <span>{winner.categoryFit}% category fit</span>
                <span>&middot;</span>
                <span>{winner.purchaseIntent}% purchase intent</span>
              </div>
            </CardContent>
          </Card>

          {/* ── Detailed Name Analysis ── */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Detailed Name Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {result.names.map((n) => (
                  <div
                    key={n.name}
                    className="p-5 rounded-lg bg-muted/50 border border-border/50"
                  >
                    {/* Name header */}
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`text-lg font-bold w-8 text-center ${n.rank === 1 ? "text-teal" : "text-muted-foreground"}`}
                      >
                        #{n.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-primary text-lg">
                          {n.name}
                        </p>
                        {n.rank === 1 && (
                          <Badge className="bg-teal text-white text-[10px] mt-0.5">
                            Top Pick
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Brand perception one-liner */}
                    <p className="text-sm text-muted-foreground italic mb-4 pl-11">
                      {n.brandPerception}
                    </p>

                    {/* Metric bars */}
                    <div className="space-y-2 mb-4">
                      <MetricBar
                        label="Appeal"
                        value={n.appealScore}
                        color={n.rank === 1 ? "bg-teal" : "bg-cyan-500"}
                      />
                      <MetricBar
                        label="Memorability"
                        value={n.memorability}
                        color={n.rank === 1 ? "bg-teal" : "bg-cyan-500"}
                      />
                      <MetricBar
                        label="Category Fit"
                        value={n.categoryFit}
                        color={n.rank === 1 ? "bg-teal" : "bg-cyan-500"}
                      />
                      <MetricBar
                        label="Uniqueness"
                        value={n.uniqueness}
                        color={n.rank === 1 ? "bg-teal" : "bg-cyan-500"}
                      />
                      <MetricBar
                        label="Purchase Intent"
                        value={n.purchaseIntent}
                        color={n.rank === 1 ? "bg-teal" : "bg-cyan-500"}
                      />
                    </div>

                    {/* Emotional reactions */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground font-medium mb-1.5">
                        Top Emotional Reactions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {n.emotions.slice(0, 3).map((e) => (
                          <Badge
                            key={e.word}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {e.word}{" "}
                            <span className="ml-1 text-muted-foreground">
                              {e.count}/{result.panelSize}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Persona impressions */}
                    {n.personaImpressions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground font-medium mb-1.5">
                          Consumer Quotes
                        </p>
                        <div className="space-y-2">
                          {n.personaImpressions.map((pi, i) => (
                            <div
                              key={i}
                              className="border-l-2 border-border pl-3"
                            >
                              <p className="text-xs text-muted-foreground italic">
                                &ldquo;{pi.quote}&rdquo;
                              </p>
                              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                                -- {pi.persona}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator className="my-3" />

                    {/* Positive / Concern */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-emerald-600 font-medium">
                          Key Strength:{" "}
                        </span>
                        <span className="text-muted-foreground">
                          {n.topPositive}
                        </span>
                      </div>
                      <div>
                        <span className="text-red-500 font-medium">
                          Key Concern:{" "}
                        </span>
                        <span className="text-muted-foreground">
                          {n.topNegative}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Comparison Table ── */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Side-by-Side Comparison
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Best-in-class scores are highlighted. Composite = 30% appeal +
                20% memorability + 20% category fit + 15% uniqueness + 15%
                purchase intent.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                        Appeal
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                        Memo.
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                        Cat. Fit
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                        Unique.
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                        Purch. Int.
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                        Composite
                      </th>
                      <th className="text-center py-3 px-3 font-medium text-muted-foreground">
                        Top Emotion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.names.map((n) => {
                      const comp =
                        compositeScores.find((c) => c.name === n.name)
                          ?.score ?? 0;
                      return (
                        <tr
                          key={n.name}
                          className={`border-b border-border/30 ${n.rank === 1 ? "bg-teal/5" : ""}`}
                        >
                          <td className="py-3 px-3 font-medium">{n.name}</td>
                          <ScoreCell
                            value={n.appealScore}
                            best={n.appealScore === bestAppeal}
                          />
                          <ScoreCell
                            value={n.memorability}
                            best={n.memorability === bestMemo}
                          />
                          <ScoreCell
                            value={n.categoryFit}
                            best={n.categoryFit === bestFit}
                          />
                          <ScoreCell
                            value={n.uniqueness}
                            best={n.uniqueness === bestUnique}
                          />
                          <ScoreCell
                            value={n.purchaseIntent}
                            best={n.purchaseIntent === bestIntent}
                          />
                          <ScoreCell
                            value={comp}
                            best={comp === bestComposite}
                          />
                          <td className="py-3 px-3 text-center">
                            {n.emotions[0]?.word || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ── Brand Perception Summary ── */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Brand Perception at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.names.map((n) => (
                  <div key={n.name} className="flex items-start gap-3">
                    <span
                      className={`text-xs font-bold w-6 text-center mt-0.5 ${n.rank === 1 ? "text-teal" : "text-muted-foreground"}`}
                    >
                      #{n.rank}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {n.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {n.brandPerception}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card className="mb-8 border-teal/20 bg-teal/5">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">
                Methodology &amp; Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Panel size:</strong>{" "}
                {result.methodology.panelSize} simulated consumers
              </p>
              <p>
                <strong>Demographic mix:</strong>{" "}
                {result.methodology.demographicMix}
              </p>
              <p>
                <strong>Scoring:</strong> Appeal and purchase intent derived
                from 1-5 ratings; memorability and category fit from yes/no/maybe
                responses; uniqueness estimated from response diversity; composite
                weighted across all five metrics.
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
                Important: These results are best used for directional insights
                and hypothesis generation. They should not replace high-stakes
                primary consumer research for major business decisions.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/name-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own name test
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
