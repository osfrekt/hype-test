"use client";

import { useEffect, useState } from "react";

export function ReportCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? null))
      .catch(() => {});
  }, []);

  if (count === null || count === 0) return null;

  const formatted = count.toLocaleString();

  return (
    <div className="py-10 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-teal" />
        </span>
        <span className="font-extrabold text-primary tabular-nums" style={{ fontSize: "clamp(2.5rem, 2rem + 3vw, 4rem)" }}>
          {formatted}
        </span>
      </div>
      <p className="text-lg text-muted-foreground">
        reports generated so far...and counting.
      </p>
    </div>
  );
}
