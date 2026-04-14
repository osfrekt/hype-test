"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Zap, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function UpgradeCta() {
  const [show, setShow] = useState(false);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user?.email) {
        setShow(true);
        return;
      }
      // Check admin
      const adminRes = await fetch("/api/admin/check");
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        if (adminData.isAdmin) return; // Don't show to admins
      }
      const { data: profile } = await supabase
        .from("users")
        .select("plan")
        .eq("email", user.email)
        .single();
      const p = profile?.plan || "free";
      setPlan(p);
      if (p === "free" || p === "starter") setShow(true);
    });
  }, []);

  if (!show) return null;

  const isStarter = plan === "starter";

  return (
    <div className="rounded-2xl border border-purple-200 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-950/20 p-6 my-8" data-print-hide>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-primary text-base mb-1">
            {isStarter ? "Unlock Pro tools" : "Get more from your research"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isStarter
              ? "Upgrade to Pro for ad testing, competitive teardowns, platform ad analysis, and the Enhance feature."
              : "Upgrade to run more reports, test ads across 8 platforms, analyse competitors, and enhance your results with AI."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-foreground">
              <Zap className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>Enhance reports with AI</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground">
              <BarChart3 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>100 respondents per panel</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>12 research tools</span>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 h-9 transition-colors"
          >
            {isStarter ? "Upgrade to Pro" : "View plans"}
          </Link>
        </div>
      </div>
    </div>
  );
}
