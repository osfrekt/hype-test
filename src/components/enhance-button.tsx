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

function buildEnhancedUrl(props: EnhanceButtonProps): string {
  const { originalInput, topConcerns = [], topPositives = [], featureImportance = [] } = props;

  const concernsList = topConcerns.slice(0, 5).join("; ");
  const positivesList = topPositives.slice(0, 5).join("; ");
  const topFeatures = featureImportance
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((f) => f.feature)
    .join("; ");

  const originalDesc = String(originalInput.productDescription || "");
  const enhancement = [
    concernsList ? `Address these consumer concerns: ${concernsList}` : "",
    positivesList ? `Double down on these strengths: ${positivesList}` : "",
    topFeatures ? `Prioritise these features in messaging: ${topFeatures}` : "",
  ].filter(Boolean).join("\n");

  const enhancedDesc = `${originalDesc}\n\nENHANCED POSITIONING (based on consumer feedback):\n${enhancement}`;

  const params = new URLSearchParams();
  if (originalInput.productName) params.set("productName", String(originalInput.productName));
  params.set("productDescription", enhancedDesc);
  if (originalInput.category) params.set("category", String(originalInput.category));
  if (originalInput.priceUnit) params.set("priceUnit", String(originalInput.priceUnit));
  if (originalInput.targetMarket) params.set("targetMarket", String(originalInput.targetMarket));
  if (originalInput.competitors) params.set("competitors", String(originalInput.competitors));
  params.set("enhanced", "true");

  return `/research/new?${params.toString()}`;
}

export function EnhanceButton(props: EnhanceButtonProps) {
  const { variant = "compact" } = props;
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkDone, setCheckDone] = useState(false);

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

  if (!checkDone) return null;

  const hasPro = userPlan === "pro" || userPlan === "team";
  const enhanceUrl = buildEnhancedUrl(props);

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
      <Link href={enhanceUrl}>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
          <Sparkles className="w-4 h-4 mr-1.5" />
          Enhance
        </Button>
      </Link>
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
              Automatically improve your product positioning based on the consumer feedback in this report.
              Enhance creates a new research report with your description updated to address concerns,
              double down on strengths, and prioritise the features that matter most to consumers.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Uses 1 research report credit. You can review and edit the enhanced description before running.
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
            Automatically improve your product positioning based on the consumer feedback above.
            Enhance creates a new research report with your description updated to address concerns,
            double down on strengths, and prioritise the features consumers care about most.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Uses 1 research report credit. You can review and edit the enhanced description before running.
          </p>
          <Link href={enhanceUrl}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Enhance this report
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
