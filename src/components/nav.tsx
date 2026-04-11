"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const [hasMultipleResults, setHasMultipleResults] = useState(false);

  function cycleTheme() {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
  }

  const themeIcon = theme === "light" ? <Sun size={16} /> : theme === "dark" ? <Moon size={16} /> : <Monitor size={16} />;
  const themeLabel = theme === "light" ? "Light mode" : theme === "dark" ? "Dark mode" : "System theme";

  useEffect(() => {
    try {
      let count = 0;
      for (let i = 0; i < sessionStorage.length; i++) {
        if (sessionStorage.key(i)?.startsWith("research-")) count++;
        if (count >= 2) break;
      }
      setHasMultipleResults(count >= 2);
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
              className="w-8 h-8 text-foreground"
              viewBox="0 0 200 200"
              fill="none"
            >
              {/* Magnifying glass outline — uses currentColor for light/dark */}
              <circle cx="88" cy="88" r="48" stroke="currentColor" strokeWidth="10" />
              <line x1="122" y1="122" x2="160" y2="160" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
              {/* Bar chart inside the lens */}
              <rect x="64" y="98" width="10" height="22" rx="2" fill="#0e7490" opacity="0.7" />
              <rect x="78" y="82" width="10" height="38" rx="2" fill="#0891b2" />
              <rect x="92" y="90" width="10" height="30" rx="2" fill="#0e7490" opacity="0.7" />
              <rect x="106" y="72" width="10" height="48" rx="2" fill="#0891b2" opacity="0.85" />
              {/* Scatter dots */}
              <circle cx="72" cy="72" r="3" fill="#0891b2" opacity="0.5" />
              <circle cx="96" cy="65" r="3" fill="#0891b2" opacity="0.5" />
              <circle cx="108" cy="60" r="2.5" fill="#0891b2" opacity="0.4" />
            </svg>
          <span className="font-semibold text-foreground text-lg tracking-tight">
            HypeTest
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link
            href="/methodology"
            className="hover:text-foreground transition-colors"
          >
            Methodology
          </Link>
          <Link
            href="/discover/new"
            className="hover:text-foreground transition-colors"
          >
            Discover
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-medium ml-1">
              Pro
            </span>
          </Link>
          <Link
            href="/pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          {hasMultipleResults && (
            <Link
              href="/compare"
              className="hover:text-foreground transition-colors"
            >
              Compare
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={cycleTheme}
            title={themeLabel}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
          >
            {themeIcon}
          </button>
          <Link
            href="/research/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 h-9 hover:bg-primary/90 transition-colors"
          >
            Try it free
          </Link>
        </div>
      </div>
    </header>
  );
}
