"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewResearchPage() {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim() || !productDescription.trim()) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Preparing research panel...");

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 8;
      });
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
        productDescription: productDescription.trim(),
      };
      if (category && category !== "other") payload.category = category;
      if (priceMin && priceMax) {
        payload.priceRange = {
          min: Number(priceMin),
          max: Number(priceMax),
        };
      }
      if (targetMarket.trim()) payload.targetMarket = targetMarket.trim();
      if (competitors.trim()) payload.competitors = competitors.trim();

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

      sessionStorage.setItem(`research-${result.id}`, JSON.stringify(result));

      setTimeout(() => {
        router.push(`/research/${result.id}`);
      }, 500);
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
            <h2 className="text-xl font-bold text-navy mb-2">
              Running your research
            </h2>
            <p className="text-sm text-muted-foreground mb-8">{stage}</p>
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div
                className="bg-teal h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Simulating 50 consumers with structured methodology
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
              Describe your product or idea. We&apos;ll simulate a panel of 50
              consumers and run structured survey methodology to generate your
              research report.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., FreshBrew Portable Cold Brew Maker"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product, its key features, target audience, and price point."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Include details about features, target audience, and price
                    range for best results.
                  </p>
                </div>

                <div className="space-y-2">
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
                  <p className="text-xs text-muted-foreground">
                    Helps us calibrate persona demographics and category context.
                  </p>
                </div>

                {/* Advanced options toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  Advanced options
                </button>

                {showAdvanced && (
                  <div className="space-y-5 border-l-2 border-border pl-4">
                    <div className="space-y-2">
                      <Label>Price Range (optional)</Label>
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
                      <p className="text-xs text-muted-foreground">
                        If blank, we&apos;ll estimate a realistic range from
                        your description.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target">Target Consumer (optional)</Label>
                      <Textarea
                        id="target"
                        placeholder="e.g., Health-conscious women 25-40, metro areas, $80k+ household income"
                        value={targetMarket}
                        onChange={(e) => setTargetMarket(e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Skews 80% of the panel toward this demographic.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competitors">
                        Competitive Products (optional)
                      </Label>
                      <Input
                        id="competitors"
                        placeholder="e.g., Brita, Hydro Flask, Sodastream"
                        value={competitors}
                        onChange={(e) => setCompetitors(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Adds competitive preference questions to the survey.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-navy hover:bg-navy-light h-11"
                  disabled={!productName.trim() || !productDescription.trim()}
                >
                  Run Research (Free)
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This will simulate 50 consumers using structured survey
                  methodology. Results typically take 1-2 minutes.
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 bg-muted/50 rounded-xl p-5 border border-border/50">
            <h3 className="text-sm font-medium text-navy mb-2">
              Free tier includes
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-teal mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                50 simulated consumer respondents
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-teal mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Purchase intent score &amp; WTP range
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-teal mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Feature importance ranking
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-teal mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Top consumer concerns &amp; verbatims
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-teal mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                3 runs per month
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
