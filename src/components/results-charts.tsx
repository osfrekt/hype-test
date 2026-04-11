"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResearchResult } from "@/types/research";

// Cohesive palette derived from OKLCH, tinted toward brand hue (260°).
// Each value computed from oklch(L C H) for Recharts hex compatibility.
// Semantic: negative → cautious → neutral → positive → strong positive
const INTENT_COLORS = [
  "#c0392b", // oklch(0.48 0.16 25)  — Definitely not
  "#c97a2e", // oklch(0.58 0.14 65)  — Probably not
  "#8a8a3d", // oklch(0.58 0.10 100) — Maybe
  "#2e8b6a", // oklch(0.55 0.12 165) — Probably yes
  "#1a6b5a", // oklch(0.45 0.10 170) — Definitely yes
];

const COMP_COLORS = [
  "#1a6b5a", // oklch(0.45 0.10 170) — Much better
  "#2e8b6a", // oklch(0.55 0.12 165) — Better
  "#8a8a3d", // oklch(0.58 0.10 100) — Same
  "#c97a2e", // oklch(0.58 0.14 65)  — Worse
  "#c0392b", // oklch(0.48 0.16 25)  — Much worse
  "#6b7280", // oklch(0.50 0.01 260) — Unfamiliar (brand-tinted gray)
];

// Shared chart styling tokens — resolved at render time for theme awareness
function useChartTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return {
    gridColor: isDark ? "oklch(0.27 0.015 260)" : "oklch(0.91 0.005 260)",
    labelColor: isDark ? "#b0b3c5" : "#3d3f54",
    tooltipBg: isDark ? "#1f2237" : "#ffffff",
    tooltipBorder: isDark ? "oklch(0.27 0.015 260)" : "oklch(0.91 0.005 260)",
    tooltipColor: isDark ? "#e0e1e8" : "#1a1f36",
  };
}

export function ResultsCharts({ result }: { result: ResearchResult }) {
  const [mounted, setMounted] = useState(false);
  const chart = useChartTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  const intentData = (result.purchaseIntent?.distribution ?? []).map((d, i) => ({
    name: d.label,
    count: d.count,
    fill: INTENT_COLORS[i],
  }));

  const compData = result.competitivePosition?.distribution?.map((d, i) => ({
    name: d.label,
    count: d.count,
    fill: COMP_COLORS[i],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Purchase Intent Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={intentData}
                  margin={{ top: 20, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.gridColor} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: `1px solid ${chart.tooltipBorder}`,
                      backgroundColor: chart.tooltipBg,
                      color: chart.tooltipColor,
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {intentData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="count"
                      position="top"
                      fontSize={11}
                      fill={chart.labelColor}
                      formatter={(v: unknown) => (Number(v) > 0 ? String(v) : "")}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Willingness-to-Pay Spectrum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex flex-col justify-center">
            <div className="relative">
              {/* Price scale */}
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>${result.wtpRange?.low}</span>
                <span>${result.wtpRange?.high}</span>
              </div>
              {/* Bar */}
              <div className="w-full h-8 bg-gradient-to-r from-emerald-200 dark:from-emerald-800 via-teal to-primary rounded-lg relative">
                {/* Mid marker */}
                <div
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  style={{
                    left: `${Math.max(8, result.wtpRange?.high === result.wtpRange?.low ? 50 : ((result.wtpRange?.mid - result.wtpRange?.low) / (result.wtpRange?.high - result.wtpRange?.low)) * 100)}%`,
                  }}
                >
                  <div className="w-0.5 h-8 bg-white" />
                  <div className="mt-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                    ${result.wtpRange?.mid}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    estimated avg
                  </span>
                </div>
              </div>
              {/* Labels */}
              <div className="flex justify-between text-xs text-muted-foreground mt-10">
                <span>Budget buyers</span>
                <span>Premium buyers</span>
              </div>
            </div>

            <div className="mt-8 text-xs text-muted-foreground leading-relaxed">
              WTP estimated via indirect choice-based methodology. The range
              reflects the spread of simulated consumer preferences, not a
              confidence interval.
            </div>
          </div>
        </CardContent>
      </Card>

      {compData && result.competitivePosition && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Competitive Positioning vs {result.competitivePosition.competitors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={compData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={chart.gridColor} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: `1px solid ${chart.tooltipBorder}`,
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {compData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
