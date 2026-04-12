"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CompetitiveResult } from "@/types/competitive";

const SAMPLE_RESULT: CompetitiveResult = {
  id: "sample-rekt",
  yours: {
    input: {
      productName: "Rekt Energy + Focus Powder",
      productDescription:
        "Energy and focus powder with 200mg natural caffeine, L-Theanine, and a nootropic blend. Zero sugar, zero calories, 30 servings per tub. Available in Blue Raspberry and Cherry.",
      category: "Health & Household",
      keyFeatures: [
        "200mg natural caffeine + L-Theanine",
        "Nootropic blend for sustained focus",
        "Zero sugar, zero calories, 30 servings/$30",
      ],
      priceRange: { min: 25, max: 35 },
      priceUnit: "per tub (30 servings)",
      targetMarket: "Gamers, athletes, and professionals who want clean energy and focus",
    },
    intentScore: 68,
    wtpMid: 30,
    featureAvg: 78,
    topPositive: "L-Theanine for smooth energy without jitters",
    topConcern: "Newer brand, less proven track record",
  },
  competitor: {
    input: {
      productName: "G Fuel Energy Formula",
      productDescription:
        "Powdered energy drink mix with 150mg caffeine, antioxidants, and focus complex. Available in 40+ flavors. Popular in gaming and esports communities.",
      category: "Health & Household",
      keyFeatures: [
        "150mg caffeine + focus complex",
        "40+ flavor varieties",
        "Official esports partnerships",
      ],
      priceRange: { min: 25, max: 36 },
      priceUnit: "per tub (40 servings)",
      targetMarket: "Gamers and esports enthusiasts 16-35",
    },
    intentScore: 62,
    wtpMid: 28,
    featureAvg: 72,
    topPositive: "Established brand with massive flavor selection",
    topConcern: "Artificial ingredients and food dyes",
  },
  radarData: [
    { dimension: "Purchase Intent", yours: 68, competitor: 62 },
    { dimension: "Perceived Value", yours: 72, competitor: 65 },
    { dimension: "Feature Appeal", yours: 80, competitor: 74 },
    { dimension: "Enthusiasm", yours: 70, competitor: 68 },
    { dimension: "Low Concern", yours: 55, competitor: 58 },
  ],
  winner: "yours",
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix:
      "Gamers, athletes, and professionals 18-38 (80%) + general population (20%)",
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

export default function SampleRektCompetitive() {
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-3">
              {result.yours.input.productName} vs{" "}
              {result.competitor.input.productName}
            </h1>
            <Badge variant="secondary" className="text-xs mb-4">
              {result.panelSize} shared respondents
            </Badge>
          </div>

          {/* Winner Banner */}
          <div className="rounded-xl border-2 px-6 py-4 text-center mb-8 bg-emerald-100 text-emerald-800 border-emerald-300">
            <p className="text-sm font-medium uppercase tracking-wider mb-1">
              Winner
            </p>
            <p className="text-2xl font-bold">
              {result.yours.input.productName}
            </p>
            <p className="text-sm mt-1">
              Based on composite scoring across 5 dimensions
            </p>
          </div>

          {/* Side-by-side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Your Product */}
            <Card className="border-emerald-300 ring-1 ring-emerald-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {result.yours.input.productName}
                  </CardTitle>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                    Winner
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Your Product</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Purchase Intent
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {result.yours.intentScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      WTP
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${result.yours.wtpMid}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Top Positive
                  </p>
                  <p className="text-sm text-foreground">
                    {result.yours.topPositive}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Top Concern
                  </p>
                  <p className="text-sm text-foreground">
                    {result.yours.topConcern}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Competitor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {result.competitor.input.productName}
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">Competitor</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Purchase Intent
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {result.competitor.intentScore}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      WTP
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${result.competitor.wtpMid}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Top Positive
                  </p>
                  <p className="text-sm text-foreground">
                    {result.competitor.topPositive}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Top Concern
                  </p>
                  <p className="text-sm text-foreground">
                    {result.competitor.topConcern}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Data Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                How You Stack Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Dimension
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        {result.yours.input.productName}
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        {result.competitor.input.productName}
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        Advantage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.radarData.map((d) => {
                      const diff = d.yours - d.competitor;
                      return (
                        <tr
                          key={d.dimension}
                          className="border-b border-border/30"
                        >
                          <td className="py-3 px-4 font-medium">
                            {d.dimension}
                          </td>
                          <td className="py-3 px-4 text-center">{d.yours}</td>
                          <td className="py-3 px-4 text-center">
                            {d.competitor}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={
                                diff > 0
                                  ? "text-emerald-600 font-medium"
                                  : diff < 0
                                    ? "text-red-500 font-medium"
                                    : "text-muted-foreground"
                              }
                            >
                              {diff > 0 ? "+" : ""}
                              {diff}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/competitive/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own competitive teardown
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
