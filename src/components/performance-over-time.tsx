"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface HistoryEntry {
  id: string;
  productName: string;
  intentScore: number;
  wtpMid: number;
  createdAt: string;
}

function useChartTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return {
    gridColor: isDark ? "oklch(0.27 0.015 260)" : "oklch(0.91 0.005 260)",
    tooltipBg: isDark ? "#1f2237" : "#ffffff",
    tooltipBorder: isDark ? "oklch(0.27 0.015 260)" : "oklch(0.91 0.005 260)",
    tooltipColor: isDark ? "#e0e1e8" : "#1a1f36",
  };
}

export function PerformanceOverTime({
  history,
  currentId,
}: {
  history: HistoryEntry[];
  currentId: string;
}) {
  const [mounted, setMounted] = useState(false);
  const chart = useChartTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = history.map((entry) => ({
    date: new Date(entry.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    intent: entry.intentScore,
    wtp: entry.wtpMid,
    id: entry.id,
  }));

  return (
    <Card className="mt-12 mb-8" data-print-hide>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Performance Over Time
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {history.length} research runs for this product
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chart.gridColor}
                />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="intent"
                  tick={{ fontSize: 11 }}
                  domain={[0, 100]}
                  label={{
                    value: "Intent %",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="wtp"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  label={{
                    value: "WTP ($)",
                    angle: 90,
                    position: "insideRight",
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: `1px solid ${chart.tooltipBorder}`,
                    backgroundColor: chart.tooltipBg,
                    color: chart.tooltipColor,
                  }}
                />
                <Legend />
                <Line
                  yAxisId="intent"
                  type="monotone"
                  dataKey="intent"
                  name="Purchase Intent %"
                  stroke="#1a6b5a"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="wtp"
                  type="monotone"
                  dataKey="wtp"
                  name="WTP Mid ($)"
                  stroke="#2e8b6a"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* History table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Date</th>
                <th className="pb-2 font-medium text-muted-foreground">
                  Purchase Intent
                </th>
                <th className="pb-2 font-medium text-muted-foreground">
                  WTP (Mid)
                </th>
                <th className="pb-2 font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr
                  key={entry.id}
                  className={`border-b last:border-0 ${
                    entry.id === currentId
                      ? "bg-primary/5 font-medium"
                      : ""
                  }`}
                >
                  <td className="py-2">
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2">{entry.intentScore}%</td>
                  <td className="py-2">${entry.wtpMid}</td>
                  <td className="py-2">
                    {entry.id === currentId ? (
                      <span className="text-xs text-muted-foreground">
                        Current
                      </span>
                    ) : (
                      <Link
                        href={`/research/${entry.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
