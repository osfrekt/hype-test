"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    description: "Try HypeTest with basic research",
    features: [
      "3 research runs per month",
      "50 simulated respondents per run",
      "Purchase intent score",
      "WTP range estimate",
      "Feature importance ranking",
      "Consumer verbatims",
      "Competitive positioning",
    ],
    cta: "Start free",
    href: "/research/new",
    highlight: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "More research runs + discovery",
    features: [
      "15 research runs per month",
      "3 discovery rounds per month",
      "Everything in Free",
      "Priority processing",
      "Email support",
    ],
    cta: "Get Starter",
    href: null,
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$149",
    period: "/mo",
    description: "Unlimited research and discovery",
    features: [
      "Unlimited research runs",
      "Unlimited discovery rounds",
      "Everything in Starter",
      "Advanced consumer filtering",
      "Priority support",
    ],
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
    features: [
      "Everything in Pro",
      "5 team seats",
      "Shared research library",
      "Team collaboration",
      "Dedicated support",
    ],
    cta: "Join waitlist",
    href: null,
    highlight: false,
    isWaitlist: true,
  },
];

export default function PricingPage() {
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
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
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more research power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.highlight ? "border-teal shadow-lg shadow-teal/10" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-teal text-white text-xs font-semibold px-3 py-1 rounded-full">
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
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1 mb-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg
                          className="w-4 h-4 text-teal mt-0.5 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

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
                      onClick={() => {
                        setCheckoutPlan(plan.id);
                        setCheckoutError("");
                        // Try to pre-fill from sessionStorage
                        try {
                          const stored = sessionStorage.getItem("ht-email");
                          if (stored) setCheckoutEmail(stored);
                        } catch {
                          // ignore
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
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                  </div>
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
                    <form
                      onSubmit={handleWaitlist}
                      className="flex gap-2 max-w-sm mx-auto"
                    >
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
                      By joining, you agree to our <Link href="/privacy">Privacy Policy</Link>.
                    </p>
                  )}

                  {waitlistStatus === "error" && (
                    <p className="text-sm text-destructive mt-2">
                      {waitlistMessage}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Need enterprise features? Custom model fine-tuning? SSO?
            </p>
            <p className="text-sm font-medium text-primary">
              Contact us for custom pricing.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
