"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
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
import type { PricingTestResult } from "@/types/pricing-test";

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

export default function NewPricingTestPage() {
  return (
    <Suspense>
      <PricingTestForm />
    </Suspense>
  );
}

function PricingTestForm() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [category, setCategory] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [priceUnit, setPriceUnit] = useState("per unit");
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [price3, setPrice3] = useState("");
  const [price4, setPrice4] = useState("");
  const [price5, setPrice5] = useState("");

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userCompanySize, setUserCompanySize] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  // UTM tracking
  const [utmSource] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") || "" : "");
  const [utmMedium] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_medium") || "" : "");
  const [utmCampaign] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_campaign") || "" : "");
  const [referrer] = useState(() => typeof window !== "undefined" ? document.referrer || "" : "");

  const priceInputs = [price1, price2, price3, price4, price5];
  const validPrices = priceInputs.filter((p) => p.trim() && Number(p) > 0);

  const isFormValid =
    productName.trim() &&
    productDescription.trim().length > 10 &&
    validPrices.length >= 2 &&
    email.trim() &&
    email.includes("@") &&
    userName.trim() &&
    userCompany.trim() &&
    userRole;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Preparing pricing panel...");

    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 6));
      setStage((s) => {
        const stages = [
          "Generating consumer personas...",
          "Testing price point 1...",
          "Testing price point 2...",
          "Testing price point 3...",
          "Analysing price sensitivity...",
          "Computing demand curve...",
          "Finding optimal price...",
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
        pricePoints: validPrices.map(Number).sort((a, b) => a - b),
        priceUnit,
      };
      if (category && category !== "other") payload.category = category;
      if (targetMarket.trim()) payload.targetMarket = targetMarket.trim();
      if (features.length) payload.keyFeatures = features;
      payload.email = email.trim();
      payload.userName = userName.trim();
      payload.userCompany = userCompany.trim();
      payload.userRole = userRole;
      if (userCompanySize) payload.userCompanySize = userCompanySize;
      if (utmSource) payload.utmSource = utmSource;
      if (utmMedium) payload.utmMedium = utmMedium;
      if (utmCampaign) payload.utmCampaign = utmCampaign;
      if (referrer) payload.referrer = referrer;

      const response = await fetch("/api/pricing-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Pricing test failed");
      }

      const result: PricingTestResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(`pricing-test-${result.id}`, JSON.stringify(result));

      setTimeout(() => router.push(`/pricing-test/${result.id}`), 500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsRunning(false);
      setProgress(0);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
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
              Running pricing test
            </h2>
            <p className="text-sm text-muted-foreground mb-8">{stage}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mb-3 overflow-hidden">
              <div
                className="bg-teal h-1.5 rounded-full origin-left transition-transform duration-1000 ease-out"
                style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {progress >= 95 ? "Finalizing results..." : `Testing price sensitivity (${Math.round(progress)}%)`}
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
              Pricing Optimizer
            </h1>
            <p className="text-muted-foreground">
              Test up to 5 price points with a simulated consumer panel. Find the price that maximizes revenue.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/pricing-test/sample-rekt" className="text-teal hover:underline">
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
                    placeholder="Describe your product, what it does, and who it's for"
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

                {/* Target Consumer */}
                <div className="space-y-1.5">
                  <Label>Target Consumer</Label>
                  <Textarea
                    placeholder="e.g., Health-conscious professionals 22-38, $60k+ income"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* Separator */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Price Points
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Pricing Unit */}
                <div className="space-y-1.5">
                  <Label>Pricing Unit</Label>
                  <Select value={priceUnit} onValueChange={(v) => setPriceUnit(v ?? "per unit")}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per unit">per unit</SelectItem>
                      <SelectItem value="per pack">per pack</SelectItem>
                      <SelectItem value="per serving">per serving</SelectItem>
                      <SelectItem value="per month">per month</SelectItem>
                      <SelectItem value="per subscription">per subscription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 5 Price Points */}
                <div className="space-y-1.5">
                  <Label>Price Points to Test (enter 2-5 prices)</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { val: price1, set: setPrice1, ph: "$19" },
                      { val: price2, set: setPrice2, ph: "$29" },
                      { val: price3, set: setPrice3, ph: "$39" },
                      { val: price4, set: setPrice4, ph: "$49" },
                      { val: price5, set: setPrice5, ph: "$59" },
                    ].map((p, i) => (
                      <div key={i} className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder={p.ph.replace("$", "")}
                          value={p.val}
                          onChange={(e) => p.set(e.target.value)}
                          className="pl-7"
                          min="0"
                          step="any"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Each price point is tested with the full panel ({validPrices.length} of 5 filled).
                  </p>
                </div>

                {/* About you */}
                <div className="bg-teal/5 rounded-xl p-4 border border-teal/20 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-1">About you</p>
                    <p className="text-xs text-muted-foreground">
                      We&apos;ll send your report link to your email. No account needed.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="userName">Name</Label>
                      <Input
                        id="userName"
                        placeholder="Jane Smith"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Work email</Label>
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
                      <Label htmlFor="userCompany">Company</Label>
                      <Input
                        id="userCompany"
                        placeholder="Acme Corp"
                        value={userCompany}
                        onChange={(e) => setUserCompany(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Role</Label>
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
                  <div className="space-y-1.5">
                    <Label>Company size</Label>
                    <Select value={userCompanySize} onValueChange={(v) => setUserCompanySize(v ?? "")}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select company size (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Just me</SelectItem>
                        <SelectItem value="2-10">2-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-1000">201-1,000</SelectItem>
                        <SelectItem value="1000+">1,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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
                  disabled={!isFormValid}
                >
                  Run Pricing Test (Free)
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
