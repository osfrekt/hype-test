"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface EnhanceButtonProps {
  originalResultId: string;
  toolType: string;
  originalInput: Record<string, unknown>;
  topConcerns?: string[];
  topPositives?: string[];
  verbatims?: { text?: string; quote?: string }[];
  featureImportance?: { feature: string; score: number }[];
  variant?: "compact" | "full";
}

export function EnhanceButton(props: EnhanceButtonProps) {
  const {
    originalInput,
    topConcerns = [],
    topPositives = [],
    featureImportance = [],
    variant = "compact",
  } = props;
  const router = useRouter();
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkDone, setCheckDone] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user?.email) {
        setIsAuthenticated(true);
        const adminRes = await fetch("/api/admin/check");
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          if (adminData.isAdmin) {
            setUserPlan("team");
            setCheckDone(true);
            return;
          }
        }
        const { data: profile } = await supabase
          .from("users")
          .select("plan")
          .eq("email", user.email)
          .single();
        setUserPlan(profile?.plan || "free");
      }
      setCheckDone(true);
    });
  }, []);

  async function handleEnhance() {
    setError("");
    setEnhancing(true);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalInput,
          topConcerns,
          topPositives,
          featureImportance,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Enhancement failed");
        setEnhancing(false);
        return;
      }

      const enhanced = await res.json();
      const params = new URLSearchParams();
      if (enhanced.productName) params.set("productName", enhanced.productName);
      if (enhanced.productDescription) params.set("productDescription", enhanced.productDescription);
      if (enhanced.category) params.set("category", enhanced.category);
      if (enhanced.priceUnit) params.set("priceUnit", enhanced.priceUnit);
      if (enhanced.targetMarket) params.set("targetMarket", enhanced.targetMarket);
      if (enhanced.competitors) params.set("competitors", enhanced.competitors);
      params.set("enhanced", "true");

      router.push(`/research/new?${params.toString()}`);
    } catch {
      setError("Enhancement failed. Please try again.");
      setEnhancing(false);
    }
  }

  if (!checkDone) return null;

  const hasPro = userPlan === "pro" || userPlan === "team";

  // ── Compact variant (top action bar) ──
  if (variant === "compact") {
    if (!isAuthenticated || !hasPro) {
      return (
        <Link href="/pricing">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Sparkles className="w-4 h-4 mr-1.5" />
            Enhance
            <span className="ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-medium">Pro</span>
          </Button>
        </Link>
      );
    }

    return (
      <div>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleEnhance}
          disabled={enhancing}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          {enhancing ? "Generating..." : "Enhance"}
        </Button>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  // ── Full variant (bottom section) ──
  if (!isAuthenticated || !hasPro) {
    return (
      <div className="rounded-2xl border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 p-6 my-8" data-print-hide>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-primary mb-1">Enhance this report</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Use AI to rewrite your product positioning based on the consumer feedback in this report.
              Enhance analyses the concerns, strengths, and feature preferences from your panel and
              generates a clean, improved product description ready for a second research run.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              You can review and edit the enhanced description before running. Uses 1 research report credit.
            </p>
            <Link href="/pricing">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Upgrade to Pro to Enhance
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 p-6 my-8" data-print-hide>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-primary mb-1">Enhance this report</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Use AI to rewrite your product positioning based on the consumer feedback above.
            Enhance analyses the concerns, strengths, and feature preferences from your panel and
            generates a clean, improved product description ready for a second research run.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            You can review and edit the enhanced description before running. Uses 1 research report credit.
          </p>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleEnhance}
            disabled={enhancing}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            {enhancing ? "Generating enhanced description..." : "Enhance this report"}
          </Button>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
