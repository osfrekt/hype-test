"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link2, RotateCcw } from "lucide-react";
import type { ResearchResult } from "@/types/research";
import { ReportView } from "@/components/report-view";
import { createClient } from "@/lib/supabase/client";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; result: ResearchResult };

export default function ResearchResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <>
          <Nav />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading results...</p>
          </main>
        </>
      }
    >
      <ResearchResultContent params={params} />
    </Suspense>
  );
}

function ResearchResultContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Try Supabase first
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("research_results")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data && !cancelled) {
          setState({
            status: "ok",
            result: {
              id: data.id,
              input: data.input,
              panelSize: data.panel_size,
              purchaseIntent: data.purchase_intent,
              wtpRange: data.wtp_range,
              featureImportance: data.feature_importance,
              topConcerns: data.top_concerns,
              topPositives: data.top_positives,
              verbatims: data.verbatims,
              methodology: data.methodology,
              ...(data.competitive_position && {
                competitivePosition: data.competitive_position,
              }),
              status: data.status,
              createdAt: data.created_at,
            },
          });
          return;
        }
      } catch {
        // Supabase fetch failed — fall through to sessionStorage
      }

      // Fallback: sessionStorage
      try {
        const stored = sessionStorage.getItem(`research-${id}`);
        if (stored && !cancelled) {
          setState({ status: "ok", result: JSON.parse(stored) });
          return;
        }
      } catch {
        // sessionStorage unavailable
      }

      if (!cancelled) {
        setState({
          status: "error",
          message:
            "Research result not found. The link may be invalid or the result may have expired.",
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="animate-spin text-teal"
                width="20"
                height="20"
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
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </main>
      </>
    );
  }

  if (state.status === "error") {
    return (
      <>
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <p className="text-lg font-medium text-navy mb-2">
              Result not found
            </p>
            <p className="text-sm text-muted-foreground">{state.message}</p>
          </div>
        </main>
      </>
    );
  }

  const result = state.result;
  const runAgainParams = new URLSearchParams({
    name: result.input.productName,
    desc: result.input.productDescription,
    ...(result.input.category && { cat: result.input.category }),
  });

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-end gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <Link2 className="w-4 h-4 mr-1.5" />
              {copied ? "Copied!" : "Copy share link"}
            </Button>
            <Link
              href={`/research/new?${runAgainParams.toString()}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Run again
            </Link>
          </div>
          <ReportView result={result} />
        </div>
      </main>
    </>
  );
}
