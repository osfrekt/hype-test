"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PricingTestResult } from "@/types/pricing-test";

const SAMPLE_RESULT: PricingTestResult = {
  id: "sample-rekt",
  input: {
    productName: "Rekt Focus Energy Powder",
    productDescription:
      "A clean energy powder with 200mg natural caffeine, Cognizin citicoline for sustained mental focus, zero sugar, 5 calories per serving.",
    category: "health & wellness",
    targetMarket: "Health-conscious professionals and gamers 18-38",
    priceUnit: "per stick pack",
  },
  pricePoints: [
    { price: 1.5, intentScore: 82, revenueIndex: 73 },
    { price: 2.0, intentScore: 74, revenueIndex: 88 },
    { price: 2.5, intentScore: 65, revenueIndex: 97 },
    { price: 3.0, intentScore: 48, revenueIndex: 86 },
    { price: 3.5, intentScore: 31, revenueIndex: 65 },
  ],
  optimalPrice: 2.5,
  optimalIntent: 65,
  panelSize: 50,
  methodology: {
    panelSize: 50,
    demographicMix:
      "Health-conscious professionals and gamers 18-38 (80%) + general population (20%)",
    confidenceNote:
      "Results based on LLM-simulated consumer panel. Best used for directional insights and hypothesis generation.",
  },
  createdAt: "2026-04-10T14:30:00Z",
  status: "complete",
};

export default function SampleRektPricingTest() {
  const result = SAMPLE_RESULT;
  const optimal = result.pricePoints.find(
    (p) => p.price === result.optimalPrice
  );
  const unit = result.input.priceUnit ? ` ${result.input.priceUnit}` : "";

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
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-primary">
                {result.input.productName}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {result.panelSize} panelists
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-3xl">
              Pricing sensitivity analysis across {result.pricePoints.length}{" "}
              price points
            </p>
          </div>

          {/* Optimal Price Card */}
          {optimal && (
            <Card className="mb-8 border-teal/30 bg-teal/5">
              <CardContent className="py-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Revenue-Maximizing Price
                  </p>
                  <p className="text-4xl font-bold text-primary mb-2">
                    ${result.optimalPrice}
                    {unit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.optimalIntent}% purchase intent &middot; Revenue
                    index {optimal.revenueIndex}/100
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Price Point Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">
                Price Point Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        Purchase Intent
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        Revenue Index
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                        Optimal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.pricePoints.map((pp) => (
                      <tr
                        key={pp.price}
                        className={`border-b border-border/30 ${pp.price === result.optimalPrice ? "bg-teal/5" : ""}`}
                      >
                        <td className="py-3 px-4 font-medium">
                          ${pp.price}
                          {unit}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {pp.intentScore}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-1.5">
                              <div
                                className="bg-teal h-1.5 rounded-full"
                                style={{ width: `${pp.revenueIndex}%` }}
                              />
                            </div>
                            <span className="text-xs">{pp.revenueIndex}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {pp.price === result.optimalPrice && (
                            <Badge className="bg-teal/10 text-teal border-teal/20 text-xs">
                              Best
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center" data-print-hide>
            <Link
              href="/pricing-test/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              Run your own pricing test
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
