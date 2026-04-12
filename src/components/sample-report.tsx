"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const INTENT_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#059669"];
const INTENT_LABELS = ["Definitely not", "Probably not", "Maybe", "Probably yes", "Definitely yes"];

const traditionalIntent = INTENT_LABELS.map((label, i) => ({
  label,
  traditional: [5, 9, 22, 38, 26][i],
  hypetest: [6, 10, 24, 36, 24][i],
}));

const features = [
  { label: "Clean ingredients", traditional: 94, hypetest: 91 },
  { label: "No jitters or crash", traditional: 87, hypetest: 84 },
  { label: "Zero sugar / low cal", traditional: 76, hypetest: 79 },
  { label: "Brand trust / positioning", traditional: 68, hypetest: 65 },
];

function SourceBadge({ variant }: { variant: "traditional" | "hypetest" }) {
  if (variant === "traditional") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
        Traditional
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-teal" />
      HypeTest
    </span>
  );
}

export function SampleReport() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* Product header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/30 px-2.5 py-1 rounded-full mb-3">
          Illustrative example only
        </span>
        <h3 className="text-xl font-bold text-primary">
          Energy Drink Category Example
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-lg mx-auto">
          This illustrative example shows how HypeTest results compare
          directionally to publicly available industry data for a well-known
          energy drink. All figures are approximate estimates, not exact data.
        </p>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/30 rounded-lg px-3 py-2 mt-3 max-w-lg mx-auto">
          <p className="text-[11px] text-amber-800 dark:text-amber-300 text-center">
            This is not a validation study. Traditional panel figures are
            estimated from public industry reports, not sourced directly from
            any specific brand or research firm. HypeTest results are simulated.
            No brand endorses or is affiliated with this comparison.
          </p>
        </div>
      </div>

      {/* ---- METRIC 1: Purchase Intent ---- */}
      <section className="bg-card rounded-2xl border border-border p-5 sm:p-6">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Purchase Intent
        </h4>

        {/* Big numbers side by side */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <SourceBadge variant="traditional" />
            <p className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mt-1">64%</p>
            <p className="text-[11px] text-muted-foreground">~1,000 surveyed consumers</p>
          </div>
          <div>
            <SourceBadge variant="hypetest" />
            <p className="text-3xl sm:text-4xl font-extrabold text-teal tracking-tight mt-1">61%</p>
            <p className="text-[11px] text-muted-foreground">50 simulated consumers</p>
          </div>
        </div>

        {/* Overlaid distribution chart */}
        <div className="h-44 sm:h-52">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={traditionalIntent} margin={{ top: 10, right: 0, left: -15, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.005 260)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 9 }} unit="%" />
                <Bar dataKey="traditional" name="Traditional" radius={[3, 3, 0, 0]} opacity={0.5}>
                  {traditionalIntent.map((_, i) => (
                    <Cell key={i} fill={INTENT_COLORS[i]} />
                  ))}
                </Bar>
                <Bar dataKey="hypetest" name="HypeTest" radius={[3, 3, 0, 0]}>
                  {traditionalIntent.map((_, i) => (
                    <Cell key={i} fill={INTENT_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-emerald-500/50" /> Traditional</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-emerald-500" /> HypeTest</span>
        </div>
      </section>

      {/* ---- METRIC 2: Willingness to Pay ---- */}
      <section className="bg-card rounded-2xl border border-border p-5 sm:p-6">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Willingness to Pay
        </h4>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <SourceBadge variant="traditional" />
            <p className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-1">$2.89</p>
            <p className="text-[11px] text-muted-foreground">avg per can</p>
          </div>
          <div>
            <SourceBadge variant="hypetest" />
            <p className="text-2xl sm:text-3xl font-extrabold text-teal tracking-tight mt-1">$2.75</p>
            <p className="text-[11px] text-muted-foreground">avg per can</p>
          </div>
        </div>

        {/* Dual WTP spectrums stacked */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>$2.50</span>
              <SourceBadge variant="traditional" />
              <span>$3.50</span>
            </div>
            <div className="w-full h-4 bg-gradient-to-r from-emerald-200 via-teal/60 to-primary/60 rounded-md relative">
              <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: "39%" }}>
                <div className="w-0.5 h-4 bg-white" />
                <div className="mt-0.5 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">$2.89</div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>$2.25</span>
              <SourceBadge variant="hypetest" />
              <span>$3.75</span>
            </div>
            <div className="w-full h-4 bg-gradient-to-r from-emerald-200 via-teal/60 to-teal rounded-md relative">
              <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: "33%" }}>
                <div className="w-0.5 h-4 bg-white" />
                <div className="mt-0.5 bg-teal text-white text-[9px] font-bold px-1.5 py-0.5 rounded">$2.75</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- METRIC 3: Feature Importance ---- */}
      <section className="bg-card rounded-2xl border border-border p-5 sm:p-6">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Feature Importance
        </h4>

        <div className="space-y-4">
          {features.map((f) => (
            <div key={f.label}>
              <p className="text-xs font-medium text-primary mb-2">{f.label}</p>
              {/* Traditional bar */}
              <div className="flex items-center gap-2 mb-1">
                <SourceBadge variant="traditional" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-muted-foreground/40 h-2 rounded-full" style={{ width: `${f.traditional}%` }} />
                </div>
                <span className="text-xs font-bold text-primary w-8 text-right">{f.traditional}%</span>
              </div>
              {/* HypeTest bar */}
              <div className="flex items-center gap-2">
                <SourceBadge variant="hypetest" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-teal h-2 rounded-full" style={{ width: `${f.hypetest}%` }} />
                </div>
                <span className="text-xs font-bold text-teal w-8 text-right">{f.hypetest}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- METRIC 4: Top Concerns ---- */}
      <section className="bg-card rounded-2xl border border-border p-5 sm:p-6">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Top Consumer Concerns
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <SourceBadge variant="traditional" />
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>High caffeine content concerns</li>
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Price premium over category average</li>
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Taste preference varies widely</li>
            </ul>
          </div>
          <div>
            <SourceBadge variant="hypetest" />
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Caffeine sensitivity and overstimulation</li>
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Price gap vs. mainstream competitors</li>
              <li className="flex items-start gap-1.5"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Skepticism about health positioning</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Alignment Score ---- */}
      <section className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/30 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Directional Alignment</p>
          </div>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">~92%</p>
        </div>
        <div className="w-full h-2.5 bg-emerald-200 dark:bg-emerald-900/50 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">3%</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Intent gap</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">$0.14</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500">WTP difference</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">4/4</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Features matched</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">3/3</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Concerns aligned</p>
          </div>
        </div>
      </section>

      {/* ---- Cost comparison ---- */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-xl p-4 text-center border border-border">
          <SourceBadge variant="traditional" />
          <p className="text-lg font-bold text-primary mt-2">$20-50k</p>
          <p className="text-[10px] text-muted-foreground">4-6 weeks, ~1,000 respondents</p>
        </div>
        <div className="bg-teal/5 rounded-xl p-4 text-center border border-teal/20">
          <SourceBadge variant="hypetest" />
          <p className="text-lg font-bold text-teal mt-2">Free</p>
          <p className="text-[10px] text-muted-foreground">2 minutes, 50 respondents</p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
        Traditional panel figures are approximate estimates based on publicly
        available industry reports and are not sourced from or endorsed by any
        specific research firm or brand. HypeTest results are AI-simulated and
        illustrative of typical output for this product category. This is not a
        controlled validation study. All brand names are trademarks of their
        respective owners and are used here for illustrative purposes only.
      </p>
    </div>
  );
}
