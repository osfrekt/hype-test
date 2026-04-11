"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import type { ResearchResult } from "@/types/research";

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

const CATEGORY_DEFAULTS: Record<
  string,
  { target: string; competitors: string }
> = {
  "food & beverage": {
    target: "Grocery shoppers 25-55, health-aware, urban/suburban",
    competitors: "Kind, RXBar, Clif Bar",
  },
  "health & wellness": {
    target: "Health-conscious adults 25-40, fitness enthusiasts",
    competitors: "Celsius, Ghost, Athletic Greens",
  },
  technology: {
    target: "Tech-savvy professionals 22-45, early adopters",
    competitors: "Apple, Samsung, Google",
  },
  "fashion & apparel": {
    target: "Style-conscious adults 18-35, urban, mid-to-high income",
    competitors: "Nike, Zara, Everlane",
  },
  "home & garden": {
    target: "Homeowners 28-55, suburban, mid-to-high income",
    competitors: "IKEA, West Elm, Wayfair",
  },
  "beauty & personal care": {
    target: "Women 18-40, beauty-aware, social media active",
    competitors: "The Ordinary, CeraVe, Glossier",
  },
  education: {
    target: "Students and professionals 18-40, career-focused",
    competitors: "Coursera, Udemy, Skillshare",
  },
  finance: {
    target: "Young professionals 22-40, income $50k+, digitally native",
    competitors: "Robinhood, Wealthfront, SoFi",
  },
};

const EXAMPLES: Record<string, string> = {
  productName: "REKT Focus Energy Powder",
  problem:
    "People want clean energy for work and training without sugar crashes, jitters, or having to drink another can of something",
  feature1: "200mg natural caffeine from green coffee bean",
  feature2: "Cognizin citicoline for sustained mental focus",
  feature3: "Zero sugar, 5 calories, mixes in water in seconds",
  differentiator:
    "Only energy powder combining clinical-dose nootropics with clean caffeine — positioned between energy drinks (unhealthy) and pre-workout (too intense)",
  priceMin: "2",
  priceMax: "3",
  priceUnit: "per stick pack",
  targetMarket:
    "Health-conscious professionals and gym-goers 22-38, $60k+ income, who currently drink energy drinks but want something cleaner",
  competitors: "Celsius, Ghost Energy, LMNT, Liquid IV Energy",
};

export default function NewResearchPage() {
  return (
    <Suspense>
      <NewResearchForm />
    </Suspense>
  );
}

function NewResearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productName, setProductName] = useState("");
  const [problem, setProblem] = useState("");
  const [feature1, setFeature1] = useState("");
  const [feature2, setFeature2] = useState("");
  const [feature3, setFeature3] = useState("");
  const [differentiator, setDifferentiator] = useState("");
  const [category, setCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceUnit, setPriceUnit] = useState("per unit");
  const [unitsPerPack, setUnitsPerPack] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [showExamples, setShowExamples] = useState<Set<string>>(new Set());

  // Track whether user has manually edited target/competitors
  const [targetTouched, setTargetTouched] = useState(false);
  const [competitorsTouched, setCompetitorsTouched] = useState(false);

  // Pre-fill from search params (e.g. "Run again" from results page)
  useEffect(() => {
    const name = searchParams.get("name");
    const desc = searchParams.get("desc");
    const cat = searchParams.get("cat");
    if (name) setProductName(name);
    if (desc) setProblem(desc); // best effort — put old description into problem field
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Smart defaults when category changes
  useEffect(() => {
    const defaults = CATEGORY_DEFAULTS[category];
    if (!defaults) return;
    if (!targetTouched && !targetMarket) setTargetMarket(defaults.target);
    if (!competitorsTouched && !competitors) setCompetitors(defaults.competitors);
  }, [category, targetTouched, competitorsTouched, targetMarket, competitors]);

  // Assemble structured fields into a single description string
  const assembledDescription = useMemo(() => {
    const parts: string[] = [];
    if (problem.trim()) parts.push(problem.trim());
    const features = [feature1, feature2, feature3]
      .map((f) => f.trim())
      .filter(Boolean);
    if (features.length) parts.push("Key features: " + features.join(". ") + ".");
    if (differentiator.trim())
      parts.push("Differentiator: " + differentiator.trim());
    return parts.join(" ");
  }, [problem, feature1, feature2, feature3, differentiator]);

  const isFormValid = productName.trim() && assembledDescription.length > 20;

  // Quality indicator
  const quality = useMemo(() => {
    let score = 0;
    if (productName.trim()) score++;
    if (problem.trim().length > 20) score++;
    if ([feature1, feature2, feature3].filter((f) => f.trim()).length >= 2)
      score++;
    if (differentiator.trim().length > 10) score++;
    if (category) score++;
    if (priceMin && priceMax) score++;
    if (targetMarket.trim()) score++;
    if (competitors.trim()) score++;

    if (score <= 3) return { level: "Fair", color: "text-amber-600", bg: "bg-amber-500" };
    if (score <= 5) return { level: "Good", color: "text-teal", bg: "bg-teal" };
    return { level: "Excellent", color: "text-emerald-600", bg: "bg-emerald-500" };
  }, [
    productName, problem, feature1, feature2, feature3,
    differentiator, category, priceMin, priceMax, targetMarket, competitors,
  ]);

  const qualityNudge = useMemo(() => {
    if (!competitors.trim())
      return "Adding competitors enables head-to-head analysis";
    if (!targetMarket.trim())
      return "Specifying a target consumer skews the panel for more relevant results";
    if (!priceMin || !priceMax)
      return "Adding a price range improves willingness-to-pay accuracy";
    if ([feature1, feature2, feature3].filter((f) => f.trim()).length < 2)
      return "Adding more features gives consumers more to evaluate";
    return null;
  }, [competitors, targetMarket, priceMin, priceMax, feature1, feature2, feature3]);

  function toggleExample(field: string) {
    setShowExamples((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  }

  async function handleExtract() {
    if (!url.trim()) return;
    setIsExtracting(true);
    setExtractError("");
    try {
      const res = await fetch("/api/extract-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setExtractError(data.error || "Failed to extract product info.");
        return;
      }
      if (data.productName) setProductName(data.productName);
      if (data.problem) setProblem(data.problem);
      if (data.feature1) setFeature1(data.feature1);
      if (data.feature2) setFeature2(data.feature2);
      if (data.feature3) setFeature3(data.feature3);
      if (data.differentiator) setDifferentiator(data.differentiator);
      if (data.category) setCategory(data.category);
      if (data.priceMin != null) setPriceMin(String(data.priceMin));
      if (data.priceMax != null) setPriceMax(String(data.priceMax));
      if (data.priceUnit) {
        const unitOptions = ["per unit", "per pack", "per serving", "per month", "per subscription"];
        const match = unitOptions.find((o) =>
          data.priceUnit.toLowerCase().includes(o.replace("per ", ""))
        );
        setPriceUnit(match || "per unit");
      }
      if (data.unitsPerPack != null) setUnitsPerPack(String(data.unitsPerPack));
      if (data.competitors) {
        setCompetitors(data.competitors);
        setCompetitorsTouched(true);
      }
      if (data.targetMarket) {
        setTargetMarket(data.targetMarket);
        setTargetTouched(true);
      }
    } catch {
      setExtractError(
        "Failed to extract product info. Check the URL and try again."
      );
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Preparing research panel...");

    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 8));
      setStage((s) => {
        const stages = [
          "Generating consumer personas...",
          "Running structured surveys...",
          "Simulating purchase decisions...",
          "Analysing feature preferences...",
          "Aggregating panel responses...",
          "Computing willingness-to-pay...",
          "Generating consumer insights...",
        ];
        const idx = stages.indexOf(s);
        return idx < stages.length - 1 ? stages[idx + 1] : s;
      });
    }, 3000);

    try {
      const payload: Record<string, unknown> = {
        productName: productName.trim(),
        productDescription: assembledDescription,
      };
      if (category && category !== "other") payload.category = category;
      if (priceMin && priceMax) {
        payload.priceRange = { min: Number(priceMin), max: Number(priceMax) };
      }
      if (priceUnit) payload.priceUnit = priceUnit;
      if (unitsPerPack && Number(unitsPerPack) > 0)
        payload.unitsPerPack = Number(unitsPerPack);
      if (targetMarket.trim()) payload.targetMarket = targetMarket.trim();
      if (competitors.trim()) payload.competitors = competitors.trim();

      const features = [feature1, feature2, feature3]
        .map((f) => f.trim())
        .filter(Boolean);
      if (features.length) payload.keyFeatures = features;

      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Research failed");
      }

      const result: ResearchResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(
        `research-${result.id}`,
        JSON.stringify(result)
      );

      setTimeout(() => router.push(`/research/${result.id}`), 500);
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
            {/* Pulsing dot grid — suggests distributed consumer simulation */}
            <div className="dot-grid grid grid-cols-6 gap-2 w-fit mx-auto mb-8">
              {Array.from({ length: 18 }, (_, i) => (
                <span
                  key={i}
                  className="block w-2.5 h-2.5 rounded-full bg-teal"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">
              Running your research
            </h2>
            <p className="text-sm text-muted-foreground mb-8">{stage}</p>
            <div className="w-full bg-muted rounded-full h-1.5 mb-3 overflow-hidden">
              <div
                className="bg-teal h-1.5 rounded-full origin-left transition-transform duration-1000 ease-out"
                style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {progress >= 95 ? "Finalizing report..." : `Surveying simulated panel (${Math.round(progress)}%)`}
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
            <h1 className="text-2xl font-bold text-navy mb-2">
              New Research Run
            </h1>
            <p className="text-muted-foreground">
              Tell us about your product. The more detail you give, the better
              your research panel performs.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* URL auto-fill */}
              <div className="mb-6 pb-6 border-b border-border/50">
                <Label htmlFor="url" className="mb-2 block">
                  Auto-fill from URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/product"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleExtract}
                    disabled={isExtracting || !url.trim()}
                    className="shrink-0"
                  >
                    {isExtracting ? "Extracting..." : "Auto-fill"}
                  </Button>
                </div>
                {extractError && (
                  <p className="text-xs text-destructive mt-2">
                    {extractError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Paste a product page URL and we&apos;ll extract the details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Name */}
                <FieldGroup
                  label="Product Name"
                  example={showExamples.has("name") ? EXAMPLES.productName : null}
                  onToggleExample={() => toggleExample("name")}
                >
                  <Input
                    placeholder="e.g., REKT Focus Energy Powder"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </FieldGroup>

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

                {/* Problem */}
                <FieldGroup
                  label="What problem does this solve?"
                  example={showExamples.has("problem") ? EXAMPLES.problem : null}
                  onToggleExample={() => toggleExample("problem")}
                >
                  <Textarea
                    placeholder="e.g. People want clean energy without sugar crashes or jitters"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    rows={2}
                    className="resize-none"
                    required
                  />
                </FieldGroup>

                {/* Top 3 Features */}
                <FieldGroup
                  label="Top 3 features"
                  example={
                    showExamples.has("features")
                      ? `1. ${EXAMPLES.feature1}\n2. ${EXAMPLES.feature2}\n3. ${EXAMPLES.feature3}`
                      : null
                  }
                  onToggleExample={() => toggleExample("features")}
                >
                  <div className="space-y-2">
                    <Input
                      placeholder="e.g. 200mg natural caffeine from green coffee bean"
                      value={feature1}
                      onChange={(e) => setFeature1(e.target.value)}
                    />
                    <Input
                      placeholder="e.g. Zero sugar, 5 calories per serving"
                      value={feature2}
                      onChange={(e) => setFeature2(e.target.value)}
                    />
                    <Input
                      placeholder="e.g. Mixes instantly in water, no blender needed"
                      value={feature3}
                      onChange={(e) => setFeature3(e.target.value)}
                    />
                  </div>
                </FieldGroup>

                {/* Differentiator */}
                <FieldGroup
                  label="What makes it different from competitors?"
                  example={
                    showExamples.has("diff") ? EXAMPLES.differentiator : null
                  }
                  onToggleExample={() => toggleExample("diff")}
                >
                  <Textarea
                    placeholder="e.g. Only energy powder with Cognizin citicoline for focus"
                    value={differentiator}
                    onChange={(e) => setDifferentiator(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </FieldGroup>

                {/* Separator */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Research context
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Target Consumer */}
                <FieldGroup
                  label="Target Consumer"
                  example={
                    showExamples.has("target") ? EXAMPLES.targetMarket : null
                  }
                  onToggleExample={() => toggleExample("target")}
                >
                  <Textarea
                    placeholder="e.g., Health-conscious women 25-40, metro areas, $80k+ household income"
                    value={targetMarket}
                    onChange={(e) => {
                      setTargetMarket(e.target.value);
                      setTargetTouched(true);
                    }}
                    rows={2}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Skews 80% of the panel toward this demographic.
                  </p>
                </FieldGroup>

                {/* Competitors */}
                <FieldGroup
                  label="Competitive Products"
                  example={
                    showExamples.has("comp") ? EXAMPLES.competitors : null
                  }
                  onToggleExample={() => toggleExample("comp")}
                >
                  <Input
                    placeholder="e.g., Celsius, Ghost Energy, LMNT"
                    value={competitors}
                    onChange={(e) => {
                      setCompetitors(e.target.value);
                      setCompetitorsTouched(true);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enables head-to-head competitive preference analysis.
                  </p>
                </FieldGroup>

                {/* Price Range */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>Price Range</Label>
                    <button
                      type="button"
                      onClick={() => toggleExample("price")}
                      className="text-xs text-teal hover:underline"
                    >
                      {showExamples.has("price") ? "Hide example" : "See example"}
                    </button>
                  </div>
                  {showExamples.has("price") && (
                    <p className="text-xs text-teal bg-teal/5 rounded px-2 py-1">
                      ${EXAMPLES.priceMin}-${EXAMPLES.priceMax}{" "}
                      {EXAMPLES.priceUnit}
                    </p>
                  )}
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
                    <span className="text-muted-foreground">—</span>
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
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Select
                        value={priceUnit}
                        onValueChange={(v) => setPriceUnit(v ?? "per unit")}
                      >
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
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="e.g. 30 servings per tub"
                        value={unitsPerPack}
                        onChange={(e) => setUnitsPerPack(e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pricing unit and servings/units per pack (optional). Helps
                    consumers evaluate pricing in the right context.
                  </p>
                </div>

                {/* Quality indicator */}
                <div className="rounded-xl bg-muted/50 border border-border/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Research quality
                    </span>
                    <span className={`text-xs font-semibold ${quality.color}`}>
                      {quality.level}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${quality.bg}`}
                      style={{
                        width:
                          quality.level === "Fair"
                            ? "33%"
                            : quality.level === "Good"
                              ? "66%"
                              : "100%",
                      }}
                    />
                  </div>
                  {qualityNudge && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {qualityNudge}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-navy hover:bg-navy-light h-11"
                  disabled={!isFormValid}
                >
                  Run Research (Free)
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Simulates 50 consumers using structured survey methodology.
                  Results in 1-2 minutes.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function FieldGroup({
  label,
  example,
  onToggleExample,
  children,
}: {
  label: string;
  example: string | null;
  onToggleExample: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <button
          type="button"
          onClick={onToggleExample}
          className="text-xs text-teal hover:underline"
        >
          {example !== null ? "Hide example" : "See example"}
        </button>
      </div>
      {example !== null && (
        <p className="text-xs text-teal bg-teal/5 rounded px-2 py-1.5 whitespace-pre-line">
          {example}
        </p>
      )}
      {children}
    </div>
  );
}
