"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

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

interface PastResult {
  id: string;
  productName: string;
  productDescription: string;
  category?: string;
  priceRange?: { min: number; max: number };
  priceUnit?: string;
}

export default function CompetitiveNewPage() {
  return (
    <Suspense>
      <CompetitiveForm />
    </Suspense>
  );
}

function CompetitiveForm() {
  const router = useRouter();
  const { planChecked, hasAccess, isAuthenticated } = usePlanAccess("pro");

  // Your product
  const [yourMode, setYourMode] = useState<"new" | "past">("new");
  const [pastResults, setPastResults] = useState<PastResult[]>([]);
  const [selectedPastId, setSelectedPastId] = useState("");
  const [yourName, setYourName] = useState("");
  const [yourDesc, setYourDesc] = useState("");
  const [yourPriceMin, setYourPriceMin] = useState("");
  const [yourPriceMax, setYourPriceMax] = useState("");

  // Competitor
  const [compMode, setCompMode] = useState<"url" | "manual">("url");
  const [compUrl, setCompUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [compName, setCompName] = useState("");
  const [compDesc, setCompDesc] = useState("");
  const [compPriceMin, setCompPriceMin] = useState("");
  const [compPriceMax, setCompPriceMax] = useState("");

  // Shared
  const [category, setCategory] = useState("");
  const [targetMarket, setTargetMarket] = useState("");

  // About you
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
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
          .select("name, company")
          .eq("email", user.email)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              if (profile.name && !userName) setUserName(profile.name);
              if (profile.company && !userCompany) setUserCompany(profile.company);
            }
          });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // UTM
  const [utmSource] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") || "" : "");
  const [utmMedium] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_medium") || "" : "");
  const [utmCampaign] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_campaign") || "" : "");
  const [referrer] = useState(() => typeof window !== "undefined" ? document.referrer || "" : "");

  // State
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  // Load past results from sessionStorage
  useEffect(() => {
    try {
      const results: PastResult[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith("research-")) {
          const data = JSON.parse(sessionStorage.getItem(key) || "{}");
          if (data.input?.productName) {
            results.push({
              id: data.id,
              productName: data.input.productName,
              productDescription: data.input.productDescription || "",
              category: data.input.category,
              priceRange: data.input.priceRange,
              priceUnit: data.input.priceUnit,
            });
          }
        }
      }
      setPastResults(results);
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  // When selecting a past result, populate fields
  useEffect(() => {
    if (!selectedPastId) return;
    const past = pastResults.find((r) => r.id === selectedPastId);
    if (past) {
      setYourName(past.productName);
      setYourDesc(past.productDescription);
      if (past.priceRange) {
        setYourPriceMin(String(past.priceRange.min));
        setYourPriceMax(String(past.priceRange.max));
      }
      if (past.category) setCategory(past.category);
    }
  }, [selectedPastId, pastResults]);

  async function handleExtractCompetitor() {
    if (!compUrl.trim()) return;
    setIsExtracting(true);
    setExtractError("");
    try {
      const res = await fetch("/api/extract-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: compUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setExtractError(data.error || "Failed to extract competitor info.");
        return;
      }
      if (data.productName) setCompName(data.productName);
      if (data.problem) {
        const parts = [data.problem];
        if (data.feature1) parts.push(data.feature1);
        if (data.feature2) parts.push(data.feature2);
        if (data.differentiator) parts.push(data.differentiator);
        setCompDesc(parts.join(". "));
      }
      if (data.priceMin != null) setCompPriceMin(String(data.priceMin));
      if (data.priceMax != null) setCompPriceMax(String(data.priceMax));
      if (data.category && !category) setCategory(data.category);
    } catch {
      setExtractError("Failed to extract. Check the URL and try again.");
    } finally {
      setIsExtracting(false);
    }
  }

  const isFormValid = useMemo(() => {
    const hasYours = yourName.trim() && yourDesc.trim().length > 10;
    const hasComp = compName.trim() && compDesc.trim().length > 10;
    const hasUser = email.trim() && email.includes("@") && (isAuthUser || userName.trim());
    return hasYours && hasComp && hasUser;
  }, [yourName, yourDesc, compName, compDesc, email, userName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Preparing shared consumer panel...");

    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 6));
      setStage((s) => {
        const stages = [
          "Generating consumer personas...",
          "Testing your product with panel...",
          "Testing competitor with same panel...",
          "Comparing purchase intent...",
          "Computing radar dimensions...",
          "Determining winner...",
        ];
        const idx = stages.indexOf(s);
        return idx < stages.length - 1 ? stages[idx + 1] : s;
      });
    }, 4000);

    try {
      const payload: Record<string, unknown> = {
        yours: {
          productName: yourName.trim(),
          productDescription: yourDesc.trim(),
          ...(yourPriceMin && yourPriceMax && {
            priceRange: { min: Number(yourPriceMin), max: Number(yourPriceMax) },
          }),
        },
        competitor: {
          productName: compName.trim(),
          productDescription: compDesc.trim(),
          ...(compPriceMin && compPriceMax && {
            priceRange: { min: Number(compPriceMin), max: Number(compPriceMax) },
          }),
        },
        ...(category && { category }),
        ...(targetMarket.trim() && { targetMarket: targetMarket.trim() }),
        email: email.trim(),
        userName: userName.trim(),
        ...(userCompany.trim() && { userCompany: userCompany.trim() }),
        ...(utmSource && { utmSource }),
        ...(utmMedium && { utmMedium }),
        ...(utmCampaign && { utmCampaign }),
        ...(referrer && { referrer }),
      };

      const response = await fetch("/api/competitive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Competitive test failed");
      }

      const result = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(`competitive-${result.id}`, JSON.stringify(result));

      setTimeout(() => router.push(`/competitive/${result.id}`), 500);
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
        toolTitle="Competitive Teardown"
        toolDescription="Compare your product against a competitor. Same panel, same questions, side-by-side results."
        bullets={[
          "Your product vs a competitor",
          "Radar chart across 5 dimensions",
          "Side-by-side strengths/weaknesses",
          "Strategic positioning insights",
        ]}
        sampleReportHref="/competitive/sample-rekt"
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
            <h2 className="text-xl font-bold text-primary mb-2">Running competitive teardown</h2>
            <p className="text-sm text-muted-foreground mb-8">{stage}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mb-3 overflow-hidden">
              <div
                className="bg-teal h-1.5 rounded-full origin-left transition-transform duration-1000 ease-out"
                style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {progress >= 95 ? "Finalizing comparison..." : `Testing both products (${Math.round(progress)}%)`}
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
            <h1 className="text-2xl font-bold text-primary mb-2">Competitive Teardown</h1>
            <p className="text-muted-foreground">
              Compare your product against a competitor. Same panel, same questions, side-by-side results.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/competitive/sample-rekt" className="text-teal hover:underline">
                View a sample report &rarr;
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* YOUR PRODUCT */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastResults.length > 0 && (
                  <Tabs value={yourMode} onValueChange={(v) => setYourMode(v as "new" | "past")}>
                    <TabsList className="mb-3">
                      <TabsTrigger value="new">Enter new</TabsTrigger>
                      <TabsTrigger value="past">Use past research</TabsTrigger>
                    </TabsList>
                    <TabsContent value="past">
                      <Select value={selectedPastId} onValueChange={(v) => setSelectedPastId(v ?? "")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a past research result" />
                        </SelectTrigger>
                        <SelectContent>
                          {pastResults.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.productName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                    <TabsContent value="new">{null}</TabsContent>
                  </Tabs>
                )}

                <div className="space-y-1.5">
                  <Label>Product Name</Label>
                  <Input
                    placeholder="e.g., Rekt Focus Energy Powder"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Product Description</Label>
                  <Textarea
                    placeholder="Describe your product, its key features, and what makes it different"
                    value={yourDesc}
                    onChange={(e) => setYourDesc(e.target.value)}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Price Min ($)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={yourPriceMin}
                      onChange={(e) => setYourPriceMin(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Price Max ($)</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={yourPriceMax}
                      onChange={(e) => setYourPriceMax(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* COMPETITOR */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Competitor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={compMode} onValueChange={(v) => setCompMode(v as "url" | "manual")}>
                  <TabsList className="mb-3">
                    <TabsTrigger value="url">Auto-extract from URL</TabsTrigger>
                    <TabsTrigger value="manual">Enter manually</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url">
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://competitor.com/product"
                        value={compUrl}
                        onChange={(e) => setCompUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleExtractCompetitor}
                        disabled={isExtracting || !compUrl.trim()}
                        className="shrink-0"
                      >
                        {isExtracting ? "Extracting..." : "Extract"}
                      </Button>
                    </div>
                    {extractError && (
                      <p className="text-xs text-destructive mt-2">{extractError}</p>
                    )}
                  </TabsContent>
                  <TabsContent value="manual">{null}</TabsContent>
                </Tabs>

                <div className="space-y-1.5">
                  <Label>Competitor Name</Label>
                  <Input
                    placeholder="e.g., Celsius Energy"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Competitor Description</Label>
                  <Textarea
                    placeholder="Describe the competitor product"
                    value={compDesc}
                    onChange={(e) => setCompDesc(e.target.value)}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Price Min ($)</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={compPriceMin}
                      onChange={(e) => setCompPriceMin(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Price Max ($)</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={compPriceMax}
                      onChange={(e) => setCompPriceMax(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SHARED FIELDS */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Research Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Target Consumer</Label>
                  <Textarea
                    placeholder="e.g., Health-conscious adults 25-40, fitness enthusiasts"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Both products will be tested against the same consumer panel.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ABOUT YOU - only for non-authenticated users */}
            {!isAuthUser && (
              <Card className="bg-teal/5 border-teal/20">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">About you</p>
                    <p className="text-xs text-muted-foreground">
                      We&apos;ll send the comparison report link to your email.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Name <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="Jane Smith"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Work email <span className="text-red-500">*</span></Label>
                      <Input
                        type="email"
                        placeholder="jane@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Company (optional)</Label>
                    <Input
                      placeholder="Acme Corp"
                      value={userCompany}
                      onChange={(e) => setUserCompany(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              By running this comparison, you agree to our{" "}
              <Link href="/terms" className="text-teal underline">Terms of Service</Link> and{" "}
              <Link href="/privacy" className="text-teal underline">Privacy Policy</Link>.
              Results are AI-simulated and not from real consumers.
            </p>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              disabled={!isFormValid || isRunning}
            >
              Run Competitive Teardown (Free)
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Free - no credit card required. Results in 2-4 minutes.
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
