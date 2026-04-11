"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, Link2, RotateCcw, Trash2 } from "lucide-react";
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
  const router = useRouter();
  const { id } = use(params);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
            <p className="text-lg font-medium text-primary mb-2">
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
    desc: result.input.productDescription.slice(0, 500),
    ...(result.input.category && { cat: result.input.category }),
  });

  return (
    <>
      <Nav />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-end gap-2 mb-6" data-print-hide>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  // Clipboard API not available (HTTP or permissions)
                }
              }}
            >
              <Link2 className="w-4 h-4 mr-1.5" />
              {copied ? "Copied!" : "Copy share link"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              data-print-hide
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download PDF
            </Button>
            <Link
              href={`/research/new?${runAgainParams.toString()}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
              data-print-hide
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Run again
            </Link>
          </div>
          <ReportView result={result} />

          {/* Delete button */}
          <div className="mt-12 mb-8 text-center" data-print-hide>
            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                const email = window.prompt("Enter the email you used to create this research to confirm deletion:");
                if (!email) return;
                setDeleting(true);
                try {
                  const res = await fetch(`/api/research/${id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
                  if (res.ok) {
                    router.push("/");
                  } else {
                    alert("Failed to delete. Please try again.");
                    setDeleting(false);
                  }
                } catch {
                  alert("Failed to delete. Please try again.");
                  setDeleting(false);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleting ? "Deleting..." : "Delete my research"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
