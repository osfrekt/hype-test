import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative">
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal-dark text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              Grounded in peer-reviewed research
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy tracking-tight leading-[1.1] mb-6">
              Consumer research in
              <br />
              minutes, not months.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Simulate a panel of real consumers for any product or idea.
              Get willingness-to-pay estimates, feature priorities, and purchase
              intent — powered by AI, grounded in academic methodology.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/research/new"
                className="inline-flex items-center justify-center rounded-lg bg-navy text-white font-medium px-8 h-12 text-base hover:bg-navy-light transition-colors shadow-lg shadow-navy/20"
              >
                Try it free — no credit card required
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center justify-center rounded-lg border border-border text-muted-foreground font-medium px-6 h-12 text-base hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-4">
              How HypeTest works
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
              Three steps to insights that used to cost $20-50k and take weeks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <Step
                number="1"
                title="Describe your product"
                description="Tell us about your product, feature, or business idea. Free-text is fine — we'll extract what we need."
              />
              <Step
                number="2"
                title="We simulate your consumers"
                description="We generate a diverse panel of 50+ consumer personas and run structured survey methodology through each one."
              />
              <Step
                number="3"
                title="Get your research report"
                description="Receive purchase intent, willingness-to-pay, feature importance, and consumer concerns — in under 2 minutes."
              />
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-4">
              What&apos;s in a HypeTest report
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
              Not another AI opinion. Structured research methodology with aggregated results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard
                title="Purchase Intent Score"
                description="What percentage of consumers would actually buy your product, on a validated 5-point scale."
              />
              <ResultCard
                title="Willingness-to-Pay Range"
                description="Data-derived price estimates from conjoint-style choice tasks — not guesses."
              />
              <ResultCard
                title="Feature Importance Ranking"
                description="Which product attributes drive purchase decisions, ranked by simulated consumer preference."
              />
              <ResultCard
                title="Consumer Concerns"
                description="The top objections and hesitations from your simulated panel — the things you need to address."
              />
              <ResultCard
                title="Consumer Verbatims"
                description="Simulated open-ended responses from diverse consumer profiles, giving you qualitative texture."
              />
              <ResultCard
                title="Methodology Disclosure"
                description="Full transparency on panel composition, question design, and confidence level. Always."
              />
            </div>
          </div>
        </section>

        {/* Why this works */}
        <section className="py-20 bg-navy text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why this works
            </h2>
            <p className="text-blue-200/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              HypeTest is built on peer-reviewed research showing that LLM-simulated
              consumer panels produce willingness-to-pay estimates comparable to
              real human panels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-sm font-medium text-teal mb-2">
                  Academic Foundation
                </p>
                <p className="text-sm text-blue-100/70 leading-relaxed">
                  Based on Brand, Israeli &amp; Ngwe (2025) from Harvard Business
                  School, who demonstrated that LLM-generated WTP estimates
                  closely match real consumer panels.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-sm font-medium text-teal mb-2">
                  Real Methodology
                </p>
                <p className="text-sm text-blue-100/70 leading-relaxed">
                  We use conjoint-style indirect elicitation — the same approach
                  used by professional research firms — not direct &quot;how much would
                  you pay?&quot; questions.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <p className="text-sm font-medium text-teal mb-2">
                  Honest Limitations
                </p>
                <p className="text-sm text-blue-100/70 leading-relaxed">
                  We clearly communicate what this approach can and cannot do.
                  It&apos;s best for early-stage exploration, not replacing
                  high-stakes primary research.
                </p>
              </div>
            </div>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 text-teal text-sm font-medium mt-10 hover:underline"
            >
              Read the full methodology
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
              Try it now — it&apos;s free
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              3 free research runs per month. No credit card required.
              See what your consumers think in under 2 minutes.
            </p>
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-lg bg-navy text-white font-medium px-8 h-12 text-base hover:bg-navy-light transition-colors shadow-lg shadow-navy/20"
            >
              Start your first research run
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-teal/10 text-teal font-bold text-lg flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-navy mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ResultCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border/50 p-6 hover:border-teal/30 transition-colors">
      <h3 className="font-semibold text-navy mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
