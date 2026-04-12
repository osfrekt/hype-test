"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AudienceTestResult } from "@/types/audience-test";

const SAMPLE_RESULT: AudienceTestResult = {
  id: "sample-rekt",
  input: {
    productName: "Rekt Energy + Focus Powder",
    productDescription:
      "Energy and focus powder with 200mg natural caffeine, L-Theanine, and a nootropic blend. Zero sugar, zero calories, 30 servings per tub (~$1/serving). Available in Blue Raspberry and Cherry.",
    category: "Health & Household",
    priceRange: { min: 25, max: 35 },
  },
  segments: [
    {
      audience: "Male gamers 18-25",
      intentScore: 74,
      wtpMid: 28,
      topPositive: "L-Theanine + caffeine combo appeals to competitive gamers who need sustained focus",
      topConcern: "Skepticism about nootropic claims without visible proof from a newer brand",
      rank: 1,
    },
    {
      audience: "Male fitness enthusiasts 25-35",
      intentScore: 71,
      wtpMid: 32,
      topPositive: "Zero sugar and zero calories fit clean supplement stack alongside protein and creatine",
      topConcern: "Already loyal to established brands like Ghost Energy and Celsius",
      rank: 2,
    },
    {
      audience: "Female professionals 28-40",
      intentScore: 62,
      wtpMid: 30,
      topPositive: "Clean energy without the crash is perfect for long work days",
      topConcern: "Brand name Rekt feels too aggressive and male-oriented",
      rank: 3,
    },
    {
      audience: "College students 18-22",
      intentScore: 58,
      wtpMid: 22,
      topPositive: "$1/serving is cheaper than buying canned energy drinks daily",
      topConcern: "Price sensitivity at $30/tub limits trial for budget-conscious students",
      rank: 4,
    },
    {
      audience: "Adults 45-60",
      intentScore: 34,
      wtpMid: 25,
      topPositive: "Interest in cognitive health benefits from nootropic blend",
      topConcern: "Brand name Rekt feels too youth-oriented and intimidating",
      rank: 5,
    },
  ],
  bestSegment: "Male gamers 18-25",
  panelSizePerSegment: 30,
  methodology: {
    panelSizePerSegment: 30,
    totalPanelists: 150,
    demographicMix:
      "Targeted panels for each segment with demographic-appropriate personas",
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

export default function SampleRektAudienceTest() {
  const result = SAMPLE_RESULT;
  const best = result.segments.find((s) => s.rank === 1);

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
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {result.input.productName}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.methodology.totalPanelists} total panelists
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              Audience segment comparison across {result.segments.length}{" "}
              segments
            </p>
          </div>

          {/* Best Segment Card */}
          {best && (
            <Card className="mb-8 border-teal/30 bg-teal/5">
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Best Audience Segment
                  </p>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {best.audience}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {best.intentScore}% purchase intent &middot; WTP $
                    {best.wtpMid}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Segment Detail Cards */}
          <div className="grid gap-4 mb-8">
            {result.segments.map((seg) => (
              <Card
                key={seg.audience}
                className={seg.rank === 1 ? "border-teal/30" : ""}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center">
                        #{seg.rank}
                      </span>
                      <h3 className="font-semibold text-primary">
                        {seg.audience}
                      </h3>
                      {seg.rank === 1 && (
                        <Badge className="bg-teal/10 text-teal border-teal/20 text-xs">
                          Best
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {seg.intentScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        purchase intent
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg WTP</p>
                      <p className="font-medium">${seg.wtpMid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Top Positive
                      </p>
                      <p className="text-muted-foreground">{seg.topPositive}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Top Concern
                      </p>
                      <p className="text-muted-foreground">{seg.topConcern}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/audience-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own audience test
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
