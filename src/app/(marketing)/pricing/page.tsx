import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more depth, customisation, or
              team collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="relative">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1f36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                <CardTitle className="text-lg">Quick Pulse</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-navy">Free</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
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
                  className="block w-full text-center rounded-xl border-2 border-navy text-navy font-semibold py-3 text-sm hover:bg-navy hover:text-white transition-colors"
                >
                  Get started free
                </Link>
              </CardContent>
            </Card>

            {/* Pro — overflow-visible to show the badge */}
            <Card className="relative border-teal shadow-lg shadow-teal/10 overflow-visible">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-teal text-white border-0 shadow-md">
                  Most popular
                </Badge>
              </div>
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                </div>
                <CardTitle className="text-lg">Pro</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-navy">$79</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
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
                  className="block w-full text-center rounded-xl bg-navy text-white font-semibold py-3 text-sm hover:bg-navy-light transition-colors cursor-not-allowed opacity-60"
                  disabled
                >
                  Coming soon
                </button>
              </CardContent>
            </Card>

            {/* Teams */}
            <Card className="relative">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1f36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <CardTitle className="text-lg">Teams</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-navy">$199</span>
                  <span className="text-muted-foreground text-sm">
                    /seat/month
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
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
                  className="block w-full text-center rounded-xl border border-border text-muted-foreground font-semibold py-3 text-sm cursor-not-allowed opacity-60"
                  disabled
                >
                  Coming soon
                </button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-1">
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
