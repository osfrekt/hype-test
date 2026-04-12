"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const [hasMultipleResults, setHasMultipleResults] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user);
      setAuthChecked(true);
    });
  }, []);

  const displayName =
    authUser?.user_metadata?.name ||
    authUser?.user_metadata?.full_name ||
    authUser?.email;
  const initial = (displayName || "?").charAt(0).toUpperCase();

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
              className="w-8 h-8 text-foreground"
              viewBox="0 0 200 200"
              fill="none"
            >
              {/* Magnifying glass outline -- uses currentColor for light/dark */}
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
          {authChecked && authUser && (
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors font-medium"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/methodology"
            className="hover:text-foreground transition-colors"
          >
            Methodology
          </Link>
          <div className="relative group">
            <button className="hover:text-foreground transition-colors flex items-center gap-1">
              Tools
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="bg-card border border-border rounded-xl shadow-lg p-1.5 w-64">
                <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Free</p>
                <Link href="/research/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Consumer Research
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">Free</span>
                </Link>
                <div className="h-px bg-border mx-3 my-1" />
                <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Starter</p>
                <Link href="/ab-test/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  A/B Concept Testing
                  <span className="text-[10px] bg-teal/10 text-teal-dark dark:text-teal px-1.5 py-0.5 rounded-full font-medium">Starter</span>
                </Link>
                <Link href="/name-test/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Name Testing
                  <span className="text-[10px] bg-teal/10 text-teal-dark dark:text-teal px-1.5 py-0.5 rounded-full font-medium">Starter</span>
                </Link>
                <Link href="/pricing-test/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Pricing Optimizer
                  <span className="text-[10px] bg-teal/10 text-teal-dark dark:text-teal px-1.5 py-0.5 rounded-full font-medium">Starter</span>
                </Link>
                <div className="h-px bg-border mx-3 my-1" />
                <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pro</p>
                <Link href="/market-research/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Market Research
                  <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Pro</span>
                </Link>
                <Link href="/ad-test/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Ad Testing
                  <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Pro</span>
                </Link>
                <Link href="/logo-test/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Logo Testing
                  <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Pro</span>
                </Link>
                <Link href="/discover/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Product Discovery
                  <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Pro</span>
                </Link>
                <Link href="/audience-test/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Audience Finder
                  <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Pro</span>
                </Link>
                <Link href="/competitive/new" className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                  Competitive Teardown
                  <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Pro</span>
                </Link>
              </div>
            </div>
          </div>
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
          {authChecked && authUser ? (
            <div className="relative group/account">
              <button className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                  {initial}
                </span>
                Account
              </button>
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-150 z-50">
                <div className="bg-card border border-border rounded-xl shadow-lg p-1.5 w-40">
                  <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">Dashboard</Link>
                  <Link href="/account" className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">Account</Link>
                  <div className="h-px bg-border mx-3 my-1" />
                  <button
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      window.location.href = "/";
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-red-600 dark:text-red-400"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-foreground transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="hover:text-foreground transition-colors"
              >
                Sign Up
              </Link>
            </>
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
            href="/pricing"
            className="inline-flex md:hidden items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          {authChecked && authUser ? (
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 h-9 hover:bg-primary/90 transition-colors"
            >
              New Research
            </Link>
          ) : (
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 h-9 hover:bg-primary/90 transition-colors"
            >
              Try it free
            </Link>
          )}
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-card">
          <div className="max-w-6xl mx-auto px-6 py-4 space-y-1">
            <Link href="/research/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-foreground font-medium">Consumer Research <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-medium ml-1">Free</span></Link>
            <Link href="/ab-test/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">A/B Concept Testing</Link>
            <Link href="/name-test/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Name Testing</Link>
            <Link href="/pricing-test/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Pricing Optimizer</Link>
            <Link href="/ad-test/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Ad Testing</Link>
            <Link href="/logo-test/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Logo Testing</Link>
            <Link href="/discover/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Product Discovery</Link>
            <Link href="/audience-test/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Audience Finder</Link>
            <Link href="/competitive/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Competitive Teardown</Link>
            <Link href="/market-research/new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Market Research</Link>
            <div className="h-px bg-border my-2" />
            <Link href="/methodology" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Methodology</Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Pricing</Link>
            <Link href="/case-studies/rekt" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground">Case Study</Link>
            {authChecked && authUser ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-foreground font-medium">Dashboard</Link>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-foreground font-medium">Account</Link>
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    window.location.href = "/";
                  }}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-red-600 dark:text-red-400"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-foreground font-medium">Log In</Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-foreground font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
