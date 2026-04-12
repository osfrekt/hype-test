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
import type { LogoTestResult } from "@/types/logo-test";

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

interface LogoInput {
  name: string;
  description: string;
  colorPalette: string;
  styleTags: string;
}

function emptyLogo(): LogoInput {
  return { name: "", description: "", colorPalette: "", styleTags: "" };
}

export default function NewLogoTestPage() {
  return (
    <Suspense>
      <NewLogoTestForm />
    </Suspense>
  );
}

function NewLogoTestForm() {
  const router = useRouter();

  // Brand context
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandDescription, setBrandDescription] = useState("");

  // Logos (start with 2)
  const [logos, setLogos] = useState<LogoInput[]>([emptyLogo(), emptyLogo()]);

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

  function updateLogo(index: number, field: keyof LogoInput, value: string) {
    setLogos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addLogo() {
    if (logos.length < 5) {
      setLogos((prev) => [...prev, emptyLogo()]);
    }
  }

  function removeLogo(index: number) {
    if (logos.length > 1) {
      setLogos((prev) => prev.filter((_, i) => i !== index));
    }
  }

  const hasValidLogos = logos.every(
    (l) => l.name.trim() && l.description.trim().length > 5
  );

  const isFormValid =
    brandName.trim() &&
    hasValidLogos &&
    email.trim() && email.includes("@") &&
    userName.trim() && userCompany.trim() && userRole;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Assembling consumer panel...");

    let logoIndex = 0;
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 4;
      });
      setStage(() => {
        const totalLogos = logos.length;
        if (logoIndex < totalLogos) {
          const current = `Testing logo ${logoIndex + 1} of ${totalLogos}...`;
          logoIndex++;
          return current;
        }
        return "Analysing responses...";
      });
    }, 6000);

    try {
      const payload: Record<string, unknown> = {
        brandName: brandName.trim(),
        category: category || undefined,
        targetAudience: targetAudience.trim() || undefined,
        brandDescription: brandDescription.trim() || undefined,
        logos: logos.map((l) => ({
          name: l.name.trim(),
          description: l.description.trim(),
          ...(l.colorPalette.trim() && { colorPalette: l.colorPalette.trim() }),
          ...(l.styleTags.trim() && { styleTags: l.styleTags.trim() }),
        })),
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

      const response = await fetch("/api/logo-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logo test failed");
      }

      const result: LogoTestResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(`logo-test-${result.id}`, JSON.stringify(result));
      setTimeout(() => router.push(`/logo-test/${result.id}`), 500);
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
              Running your logo test
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
                ? "Finalising results..."
                : `Testing logos with consumer panel (${Math.round(progress)}%)`}
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
              Logo Testing
            </h1>
            <p className="text-muted-foreground">
              Test 1-5 logo designs with a panel of 30 simulated consumers. Get first impression, memorability, brand fit, distinctiveness, and trust scores.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/logo-test/sample-rekt" className="text-teal hover:underline">
                View a sample report &rarr;
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Brand context */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Brand Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Brand Name</Label>
                  <Input
                    placeholder="e.g., Rekt Energy"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                  />
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
                  <Label>Target Audience (optional)</Label>
                  <Textarea
                    placeholder="e.g., Health-conscious professionals 25-40"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Skews 80% of the panel toward this demographic.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>Brand Description (optional)</Label>
                  <Textarea
                    placeholder="e.g., A bold energy drink brand targeting gamers and fitness enthusiasts"
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo inputs */}
            {logos.map((logo, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Logo {idx + 1}</CardTitle>
                    {logos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLogo(idx)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Logo Name</Label>
                    <Input
                      placeholder='e.g., "Option A - Minimalist"'
                      value={logo.name}
                      onChange={(e) => updateLogo(idx, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Logo Description</Label>
                    <Textarea
                      placeholder="Describe the logo in detail: typeface, imagery, layout, colours..."
                      value={logo.description}
                      onChange={(e) => updateLogo(idx, "description", e.target.value)}
                      rows={3}
                      className="resize-none"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Be specific. The more detail you give, the better the panel can evaluate it.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Color Palette (optional)</Label>
                      <Input
                        placeholder="e.g., Black, white, electric yellow"
                        value={logo.colorPalette}
                        onChange={(e) => updateLogo(idx, "colorPalette", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Style Tags (optional)</Label>
                      <Input
                        placeholder="e.g., minimalist, bold, tech"
                        value={logo.styleTags}
                        onChange={(e) => updateLogo(idx, "styleTags", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {logos.length < 5 && (
              <button
                type="button"
                onClick={addLogo}
                className="w-full py-2.5 text-sm font-medium text-muted-foreground border border-dashed border-border rounded-lg hover:border-teal/40 hover:text-teal transition-colors"
              >
                + Add another logo ({logos.length}/5)
              </button>
            )}

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
              Results are AI-simulated (not real consumers). Uses 1 research credit.
            </p>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
              disabled={!isFormValid}
            >
              Run Logo Test (Starter)
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Uses 1 research credit. Results in 2-4 minutes.
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
