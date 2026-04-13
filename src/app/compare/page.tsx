"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResearchResult } from "@/types/research";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CHART_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b"];

export default function ComparePage() {
  const [available, setAvailable] = useState<ResearchResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results: ResearchResult[] = [];
      const seenIds = new Set<string>();

      // Gather from sessionStorage
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith("research-")) {
            const stored = sessionStorage.getItem(key);
            if (stored) {
              const parsed: ResearchResult = JSON.parse(stored);
              if (!seenIds.has(parsed.id)) {
                results.push(parsed);
                seenIds.add(parsed.id);
              }
            }
          }
        }
      } catch {
        // sessionStorage unavailable
      }

      // Fetch recent from Supabase
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("research_results")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20);

        if (data) {
          for (const row of data) {
            if (!seenIds.has(row.id)) {
              results.push({
                id: row.id,
                input: row.input,
                panelSize: row.panel_size,
                purchaseIntent: row.purchase_intent,
                wtpRange: row.wtp_range,
                featureImportance: row.feature_importance,
                topConcerns: row.top_concerns,
                topPositives: row.top_positives,
                verbatims: row.verbatims,
                methodology: row.methodology,
                ...(row.competitive_position && {
                  competitivePosition: row.competitive_position,
                }),
                status: row.status,
                createdAt: row.created_at,
              });
              seenIds.add(row.id);
            }
          }
        }
      } catch {
        // Supabase unavailable
      }

      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAvailable(results);
      setLoading(false);
    }

    load();
  }, []);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  }

  const selectedResults = available.filter((r) => selected.has(r.id));

  if (loading) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading results...</p>
        </main>
      </>
    );
  }

  if (available.length < 2) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <p className="text-lg font-medium text-primary mb-2">
              Not enough results to compare
            </p>
            <p className="text-sm text-muted-foreground">
              Run at least 2 research studies to use the comparison view.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary mb-1">
              Compare Research Runs
            </h1>
            <p className="text-sm text-muted-foreground">
              Select 2-3 studies to compare side by side.
            </p>
          </div>

          {/* Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {available.map((r) => (
              <button
                key={r.id}
                onClick={() => toggleSelect(r.id)}
                className={`text-left rounded-xl border p-4 transition-colors ${
                  selected.has(r.id)
                    ? "border-teal bg-teal/5"
                    : "border-border/50 hover:border-border"
                } ${
                  !selected.has(r.id) && selected.size >= 3
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
                disabled={!selected.has(r.id) && selected.size >= 3}
              >
                <p className="font-medium text-primary text-sm truncate">
                  {r.input.productName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(r.createdAt).toLocaleDateString("en-US")} &middot;{" "}
                  {r.panelSize} respondents
                </p>
                {selected.has(r.id) && (
                  <Badge className="mt-2 bg-teal text-white border-0 text-xs">
                    Selected
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {selectedResults.length >= 2 && (
            <>
              {/* Comparison table */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-base">
                    Side-by-Side Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 text-muted-foreground font-medium w-40">
                            Metric
                          </th>
                          {selectedResults.map((r, i) => (
                            <th
                              key={r.id}
                              className="text-left py-2 px-4 font-medium"
                              style={{ color: CHART_COLORS[i] }}
                            >
                              {r.input.productName}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2.5 pr-4 font-medium text-foreground">
                            Purchase Intent
                          </td>
                          {selectedResults.map((r) => (
                            <td key={r.id} className="py-2.5 px-4">
                              {r.purchaseIntent.score}%
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5 pr-4 font-medium text-foreground">
                            WTP (low / mid / high)
                          </td>
                          {selectedResults.map((r) => (
                            <td key={r.id} className="py-2.5 px-4">
                              ${r.wtpRange.low} / ${r.wtpRange.mid} / $
                              {r.wtpRange.high}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5 pr-4 font-medium text-foreground">
                            Top Feature
                          </td>
                          {selectedResults.map((r) => (
                            <td key={r.id} className="py-2.5 px-4">
                              {r.featureImportance[0]?.feature || "N/A"}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2.5 pr-4 font-medium text-foreground">
                            Top Concern
                          </td>
                          {selectedResults.map((r) => (
                            <td key={r.id} className="py-2.5 px-4">
                              {r.topConcerns[0] || "N/A"}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2.5 pr-4 font-medium text-foreground">
                            Panel Size
                          </td>
                          {selectedResults.map((r) => (
                            <td key={r.id} className="py-2.5 px-4">
                              {r.panelSize}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Intent comparison chart */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-base">
                    Purchase Intent Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={buildIntentComparisonData(selectedResults)}
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(0.91 0.005 260)"
                        />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            fontSize: 12,
                            borderRadius: 8,
                            border: "1px solid oklch(0.91 0.005 260)",
                          }}
                        />
                        <Legend />
                        {selectedResults.map((r, i) => (
                          <Bar
                            key={r.id}
                            dataKey={r.input.productName}
                            fill={CHART_COLORS[i]}
                            radius={[4, 4, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Importance comparison */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-base">
                    Feature Importance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={buildFeatureComparisonData(selectedResults)}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(0.91 0.005 260)"
                        />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis
                          dataKey="feature"
                          type="category"
                          tick={{ fontSize: 11 }}
                          width={75}
                        />
                        <Tooltip
                          contentStyle={{
                            fontSize: 12,
                            borderRadius: 8,
                            border: "1px solid oklch(0.91 0.005 260)",
                          }}
                        />
                        <Legend />
                        {selectedResults.map((r, i) => (
                          <Bar
                            key={r.id}
                            dataKey={r.input.productName}
                            fill={CHART_COLORS[i]}
                            radius={[0, 4, 4, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function buildIntentComparisonData(results: ResearchResult[]) {
  const labels = [
    "Definitely not",
    "Probably not",
    "Maybe",
    "Probably yes",
    "Definitely yes",
  ];
  return labels.map((label, i) => {
    const row: Record<string, string | number> = { label };
    results.forEach((r) => {
      row[r.input.productName] = r.purchaseIntent.distribution[i]?.count ?? 0;
    });
    return row;
  });
}

function buildFeatureComparisonData(results: ResearchResult[]) {
  // Gather all unique features across all results
  const allFeatures = new Set<string>();
  results.forEach((r) =>
    r.featureImportance.forEach((f) => allFeatures.add(f.feature))
  );
  return Array.from(allFeatures)
    .slice(0, 8)
    .map((feature) => {
      const row: Record<string, string | number> = { feature };
      results.forEach((r) => {
        const match = r.featureImportance.find((f) => f.feature === feature);
        row[r.input.productName] = match?.score ?? 0;
      });
      return row;
    });
}
