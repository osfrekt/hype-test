"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NameTestResult } from "@/types/name-test";

const SAMPLE_RESULT: NameTestResult = {
  id: "sample-rekt",
  productDescription:
    "A clean energy powder with 200mg natural caffeine from green coffee bean, Cognizin citicoline for sustained mental focus, zero sugar, 5 calories per serving. Positioned for health-conscious professionals and gamers.",
  names: [
    {
      name: "Rekt Focus",
      appealScore: 78,
      topPositive: "Strong brand tie-in with edgy positioning that resonates with gamers",
      topNegative: "May alienate older health-conscious professionals",
      rank: 1,
    },
    {
      name: "Rekt Neuro",
      appealScore: 71,
      topPositive: "Neuro prefix signals cognitive benefits clearly",
      topNegative: "Sounds too clinical or pharmaceutical for a daily energy product",
      rank: 2,
    },
    {
      name: "BrainFuel",
      appealScore: 62,
      topPositive: "Immediately communicates the focus/energy benefit",
      topNegative: "Feels generic; many similar products use brain-related names",
      rank: 3,
    },
    {
      name: "ClearMind Energy",
      appealScore: 55,
      topPositive: "Clean and approachable; appeals to wellness crowd",
      topNegative: "Too soft for a brand called Rekt; lacks edge",
      rank: 4,
    },
    {
      name: "FocusDrive",
      appealScore: 48,
      topPositive: "Action-oriented name suggests productivity",
      topNegative: "Sounds like a software product or app, not a supplement",
      rank: 5,
    },
  ],
  panelSize: 30,
  methodology: {
    panelSize: 30,
    demographicMix:
      "Health-conscious professionals and gamers 18-38 (80%) + general population (20%)",
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

export default function SampleRektNameTest() {
  const result = SAMPLE_RESULT;
  const winner = result.names[0];

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          {/* Sample badge */}
          <div className="mb-6">
            <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/30 text-xs">
              Sample report
            </Badge>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Name Test Results
            </h2>
            <p className="text-sm text-muted-foreground mb-1">
              {result.names.length} names tested with {result.panelSize}{" "}
              consumers
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl">
              {result.productDescription}
            </p>
          </div>

          {/* Winner banner */}
          <Card className="mb-8 bg-primary text-primary-foreground border-primary">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-lg font-bold mb-1">
                &ldquo;{winner.name}&rdquo; ranks #1
              </p>
              <p className="text-sm text-primary-foreground/70">
                {winner.appealScore}% appeal score
              </p>
            </CardContent>
          </Card>

          {/* Ranked list */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Name Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.names.map((n) => (
                  <div
                    key={n.name}
                    className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="flex items-center gap-3 md:w-64 shrink-0">
                      <span
                        className={`text-lg font-bold w-8 text-center ${n.rank === 1 ? "text-teal" : "text-muted-foreground"}`}
                      >
                        #{n.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-primary">{n.name}</p>
                        {n.rank === 1 && (
                          <Badge className="bg-teal text-white text-[10px] mt-0.5">
                            Top Pick
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${n.rank === 1 ? "bg-teal" : "bg-cyan-500"}`}
                            style={{ width: `${n.appealScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-primary w-12 text-right">
                          {n.appealScore}%
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-emerald-600 font-medium">
                            Positive:{" "}
                          </span>
                          <span className="text-muted-foreground">
                            {n.topPositive}
                          </span>
                        </div>
                        <div>
                          <span className="text-red-500 font-medium">
                            Concern:{" "}
                          </span>
                          <span className="text-muted-foreground">
                            {n.topNegative}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
