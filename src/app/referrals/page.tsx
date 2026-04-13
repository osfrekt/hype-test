"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Referral {
  id: number;
  referred_email: string;
  status: string;
  created_at: string;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  if (local.length <= 3) return local + "@" + domain;
  return local.slice(0, 2) + "***" + local.slice(-1) + "@" + domain;
}

export default function ReferralsPage() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [bonusRuns, setBonusRuns] = useState(0);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) {
        router.replace("/login");
        return;
      }

      // Get user's referral code and bonus runs
      const { data: userData } = await supabase
        .from("users")
        .select("referral_code, bonus_runs")
        .eq("email", user.email)
        .single();

      if (userData) {
        setReferralCode(userData.referral_code);
        setBonusRuns(userData.bonus_runs || 0);
      }

      // Get referrals
      const { data: refs } = await supabase
        .from("referrals")
        .select("id, referred_email, status, created_at")
        .eq("referrer_email", user.email)
        .order("created_at", { ascending: false });

      if (refs) setReferrals(refs as Referral[]);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="flex-1 py-12">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-primary mb-1">Referral Program</h1>
            <p className="text-sm text-muted-foreground">
              Share HypeTest with friends. When they sign up and you both get 3 extra research runs.
            </p>
          </div>

          {/* Referral link */}
          <Card className="border-teal/20 bg-teal/5">
            <CardContent className="py-6">
              <p className="text-sm font-medium text-primary mb-3">Your referral link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted px-3 py-2 rounded font-mono overflow-x-auto break-all">
                  <span className="hidden sm:inline">https://hypetest.ai/?ref={referralCode || "..."}</span>
                  <span className="sm:hidden">?ref={referralCode || "..."}</span>
                </code>
                <Button
                  size="sm"
                  onClick={() => {
                    if (referralCode) {
                      navigator.clipboard.writeText(`https://hypetest.ai/?ref=${referralCode}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              {bonusRuns > 0 && (
                <p className="text-sm text-emerald-600 font-medium mt-3">
                  You have {bonusRuns} bonus research runs from referrals!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Referral history */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Your Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No referrals yet. Share your link to get started!
                </p>
              ) : (
                <div className="space-y-2">
                  {referrals.map((ref) => (
                    <div key={ref.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm text-foreground">{maskEmail(ref.referred_email)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(ref.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        ref.status === "completed"
                          ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {ref.status === "completed" ? "+3 runs" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
