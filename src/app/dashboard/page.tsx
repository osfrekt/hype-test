"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface UserData {
  email: string;
  name: string | null;
  plan: string;
  research_count_this_month: number;
  discovery_count_this_month: number;
}

interface ResearchResult {
  id: string;
  input: { productName: string };
  purchase_intent: { score: number };
  created_at: string;
}

interface TestResult {
  id: string;
  input: Record<string, string>;
  created_at: string;
  type: string;
}

/* ------------------------------------------------------------------ */
/*  Plan config                                                        */
/* ------------------------------------------------------------------ */

const PLAN_LIMITS: Record<string, { research: number; discovery: number }> = {
  free: { research: 3, discovery: 0 },
  starter: { research: 30, discovery: 10 },
  pro: { research: 100, discovery: 50 },
  team: { research: 500, discovery: 200 },
};

interface Tool {
  name: string;
  description: string;
  runHref: string;
  sampleHref: string;
  minPlan: "free" | "starter" | "pro";
}

const ALL_TOOLS: Tool[] = [
  {
    name: "Consumer Research",
    description: "Simulate a consumer panel and get purchase intent, WTP, and feature priorities.",
    runHref: "/research/new",
    sampleHref: "/research/sample-rekt",
    minPlan: "free",
  },
  {
    name: "A/B Concept Testing",
    description: "Compare two product concepts head-to-head with a simulated panel.",
    runHref: "/ab-test/new",
    sampleHref: "/ab-test/sample-rekt",
    minPlan: "starter",
  },
  {
    name: "Name Testing",
    description: "Test product or brand names for appeal, memorability, and associations.",
    runHref: "/name-test/new",
    sampleHref: "/name-test/sample-rekt",
    minPlan: "starter",
  },
  {
    name: "Pricing Optimizer",
    description: "Find optimal price points with Van Westendorp and Gabor-Granger analysis.",
    runHref: "/pricing-test/new",
    sampleHref: "/pricing-test/sample-rekt",
    minPlan: "starter",
  },
  {
    name: "Ad Testing",
    description: "Evaluate ad copy and creatives for effectiveness before spending media budget.",
    runHref: "/ad-test/new",
    sampleHref: "/ad-test/sample-rekt",
    minPlan: "pro",
  },
  {
    name: "Logo Testing",
    description: "Test logo concepts for brand fit, appeal, and memorability.",
    runHref: "/logo-test/new",
    sampleHref: "/logo-test/sample-rekt",
    minPlan: "pro",
  },
  {
    name: "Product Discovery",
    description: "Explore whitespace opportunities and unmet needs in a category.",
    runHref: "/discover/new",
    sampleHref: "/discover/sample-rekt",
    minPlan: "pro",
  },
  {
    name: "Audience Finder",
    description: "Identify your most promising customer segments and their motivations.",
    runHref: "/audience-test/new",
    sampleHref: "/audience-test/sample-rekt",
    minPlan: "pro",
  },
  {
    name: "Competitive Teardown",
    description: "Benchmark against competitors with a simulated head-to-head panel.",
    runHref: "/competitive/new",
    sampleHref: "/competitive/sample-rekt",
    minPlan: "pro",
  },
];

const PLAN_RANK: Record<string, number> = { free: 0, starter: 1, pro: 2, team: 3 };

function canAccess(userPlan: string, toolMinPlan: string): boolean {
  return (PLAN_RANK[userPlan] ?? 0) >= (PLAN_RANK[toolMinPlan] ?? 0);
}

function upgradePlanLabel(toolMinPlan: string): string {
  return toolMinPlan.charAt(0).toUpperCase() + toolMinPlan.slice(1);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function testResultLink(type: string, id: string): string {
  switch (type) {
    case "A/B Test": return `/ab-test/${id}`;
    case "Name Test": return `/name-test/${id}`;
    case "Pricing Test": return `/pricing-test/${id}`;
    case "Audience Test": return `/audience-test/${id}`;
    case "Ad Test": return `/ad-test/${id}`;
    case "Logo Test": return `/logo-test/${id}`;
    case "Discovery": return `/discover/${id}`;
    default: return `/competitive/${id}`;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentResearch, setRecentResearch] = useState<ResearchResult[]>([]);
  const [recentTests, setRecentTests] = useState<TestResult[]>([]);

  const loadData = useCallback(async (email: string) => {
    const supabase = createClient();

    // User profile
    const { data: userData } = await supabase
      .from("users")
      .select("email, name, plan, research_count_this_month, discovery_count_this_month")
      .eq("email", email)
      .single();

    if (userData) {
      setUser(userData as UserData);
    } else {
      setUser({
        email,
        name: null,
        plan: "free",
        research_count_this_month: 0,
        discovery_count_this_month: 0,
      });
    }

    // Recent research (last 5)
    const { data: research } = await supabase
      .from("research_results")
      .select("id, input, purchase_intent, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(5);

    if (research) setRecentResearch(research as ResearchResult[]);

    // Recent tests (last 3 across all types)
    const testTypes = [
      { table: "discovery_results", type: "Discovery" },
      { table: "ab_test_results", type: "A/B Test" },
      { table: "name_test_results", type: "Name Test" },
      { table: "pricing_test_results", type: "Pricing Test" },
      { table: "audience_test_results", type: "Audience Test" },
      { table: "competitive_results", type: "Competitive" },
      { table: "ad_test_results", type: "Ad Test" },
      { table: "logo_test_results", type: "Logo Test" },
    ];

    const allTests: TestResult[] = [];
    for (const { table, type } of testTypes) {
      const { data: tests } = await supabase
        .from(table)
        .select("id, input, created_at")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(3);

      if (tests) {
        allTests.push(...tests.map((t) => ({ ...t, type } as TestResult)));
      }
    }
    allTests.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setRecentTests(allTests.slice(0, 3));
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user: authUserData },
      } = await supabase.auth.getUser();

      if (!authUserData) {
        router.replace("/login");
        return;
      }

      setAuthUser(authUserData);
      await loadData(authUserData.email!);
      setLoading(false);
    }
    checkAuth();
  }, [loadData, router]);

  if (loading) {
    return (
      <>
        <Nav />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!authUser || !user) return null;

  const plan = user.plan || "free";
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const displayName =
    user.name ||
    authUser.user_metadata?.name ||
    authUser.user_metadata?.full_name ||
    null;

  const usedResearch = user.research_count_this_month || 0;
  const maxResearch = limits.research;
  const progressPct =
    maxResearch === -1 ? 0 : Math.min(100, (usedResearch / maxResearch) * 100);

  const availableTools = ALL_TOOLS.filter((t) => canAccess(plan, t.minPlan));
  const lockedTools = ALL_TOOLS.filter((t) => !canAccess(plan, t.minPlan));

  return (
    <>
      <Nav />
      <main className="flex-1 py-10">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {/* ------- Header ------- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Welcome back{displayName ? `, ${displayName}` : ""}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {usedResearch} of{" "}
                {maxResearch === -1 ? "unlimited" : maxResearch} research runs
                used this month
              </p>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1 w-fit">
              {planName} plan
            </Badge>
          </div>

          {/* Usage progress bar */}
          {maxResearch !== -1 && (
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}

          {/* Upgrade CTA for Free */}
          {plan === "free" && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">
                    Upgrade to unlock more tools
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get A/B testing, name testing, pricing optimizer, and more.
                  </p>
                </div>
                <Link href="/pricing">
                  <Button size="sm">View plans</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* ------- Run Research ------- */}
          <section>
            <h2 className="text-lg font-semibold text-primary mb-4">
              Run Research
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTools.map((tool) => (
                <Card key={tool.name} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between gap-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <Link href={tool.runHref} className="flex-1">
                        <Button size="sm" className="w-full">
                          Run
                        </Button>
                      </Link>
                      <Link
                        href={tool.sampleHref}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                      >
                        View sample
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ------- Locked tools ------- */}
          {lockedTools.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-primary mb-4">
                Unlock more tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedTools.map((tool) => (
                  <Card
                    key={tool.name}
                    className="flex flex-col opacity-60 relative"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Lock size={14} className="text-muted-foreground" />
                          {tool.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-[10px]">
                          {upgradePlanLabel(tool.minPlan)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between gap-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                      <Link href="/pricing">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          Upgrade to {upgradePlanLabel(tool.minPlan)}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* ------- Recent Research ------- */}
          <section>
            <h2 className="text-lg font-semibold text-primary mb-4">
              Recent Research
            </h2>
            {recentResearch.length === 0 && recentTests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t run any research yet. Start your first one
                    above.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {recentResearch.map((r) => (
                  <Link key={r.id} href={`/research/${r.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {r.input?.productName || "Untitled"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Consumer Research &middot;{" "}
                            {new Date(r.created_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.purchase_intent?.score != null && (
                            <Badge
                              variant="outline"
                              className="text-xs tabular-nums"
                            >
                              PI: {r.purchase_intent.score}%
                            </Badge>
                          )}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                {recentTests.map((t) => {
                  const testName =
                    t.input?.productName ||
                    t.input?.brandName ||
                    t.input?.name ||
                    "Untitled";
                  return (
                    <Link
                      key={`${t.type}-${t.id}`}
                      href={testResultLink(t.type, t.id)}
                    >
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {testName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t.type} &middot;{" "}
                              {new Date(t.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}

                <div className="text-center pt-2">
                  <Link
                    href="/account"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View all results in Account
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
