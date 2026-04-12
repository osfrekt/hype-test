"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserData {
  email: string;
  name: string | null;
  company: string | null;
  role: string | null;
  plan: string;
  research_count_this_month: number;
  discovery_count_this_month: number;
  stripe_customer_id: string | null;
}

interface ResearchResult {
  id: string;
  input: { productName: string };
  purchase_intent: { score: number };
  created_at: string;
}

interface DiscoveryResult {
  id: string;
  input: { brandName: string; category: string };
  created_at: string;
}

interface TestResult {
  id: string;
  input: Record<string, unknown>;
  created_at: string;
  type: string;
}

const PLAN_LIMITS: Record<string, { research: number; discovery: number }> = {
  free: { research: 3, discovery: 0 },
  starter: { research: 15, discovery: 3 },
  pro: { research: -1, discovery: -1 },
  team: { research: -1, discovery: -1 },
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <>
          <Nav />
          <main className="flex-1 py-12">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const searchParams = useSearchParams();
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([]);
  const [discoveryResults, setDiscoveryResults] = useState<DiscoveryResult[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [slackStatus, setSlackStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "testing" | "tested" | "test-error"
  >("idle");

  const loadUserData = useCallback(async (email: string) => {
    const supabase = createClient();

    // Fetch user profile from users table
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userData) {
      setUser(userData as UserData);
    } else {
      // User exists in auth but not in users table yet - create minimal profile
      setUser({
        email,
        name: null,
        company: null,
        role: null,
        plan: "free",
        research_count_this_month: 0,
        discovery_count_this_month: 0,
        stripe_customer_id: null,
      });
    }

    // Fetch research results
    const { data: research } = await supabase
      .from("research_results")
      .select("id, input, purchase_intent, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (research) setResearchResults(research as ResearchResult[]);

    // Fetch discovery results
    const { data: discovery } = await supabase
      .from("discovery_results")
      .select("id, input, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false });

    if (discovery) setDiscoveryResults(discovery as DiscoveryResult[]);

    // Fetch test results (all types)
    const testTypes = [
      { table: "ab_test_results", type: "A/B Test" },
      { table: "name_test_results", type: "Name Test" },
      { table: "pricing_test_results", type: "Pricing Test" },
      { table: "audience_test_results", type: "Audience Test" },
      { table: "competitive_results", type: "Competitive" },
      { table: "ad_test_results", type: "Ad Test" },
    ];

    const allTests: TestResult[] = [];
    for (const { table, type } of testTypes) {
      const { data: tests } = await supabase
        .from(table)
        .select("id, input, created_at")
        .eq("email", email)
        .order("created_at", { ascending: false });

      if (tests) {
        allTests.push(
          ...tests.map((t) => ({ ...t, type } as TestResult))
        );
      }
    }
    allTests.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setTestResults(allTests);

    // Fetch Slack webhook
    fetch(`/api/integrations/slack?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.slackWebhookUrl) {
          setSlackWebhookUrl(data.slackWebhookUrl);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user: authUserData },
      } = await supabase.auth.getUser();

      if (authUserData) {
        setAuthUser(authUserData);
        await loadUserData(authUserData.email!);
      }
      setLoading(false);
    }
    checkAuth();
  }, [loadUserData]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAuthUser(null);
    setUser(null);
    sessionStorage.removeItem("ht-email");
  }

  async function handleManageBilling() {
    if (!user?.stripe_customer_id || !authUser?.email) return;
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authUser.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // handle error
    }
  }

  if (loading) {
    return (
      <>
        <Nav />
        <main className="flex-1 py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not authenticated -- show login/signup CTA
  if (!authUser) {
    return (
      <>
        <Nav />
        <main className="flex-1 py-12">
          <div className="max-w-md mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary mb-2">
                My Account
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to view your research history and manage your account.
              </p>
            </div>

            <Card>
              <CardContent className="py-8 text-center space-y-4">
                <Link href="/login">
                  <Button className="w-full h-11">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="w-full h-11">
                    Create an account
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/research/new"
                className="text-primary hover:underline"
              >
                Run your first research
              </Link>{" "}
              and one will be created automatically.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Authenticated -- show account dashboard
  const displayName =
    user?.name ||
    authUser.user_metadata?.name ||
    authUser.user_metadata?.full_name ||
    authUser.email;
  const userEmail = authUser.email!;
  const plan = user?.plan || "free";
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {(displayName || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">
                  {displayName}
                </h1>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {planName} plan
            </Badge>
          </div>

          {searchParams.get("checkout") === "success" && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4">
              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                Payment successful! Your plan has been upgraded.
              </p>
            </div>
          )}

          {/* Usage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Research runs this month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {user?.research_count_this_month || 0}
                  <span className="text-base font-normal text-muted-foreground">
                    {limits.research === -1
                      ? " / unlimited"
                      : ` / ${limits.research}`}
                  </span>
                </div>
                {limits.research !== -1 && (
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, ((user?.research_count_this_month || 0) / limits.research) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Discovery runs this month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {user?.discovery_count_this_month || 0}
                  <span className="text-base font-normal text-muted-foreground">
                    {limits.discovery === -1
                      ? " / unlimited"
                      : limits.discovery === 0
                        ? " / 0 (upgrade to unlock)"
                        : ` / ${limits.discovery}`}
                  </span>
                </div>
                {limits.discovery > 0 && (
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, ((user?.discovery_count_this_month || 0) / limits.discovery) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upgrade CTA */}
          {plan === "free" && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">
                    Upgrade your plan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get more research runs, discovery, and advanced tests.
                  </p>
                </div>
                <Link href="/pricing">
                  <Button size="sm">View plans</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Tabs for results */}
          <Tabs defaultValue="research">
            <TabsList variant="line">
              <TabsTrigger value="research">
                My Research ({researchResults.length})
              </TabsTrigger>
              <TabsTrigger value="discovery">
                My Discovery ({discoveryResults.length})
              </TabsTrigger>
              <TabsTrigger value="tests">
                My Tests ({testResults.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="research">
              {researchResults.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      No research results yet.
                    </p>
                    <Link href="/research/new">
                      <Button variant="outline" size="sm">
                        Run your first research
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {researchResults.map((r) => (
                    <Link key={r.id} href={`/research/${r.id}`}>
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {r.input?.productName || "Untitled"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(r.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
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
                </div>
              )}
            </TabsContent>

            <TabsContent value="discovery">
              {discoveryResults.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      No discovery results yet.
                    </p>
                    <Link href="/discover/new">
                      <Button variant="outline" size="sm">
                        Run product discovery
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {discoveryResults.map((d) => (
                    <Link key={d.id} href={`/discover/${d.id}`}>
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardContent className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {d.input?.brandName || "Untitled"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {d.input?.category && (
                                <span className="capitalize">
                                  {d.input.category} &middot;{" "}
                                </span>
                              )}
                              {new Date(d.created_at).toLocaleDateString(
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
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tests">
              {testResults.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      No test results yet.
                    </p>
                    <Link href="/ab-test/new">
                      <Button variant="outline" size="sm">
                        Run a test
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {testResults.map((t) => {
                    const testLink =
                      t.type === "A/B Test"
                        ? `/ab-test/${t.id}`
                        : t.type === "Name Test"
                          ? `/name-test/${t.id}`
                          : t.type === "Pricing Test"
                            ? `/pricing-test/${t.id}`
                            : t.type === "Audience Test"
                              ? `/audience-test/${t.id}`
                              : t.type === "Ad Test"
                                ? `/ad-test/${t.id}`
                                : `/competitive/${t.id}`;
                    const testName =
                      (t.input as Record<string, string>)?.productName ||
                      (t.input as Record<string, string>)?.brandName ||
                      (t.input as Record<string, string>)?.name ||
                      "Untitled";
                    return (
                      <Link key={`${t.type}-${t.id}`} href={testLink}>
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
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-wrap gap-3">
                <Link href="/research/new">
                  <Button variant="outline">New research</Button>
                </Link>
                <Link href="/discover/new">
                  <Button variant="outline">New discovery</Button>
                </Link>
                {user?.stripe_customer_id && (
                  <Button variant="outline" onClick={handleManageBilling}>
                    Manage billing
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="ml-auto"
                >
                  Sign out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          {(user?.name || user?.company) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {user.name && (
                    <>
                      <dt className="text-muted-foreground">Name</dt>
                      <dd className="text-foreground">{user.name}</dd>
                    </>
                  )}
                  {user.company && (
                    <>
                      <dt className="text-muted-foreground">Company</dt>
                      <dd className="text-foreground">{user.company}</dd>
                    </>
                  )}
                  {user.role && (
                    <>
                      <dt className="text-muted-foreground">Role</dt>
                      <dd className="text-foreground">{user.role}</dd>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Slack Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Slack Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add a Slack webhook URL to receive research and discovery
                summaries in your Slack channel when they complete.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackWebhookUrl}
                  onChange={(e) => {
                    setSlackWebhookUrl(e.target.value);
                    setSlackStatus("idle");
                  }}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    disabled={slackStatus === "saving"}
                    onClick={async () => {
                      setSlackStatus("saving");
                      try {
                        const res = await fetch("/api/integrations/slack", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: userEmail,
                            webhookUrl: slackWebhookUrl.trim(),
                          }),
                        });
                        if (res.ok) {
                          setSlackStatus("saved");
                        } else {
                          const data = await res.json();
                          alert(data.error || "Failed to save.");
                          setSlackStatus("error");
                        }
                      } catch {
                        setSlackStatus("error");
                      }
                    }}
                  >
                    {slackStatus === "saving"
                      ? "Saving..."
                      : slackStatus === "saved"
                        ? "Saved"
                        : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      !slackWebhookUrl.trim() || slackStatus === "testing"
                    }
                    onClick={async () => {
                      setSlackStatus("testing");
                      try {
                        const res = await fetch(slackWebhookUrl.trim(), {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            text: "HypeTest connection test successful! You will receive research summaries here.",
                          }),
                        });
                        if (res.ok) {
                          setSlackStatus("tested");
                        } else {
                          setSlackStatus("test-error");
                        }
                      } catch {
                        setSlackStatus("test-error");
                      }
                    }}
                  >
                    {slackStatus === "testing"
                      ? "Testing..."
                      : slackStatus === "tested"
                        ? "Sent!"
                        : "Test"}
                  </Button>
                </div>
              </div>
              {slackStatus === "saved" && (
                <p className="text-xs text-emerald-600 mt-2">
                  Webhook URL saved successfully.
                </p>
              )}
              {slackStatus === "error" && (
                <p className="text-xs text-destructive mt-2">
                  Failed to save. Please try again.
                </p>
              )}
              {slackStatus === "tested" && (
                <p className="text-xs text-emerald-600 mt-2">
                  Test message sent. Check your Slack channel.
                </p>
              )}
              {slackStatus === "test-error" && (
                <p className="text-xs text-destructive mt-2">
                  Test failed. Please check the webhook URL.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
