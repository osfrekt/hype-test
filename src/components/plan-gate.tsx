"use client";

import Link from "next/link";
import { Nav } from "@/components/nav";

interface PlanGateProps {
  requiredPlan: "Starter" | "Pro";
  toolTitle: string;
  toolDescription: string;
  bullets: string[];
  sampleReportHref: string;
  isAuthenticated: boolean;
}

export function PlanGate({
  requiredPlan,
  toolTitle,
  toolDescription,
  bullets,
  sampleReportHref,
  isAuthenticated,
}: PlanGateProps) {
  const price = requiredPlan === "Starter" ? "$49" : "$149";
  const planDescription =
    requiredPlan === "Starter"
      ? "Includes A/B testing, name testing, and pricing optimizer."
      : "Includes market research, ad testing, logo testing, product discovery, audience finder, and competitive teardown.";

  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-full mb-4">
              {requiredPlan} Plan
            </span>
            <h1 className="text-2xl font-bold text-primary mb-3">
              {toolTitle}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {toolDescription}
            </p>
          </div>

          {/* What you get */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h2 className="text-sm font-bold text-primary mb-3">What this tool does</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-teal mt-0.5">&#10003;</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample report link */}
          <div className="text-center mb-6">
            <Link href={sampleReportHref} className="text-sm text-teal hover:underline font-medium">
              View a sample report to see what you get
            </Link>
          </div>

          {/* Upgrade CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-lg font-bold text-primary mb-2">
              Unlock with {requiredPlan} ({price}/mo)
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {planDescription}
            </p>
            <Link
              href={isAuthenticated ? "/pricing" : "/login"}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium px-6 h-10 hover:bg-primary/90 transition-colors"
            >
              {isAuthenticated ? "See plans" : "Sign up to get started"}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
