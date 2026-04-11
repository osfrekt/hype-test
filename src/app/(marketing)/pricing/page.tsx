"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [waitlistMessage, setWaitlistMessage] = useState("");

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setWaitlistStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWaitlistStatus("error");
        setWaitlistMessage(data.error || "Something went wrong.");
      } else {
        setWaitlistStatus("success");
        setWaitlistMessage(data.message);
        setEmail("");
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
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free today. Pro features are coming soon.
            </p>
          </div>

          {/* Free tier — prominent */}
          <Card className="relative border-teal shadow-lg shadow-teal/10 mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                <div>
                  <CardTitle className="text-lg">Quick Pulse</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    3 research runs per month
                  </p>
                </div>
                <span className="ml-auto text-3xl font-bold text-primary">
                  Free
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Feature>50 simulated respondents per run</Feature>
                <Feature>Purchase intent score</Feature>
                <Feature>WTP range estimate</Feature>
                <Feature>Feature importance ranking</Feature>
                <Feature>Top consumer concerns</Feature>
                <Feature>Consumer verbatims</Feature>
                <Feature>Competitive positioning</Feature>
                <Feature>Target consumer filtering</Feature>
              </div>
              <Link
                href="/research/new"
                className="block w-full text-center rounded-xl bg-primary text-primary-foreground font-semibold py-3 text-sm hover:bg-primary/90 transition-colors"
              >
                Start free
              </Link>
            </CardContent>
          </Card>

          {/* Coming soon / waitlist */}
          <Card className="bg-muted/30">
            <CardContent className="py-8">
              <div className="text-center max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  More power coming soon
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Product Discovery (find what to build next), custom panels of
                  up to 200 respondents, conjoint WTP breakdown by feature,
                  competitive positioning for up to 3 competitors, target
                  demographic selection, PDF &amp; CSV export, team
                  collaboration, and API access.
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                      disabled={waitlistStatus === "loading"}
                    >
                      {waitlistStatus === "loading"
                        ? "Joining..."
                        : "Join the waitlist"}
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

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
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
      {children}
    </div>
  );
}
