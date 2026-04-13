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
import type { NameTestResult } from "@/types/name-test";

const CATEGORIES = [
  { value: "food & beverage", label: "Food & Beverage" },
  { value: "health & wellness", label: "Health & Wellness" },
  { value: "technology", label: "Technology" },
  { value: "fashion & apparel", label: "Fashion & Apparel" },
  { value: "home & garden", label: "Home & Garden" },
  { value: "beauty & personal care", label: "Beauty & Personal Care" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "other", label: "Other" },
];

export default function NewNameTestPage() {
  return (
    <Suspense>
      <NewNameTestForm />
    </Suspense>
  );
}

function NewNameTestForm() {
  const router = useRouter();
  const { planChecked, hasAccess, isAuthenticated } = usePlanAccess("starter");

  // Product
  const [productDescription, setProductDescription] = useState("");
  const [feature1, setFeature1] = useState("");
  const [feature2, setFeature2] = useState("");
  const [feature3, setFeature3] = useState("");
  const [category, setCategory] = useState("");
  const [targetConsumer, setTargetConsumer] = useState("");

  // Names (3-5)
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [name3, setName3] = useState("");
  const [name4, setName4] = useState("");
  const [name5, setName5] = useState("");

  // About you
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAuthUser, setIsAuthUser] = useState(false);

  // Check Supabase Auth - if logged in, pre-fill and skip verification
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setIsAuthUser(true);
        setEmail(user.email);
        const meta = user.user_metadata;
        if (meta?.name && !userName) setUserName(meta.name);
        supabase
          .from("users")
          .select("name, company, role")
          .eq("email", user.email)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              if (profile.name && !userName) setUserName(profile.name);
              if (profile.company && !userCompany) setUserCompany(profile.company);
              if (profile.role && !userRole) setUserRole(profile.role);
            }
          });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // UTM / referrer
  const [utmSource] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") || "" : "");
  const [utmMedium] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_medium") || "" : "");
  const [utmCampaign] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_campaign") || "" : "");
  const [referrer] = useState(() => typeof window !== "undefined" ? document.referrer || "" : "");

  // UI state
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  const nameOptions = [name1, name2, name3, name4, name5].filter(n => n.trim());

  const isFormValid =
    productDescription.trim().length > 10 &&
    nameOptions.length >= 2 &&
    email.trim() && email.includes("@") &&
    (isAuthUser || (userName.trim() && userCompany.trim() && userRole));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Preparing name testing panel...");

    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 6));
      setStage((s) => {
        const stages = [
          "Generating consumer personas...",
          "Testing name options with panel...",
          "Evaluating name appeal...",
          "Collecting impressions...",
          "Ranking names by appeal...",
        ];
        const idx = stages.indexOf(s);
        return idx < stages.length - 1 ? stages[idx + 1] : s;
      });
    }, 3500);

    try {
      const payload: Record<string, unknown> = {
        productDescription: productDescription.trim(),
        names: nameOptions,
        category: category || undefined,
        targetConsumer: targetConsumer.trim() || undefined,
        email: email.trim(),
        userName: userName.trim(),
        userCompany: userCompany.trim(),
        userRole,
        ...(utmSource && { utmSource }),
        ...(utmMedium && { utmMedium }),
        ...(utmCampaign && { utmCampaign }),
        ...(referrer && { referrer }),
      };

      const response = await fetch("/api/name-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Name test failed");
      }

      const result: NameTestResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(`name-test-${result.id}`, JSON.stringify(result));
      setTimeout(() => router.push(`/name-test/${result.id}`), 500);
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
        requiredPlan="Starter"
        toolTitle="Name Testing"
        toolDescription="Test 2-5 name options for the same product. A consumer panel ranks each name by appeal."
        bullets={[
          "Test 3-5 name options",
          "Ranked by consumer appeal",
          "Emotional associations per name",
          "First impression quotes",
        ]}
        sampleReportHref="/name-test/sample-rekt"
        isAuthenticated={isAuthenticated}
      />
    );
  }

  if (isRunning) {
    return (
      <>
        <Nav />
        <style>{`
          @keyframes dot-pulse {
            0%, 100% { opacity: 0.15; transform: scale(0.85); }
            50% { opacity: 0.7; transform: scale(1); }
          }
          .dot-grid span {
            animation: dot-pulse 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
        `}</style>
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-sm mx-auto px-6 text-center">
            <div className="dot-grid grid grid-cols-6 gap-2 w-fit mx-auto mb-8">
              {Array.from({ length: 18 }, (_, i) => (
                <span
                  key={i}
                  className="block w-2.5 h-2.5 rounded-full bg-teal"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">
              Testing your names
            </h2>
            <p className="text-sm text-muted-foreground mb-8">{stage}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mb-3 overflow-hidden">
              <div
                className="bg-teal h-1.5 rounded-full origin-left transition-transform duration-1000 ease-out"
                style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {progress >= 95
                ? "Ranking names..."
                : `Evaluating ${nameOptions.length} names with panel (${Math.round(progress)}%)`}
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
            <h1 className="text-2xl font-bold text-primary mb-2">
              Name Test
            </h1>
            <p className="text-muted-foreground">
              Test 2-5 name options for the same product concept. A panel of 30 consumers ranks each name by appeal.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/name-test/sample-rekt" className="text-teal hover:underline">
                View a sample report &rarr;
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product concept */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Concept</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Product Description</Label>
                  <Textarea
                    placeholder="Describe the product, what it does, and what problem it solves..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Key Features (optional)</Label>
                  <div className="space-y-2">
                    <Input placeholder="Feature 1" value={feature1} onChange={(e) => setFeature1(e.target.value)} />
                    <Input placeholder="Feature 2" value={feature2} onChange={(e) => setFeature2(e.target.value)} />
                    <Input placeholder="Feature 3" value={feature3} onChange={(e) => setFeature3(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Target Consumer (optional)</Label>
                  <Textarea
                    placeholder="e.g., Health-conscious professionals 25-40"
                    value={targetConsumer}
                    onChange={(e) => setTargetConsumer(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Name options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Name Options (2-5)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Name 1 *</Label>
                  <Input placeholder="e.g., Rekt Focus" value={name1} onChange={(e) => setName1(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Name 2 *</Label>
                  <Input placeholder="e.g., FlowState" value={name2} onChange={(e) => setName2(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Name 3</Label>
                  <Input placeholder="e.g., NeuroDrive" value={name3} onChange={(e) => setName3(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Name 4</Label>
                  <Input placeholder="Optional" value={name4} onChange={(e) => setName4(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Name 5</Label>
                  <Input placeholder="Optional" value={name5} onChange={(e) => setName5(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* About you - only for non-authenticated users */}
            {!isAuthUser && (
              <div className="bg-teal/5 rounded-xl p-4 border border-teal/20 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-primary mb-1">About you</p>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll send your report link to your email. No account needed.
                  </p>
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
              By running this test, you agree to our{" "}
              <Link href="/terms" className="text-teal underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-teal underline">Privacy Policy</Link>.
              Results are AI-simulated (not real consumers). Uses 1 research credit.
            </p>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              disabled={!isFormValid || isRunning}
            >
              Run Name Test
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Results in 1-2 minutes.
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
