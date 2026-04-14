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
}

export function EnhanceButton({
  originalResultId,
  toolType,
  originalInput,
  topConcerns = [],
  topPositives = [],
  verbatims = [],
  featureImportance = [],
}: EnhanceButtonProps) {
  const router = useRouter();
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState("");
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkDone, setCheckDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user?.email) {
        setIsAuthenticated(true);
        // Check admin status first
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

  const hasPro = userPlan === "pro" || userPlan === "team";

  async function handleEnhance() {
    setError("");
    setEnhancing(true);

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalResultId,
          toolType,
          originalInput,
          topConcerns,
          topPositives,
          verbatims: verbatims.map((v) => ({ text: v.text || v.quote || "" })),
          featureImportance,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Enhancement failed");
        setEnhancing(false);
        return;
      }

      const result = await res.json();
      // Store in sessionStorage as backup
      try {
        sessionStorage.setItem(`research-${result.id}`, JSON.stringify(result));
      } catch {}
      router.push(`/research/${result.id}`);
    } catch {
      setError("Enhancement failed. Please try again.");
      setEnhancing(false);
    }
  }

  if (!checkDone) return null;

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30">
          <Sparkles className="w-4 h-4 mr-1.5" />
          Enhance with AI
        </Button>
      </Link>
    );
  }

  // Free/Starter — show upgrade prompt
  if (!hasPro) {
    return (
      <Link href="/pricing">
        <Button variant="outline" size="sm" className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30">
          <Sparkles className="w-4 h-4 mr-1.5" />
          Enhance
          <span className="ml-1.5 text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded-full font-medium">Pro</span>
        </Button>
      </Link>
    );
  }

  // Pro/Team — functional button
  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleEnhance}
        disabled={enhancing}
        className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30"
      >
        <Sparkles className="w-4 h-4 mr-1.5" />
        {enhancing ? "Enhancing..." : "Enhance"}
      </Button>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
