"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface ExtractedProduct {
  productName?: string;
  problem?: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
  differentiator?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  priceUnit?: string;
  competitors?: string;
  targetMarket?: string;
}

export function UrlAutofill({ onExtracted }: { onExtracted: (data: ExtractedProduct) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExtract() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/extract-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 422) {
          setError("Could not extract product info from that page. Try a different URL.");
        } else if (res.status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else {
          setError(errorData.error || "Something went wrong. Check the URL and try again.");
        }
        return;
      }
      const data = await res.json();
      onExtracted(data);
    } catch {
      setError("Failed to extract. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6 pb-6 border-b border-border/50">
      <Label className="mb-2 block">Auto-fill from URL</Label>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://example.com/product"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleExtract}
          disabled={loading || !url.trim()}
          className="shrink-0 bg-teal hover:bg-teal/90 text-white"
        >
          {loading ? "Extracting..." : "Auto-fill"}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      <p className="text-xs text-muted-foreground mt-2">
        Paste a product page URL and we&apos;ll extract the details.
      </p>
    </div>
  );
}
