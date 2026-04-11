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

// Purchase intent distribution data
const traditionalIntent = [
  { label: "Definitely not", count: 5, pct: 5 },
  { label: "Probably not", count: 9, pct: 9 },
  { label: "Maybe", count: 22, pct: 22 },
  { label: "Probably yes", count: 38, pct: 38 },
  { label: "Definitely yes", count: 26, pct: 26 },
];

const hypetestIntent = [
  { label: "Definitely not", count: 3, pct: 6 },
  { label: "Probably not", count: 5, pct: 10 },
  { label: "Maybe", count: 12, pct: 24 },
  { label: "Probably yes", count: 18, pct: 36 },
  { label: "Definitely yes", count: 12, pct: 24 },
];

const INTENT_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#059669"];

// Feature importance data
const traditionalFeatures = [
  { feature: "Clean ingredients (no artificial)", score: 94 },
  { feature: "Energy without jitters or crash", score: 87 },
  { feature: "Low calorie / zero sugar", score: 76 },
  { feature: "Brand reputation and trust", score: 68 },
];

const hypetestFeatures = [
  { feature: "Natural caffeine sources", score: 91 },
  { feature: "No crash or jitters", score: 84 },
  { feature: "Zero sugar, low calorie", score: 79 },
  { feature: "Clean label positioning", score: 65 },
];

export function SampleReport() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Product header */}
      <div className="text-center mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full mb-3">
          Illustrative comparison
        </span>
        <h3 className="text-xl font-bold text-primary">
          Celsius Essential Energy Drink
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Comparing publicly available consumer research data with a HypeTest simulation on the same product.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Traditional Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Traditional Panel Research</p>
              <p className="text-[11px] text-muted-foreground">
                Sources:{" "}
                <a href="https://www.ey.com/en_us/newsroom/2026/03/ey-consumer-beverage-survey" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">EY Beverage Survey 2026</a>,{" "}
                <a href="https://www.hundredx.com" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">HundredX 2025</a>
              </p>
            </div>
          </div>

          {/* Purchase Intent */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Purchase Intent</p>
            <p className="text-3xl font-extrabold text-primary tracking-tight">64%</p>
            <p className="text-xs text-muted-foreground mb-3">of surveyed consumers likely to buy</p>
            <div className="h-36">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={traditionalIntent} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
                      {traditionalIntent.map((_, i) => (
                        <Cell key={i} fill={INTENT_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* WTP */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Willingness to Pay</p>
            <p className="text-2xl font-extrabold text-primary tracking-tight">$2.89 <span className="text-sm font-medium text-muted-foreground">avg / can</span></p>
            <div className="mt-3 relative">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>$2.50</span>
                <span>$3.50</span>
              </div>
              <div className="w-full h-5 bg-gradient-to-r from-emerald-200 via-teal to-primary rounded-md relative">
                <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: "39%" }}>
                  <div className="w-0.5 h-5 bg-white" />
                  <div className="mt-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">$2.89</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Feature Importance</p>
            <div className="space-y-2.5">
              {traditionalFeatures.map((f) => (
                <div key={f.feature}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{f.feature}</span>
                    <span className="text-xs font-bold text-primary">{f.score}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-muted-foreground/40 h-1.5 rounded-full" style={{ width: `${f.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Top Consumer Concerns</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>High caffeine content (200mg per can)</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Price premium over traditional energy drinks</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Taste preference varies widely</li>
            </ul>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <span>~1,000 respondents</span>
            <span className="w-px h-3 bg-border" />
            <span>4-6 weeks to field</span>
            <span className="w-px h-3 bg-border" />
            <span>$20-50k cost</span>
          </div>
        </div>

        {/* RIGHT: HypeTest */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-teal/30 pb-3">
            <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-primary">HypeTest Simulation</p>
              <p className="text-[11px] text-muted-foreground">
                Simulated via HypeTest (50 AI panellists)
              </p>
            </div>
          </div>

          {/* Purchase Intent */}
          <div className="bg-card rounded-xl border border-teal/20 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Purchase Intent</p>
            <p className="text-3xl font-extrabold text-primary tracking-tight">61%</p>
            <p className="text-xs text-muted-foreground mb-3">of simulated consumers likely to buy</p>
            <div className="h-36">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hypetestIntent} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
                      {hypetestIntent.map((_, i) => (
                        <Cell key={i} fill={INTENT_COLORS[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* WTP */}
          <div className="bg-card rounded-xl border border-teal/20 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Willingness to Pay</p>
            <p className="text-2xl font-extrabold text-primary tracking-tight">$2.75 <span className="text-sm font-medium text-muted-foreground">avg / can</span></p>
            <div className="mt-3 relative">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>$2.25</span>
                <span>$3.75</span>
              </div>
              <div className="w-full h-5 bg-gradient-to-r from-emerald-200 via-teal to-primary rounded-md relative">
                <div className="absolute top-0 -translate-x-1/2 flex flex-col items-center" style={{ left: "33%" }}>
                  <div className="w-0.5 h-5 bg-white" />
                  <div className="mt-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">$2.75</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="bg-card rounded-xl border border-teal/20 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Feature Importance</p>
            <div className="space-y-2.5">
              {hypetestFeatures.map((f) => (
                <div key={f.feature}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{f.feature}</span>
                    <span className="text-xs font-bold text-primary">{f.score}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-teal h-1.5 rounded-full" style={{ width: `${f.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <div className="bg-card rounded-xl border border-teal/20 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Top Consumer Concerns</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Caffeine sensitivity and potential overstimulation</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Price gap vs. Monster, Red Bull, and store brands</li>
              <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5 shrink-0">&bull;</span>Skepticism about "healthy energy drink" positioning</li>
            </ul>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground bg-teal/5 rounded-lg px-3 py-2 border border-teal/10">
            <span>50 respondents</span>
            <span className="w-px h-3 bg-teal/20" />
            <span>2 minutes</span>
            <span className="w-px h-3 bg-teal/20" />
            <span>Free</span>
          </div>
        </div>
      </div>

      {/* Alignment score */}
      <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-sm font-bold text-emerald-800">Directional Alignment</p>
          </div>
          <p className="text-lg font-extrabold text-emerald-700">~92%</p>
        </div>
        <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-emerald-700">3%</p>
            <p className="text-[10px] text-emerald-600">Purchase Intent gap</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-700">$0.14</p>
            <p className="text-[10px] text-emerald-600">WTP difference</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-700">4/4</p>
            <p className="text-[10px] text-emerald-600">Feature themes matched</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-700">3/3</p>
            <p className="text-[10px] text-emerald-600">Concerns aligned</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
        Traditional panel data sourced from publicly available industry reports ({" "}
        <a href="https://www.ey.com/en_us/newsroom/2026/03/ey-consumer-beverage-survey" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">EY 2026</a>,{" "}
        <a href="https://www.hundredx.com" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">HundredX</a>
        ). HypeTest results are illustrative of typical output for this product category. This is not a controlled validation study.
      </p>
    </div>
  );
}
