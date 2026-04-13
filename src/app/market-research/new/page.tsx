"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { PlanGate } from "@/components/plan-gate";
import { usePlanAccess } from "@/hooks/use-plan-access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { UrlAutofill } from "@/components/url-autofill";
import type { MarketResearchResult } from "@/types/market-research";

const GEOGRAPHIES = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "EU", label: "European Union" },
  { value: "Global", label: "Global" },
];

export default function NewMarketResearchPage() {
  return (
    <Suspense>
      <NewMarketResearchForm />
    </Suspense>
  );
}

function NewMarketResearchForm() {
  const router = useRouter();
  const { planChecked, hasAccess, isAuthenticated } = usePlanAccess("pro");
  const [category, setCategory] = useState("");
  const [geography, setGeography] = useState("");
  const [questions, setQuestions] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userRole, setUserRole] = useState("");

  // Email verification state
  const [verificationStep, setVerificationStep] = useState<"form" | "verifying" | "entering-code" | "verified">("form");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isAuthUser, setIsAuthUser] = useState(false);

  // Check Supabase Auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setIsAuthUser(true);
        setEmail(user.email);
        setVerificationStep("verified");
        setVerificationToken("supabase-auth");
        const meta = user.user_metadata;
        if (meta?.name) setUserName(meta.name);
        supabase
          .from("users")
          .select("name, company, role")
          .eq("email", user.email)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              if (profile.name) setUserName(profile.name);
              if (profile.company) setUserCompany(profile.company);
              if (profile.role) setUserRole(profile.role);
            }
          });
      }
    });
  }, []);

  // Restore verification from session
  useEffect(() => {
    if (isAuthUser) return;
    const stored = sessionStorage.getItem("hypetest-verification");
    if (stored) {
      try {
        const { email: storedEmail, token } = JSON.parse(stored);
        if (storedEmail && token) {
          setVerificationToken(token);
          setVerificationStep("verified");
          if (!email) setEmail(storedEmail);
        }
      } catch { /* ignore */ }
    }
  }, [isAuthUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFormValid = category.trim() && geography && email.trim() && email.includes("@") && (isAuthUser || (userName.trim() && userCompany.trim() && userRole));

  async function handleSendVerification() {
    setVerificationStep("verifying");
    setVerificationError("");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerificationError(data.error || "Failed to send verification code");
        setVerificationStep("form");
        return;
      }
      setVerificationStep("entering-code");
    } catch {
      setVerificationError("Failed to send verification code. Please try again.");
      setVerificationStep("form");
    }
  }

  async function handleConfirmCode() {
    setVerificationError("");
    try {
      const res = await fetch("/api/auth/confirm-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerificationError(data.error || "Invalid code");
        return;
      }
      setVerificationToken(data.verificationToken);
      setVerificationStep("verified");
      sessionStorage.setItem("hypetest-verification", JSON.stringify({ email: email.trim(), token: data.verificationToken }));
      submitResearch(data.verificationToken);
    } catch {
      setVerificationError("Verification failed. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    const storedVerification = sessionStorage.getItem("hypetest-verification");
    let currentToken = verificationToken;
    if (storedVerification) {
      try {
        const { email: storedEmail, token } = JSON.parse(storedVerification);
        if (storedEmail === email.trim() && token) {
          currentToken = token;
        }
      } catch { /* ignore */ }
    }

    if (verificationStep !== "verified" || !currentToken) {
      handleSendVerification();
      return;
    }

    submitResearch(currentToken);
  }

  async function submitResearch(token: string) {
    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Analyzing market landscape...");

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 12, 95));
      setStage((s) => {
        const stages = [
          "Analyzing market landscape...",
          "Evaluating competitive dynamics...",
          "Identifying consumer trends...",
          "Mapping market gaps...",
          "Generating recommendations...",
        ];
        const idx = stages.indexOf(s);
        return idx < stages.length - 1 ? stages[idx + 1] : s;
      });
    }, 3000);

    try {
      const payload: Record<string, unknown> = {
        category: category.trim(),
        geography,
        questions: questions.trim(),
        email: email.trim(),
        userName: userName.trim(),
        userCompany: userCompany.trim(),
        userRole,
        verificationToken: token,
      };

      const response = await fetch("/api/market-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Market research failed");
      }

      const result: MarketResearchResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(`market-research-${result.id}`, JSON.stringify(result));

      setTimeout(() => router.push(`/market-research/${result.id}`), 500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsRunning(false);
      setProgress(0);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (planChecked && !hasAccess) {
    return (
      <PlanGate
        requiredPlan="Pro"
        toolTitle="Market Research"
        toolDescription="Get a deep analysis of any market or category. Understand trends, competition, consumer insights, and opportunities."
        bullets={[
          "Deep analysis of your market",
          "Competitive landscape mapping",
          "Consumer insight extraction",
          "Market gaps and opportunities",
        ]}
        sampleReportHref="/market-research/sample-rekt"
        isAuthenticated={isAuthenticated}
      />
    );
  }

  if (isRunning) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-sm mx-auto px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
              <svg className="animate-spin text-teal" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Running market analysis</h2>
            <p className="text-sm text-muted-foreground mb-8">{stage}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mb-3 overflow-hidden">
              <div
                className="bg-teal h-1.5 rounded-full origin-left transition-transform duration-1000 ease-out"
                style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {progress >= 95 ? "Finalizing report..." : `Analyzing market (${Math.round(progress)}%)`}
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Market Research</h1>
            <p className="text-muted-foreground">
              Get a deep analysis of any market or category. Understand trends, competition, consumer insights, and opportunities.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/market-research/sample-rekt" className="text-teal hover:underline">
                View a sample report &rarr;
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Market Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <UrlAutofill onExtracted={(data) => {
                  if (data.category) setCategory(data.category);
                }} />

                {/* Industry/Category */}
                <div className="space-y-1.5">
                  <Label>Industry / Category <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder='e.g. "Energy drinks", "DTC skincare", "B2B SaaS for restaurants"'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>

                {/* Geography */}
                <div className="space-y-1.5">
                  <Label>Target Geography <span className="text-red-500">*</span></Label>
                  <Select value={geography} onValueChange={(v) => setGeography(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select geography" />
                    </SelectTrigger>
                    <SelectContent>
                      {GEOGRAPHIES.map((geo) => (
                        <SelectItem key={geo.value} value={geo.value}>
                          {geo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific questions */}
                <div className="space-y-1.5">
                  <Label>What specifically do you want to know?</Label>
                  <Textarea
                    placeholder='e.g. "What are consumers looking for that doesn&#39;t exist yet?", "What&#39;s driving purchase decisions?", "What price points work?"'
                    value={questions}
                    onChange={(e) => setQuestions(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional but improves relevance. Ask about gaps, pricing, trends, or consumer behavior.
                  </p>
                </div>

                {/* About You - Auth-aware */}
                {!isAuthUser && (
                  <div className="bg-teal/5 rounded-xl p-4 border border-teal/20 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Quick sign in (recommended)</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Sign in with Google to skip email verification and save reports to your account.
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          const supabase = createClient();
                          await supabase.auth.signInWithOAuth({
                            provider: "google",
                            options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}` },
                          });
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card hover:bg-muted h-10 text-sm font-medium transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Continue with Google
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or enter your details</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="userName">Name <span className="text-red-500">*</span></Label>
                        <Input id="userName" placeholder="Jane Smith" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Work email <span className="text-red-500">*</span></Label>
                        <Input id="email" type="email" placeholder="jane@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="userCompany">Company <span className="text-red-500">*</span></Label>
                        <Input id="userCompany" placeholder="Acme Corp" value={userCompany} onChange={(e) => setUserCompany(e.target.value)} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Role <span className="text-red-500">*</span></Label>
                        <Select value={userRole} onValueChange={(v) => setUserRole(v ?? "")}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="founder">Founder / CEO</SelectItem>
                            <SelectItem value="product">Product / CPO</SelectItem>
                            <SelectItem value="marketing">Marketing / CMO</SelectItem>
                            <SelectItem value="brand">Brand Manager</SelectItem>
                            <SelectItem value="innovation">Innovation / R&amp;D</SelectItem>
                            <SelectItem value="insights">Consumer Insights / Research</SelectItem>
                            <SelectItem value="growth">Growth / Strategy</SelectItem>
                            <SelectItem value="consultant">Consultant / Agency</SelectItem>
                            <SelectItem value="investor">Investor / VC</SelectItem>
                            <SelectItem value="student">Student / Academic</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
                    {error}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  By running research, you agree to our{" "}
                  <Link href="/terms" className="text-teal underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-teal underline">Privacy Policy</Link>.
                  Results are AI-generated analysis, not primary research data.
                </p>

                {!isAuthUser && verificationError && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
                    {verificationError}
                  </div>
                )}

                {!isAuthUser && verificationStep === "verifying" && (
                  <div className="bg-teal/5 border border-teal/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">Sending verification code...</p>
                  </div>
                )}

                {!isAuthUser && verificationStep === "entering-code" ? (
                  <div className="bg-teal/5 border border-teal/20 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-medium text-primary">Verify your email</p>
                    <p className="text-xs text-muted-foreground">
                      We sent a 6-digit code to {email}. Enter it below and your research will start automatically.
                    </p>
                    <Input
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      className="text-center text-lg tracking-widest font-mono"
                    />
                    {verificationError && (
                      <p className="text-xs text-destructive">{verificationError}</p>
                    )}
                    <Button type="button" onClick={handleConfirmCode} disabled={verificationCode.length !== 6} className="w-full">
                      Verify and run research
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                    disabled={!isFormValid || isRunning || verificationStep === "verifying"}
                  >
                    Run Market Research
                  </Button>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Results in under 30 seconds.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
