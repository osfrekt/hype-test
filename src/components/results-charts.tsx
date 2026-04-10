"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResearchResult } from "@/types/research";

const INTENT_COLORS = [
  "#ef4444", // Definitely not - red
  "#f97316", // Probably not - orange
  "#eab308", // Maybe - yellow
  "#22c55e", // Probably yes - green
  "#059669", // Definitely yes - dark green
];

const COMP_COLORS = [
  "#059669", // Much better - dark green
  "#22c55e", // Better - green
  "#eab308", // Same - yellow
  "#f97316", // Worse - orange
  "#ef4444", // Much worse - red
  "#94a3b8", // Unfamiliar - gray
];

export function ResultsCharts({ result }: { result: ResearchResult }) {
  const intentData = result.purchaseIntent.distribution.map((d, i) => ({
    name: d.label,
    count: d.count,
    fill: INTENT_COLORS[i],
  }));

  const compData = result.competitivePosition?.distribution.map((d, i) => ({
    name: d.label,
    count: d.count,
    fill: COMP_COLORS[i],
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Purchase Intent Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={intentData}
                margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {intentData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Willingness-to-Pay Spectrum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex flex-col justify-center">
            <div className="relative">
              {/* Price scale */}
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>${result.wtpRange.low}</span>
                <span>${result.wtpRange.high}</span>
              </div>
              {/* Bar */}
              <div className="w-full h-8 bg-gradient-to-r from-emerald-200 via-teal to-navy rounded-lg relative">
                {/* Mid marker */}
                <div
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  style={{
                    left: `${((result.wtpRange.mid - result.wtpRange.low) / (result.wtpRange.high - result.wtpRange.low)) * 100}%`,
                  }}
                >
                  <div className="w-0.5 h-8 bg-white" />
                  <div className="mt-2 bg-navy text-white text-xs font-medium px-2 py-1 rounded">
                    ${result.wtpRange.mid}
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
            <CardTitle className="text-base">
              Competitive Positioning vs {result.competitivePosition.competitors}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={compData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {compData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
