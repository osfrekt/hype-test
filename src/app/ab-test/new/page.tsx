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
import type { AbTestResult } from "@/types/ab-test";

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

export default function NewAbTestPage() {
  return (
    <Suspense>
      <NewAbTestForm />
    </Suspense>
  );
}

function NewAbTestForm() {
  const router = useRouter();

  // Concept A
  const [nameA, setNameA] = useState("");
  const [descA, setDescA] = useState("");
  const [featureA1, setFeatureA1] = useState("");
  const [featureA2, setFeatureA2] = useState("");
  const [featureA3, setFeatureA3] = useState("");
  const [priceMinA, setPriceMinA] = useState("");
  const [priceMaxA, setPriceMaxA] = useState("");

  // Concept B
  const [nameB, setNameB] = useState("");
  const [descB, setDescB] = useState("");
  const [featureB1, setFeatureB1] = useState("");
  const [featureB2, setFeatureB2] = useState("");
  const [featureB3, setFeatureB3] = useState("");
  const [priceMinB, setPriceMinB] = useState("");
  const [priceMaxB, setPriceMaxB] = useState("");

  // Shared
  const [category, setCategory] = useState("");
  const [targetConsumer, setTargetConsumer] = useState("");

  // About you
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userCompanySize, setUserCompanySize] = useState("");

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

  const isFormValid =
    nameA.trim() && descA.trim().length > 10 &&
    nameB.trim() && descB.trim().length > 10 &&
    email.trim() && email.includes("@") &&
    userName.trim() && userCompany.trim() && userRole;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Preparing shared research panel...");

    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 5));
      setStage((s) => {
        const stages = [
          "Generating consumer personas...",
          "Testing Concept A with panel...",
          "Testing Concept B with panel...",
          "Comparing purchase intent...",
          "Analysing feature preferences...",
          "Determining winner...",
        ];
        const idx = stages.indexOf(s);
        return idx < stages.length - 1 ? stages[idx + 1] : s;
      });
    }, 4000);

    try {
      const featuresA = [featureA1, featureA2, featureA3].map(f => f.trim()).filter(Boolean);
      const featuresB = [featureB1, featureB2, featureB3].map(f => f.trim()).filter(Boolean);

      const payload: Record<string, unknown> = {
        conceptA: {
          productName: nameA.trim(),
          productDescription: descA.trim(),
          ...(featuresA.length && { keyFeatures: featuresA }),
          ...(priceMinA && priceMaxA && { priceRange: { min: Number(priceMinA), max: Number(priceMaxA) } }),
        },
        conceptB: {
          productName: nameB.trim(),
          productDescription: descB.trim(),
          ...(featuresB.length && { keyFeatures: featuresB }),
          ...(priceMinB && priceMaxB && { priceRange: { min: Number(priceMinB), max: Number(priceMaxB) } }),
        },
        category: category || undefined,
        targetConsumer: targetConsumer.trim() || undefined,
        email: email.trim(),
        userName: userName.trim(),
        userCompany: userCompany.trim(),
        userRole,
        userCompanySize: userCompanySize || undefined,
        ...(utmSource && { utmSource }),
        ...(utmMedium && { utmMedium }),
        ...(utmCampaign && { utmCampaign }),
        ...(referrer && { referrer }),
      };

      const response = await fetch("/api/ab-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "A/B test failed");
      }

      const result: AbTestResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(`ab-test-${result.id}`, JSON.stringify(result));
      setTimeout(() => router.push(`/ab-test/${result.id}`), 500);
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
              Running your A/B test
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
                ? "Determining winner..."
                : `Testing both concepts with shared panel (${Math.round(progress)}%)`}
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
              A/B Concept Test
            </h1>
            <p className="text-muted-foreground">
              Test two product concepts against the same panel of 50 consumers. See which one wins.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/ab-test/sample-rekt" className="text-teal hover:underline">
                View a sample report &rarr;
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Concept A */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Concept A</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Product Name</Label>
                  <Input
                    placeholder="e.g., Rekt Focus Powder"
                    value={nameA}
                    onChange={(e) => setNameA(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="What is this product? What problem does it solve?"
                    value={descA}
                    onChange={(e) => setDescA(e.target.value)}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Key Features (optional)</Label>
                  <div className="space-y-2">
                    <Input placeholder="Feature 1" value={featureA1} onChange={(e) => setFeatureA1(e.target.value)} />
                    <Input placeholder="Feature 2" value={featureA2} onChange={(e) => setFeatureA2(e.target.value)} />
                    <Input placeholder="Feature 3" value={featureA3} onChange={(e) => setFeatureA3(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Price Range (optional)</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input type="number" placeholder="Min" value={priceMinA} onChange={(e) => setPriceMinA(e.target.value)} className="pl-7" min="0" />
                    </div>
                    <span className="text-muted-foreground">&mdash;</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input type="number" placeholder="Max" value={priceMaxA} onChange={(e) => setPriceMaxA(e.target.value)} className="pl-7" min="0" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Concept B */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Concept B</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Product Name</Label>
                  <Input
                    placeholder="e.g., Rekt Energy Gummies"
                    value={nameB}
                    onChange={(e) => setNameB(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="What is this product? What problem does it solve?"
                    value={descB}
                    onChange={(e) => setDescB(e.target.value)}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Key Features (optional)</Label>
                  <div className="space-y-2">
                    <Input placeholder="Feature 1" value={featureB1} onChange={(e) => setFeatureB1(e.target.value)} />
                    <Input placeholder="Feature 2" value={featureB2} onChange={(e) => setFeatureB2(e.target.value)} />
                    <Input placeholder="Feature 3" value={featureB3} onChange={(e) => setFeatureB3(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Price Range (optional)</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input type="number" placeholder="Min" value={priceMinB} onChange={(e) => setPriceMinB(e.target.value)} className="pl-7" min="0" />
                    </div>
                    <span className="text-muted-foreground">&mdash;</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input type="number" placeholder="Max" value={priceMaxB} onChange={(e) => setPriceMaxB(e.target.value)} className="pl-7" min="0" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shared fields */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Shared Context</CardTitle>
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
                  <p className="text-xs text-muted-foreground">
                    Skews 80% of the panel toward this demographic. Both concepts are tested on the same panel.
                  </p>
                </div>
              </CardContent>
            </Card>

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
                  <Input id="userName" placeholder="Jane Smith" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" placeholder="jane@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="userCompany">Company</Label>
                  <Input id="userCompany" placeholder="Acme Corp" value={userCompany} onChange={(e) => setUserCompany(e.target.value)} required />
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
              Results are AI-simulated (not real consumers). Uses 2 research credits.
            </p>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              disabled={!isFormValid}
            >
              Run A/B Test (Pro)
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Uses 2 research credits. Results in 2-4 minutes.
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
