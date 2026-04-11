"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16a34a"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const metrics = [
  {
    label: "Purchase Intent",
    traditional: "64%",
    hypetest: "61%",
    match: true,
  },
  {
    label: "WTP Range",
    traditional: "$2.50 - $3.50/can",
    hypetest: "$2.25 - $3.75/can",
    match: true,
  },
  {
    label: "Top Feature",
    traditional: "Clean energy, no artificial ingredients",
    hypetest: "Clean caffeine from natural sources",
    match: true,
  },
  {
    label: "Top Concern",
    traditional: "High caffeine content, price premium vs. competitors",
    hypetest: "Caffeine sensitivity and price vs. competitors",
    match: true,
  },
  {
    label: "Panel Size / Time",
    traditional: "~1,000 US consumers, 4-6 weeks",
    hypetest: "50 AI-simulated consumers, 2 minutes",
    match: false,
  },
];

export function SampleReport() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
            Illustrative comparison
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-primary">
          Celsius Energy Drink
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How does HypeTest compare to traditional panel research for a
          well-known CPG product?
        </p>
      </CardHeader>

      <CardContent>
        {/* Column headers */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 mb-4">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-3 border border-border/50">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground shrink-0"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-primary">
                Traditional Panel Data
              </p>
              <p className="text-xs text-muted-foreground">
                Source: EY Consumer Beverage Survey 2026, HundredX 2025
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-teal/5 rounded-lg px-4 py-3 border border-teal/20">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-teal shrink-0"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-primary">
                HypeTest Simulation
              </p>
              <p className="text-xs text-muted-foreground">
                Simulated via HypeTest
              </p>
            </div>
          </div>
        </div>

        {/* Metric rows */}
        <div className="space-y-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3"
            >
              {/* Traditional */}
              <div
                className={`rounded-lg px-4 py-3 border ${
                  metric.match
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30"
                    : "bg-muted/30 border-border/50"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {metric.match && <CheckIcon />}
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {metric.label}
                  </p>
                </div>
                <p className="text-sm font-medium text-primary">
                  {metric.traditional}
                </p>
              </div>
              {/* HypeTest */}
              <div
                className={`rounded-lg px-4 py-3 border ${
                  metric.match
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30"
                    : "bg-muted/30 border-border/50"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {metric.match && <CheckIcon />}
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {metric.label}
                  </p>
                </div>
                <p className="text-sm font-medium text-primary">
                  {metric.hypetest}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Match score bar */}
        <div className="mt-6 bg-muted/50 rounded-xl p-4 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-primary">
              Directional alignment
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ~92%
            </p>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: "92%" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Purchase intent, WTP range, and key themes are directionally
            consistent between traditional panel data and HypeTest simulation.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-0">
        <p className="text-xs text-muted-foreground leading-relaxed text-center">
          Traditional panel data sourced from publicly available industry reports
          (EY 2026, HundredX). HypeTest results are illustrative of typical
          output for this product category. This is not a controlled validation
          study.
        </p>
      </CardFooter>
    </Card>
  );
}
