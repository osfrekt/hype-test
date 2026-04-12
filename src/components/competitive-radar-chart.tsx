"use client";

import { useState, useEffect } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface RadarDatum {
  dimension: string;
  yours: number;
  competitor: number;
}

export function CompetitiveRadarChart({
  data,
  yourName,
  competitorName,
}: {
  data: RadarDatum[];
  yourName: string;
  competitorName: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-80 flex items-center justify-center text-muted-foreground text-sm">Loading chart...</div>;
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="oklch(0.80 0.01 260)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: "oklch(0.45 0.02 260)" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 9 }}
            tickCount={5}
          />
          <Radar
            name={yourName}
            dataKey="yours"
            stroke="#1a6b5a"
            fill="#1a6b5a"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Radar
            name={competitorName}
            dataKey="competitor"
            stroke="#c0392b"
            fill="#c0392b"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid oklch(0.91 0.005 260)",
              backgroundColor: "#ffffff",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
