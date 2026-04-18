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
import type { AudienceTestResult } from "@/types/audience-test";
import { isValidEmail } from "@/lib/email-validation";

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

const DEFAULT_SEGMENTS = [
  "Women 18-30",
  "Women 31-45",
  "Men 18-30",
  "Men 31-45",
  "Mixed 46-65",
];

export default function NewAudienceTestPage() {
  return (
    <Suspense>
      <AudienceTestForm />
    </Suspense>
  );
}

function AudienceTestForm() {
  const router = useRouter();
  const { planChecked, hasAccess, isAuthenticated } = usePlanAccess("pro");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [category, setCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const [seg1, setSeg1] = useState(DEFAULT_SEGMENTS[0]);
  const [seg2, setSeg2] = useState(DEFAULT_SEGMENTS[1]);
  const [seg3, setSeg3] = useState(DEFAULT_SEGMENTS[2]);
  const [seg4, setSeg4] = useState(DEFAULT_SEGMENTS[3]);
  const [seg5, setSeg5] = useState(DEFAULT_SEGMENTS[4]);

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAuthUser, setIsAuthUser] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  // UTM tracking
  const [utmSource] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") || "" : "");
  const [utmMedium] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_medium") || "" : "");
  const [utmCampaign] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_campaign") || "" : "");
  const [referrer] = useState(() => typeof window !== "undefined" ? document.referrer || "" : "");

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

  // Reset segments to defaults when category changes (only if defaults haven't been edited)
  const [segmentsTouched, setSegmentsTouched] = useState(false);
  useEffect(() => {
    if (!segmentsTouched) {
      setSeg1(DEFAULT_SEGMENTS[0]);
      setSeg2(DEFAULT_SEGMENTS[1]);
      setSeg3(DEFAULT_SEGMENTS[2]);
      setSeg4(DEFAULT_SEGMENTS[3]);
      setSeg5(DEFAULT_SEGMENTS[4]);
    }
  }, [category, segmentsTouched]);

  const segmentInputs = [seg1, seg2, seg3, seg4, seg5];
  const validSegments = segmentInputs.filter((s) => s.trim());

  const isFormValid =
    productName.trim() &&
    productDescription.trim().length > 10 &&
    validSegments.length >= 2 &&
    email.trim() &&
    isValidEmail(email) &&
    (isAuthUser || (userName.trim() && userCompany.trim() && userRole));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Preparing audience panels...");

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 5, 95));
      setStage((s) => {
        const stages = [
          "Generating targeted personas...",
          "Testing segment 1...",
          "Testing segment 2...",
          "Testing segment 3...",
          "Comparing audience responses...",
          "Ranking segments...",
          "Finalizing audience insights...",
        ];
        const idx = stages.indexOf(s);
        return idx < stages.length - 1 ? stages[idx + 1] : s;
      });
    }, 4000);

    try {
      const features = keyFeatures
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload: Record<string, unknown> = {
        productName: productName.trim(),
        productDescription: productDescription.trim(),
        segments: validSegments,
      };
      if (category && category !== "other") payload.category = category;
      if (priceMin && priceMax) {
        payload.priceRange = { min: Number(priceMin), max: Number(priceMax) };
      }
      if (features.length) payload.keyFeatures = features;
      payload.email = email.trim();
      payload.userName = userName.trim();
      payload.userCompany = userCompany.trim();
      payload.userRole = userRole;
      if (utmSource) payload.utmSource = utmSource;
      if (utmMedium) payload.utmMedium = utmMedium;
      if (utmCampaign) payload.utmCampaign = utmCampaign;
      if (referrer) payload.referrer = referrer;

      const response = await fetch("/api/audience-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Audience test failed");
      }

      const result: AudienceTestResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(`audience-test-${result.id}`, JSON.stringify(result));

      setTimeout(() => router.push(`/audience-test/${result.id}`), 500);
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
        toolTitle="Audience Finder"
        toolDescription="Test your product across different audience segments. Find out which group has the highest purchase intent."
        bullets={[
          "Test across 5 audience segments",
          "Find highest-intent demographic",
          "Per-segment WTP and concerns",
          "Strategic audience recommendations",
        ]}
        sampleReportHref="/audience-test/sample-rekt"
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
              Running audience test
            </h2>
            <p className="text-sm text-muted-foreground mb-8">{stage}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mb-3 overflow-hidden">
              <div
                className="bg-teal h-1.5 rounded-full origin-left transition-transform duration-1000 ease-out"
                style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {progress >= 95 ? "Finalizing results..." : `Testing audience segments (${Math.round(progress)}%)`}
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
              Audience Finder
            </h1>
            <p className="text-muted-foreground">
              Test your product across different audience segments. Find out which group has the highest purchase intent.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/audience-test/sample-rekt" className="text-teal hover:underline">
                View a sample report &rarr;
              </Link>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <UrlAutofill onExtracted={(data) => {
                  if (data.productName) setProductName(data.productName);
                  const descParts = [data.problem, data.feature1, data.feature2, data.feature3].filter(Boolean);
                  if (descParts.length) setProductDescription(descParts.join(". "));
                  const featureParts = [data.feature1, data.feature2, data.feature3].filter(Boolean);
                  if (featureParts.length) setKeyFeatures(featureParts.join(", "));
                  if (data.category) setCategory(data.category);
                  if (data.priceMin) setPriceMin(String(data.priceMin));
                  if (data.priceMax) setPriceMax(String(data.priceMax));
                }} />

                {/* Product Name */}
                <div className="space-y-1.5">
                  <Label>Product Name</Label>
                  <Input
                    placeholder="e.g., Rekt Focus Energy Powder"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label>Product Description</Label>
                  <Textarea
                    placeholder="Describe your product, what it does, and what problem it solves"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>

                {/* Key Features */}
                <div className="space-y-1.5">
                  <Label>Key Features (comma-separated)</Label>
                  <Input
                    placeholder="e.g., Natural caffeine, Zero sugar, Mixes instantly"
                    value={keyFeatures}
                    onChange={(e) => setKeyFeatures(e.target.value)}
                  />
                </div>

                {/* Category */}
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

                {/* Price Range */}
                <div className="space-y-1.5">
                  <Label>Price Range</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="pl-7"
                        min="0"
                      />
                    </div>
                    <span className="text-muted-foreground">&mdash;</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="pl-7"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Audience Segments
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Audience Segments */}
                <div className="space-y-2">
                  <Label>Segments to Test (2-5)</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Edit the defaults below or enter your own audience descriptions.
                  </p>
                  {[
                    { val: seg1, set: setSeg1, num: 1 },
                    { val: seg2, set: setSeg2, num: 2 },
                    { val: seg3, set: setSeg3, num: 3 },
                    { val: seg4, set: setSeg4, num: 4 },
                    { val: seg5, set: setSeg5, num: 5 },
                  ].map((s) => (
                    <Input
                      key={s.num}
                      placeholder={`Segment ${s.num} (e.g., Women 25-35, urban, mid income)`}
                      value={s.val}
                      onChange={(e) => {
                        s.set(e.target.value);
                        setSegmentsTouched(true);
                      }}
                    />
                  ))}
                  <p className="text-xs text-muted-foreground">
                    Each segment is tested with 20 targeted personas ({validSegments.length} of 5 filled).
                  </p>
                </div>

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
                        <Input
                          id="userName"
                          placeholder="Jane Smith"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Work email <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="userCompany">Company <span className="text-red-500">*</span></Label>
                        <Input
                          id="userCompany"
                          placeholder="Acme Corp"
                          value={userCompany}
                          onChange={(e) => setUserCompany(e.target.value)}
                          required
                        />
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
                  Results are AI-simulated (not real consumers). Not suitable for high-stakes decisions.
                </p>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                  disabled={!isFormValid || isRunning}
                >
                  Run Audience Test (Free)
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Free - no credit card required. Results in 2-3 minutes.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
