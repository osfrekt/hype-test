"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    description: "Get started with core research",
    cta: "Start free",
    href: "/research/new",
    highlight: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "More runs + advanced tools",
    cta: "Get Starter",
    href: null,
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$149",
    period: "/mo",
    description: "Unlimited everything",
    cta: "Get Pro",
    href: null,
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$349",
    period: "/mo",
    description: "For teams building together",
    cta: "Join waitlist",
    href: null,
    isWaitlist: true,
    highlight: false,
  },
];

type FeatureRow = {
  name: string;
  free: string | boolean;
  starter: string | boolean;
  pro: string | boolean;
  team: string | boolean;
};

const featureCategories: { category: string; features: FeatureRow[] }[] = [
  {
    category: "Consumer Research",
    features: [
      { name: "Research runs per month", free: "3", starter: "30", pro: "100", team: "500" },
      { name: "Simulated panellists per run", free: "50", starter: "50", pro: "100", team: "100" },
      { name: "Purchase intent scoring", free: true, starter: true, pro: true, team: true },
      { name: "WTP range estimation", free: true, starter: true, pro: true, team: true },
      { name: "Feature importance ranking", free: true, starter: true, pro: true, team: true },
      { name: "Consumer concerns and positives", free: true, starter: true, pro: true, team: true },
      { name: "Consumer verbatims", free: true, starter: true, pro: true, team: true },
      { name: "Go/No-Go scorecard", free: true, starter: true, pro: true, team: true },
      { name: "Demographic segment breakdown", free: true, starter: true, pro: true, team: true },
    ],
  },
  {
    category: "Starter Testing Tools",
    features: [
      { name: "A/B concept testing", free: false, starter: true, pro: true, team: true },
      { name: "Name testing (rank 3-5 options)", free: false, starter: true, pro: true, team: true },
      { name: "Pricing optimizer (demand curve)", free: false, starter: true, pro: true, team: true },
    ],
  },
  {
    category: "Pro Tools",
    features: [
      { name: "Ad/creative testing", free: false, starter: false, pro: true, team: true },
      { name: "Logo testing", free: false, starter: false, pro: true, team: true },
      { name: "Product Discovery", free: false, starter: false, pro: true, team: true },
      { name: "Discovery rounds per month", free: false, starter: false, pro: "50", team: "200" },
      { name: "AI concept generation", free: false, starter: false, pro: true, team: true },
      { name: "Iterative refinement rounds", free: false, starter: false, pro: true, team: true },
      { name: "Audience finder (5 segments)", free: false, starter: false, pro: true, team: true },
      { name: "Competitive teardown (radar chart)", free: false, starter: false, pro: true, team: true },
      { name: "Brand auto-fill (URL + search)", free: false, starter: false, pro: true, team: true },
    ],
  },
  {
    category: "Insights and Delivery",
    features: [
      { name: "Shareable report links", free: true, starter: true, pro: true, team: true },
      { name: "PDF export", free: true, starter: true, pro: true, team: true },
      { name: "Email report delivery", free: true, starter: true, pro: true, team: true },
      { name: "Performance tracking over time", free: false, starter: true, pro: true, team: true },
      { name: "Slack notifications", free: false, starter: true, pro: true, team: true },
      { name: "Team seats", free: "1", starter: "1", pro: "1", team: "5" },
      { name: "Shared research library", free: false, starter: false, pro: false, team: true },
    ],
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-teal mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DashIcon() {
  return <span className="block w-4 h-0.5 bg-muted-foreground/20 mx-auto rounded" />;
}

export default function PricingPage() {
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setAuthEmail(user.email);
    });
  }, []);
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistMessage, setWaitlistMessage] = useState("");

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!checkoutEmail.trim() || !checkoutPlan) return;
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: checkoutEmail.trim(), plan: checkoutPlan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Something went wrong.");
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutError("Something went wrong. Please try again.");
      setCheckoutLoading(false);
    }
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWaitlistStatus("error");
        setWaitlistMessage(data.error || "Something went wrong.");
      } else {
        setWaitlistStatus("success");
        setWaitlistMessage(data.message);
        setWaitlistEmail("");
      }
    } catch {
      setWaitlistStatus("error");
      setWaitlistMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more research power.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.highlight ? "border-teal shadow-lg shadow-teal/10 overflow-visible" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-teal text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                      Most popular
                    </span>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  {plan.href ? (
                    <Link
                      href={plan.href}
                      className={`block w-full text-center rounded-xl font-semibold py-2.5 text-sm transition-colors ${
                        plan.highlight
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  ) : plan.isWaitlist ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const el = document.getElementById("team-waitlist");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button
                      className={`w-full ${plan.highlight ? "" : "bg-muted text-foreground hover:bg-muted/80"}`}
                      onClick={async () => {
                        if (authEmail) {
                          // Logged in: skip email modal, go straight to checkout
                          setCheckoutLoading(true);
                          setCheckoutError("");
                          try {
                            const res = await fetch("/api/billing/checkout", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email: authEmail, plan: plan.id }),
                            });
                            const data = await res.json();
                            if (data.url) {
                              window.location.href = data.url;
                            } else {
                              setCheckoutError(data.error || "Something went wrong.");
                              setCheckoutLoading(false);
                            }
                          } catch {
                            setCheckoutError("Something went wrong.");
                            setCheckoutLoading(false);
                          }
                        } else {
                          // Not logged in: show email modal
                          setCheckoutPlan(plan.id);
                          setCheckoutError("");
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pro features explainer */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary text-center mb-2">
              What you unlock with a paid plan
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Free gets you core consumer research. Starter adds testing tools.
              Pro unlocks strategic research and product discovery.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-card rounded-2xl border border-border p-6">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Free</span>
                <h3 className="text-base font-bold text-primary mt-2 mb-3">Core consumer research</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  50-person AI panel with purchase intent, WTP, feature ranking,
                  Go/No-Go verdict, and demographic breakdown.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />3 research runs per month</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />Shareable reports and PDF export</li>
                </ul>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6">
                <span className="text-xs font-bold text-teal uppercase tracking-wider">Starter</span>
                <h3 className="text-base font-bold text-primary mt-2 mb-3">Test every angle</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Three testing tools to compare concepts, find the right name,
                  and optimize your price point.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />A/B concept testing</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />Name testing (rank 3-5 options)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />Pricing optimizer with demand curve</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />30 research runs per month</li>
                </ul>
              </div>
              <div className="bg-card rounded-2xl border border-teal/30 p-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Pro</span>
                <h3 className="text-base font-bold text-primary mt-2 mb-3">Strategic research</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Product discovery, audience testing, and competitive analysis
                  for teams building seriously.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Product Discovery (AI concept generation)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Audience finder across 5 segments</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Competitive teardown with radar chart</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Ad/creative testing</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Logo testing</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />100 research runs per month</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature comparison table */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary text-center mb-2">
              Compare features
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Everything you get with each plan, at a glance.
            </p>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                {/* Sticky header */}
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 font-medium text-muted-foreground w-[40%]" />
                    {plans.map((p) => (
                      <th key={p.id} className="text-center py-3 px-2 font-bold text-primary min-w-[100px]">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureCategories.map((cat) => (
                    <>
                      {/* Category header */}
                      <tr key={cat.category}>
                        <td
                          colSpan={5}
                          className="pt-6 pb-2 px-3 text-xs font-bold text-primary uppercase tracking-wider"
                        >
                          {cat.category}
                        </td>
                      </tr>
                      {/* Feature rows */}
                      {cat.features.map((feat) => (
                        <tr key={feat.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3 text-muted-foreground">{feat.name}</td>
                          {(["free", "starter", "pro", "team"] as const).map((planId) => {
                            const val = feat[planId];
                            return (
                              <td key={planId} className="py-2.5 px-2 text-center">
                                {val === true ? (
                                  <CheckIcon />
                                ) : val === false ? (
                                  <DashIcon />
                                ) : (
                                  <span className="text-xs font-semibold text-primary">{val}</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="md:hidden space-y-6">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-primary">{plan.name}</h3>
                    <span className="text-lg font-bold text-primary">{plan.price}{plan.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                  {featureCategories.map(cat => (
                    <div key={cat.category} className="mb-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{cat.category}</p>
                      {cat.features.map(feat => {
                        const val = feat[plan.id as keyof typeof feat];
                        return val ? (
                          <div key={feat.name} className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
                            {val === true ? (
                              <svg className="w-4 h-4 text-teal shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                              <span className="text-xs font-semibold text-primary">{String(val)}</span>
                            )}
                            <span>{feat.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tools showcase */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary text-center mb-2">
              Your complete research toolkit
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Every tool you need to validate products, pricing, names, audiences, and competitive positioning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Free */}
              <ToolCard
                title="Consumer Research"
                description="Test any product concept with a 50-person AI panel. Get purchase intent, WTP, feature importance, concerns, and a Go/No-Go verdict."
                href="/research/new"
                badge="Free"
                badgeColor="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400"
              />
              <ToolCard
                title="Segment Breakdown"
                description="See research results broken down by age, gender, and income. Automatically included in every research run."
                href="/research/new"
                badge="Free"
                badgeColor="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400"
              />
              {/* Starter */}
              <ToolCard
                title="A/B Concept Testing"
                description="Test two product concepts head-to-head against the same panel. Clear winner with side-by-side metrics."
                href="/ab-test/new"
                badge="Starter"
                badgeColor="bg-teal/10 text-teal-dark"
              />
              <ToolCard
                title="Name Testing"
                description="Test 3-5 product name options for the same concept. Ranked by consumer appeal with first impressions."
                href="/name-test/new"
                badge="Starter"
                badgeColor="bg-teal/10 text-teal-dark"
              />
              <ToolCard
                title="Pricing Optimizer"
                description="Test 5 price points and see the demand curve. Find the revenue-maximizing price with a visual chart."
                href="/pricing-test/new"
                badge="Starter"
                badgeColor="bg-teal/10 text-teal-dark"
              />
              <ToolCard
                title="Slack Integration"
                description="Connect a Slack webhook and get research summaries posted to your channel automatically."
                href="/account"
                badge="Starter"
                badgeColor="bg-teal/10 text-teal-dark"
              />
              {/* Pro */}
              <ToolCard
                title="Product Discovery"
                description="Enter your brand and audience. AI generates product concepts and tests them with consumers. Keep iterating until you find a winner."
                href="/discover/new"
                badge="Pro"
                badgeColor="bg-primary text-primary-foreground"
              />
              <ToolCard
                title="Ad / Creative Testing"
                description="Test ad creatives with a 50-person panel. Get attention, clarity, persuasion, brand fit, and click likelihood scores."
                href="/ad-test/new"
                badge="Pro"
                badgeColor="bg-primary text-primary-foreground"
              />
              <ToolCard
                title="Logo Testing"
                description="Test 1-5 logo designs with a 30-person panel. Get first impression, memorability, brand fit, distinctiveness, and trust scores."
                href="/logo-test/new"
                badge="Pro"
                badgeColor="bg-primary text-primary-foreground"
              />
              <ToolCard
                title="Audience Finder"
                description="Test your product across 5 audience segments. Find which demographic has the highest purchase intent."
                href="/audience-test/new"
                badge="Pro"
                badgeColor="bg-primary text-primary-foreground"
              />
              <ToolCard
                title="Competitive Teardown"
                description="Compare your product vs a competitor with a radar chart across 5 dimensions. See exactly where you win and lose."
                href="/competitive/new"
                badge="Pro"
                badgeColor="bg-primary text-primary-foreground"
              />
            </div>
          </div>

          {/* Checkout email modal */}
          {checkoutPlan && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Subscribe to {checkoutPlan.charAt(0).toUpperCase() + checkoutPlan.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                      <label htmlFor="checkout-email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email address
                      </label>
                      <Input
                        id="checkout-email"
                        type="email"
                        placeholder="you@company.com"
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        required
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        You&apos;ll be redirected to Stripe to complete payment.
                      </p>
                    </div>
                    {checkoutError && (
                      <p className="text-sm text-destructive">{checkoutError}</p>
                    )}
                    <div className="flex gap-2">
                      <Button type="submit" disabled={checkoutLoading} className="flex-1">
                        {checkoutLoading ? "Redirecting..." : "Continue to payment"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCheckoutPlan(null);
                          setCheckoutError("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Team waitlist */}
          <div id="team-waitlist">
            <Card className="bg-muted/30">
              <CardContent className="py-8">
                <div className="text-center max-w-lg mx-auto">
                  <h3 className="text-lg font-bold text-primary mb-2">
                    Team plan coming soon
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    Team collaboration, shared research library, 5 seats, and dedicated support.
                    Join the waitlist to be first in line.
                  </p>

                  {waitlistStatus === "success" ? (
                    <p className="text-sm font-medium text-emerald-600">
                      {waitlistMessage}
                    </p>
                  ) : (
                    <form onSubmit={handleWaitlist} className="flex gap-2 max-w-sm mx-auto">
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                        disabled={waitlistStatus === "loading"}
                      >
                        {waitlistStatus === "loading" ? "Joining..." : "Join the waitlist"}
                      </Button>
                    </form>
                  )}

                  {waitlistStatus !== "success" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      By joining, you agree to our <Link href="/privacy" className="text-teal underline">Privacy Policy</Link>.
                    </p>
                  )}

                  {waitlistStatus === "error" && (
                    <p className="text-sm text-destructive mt-2">{waitlistMessage}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Questions? <a href="mailto:support@hypetest.ai" className="text-primary underline">support@hypetest.ai</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ToolCard({
  title,
  description,
  href,
  badge,
  badgeColor,
}: {
  title: string;
  description: string;
  href: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-card rounded-2xl border border-border/50 p-5 h-full hover:border-teal/30 hover:shadow-sm transition-all group">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-primary group-hover:text-teal transition-colors">{title}</h3>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
