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

const PLAN_LIMITS: Record<string, { research: number; discovery: number }> = {
  free: { research: 3, discovery: 0 },
  starter: { research: 15, discovery: 3 },
  pro: { research: -1, discovery: -1 },
  team: { research: -1, discovery: -1 },
};

export default function AccountPage() {
  return (
    <Suspense fallback={
      <>
        <Nav />
        <main className="flex-1 py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    }>
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [magicLinkStatus, setMagicLinkStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([]);
  const [discoveryResults, setDiscoveryResults] = useState<DiscoveryResult[]>([]);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [slackStatus, setSlackStatus] = useState<"idle" | "saving" | "saved" | "error" | "testing" | "tested" | "test-error">("idle");

  const verifyToken = useCallback(async (token: string) => {
    try {
      const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        sessionStorage.setItem("ht-email", data.user.email);
        // Clean URL
        window.history.replaceState({}, "", "/account");
      } else {
        sessionStorage.removeItem("ht-email");
      }
    } catch {
      // Token invalid
    }
    setLoading(false);
  }, []);

  const loadUserByEmail = useCallback(async (storedEmail: string) => {
    try {
      // We need a valid token to get user data; if we only have the email,
      // prompt them to request a new magic link
      setEmail(storedEmail);
      // Try to see if the session is still valid by checking sessionStorage for token
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyToken(token);
      return;
    }

    // Check sessionStorage for previous auth
    const storedEmail = sessionStorage.getItem("ht-email");
    if (storedEmail) {
      // Re-verify with a magic link approach: show account with cached data
      // For a better UX, we'll request user data via a lightweight endpoint
      loadUserByEmail(storedEmail);
    } else {
      setLoading(false);
    }
  }, [searchParams, verifyToken, loadUserByEmail]);

  // Fetch integrations when user is loaded
  useEffect(() => {
    if (!user) return;

    // Fetch Slack webhook URL
    fetch(`/api/integrations/slack?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.slackWebhookUrl) {
          setSlackWebhookUrl(data.slackWebhookUrl);
        }
      })
      .catch(() => {
        // Non-critical
      });
  }, [user]);

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setMagicLinkStatus("loading");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setMagicLinkStatus("sent");
      } else {
        setMagicLinkStatus("error");
      }
    } catch {
      setMagicLinkStatus("error");
    }
  }

  async function handleManageBilling() {
    if (!user?.stripe_customer_id) return;
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
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

  // Not authenticated — show magic link form
  if (!user) {
    return (
      <>
        <Nav />
        <main className="flex-1 py-12">
          <div className="max-w-md mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary mb-2">My Account</h1>
              <p className="text-muted-foreground text-sm">
                Enter your email to receive a login link. No password needed.
              </p>
            </div>

            {magicLinkStatus === "sent" ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></svg>
                  </div>
                  <h2 className="text-lg font-semibold text-primary mb-2">Check your email</h2>
                  <p className="text-sm text-muted-foreground">
                    We sent a login link to <strong>{email}</strong>. Click it to access your account.
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-6">
                  <form onSubmit={handleSendMagicLink} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={magicLinkStatus === "loading"}
                    >
                      {magicLinkStatus === "loading" ? "Sending..." : "Send login link"}
                    </Button>
                    {magicLinkStatus === "error" && (
                      <p className="text-sm text-destructive text-center">
                        Failed to send login link. Please try again.
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}

            <p className="text-center text-xs text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/research/new" className="text-primary hover:underline">
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

  // Authenticated — show account dashboard
  const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;
  const planName = user.plan.charAt(0).toUpperCase() + user.plan.slice(1);

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">My Account</h1>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Research runs this month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {user.research_count_this_month}
                  <span className="text-base font-normal text-muted-foreground">
                    {limits.research === -1 ? " / unlimited" : ` / ${limits.research}`}
                  </span>
                </div>
                {limits.research !== -1 && (
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, (user.research_count_this_month / limits.research) * 100)}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Discovery runs this month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {user.discovery_count_this_month}
                  <span className="text-base font-normal text-muted-foreground">
                    {limits.discovery === -1 ? " / unlimited" : limits.discovery === 0 ? " / 0 (upgrade to unlock)" : ` / ${limits.discovery}`}
                  </span>
                </div>
                {limits.discovery > 0 && (
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(100, (user.discovery_count_this_month / limits.discovery) * 100)}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-wrap gap-3">
                {user.plan === "free" && (
                  <Link href="/pricing">
                    <Button>Upgrade plan</Button>
                  </Link>
                )}
                {user.stripe_customer_id && (
                  <Button variant="outline" onClick={handleManageBilling}>
                    Manage billing
                  </Button>
                )}
                <Link href="/research/new">
                  <Button variant="outline">New research</Button>
                </Link>
                <Link href="/discover/new">
                  <Button variant="outline">New discovery</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    sessionStorage.removeItem("ht-email");
                    setUser(null);
                  }}
                  className="ml-auto"
                >
                  Sign out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User info */}
          {(user.name || user.company) && (
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
              <CardTitle className="text-sm font-medium">Slack Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add a Slack webhook URL to receive research and discovery summaries in your Slack channel when they complete.
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
                            email: user.email,
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
                    {slackStatus === "saving" ? "Saving..." : slackStatus === "saved" ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!slackWebhookUrl.trim() || slackStatus === "testing"}
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
                    {slackStatus === "testing" ? "Testing..." : slackStatus === "tested" ? "Sent!" : "Test"}
                  </Button>
                </div>
              </div>
              {slackStatus === "saved" && (
                <p className="text-xs text-emerald-600 mt-2">Webhook URL saved successfully.</p>
              )}
              {slackStatus === "error" && (
                <p className="text-xs text-destructive mt-2">Failed to save. Please try again.</p>
              )}
              {slackStatus === "tested" && (
                <p className="text-xs text-emerald-600 mt-2">Test message sent. Check your Slack channel.</p>
              )}
              {slackStatus === "test-error" && (
                <p className="text-xs text-destructive mt-2">Test failed. Please check the webhook URL.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
