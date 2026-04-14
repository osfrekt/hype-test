"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Zap, BarChart3, ArrowRight } from "lucide-react";
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
      const adminRes = await fetch("/api/admin/check");
      if (adminRes.ok) {
        const adminData = await adminRes.json();
        if (adminData.isAdmin) return;
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
    <div className="rounded-2xl border-2 border-purple-400 dark:border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/40 dark:to-purple-900/20 p-6 my-8 shadow-lg shadow-purple-200/30 dark:shadow-purple-900/20" data-print-hide>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-primary mb-1">
            {isStarter ? "Unlock Pro tools" : "Get more from your research"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isStarter
              ? "Upgrade to Pro for ad testing, competitive teardowns, platform ad analysis, the Enhance feature, and 100 respondents per panel."
              : "Upgrade to run more reports, test ads across 8 platforms, analyse competitors, enhance results with AI, and get 100 respondents per panel."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              Enhance reports with AI
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              100 respondents per panel
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              12 research tools
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-6 h-10 transition-colors shadow-md shadow-purple-300/30 dark:shadow-purple-900/30"
          >
            {isStarter ? "Upgrade to Pro" : "View plans"}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
