"use client";

import { useMemo, useState } from "react";
import {
  RESTAURANTS,
  DEFAULT_WEIGHTS,
  WEIGHT_LABELS,
  rankRestaurants,
  type Weights,
  type SushiRestaurant,
} from "@/lib/sushi-data";
import { cn } from "@/lib/utils";

const PRICE_FILTERS = [
  { label: "Any", value: 0 },
  { label: "££", value: 2 },
  { label: "£££", value: 3 },
  { label: "££££", value: 4 },
  { label: "£££££", value: 5 },
] as const;

export default function SushiApp() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [priceMax, setPriceMax] = useState<number>(0);
  const [query, setQuery] = useState("");
  const [tuningOpen, setTuningOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESTAURANTS.filter((r) => {
      if (priceMax !== 0 && r.priceLevel > priceMax) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.neighborhood.toLowerCase().includes(q) ||
        r.specialty.toLowerCase().includes(q) ||
        r.style.toLowerCase().includes(q)
      );
    });
  }, [priceMax, query]);

  const ranked = useMemo(() => rankRestaurants(filtered, weights), [filtered, weights]);

  const topScore = ranked[0]?.score ?? 100;

  return (
    <div className="mx-auto w-full max-w-md pb-24">
      {/* iOS-style sticky header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#fff8f1]/80 dark:bg-[#0a0a0a]/80 border-b border-black/5 dark:border-white/10">
        <div className="px-5 pt-3 pb-2">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c5323b]">
                Sushi · London
              </p>
              <h1 className="text-[28px] font-bold tracking-tight leading-none mt-0.5">
                寿司 Counter
              </h1>
            </div>
            <button
              onClick={() => setTuningOpen((v) => !v)}
              className={cn(
                "h-9 px-3 rounded-full text-xs font-semibold transition-colors",
                "bg-black/5 dark:bg-white/10 active:bg-black/10 dark:active:bg-white/20",
              )}
              aria-expanded={tuningOpen}
            >
              {tuningOpen ? "Done" : "Tune"}
            </button>
          </div>

          {/* Search */}
          <div className="mt-3 relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, area, style…"
              className={cn(
                "w-full h-10 rounded-xl pl-9 pr-3 text-[15px]",
                "bg-black/5 dark:bg-white/10 border-0 outline-none",
                "placeholder:text-black/40 dark:placeholder:text-white/40",
                "focus:bg-black/10 dark:focus:bg-white/15 transition-colors",
              )}
              type="search"
              enterKeyHint="search"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Price pills */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {PRICE_FILTERS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPriceMax(p.value)}
                className={cn(
                  "shrink-0 h-7 px-3 rounded-full text-[12px] font-semibold transition-colors",
                  priceMax === p.value
                    ? "bg-[#1a1a1a] text-white dark:bg-white dark:text-[#0a0a0a]"
                    : "bg-black/5 dark:bg-white/10 text-[#1a1a1a] dark:text-white/80",
                )}
              >
                {p.label === "Any" ? "Any price" : p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tuning panel */}
        {tuningOpen && (
          <div className="px-5 pb-4 pt-1 border-t border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/[0.03]">
            <p className="text-[11px] text-black/50 dark:text-white/50 mt-2 mb-3">
              Drag to set what matters. Ranking updates live.
            </p>
            <div className="space-y-3">
              {(Object.keys(WEIGHT_LABELS) as (keyof Weights)[]).map((k) => (
                <WeightSlider
                  key={k}
                  label={WEIGHT_LABELS[k].label}
                  emoji={WEIGHT_LABELS[k].emoji}
                  hint={WEIGHT_LABELS[k].hint}
                  value={weights[k]}
                  onChange={(v) => setWeights({ ...weights, [k]: v })}
                />
              ))}
            </div>
            <button
              onClick={() => setWeights(DEFAULT_WEIGHTS)}
              className="mt-3 text-[12px] font-semibold text-[#c5323b]"
            >
              Reset defaults
            </button>
          </div>
        )}
      </header>

      {/* Results summary */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <p className="text-[13px] text-black/60 dark:text-white/60">
          {ranked.length} {ranked.length === 1 ? "restaurant" : "restaurants"} · ranked for you
        </p>
        {ranked[0] && (
          <span className="text-[11px] font-semibold text-[#c5323b]">
            #1 {ranked[0].name.split(" ")[0]}
          </span>
        )}
      </div>

      {/* Ranked list */}
      <div className="px-4 space-y-3">
        {ranked.length === 0 && (
          <div className="rounded-2xl bg-black/5 dark:bg-white/5 p-8 text-center text-sm text-black/60 dark:text-white/60">
            No matches. Try clearing filters.
          </div>
        )}
        {ranked.map((r, i) => (
          <RestaurantCard
            key={r.slug}
            restaurant={r}
            rank={i + 1}
            topScore={topScore}
            isExpanded={expanded === r.slug}
            onToggle={() =>
              setExpanded((cur) => (cur === r.slug ? null : r.slug))
            }
          />
        ))}
      </div>

      {/* Footer note */}
      <p className="px-5 pt-8 pb-4 text-[11px] text-black/40 dark:text-white/40 text-center leading-relaxed">
        Scores are editorial, not affiliated with the restaurants. Book directly
        where you can — counters here move fast.
      </p>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        input[type="range"].ios-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.12);
          outline: none;
        }
        :is(.dark) input[type="range"].ios-range {
          background: rgba(255, 255, 255, 0.18);
        }
        input[type="range"].ios-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.12);
          cursor: pointer;
        }
        input[type="range"].ios-range::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: #ffffff;
          border: none;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.12);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function WeightSlider({
  label,
  emoji,
  hint,
  value,
  onChange,
}: {
  label: string;
  emoji: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{emoji}</span>
          <div>
            <p className="text-[13px] font-semibold leading-tight">{label}</p>
            <p className="text-[11px] text-black/45 dark:text-white/45 leading-tight">
              {hint}
            </p>
          </div>
        </div>
        <span className="text-[12px] font-mono font-semibold text-[#c5323b] tabular-nums">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ios-range"
      />
    </div>
  );
}

function RestaurantCard({
  restaurant: r,
  rank,
  topScore,
  isExpanded,
  onToggle,
}: {
  restaurant: SushiRestaurant & { score: number };
  rank: number;
  topScore: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const scorePct = (r.score / Math.max(topScore, 1)) * 100;
  const isTop = rank === 1;

  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full text-left rounded-2xl bg-white dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/10",
        "transition-all duration-200 active:scale-[0.99]",
        isTop && "ring-2 ring-[#c5323b]/40 shadow-[0_8px_24px_-8px_rgba(197,50,59,0.35)]",
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "shrink-0 w-10 h-10 rounded-xl grid place-items-center text-[15px] font-bold",
              isTop
                ? "bg-[#c5323b] text-white"
                : "bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70",
            )}
          >
            {rank}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2 className="font-bold text-[16px] leading-tight truncate">
                {r.name}
              </h2>
              {r.michelinStars > 0 && (
                <span
                  className="text-[10px] font-bold text-[#c5323b] tracking-wide"
                  aria-label={`${r.michelinStars} Michelin stars`}
                >
                  {"★".repeat(r.michelinStars)} MICHELIN
                </span>
              )}
            </div>
            <p className="text-[12px] text-black/55 dark:text-white/55 mt-0.5">
              {r.neighborhood} · {r.style} · {r.price}
            </p>
            <p className="text-[13px] text-black/75 dark:text-white/75 mt-1.5 leading-snug">
              {r.specialty}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[22px] font-bold tabular-nums leading-none">
              {r.score.toFixed(1)}
            </p>
            <p className="text-[10px] text-black/45 dark:text-white/45 uppercase tracking-wider mt-0.5">
              / 100
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-3 h-1 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isTop ? "bg-[#c5323b]" : "bg-black/60 dark:bg-white/60",
            )}
            style={{ width: `${Math.min(100, scorePct)}%` }}
          />
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10">
            <p className="text-[13px] leading-relaxed text-black/75 dark:text-white/75">
              {r.description}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              <Stat label="Avg per person" value={`£${r.avgPerPerson}`} />
              <Stat label="Style" value={r.style} />
              <Stat label="Reservation" value={r.reservation} />
              <Stat label="Don't miss" value={r.standout} />
            </div>

            <div className="mt-4 space-y-2">
              {(Object.keys(WEIGHT_LABELS) as (keyof typeof WEIGHT_LABELS)[]).map(
                (k) => (
                  <ScoreBar
                    key={k}
                    label={WEIGHT_LABELS[k].label}
                    value={r.scores[k]}
                  />
                ),
              )}
            </div>

            <p className="text-[11px] text-black/45 dark:text-white/45 mt-3">
              {r.address}
            </p>

            <div className="flex gap-2 mt-3">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  `${r.name} ${r.address} London`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 h-10 rounded-xl bg-[#1a1a1a] text-white dark:bg-white dark:text-[#0a0a0a] text-[13px] font-semibold grid place-items-center active:opacity-80"
              >
                Open in Maps
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `${r.name} London reservation`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 h-10 rounded-xl bg-black/5 dark:bg-white/10 text-[13px] font-semibold grid place-items-center active:opacity-80"
              >
                Book
              </a>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-black/45 dark:text-white/45">
        {label}
      </p>
      <p className="text-[13px] font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] w-24 shrink-0 text-black/60 dark:text-white/60">
        {label}
      </span>
      <div className="flex-1 h-1 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#c5323b]/80"
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-[11px] font-mono tabular-nums w-6 text-right">
        {value}
      </span>
    </div>
  );
}
