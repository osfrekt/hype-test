import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more depth, customisation, or
              team collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-lg">Quick Pulse</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-navy">Free</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  3 research runs per month
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <Feature>50 simulated respondents per run</Feature>
                  <Feature>Purchase intent score</Feature>
                  <Feature>WTP range estimate</Feature>
                  <Feature>Top 3 feature drivers</Feature>
                  <Feature>5 key consumer concerns</Feature>
                  <Feature>Consumer verbatims</Feature>
                </ul>
                <Link
                  href="/research/new"
                  className="block w-full text-center rounded-lg border border-navy text-navy font-medium py-2.5 text-sm hover:bg-navy hover:text-white transition-colors"
                >
                  Get started free
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative border-teal shadow-lg shadow-teal/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-teal text-white border-0">
                  Most popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Pro</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-navy">$79</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  20 research runs per month
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <Feature>100 respondents per run</Feature>
                  <Feature>Everything in Free</Feature>
                  <Feature>Conjoint WTP breakdown by feature</Feature>
                  <Feature>Competitive positioning (up to 3)</Feature>
                  <Feature>Target demographic selection</Feature>
                  <Feature>5 custom questions</Feature>
                  <Feature>PDF &amp; CSV export</Feature>
                  <Feature>Feature trade-off analysis</Feature>
                </ul>
                <button
                  className="block w-full text-center rounded-lg bg-navy text-white font-medium py-2.5 text-sm hover:bg-navy-light transition-colors cursor-not-allowed opacity-60"
                  disabled
                >
                  Coming soon
                </button>
              </CardContent>
            </Card>

            {/* Teams */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-lg">Teams</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-navy">$199</span>
                  <span className="text-muted-foreground text-sm">
                    /seat/month
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  50 research runs per seat per month
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <Feature>200 respondents per run</Feature>
                  <Feature>Everything in Pro</Feature>
                  <Feature>Upload prior survey data</Feature>
                  <Feature>Longitudinal tracking</Feature>
                  <Feature>Custom report templates</Feature>
                  <Feature>API access</Feature>
                  <Feature>Research templates</Feature>
                  <Feature>Team collaboration</Feature>
                </ul>
                <button
                  className="block w-full text-center rounded-lg border border-border text-muted-foreground font-medium py-2.5 text-sm cursor-not-allowed opacity-60"
                  disabled
                >
                  Coming soon
                </button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Need enterprise features? Custom model fine-tuning? SSO?
            </p>
            <p className="text-sm font-medium text-navy">
              Contact us for custom pricing.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <svg
        className="w-4 h-4 text-teal mt-0.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {children}
    </li>
  );
}
