"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
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
import type { AdPlatform } from "@/types/platform-ad";
import type { PlatformAdResult } from "@/types/platform-ad";
import { isValidEmail } from "@/lib/email-validation";

const PLATFORMS: { value: AdPlatform; label: string }[] = [
  { value: "amazon", label: "Amazon" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "google_search", label: "Google Search" },
  { value: "google_display", label: "Google Display" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
];

export default function NewPlatformAdPage() {
  return (
    <Suspense>
      <NewPlatformAdForm />
    </Suspense>
  );
}

function NewPlatformAdForm() {
  const router = useRouter();
  const { planChecked, hasAccess, isAuthenticated } = usePlanAccess("pro");

  const [platform, setPlatform] = useState<AdPlatform | "">("");
  const [brandName, setBrandName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  // Platform-specific inputs
  const [adCopy, setAdCopy] = useState("");
  const [url, setUrl] = useState("https://");
  const [videoDescription, setVideoDescription] = useState("");
  const [headline1, setHeadline1] = useState("");
  const [headline2, setHeadline2] = useState("");
  const [headline3, setHeadline3] = useState("");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imageFileName, setImageFileName] = useState("");

  // About you
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAuthUser, setIsAuthUser] = useState(false);

  // Amazon URL extraction
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState("");

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

  const [utmSource] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") || "" : "");
  const [utmMedium] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_medium") || "" : "");
  const [utmCampaign] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_campaign") || "" : "");
  const [referrer] = useState(() => typeof window !== "undefined" ? document.referrer || "" : "");

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be under 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
      setImageFileName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleExtractListing = useCallback(async () => {
    if (!url.trim()) return;
    setExtracting(true);
    setError("");
    try {
      const res = await fetch("/api/extract-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to extract listing");
      }
      const data = await res.json();
      const parts = [
        data.productName && `Product: ${data.productName}`,
        data.problem && `Problem it solves: ${data.problem}`,
        data.feature1 && `Feature 1: ${data.feature1}`,
        data.feature2 && `Feature 2: ${data.feature2}`,
        data.feature3 && `Feature 3: ${data.feature3}`,
        data.differentiator && `Differentiator: ${data.differentiator}`,
        data.priceMin && `Price: $${data.priceMin}${data.priceMax && data.priceMax !== data.priceMin ? ` - $${data.priceMax}` : ""}`,
      ].filter(Boolean).join("\n");
      setExtractedData(parts);
      setAdCopy(parts);
      if (data.productName && !brandName) setBrandName(data.productName);
      if (data.targetMarket && !targetAudience) setTargetAudience(data.targetMarket);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract listing");
    } finally {
      setExtracting(false);
    }
  }, [url, brandName, targetAudience]);

  const hasContent = platform === "google_search"
    ? headline1.trim().length > 0
    : (adCopy.trim().length > 5 || url.trim().length > 0);

  const isFormValid =
    platform &&
    brandName.trim() &&
    hasContent &&
    isValidEmail(email) &&
    (isAuthUser || (userName.trim() && userCompany.trim() && userRole));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    setIsRunning(true);
    setError("");
    setProgress(5);
    setStage("Assembling consumer panel...");

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 5, 95));
      setStage((s) => {
        const stages = [
          "Assembling consumer panel...",
          "Testing ad with consumers...",
          "Analyzing platform-specific responses...",
          "Generating platform tips...",
          "Complete!",
        ];
        const idx = stages.indexOf(s);
        return idx < stages.length - 1 ? stages[idx + 1] : s;
      });
    }, 5000);

    try {
      const headlines = [headline1, headline2, headline3].filter((h) => h.trim());
      const descriptions = [description1, description2].filter((d) => d.trim());

      const payload: Record<string, unknown> = {
        platform,
        brandName: brandName.trim(),
        targetAudience: targetAudience.trim() || undefined,
        ...(adCopy.trim() && { adCopy: adCopy.trim() }),
        ...(url.trim() && { url: url.trim() }),
        ...(videoDescription.trim() && { videoDescription: videoDescription.trim() }),
        ...(imageBase64 && { imageBase64 }),
        ...(headlines.length > 0 && { headlines }),
        ...(descriptions.length > 0 && { descriptions }),
        email: email.trim(),
        userName: userName.trim(),
        userCompany: userCompany.trim(),
        userRole,
        ...(utmSource && { utmSource }),
        ...(utmMedium && { utmMedium }),
        ...(utmCampaign && { utmCampaign }),
        ...(referrer && { referrer }),
      };

      const response = await fetch("/api/platform-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Platform ad test failed");
      }

      const result: PlatformAdResult = await response.json();
      setProgress(100);
      setStage("Complete!");

      sessionStorage.setItem(`platform-ad-${result.id}`, JSON.stringify(result));
      setTimeout(() => router.push(`/platform-ad/${result.id}`), 500);
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
        toolTitle="Platform Ad Analyzer"
        toolDescription="Analyze ads across Amazon, Instagram, TikTok, Google, Facebook, LinkedIn, and YouTube with platform-specific insights."
        bullets={[
          "Test ads across 8 major platforms",
          "Attention, clarity, persuasion, brand fit, and platform fit scores",
          "Platform-specific improvement tips",
          "Scroll stop power and click/engage likelihood",
        ]}
        sampleReportHref="/platform-ad/sample-rekt"
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
              Running your platform ad test
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
                : `Testing ad with consumer panel (${Math.round(progress)}%)`}
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
              Platform Ad Analyzer
            </h1>
            <p className="text-muted-foreground">
              Analyze ads across major platforms with platform-specific insights from a panel of 50 simulated consumers.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link href="/platform-ad/sample-rekt" className="text-teal hover:underline">
                View a sample report &rarr;
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Platform selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-colors ${
                        platform === p.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-foreground/20"
                      }`}
                      onClick={() => setPlatform(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform-specific inputs */}
            {platform && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {PLATFORMS.find((p) => p.value === platform)?.label} Ad Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Amazon: URL + extract */}
                  {platform === "amazon" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Amazon Listing URL (optional)</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://www.amazon.com/dp/..."
                            value={url}
                            onChange={(e) => {
                              let v = e.target.value;
                              if (v.startsWith("https://https://")) v = v.slice("https://".length);
                              else if (v.startsWith("https://http://")) v = v.slice("https://".length);
                              setUrl(v);
                            }}
                            type="url"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleExtractListing}
                            disabled={extracting || !url.trim()}
                          >
                            {extracting ? "Extracting..." : "Extract"}
                          </Button>
                        </div>
                        {extractedData && (
                          <p className="text-xs text-emerald-600">Listing extracted successfully</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Product Listing Details</Label>
                        <Textarea
                          placeholder="Product title, bullet points, key features, price..."
                          value={adCopy}
                          onChange={(e) => setAdCopy(e.target.value)}
                          rows={6}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Paste or type the listing content, or extract from a URL above.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Instagram / Facebook */}
                  {(platform === "instagram" || platform === "facebook") && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Image Upload (optional)</Label>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                        {imageFileName && (
                          <p className="text-xs text-emerald-600">Uploaded: {imageFileName}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Caption / Ad Copy</Label>
                        <Textarea
                          placeholder="The ad caption or text..."
                          value={adCopy}
                          onChange={(e) => setAdCopy(e.target.value)}
                          rows={4}
                          className="resize-none"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* TikTok */}
                  {platform === "tiktok" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Video Description</Label>
                        <Textarea
                          placeholder="Describe what happens in the video (visuals, transitions, key moments)..."
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Hook Text / Caption</Label>
                        <Textarea
                          placeholder="The caption or hook text..."
                          value={adCopy}
                          onChange={(e) => setAdCopy(e.target.value)}
                          rows={3}
                          className="resize-none"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Google Search */}
                  {platform === "google_search" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Headline 1</Label>
                        <Input
                          placeholder="e.g., Best Energy Powder"
                          value={headline1}
                          onChange={(e) => setHeadline1(e.target.value)}
                          maxLength={30}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Headline 2</Label>
                        <Input
                          placeholder="e.g., Zero Sugar, Zero Crash"
                          value={headline2}
                          onChange={(e) => setHeadline2(e.target.value)}
                          maxLength={30}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Headline 3</Label>
                        <Input
                          placeholder="e.g., Free Shipping Today"
                          value={headline3}
                          onChange={(e) => setHeadline3(e.target.value)}
                          maxLength={30}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Description 1</Label>
                        <Textarea
                          placeholder="First description line..."
                          value={description1}
                          onChange={(e) => setDescription1(e.target.value)}
                          rows={2}
                          className="resize-none"
                          maxLength={90}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Description 2</Label>
                        <Textarea
                          placeholder="Second description line..."
                          value={description2}
                          onChange={(e) => setDescription2(e.target.value)}
                          rows={2}
                          className="resize-none"
                          maxLength={90}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Display URL (optional)</Label>
                        <Input
                          placeholder="e.g., rektenergy.com/shop"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* Google Display */}
                  {platform === "google_display" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Image Upload (optional)</Label>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                        {imageFileName && (
                          <p className="text-xs text-emerald-600">Uploaded: {imageFileName}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Ad Copy / Text</Label>
                        <Textarea
                          placeholder="The banner ad text..."
                          value={adCopy}
                          onChange={(e) => setAdCopy(e.target.value)}
                          rows={4}
                          className="resize-none"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* LinkedIn */}
                  {platform === "linkedin" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Image Upload (optional)</Label>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                        {imageFileName && (
                          <p className="text-xs text-emerald-600">Uploaded: {imageFileName}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Post Text / Ad Copy</Label>
                        <Textarea
                          placeholder="The sponsored post text..."
                          value={adCopy}
                          onChange={(e) => setAdCopy(e.target.value)}
                          rows={4}
                          className="resize-none"
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* YouTube */}
                  {platform === "youtube" && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Thumbnail Upload (optional)</Label>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                        {imageFileName && (
                          <p className="text-xs text-emerald-600">Uploaded: {imageFileName}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Script / Voiceover Text</Label>
                        <Textarea
                          placeholder="The ad script or voiceover text..."
                          value={adCopy}
                          onChange={(e) => setAdCopy(e.target.value)}
                          rows={4}
                          className="resize-none"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Video Description (optional)</Label>
                        <Textarea
                          placeholder="Describe what happens visually in the ad..."
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Common fields */}
            {platform && (
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
                </CardContent>
              </Card>
            )}

            {/* About you */}
            {platform && !isAuthUser && (
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

            {platform && (
              <>
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
                  Run Platform Ad Test (Pro)
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Uses 1 research credit. Results in 2-4 minutes.
                </p>
              </>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
