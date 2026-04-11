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
import { Lock } from "lucide-react";

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

interface DiscoveryInput {
  brandName: string;
  brandDescription: string;
  category: string;
  targetAudience: string;
  existingProducts?: string;
  priceRange?: { min: number; max: number };
  priceUnit?: string;
  constraints?: string;
}

interface ProductConcept {
  name: string;
  description: string;
  rationale: string;
  estimatedPricePoint: { low: number; high: number };
}

interface DiscoveryPanelResult {
  concept: ProductConcept;
  purchaseIntent: {
    score: number;
    distribution: { label: string; count: number }[];
  };
  wtpRange: { low: number; mid: number; high: number };
  topExcitement: string;
  topHesitation: string;
  demandRank: number;
  round: number;
}

interface DiscoveryResult {
  id: string;
  input: DiscoveryInput;
  concepts: DiscoveryPanelResult[];
  rounds: number;
  panelSize: number;
  methodology: {
    panelSize: number;
    demographicMix: string;
    conceptsGenerated: number;
    conceptsTested: number;
    confidenceNote: string;
  };
  createdAt: string;
  status: "running" | "complete" | "error";
}

export default function DiscoverNewPage() {
  return (
    <Suspense>
      <DiscoverNewForm />
    </Suspense>
  );
}

function DiscoverNewForm() {
  const router = useRouter();
  const isPro = true; // TODO: gate behind auth/billing when ready

  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [category, setCategory] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [existingProducts, setExistingProducts] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceUnit, setPriceUnit] = useState("");
  const [constraints, setConstraints] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userCompanySize, setUserCompanySize] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [autofillMode, setAutofillMode] = useState<"url" | "search">("url");
  const [autofillInput, setAutofillInput] = useState("");
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [autofillError, setAutofillError] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  const isFormValid =
    brandName.trim() &&
    brandDescription.trim().length > 10 &&
    category &&
    targetAudience.trim().length > 5 &&
    email.trim() &&
    email.includes("@") &&
    userName.trim() &&
    userCompany.trim() &&
    userRole;

  async function handleAutofill() {
    if (!autofillInput.trim()) return;
    setIsAutofilling(true);
    setAutofillError("");
    try {
      const payload =
        autofillMode === "url"
          ? { url: autofillInput.trim() }
          : { query: autofillInput.trim() };

      const res = await fetch("/api/extract-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setAutofillError(data.error || "Failed");
        return;
      }

      if (data.brandName) setBrandName(data.brandName);
      if (data.brandDescription) setBrandDescription(data.brandDescription);
      if (data.category) setCategory(data.category);
      if (data.targetAudience) setTargetAudience(data.targetAudience);
      if (data.existingProducts) setExistingProducts(data.existingProducts);
      if (data.priceMin != null) setPriceMin(String(data.priceMin));
      if (data.priceMax != null) setPriceMax(String(data.priceMax));
      if (data.existingProducts || data.priceMin != null) setShowAdvanced(true);
    } catch {
      setAutofillError("Failed to look up brand. Try again.");
    } finally {
      setIsAutofilling(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Analysing your brand and audience...");

    let conceptIndex = 1;
    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 6));
      setStage((s) => {
        const stages = [
          "Analysing your brand and audience...",
          "Generating product concepts...",
          "Testing concepts with consumer panel...",
          `Evaluating concept ${conceptIndex} of 8...`,
          `Evaluating concept ${Math.min(conceptIndex + 1, 8)} of 8...`,
          `Evaluating concept ${Math.min(conceptIndex + 2, 8)} of 8...`,
          `Evaluating concept ${Math.min(conceptIndex + 3, 8)} of 8...`,
          "Ranking opportunities...",
          "Complete!",
        ];
        const idx = stages.indexOf(s);
        if (idx >= 3 && idx <= 6) conceptIndex = Math.min(conceptIndex + 1, 8);
        return idx < stages.length - 1 ? stages[idx + 1] : s;
      });
    }, 3000);

    try {
      const payload: Record<string, unknown> = {
        brandName: brandName.trim(),
        brandDescription: brandDescription.trim(),
        category,
        targetAudience: targetAudience.trim(),
      };
      if (existingProducts.trim())
        payload.existingProducts = existingProducts.trim();
      if (priceMin && priceMax) {
        payload.priceRange = { min: Number(priceMin), max: Number(priceMax) };
      }
      if (priceUnit.trim()) payload.priceUnit = priceUnit.trim();
      if (constraints.trim()) payload.constraints = constraints.trim();
      payload.email = email.trim();
      payload.userName = userName.trim();
      payload.userCompany = userCompany.trim();
      payload.userRole = userRole;
      if (userCompanySize) payload.userCompanySize = userCompanySize;

      const response = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Discovery failed");
      }

      const result: DiscoveryResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(
        `discovery-${result.id}`,
        JSON.stringify(result)
      );

      setTimeout(() => router.push(`/discover/${result.id}`), 500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsRunning(false);
      setProgress(0);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (!isPro) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">
              Product Discovery is a Pro feature
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Discover untapped product opportunities for your brand. Our AI
              generates and tests product concepts with a simulated consumer
              panel to find what your audience actually wants.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 text-sm font-medium transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (isRunning) {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
              <svg
                className="animate-spin text-teal"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">
              Discovering product opportunities
            </h2>
            <p className="text-sm text-muted-foreground mb-8">{stage}</p>
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div
                className="bg-teal h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Generating and testing 8 product concepts with 30 consumers each
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
              Product Discovery
            </h1>
            <p className="text-muted-foreground">
              Tell us about your brand. We&apos;ll generate product concepts and
              test them with a simulated consumer panel to find the best
              opportunities.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Auto-fill brand info */}
              <div className="mb-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm font-medium">
                    Auto-fill brand info
                  </span>
                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setAutofillMode("url");
                        setAutofillInput("");
                        setAutofillError("");
                      }}
                      className={
                        autofillMode === "url"
                          ? "text-teal font-medium underline underline-offset-4"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      From URL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAutofillMode("search");
                        setAutofillInput("");
                        setAutofillError("");
                      }}
                      className={
                        autofillMode === "search"
                          ? "text-teal font-medium underline underline-offset-4"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      Search by name
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type={autofillMode === "url" ? "url" : "text"}
                    placeholder={
                      autofillMode === "url"
                        ? "https://example.com"
                        : "e.g., Nike, Glossier, Athletic Greens"
                    }
                    value={autofillInput}
                    onChange={(e) => setAutofillInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAutofill}
                    disabled={isAutofilling || !autofillInput.trim()}
                    className="shrink-0"
                  >
                    {isAutofilling
                      ? autofillMode === "url"
                        ? "Extracting..."
                        : "Looking up..."
                      : autofillMode === "url"
                        ? "Auto-fill"
                        : "Look up"}
                  </Button>
                </div>
                {autofillError && (
                  <p className="text-xs text-destructive mt-2">
                    {autofillError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {autofillMode === "url"
                    ? "Paste your brand's website and we'll extract the details."
                    : "Enter a brand name and we'll pull what we know about it."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Brand Name */}
                <div className="space-y-1.5">
                  <Label>Brand Name</Label>
                  <Input
                    placeholder="e.g., REKT"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                  />
                </div>

                {/* Brand Description */}
                <div className="space-y-1.5">
                  <Label>Brand Description</Label>
                  <Textarea
                    placeholder="Describe your brand's positioning, values, and what you're known for"
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    rows={3}
                    className="resize-none"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v ?? "")}
                  >
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

                {/* Target Audience */}
                <div className="space-y-1.5">
                  <Label>Target Audience</Label>
                  <Textarea
                    placeholder="e.g., Gen Z and millennial gamers, 18-35, who care about clean ingredients and bold flavours"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    rows={2}
                    className="resize-none"
                    required
                  />
                </div>

                {/* Advanced Options */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm text-teal hover:underline font-medium flex items-center gap-1"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${showAdvanced ? "rotate-90" : ""}`}
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    Advanced options
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-5 pl-1 border-l-2 border-border/50 ml-2 pl-4">
                      {/* Existing Products */}
                      <div className="space-y-1.5">
                        <Label>Existing Products</Label>
                        <Input
                          placeholder="e.g., Energy drink, Protein bar, Hydration mix"
                          value={existingProducts}
                          onChange={(e) => setExistingProducts(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Products you already sell, so we avoid suggesting them.
                        </p>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-1.5">
                        <Label>Price Range</Label>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              placeholder="Min"
                              value={priceMin}
                              onChange={(e) => setPriceMin(e.target.value)}
                              className="pl-7"
                              min="0"
                            />
                          </div>
                          <span className="text-muted-foreground">--</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              $
                            </span>
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

                      {/* Pricing Unit */}
                      <div className="space-y-1.5">
                        <Label>Pricing Unit</Label>
                        <Input
                          placeholder="e.g., per can, per 4-pack, per box"
                          value={priceUnit}
                          onChange={(e) => setPriceUnit(e.target.value)}
                        />
                      </div>

                      {/* Constraints */}
                      <div className="space-y-1.5">
                        <Label>Constraints</Label>
                        <Input
                          placeholder="e.g., must be shelf-stable, no dairy, under $5 per unit"
                          value={constraints}
                          onChange={(e) => setConstraints(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
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
                      <Label htmlFor="d-userName">Name</Label>
                      <Input
                        id="d-userName"
                        placeholder="Jane Smith"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="d-email">Work email</Label>
                      <Input
                        id="d-email"
                        type="email"
                        placeholder="jane@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="d-userCompany">Company</Label>
                      <Input
                        id="d-userCompany"
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
                  By running discovery, you agree to our{" "}
                  <a href="/terms" className="text-teal underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-teal underline">Privacy Policy</a>.
                  Results are AI-simulated and publicly accessible via their unique URL.
                </p>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                  disabled={!isFormValid}
                >
                  Discover Products (Pro)
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Generates 8 product concepts and tests each with 30 simulated
                  consumers. Results in 2-3 minutes.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
