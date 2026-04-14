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
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
        </span>
        <span>
          <span className="font-bold text-primary tabular-nums">{formatted}</span>
          {" "}research reports generated
        </span>
      </span>
    </div>
  );
}
