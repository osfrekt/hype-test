import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SampleReport } from "@/components/sample-report";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 pt-16 pb-14 text-center relative">
            <div data-animate="1" className="inline-flex items-center gap-2 bg-teal/10 text-teal-dark text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              Grounded in peer-reviewed research
            </div>
            <h1 data-animate="2" className="font-extrabold text-navy tracking-tight leading-[1.08] mb-5" style={{ fontSize: 'clamp(2.25rem, 1.5rem + 3vw, 3.75rem)' }}>
              Consumer research in
              <br />
              minutes, not months.
            </h1>
            <p data-animate="3" className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Simulate a panel of real consumers for any product or idea.
              Get willingness-to-pay estimates, feature priorities, and purchase
              intent — powered by AI, grounded in academic methodology.
            </p>
            <div data-animate="4" className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/research/new"
                className="inline-flex items-center justify-center rounded-xl bg-navy text-white font-semibold px-10 h-14 text-lg hover:bg-navy-light transition-colors shadow-lg shadow-navy/25"
              >
                Try it free — no credit card
              </Link>
              <Link
                href="/methodology"
                className="inline-flex items-center justify-center rounded-xl border border-border text-muted-foreground font-medium px-6 h-14 text-base hover:text-foreground hover:border-foreground/20 transition-colors"
              >
                How it works
                <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Social proof + accuracy */}
        <section className="py-12 border-y border-border/50 bg-card">
          <div className="max-w-6xl mx-auto px-6">
            {/* Stat + R-squared visual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-10">
              <div>
                <p className="text-sm font-semibold text-teal uppercase tracking-wider mb-3">
                  Validated by Harvard Business School research
                </p>
                <h2 className="font-bold text-navy leading-tight mb-4" style={{ fontSize: 'clamp(1.75rem, 1.25rem + 2vw, 2.5rem)' }}>
                  R&sup2; = 0.89 correlation with real consumer panels
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  LLM-simulated consumer panels produce willingness-to-pay
                  estimates that closely match results from real human panels
                  (n=300). The same methodology used by Nielsen, Ipsos, and
                  McKinsey — at a fraction of the cost and time.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-2xl font-bold text-navy">$0</p>
                    <p className="text-muted-foreground">vs $20-50k traditional</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div>
                    <p className="text-2xl font-bold text-navy">2 min</p>
                    <p className="text-muted-foreground">vs 4-6 weeks</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div>
                    <p className="text-2xl font-bold text-navy">50+</p>
                    <p className="text-muted-foreground">simulated panellists</p>
                  </div>
                </div>
              </div>

              {/* Scatter plot / best-fit illustration */}
              <div className="bg-muted/40 rounded-2xl border border-border/50 p-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  LLM-estimated vs actual consumer WTP
                </p>
                <svg viewBox="0 0 400 250" className="w-full h-auto" aria-label="Scatter plot showing correlation between LLM-estimated and actual consumer willingness-to-pay">
                  {/* Axes */}
                  <line x1="50" y1="210" x2="380" y2="210" className="stroke-border" strokeWidth="1" />
                  <line x1="50" y1="210" x2="50" y2="20" className="stroke-border" strokeWidth="1" />
                  {/* Axis labels */}
                  <text x="215" y="245" textAnchor="middle" className="fill-muted-foreground" fontSize="11">Actual consumer WTP ($)</text>
                  <text x="15" y="115" textAnchor="middle" className="fill-muted-foreground" fontSize="11" transform="rotate(-90, 15, 115)">HypeTest WTP ($)</text>
                  {/* Grid lines */}
                  <line x1="50" y1="163" x2="380" y2="163" className="stroke-border" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="50" y1="115" x2="380" y2="115" className="stroke-border" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="50" y1="68" x2="380" y2="68" className="stroke-border" strokeWidth="0.5" strokeDasharray="4" />
                  {/* Best-fit line */}
                  <line x1="70" y1="195" x2="365" y2="35" className="stroke-teal" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.7" />
                  {/* Scatter points */}
                  {[[85,188],[95,178],[110,182],[120,168],[130,160],[145,155],[155,148],[160,140],[175,138],[190,125],[195,118],[210,120],[225,108],[238,98],[250,100],[265,88],[278,82],[290,75],[305,68],[315,58],[330,52],[345,48],[360,38]].map(([cx,cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="5" className="fill-teal" opacity="0.5" />
                  ))}
                  {/* Outliers */}
                  {[[105,170],[165,152],[215,130],[270,95],[325,60]].map(([cx,cy], i) => (
                    <circle key={`o${i}`} cx={cx} cy={cy} r="5" className="fill-teal" opacity="0.35" />
                  ))}
                  {/* R-squared annotation */}
                  <rect x="260" y="170" width="110" height="32" rx="6" className="fill-navy" />
                  <text x="315" y="191" textAnchor="middle" className="fill-primary-foreground" fontSize="13" fontWeight="600">R&sup2; = 0.89</text>
                </svg>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Based on Brand, Israeli &amp; Ngwe (2025), Harvard Business School
                </p>
              </div>
            </div>

            {/* Brand logos / social proof */}
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-5">
                Built on methodology used by
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground/40">
                <span className="text-lg font-bold tracking-tight">Nielsen</span>
                <span className="text-lg font-bold tracking-tight">Ipsos</span>
                <span className="text-lg font-bold tracking-tight">McKinsey</span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 bg-card">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-bold text-navy mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              How HypeTest works
            </h2>
            <p className="text-muted-foreground max-w-xl mb-14">
              Three steps to insights that used to cost $20-50k and take weeks.
            </p>
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-0">
              {/* Step 1 */}
              <div>
                <span className="text-xs font-bold text-teal uppercase tracking-widest">Step 1</span>
                <h3 className="text-lg font-bold text-navy mt-2 mb-2">Describe your product</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[28ch]">
                  Tell us about your product, feature, or idea. Free-text is fine — we&apos;ll extract what we need.
                </p>
              </div>
              <div className="hidden md:flex items-center px-6 pt-8">
                <svg width="32" height="12" viewBox="0 0 32 12" fill="none"><path d="M0 6h28m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" className="text-border" /></svg>
              </div>
              {/* Step 2 */}
              <div>
                <span className="text-xs font-bold text-teal uppercase tracking-widest">Step 2</span>
                <h3 className="text-lg font-bold text-navy mt-2 mb-2">We simulate your consumers</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[28ch]">
                  A diverse panel of 50+ consumer personas runs through structured survey methodology.
                </p>
              </div>
              <div className="hidden md:flex items-center px-6 pt-8">
                <svg width="32" height="12" viewBox="0 0 32 12" fill="none"><path d="M0 6h28m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" className="text-border" /></svg>
              </div>
              {/* Step 3 */}
              <div>
                <span className="text-xs font-bold text-teal uppercase tracking-widest">Step 3</span>
                <h3 className="text-lg font-bold text-navy mt-2 mb-2">Get your research report</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[28ch]">
                  Purchase intent, willingness-to-pay, feature importance, and consumer concerns — in under 2 minutes.
                </p>
              </div>
            </div>

            {/* Discovery CTA */}
            <div className="mt-14 bg-amber-50 border border-amber-200/60 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Don&apos;t have a product yet?
                </p>
                <p className="text-sm text-amber-700/80">
                  Use Product Discovery to find what your audience actually wants.
                </p>
              </div>
              <Link
                href="/discover/new"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900 hover:underline shrink-0"
              >
                Discover products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-bold text-navy mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              What&apos;s in a HypeTest report
            </h2>
            <p className="text-muted-foreground max-w-xl mb-12">
              Not another AI opinion. Structured research methodology with aggregated results.
            </p>

            {/* Featured: Purchase Intent + WTP side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="bg-navy rounded-2xl p-6 text-white">
                <span className="text-xs font-bold text-teal uppercase tracking-widest">Core metric</span>
                <h3 className="text-lg font-bold mt-2 mb-2">Purchase Intent Score</h3>
                <p className="text-sm text-blue-100/70 leading-relaxed">
                  What percentage of consumers would actually buy your product, on a validated 5-point scale.
                </p>
              </div>
              <div className="bg-navy rounded-2xl p-6 text-white">
                <span className="text-xs font-bold text-teal uppercase tracking-widest">Core metric</span>
                <h3 className="text-lg font-bold mt-2 mb-2">Willingness-to-Pay Range</h3>
                <p className="text-sm text-blue-100/70 leading-relaxed">
                  Data-derived price estimates from conjoint-style choice tasks — not guesses.
                </p>
              </div>
            </div>

            {/* Secondary outputs as a compact list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              <div className="flex gap-4">
                <span className="text-teal text-lg mt-0.5 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-navy mb-1">Feature Importance</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Which attributes drive purchase decisions, ranked by preference.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-teal text-lg mt-0.5 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-navy mb-1">Consumer Concerns</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Top objections and hesitations — the things you need to address.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-teal text-lg mt-0.5 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-navy mb-1">Consumer Verbatims</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Open-ended responses from diverse consumer profiles.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-teal text-lg mt-0.5 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-navy mb-1">Methodology Disclosure</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Full transparency on panel composition and confidence level.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample report */}
        <section className="py-14 bg-card">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-bold text-navy text-center mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              See a real report
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
              Here&apos;s what a HypeTest report looks like — complete with purchase intent,
              WTP estimates, feature rankings, and consumer verbatims.
            </p>
            <SampleReport />
          </div>
        </section>

        {/* Why this works */}
        <section className="py-14 bg-navy text-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16">
              <div>
                <h2 className="font-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
                  Why this works
                </h2>
                <p className="text-blue-100/70 leading-relaxed mb-6">
                  HypeTest is built on peer-reviewed research showing that LLM-simulated
                  consumer panels produce willingness-to-pay estimates comparable to
                  real human panels.
                </p>
                <Link
                  href="/methodology"
                  className="inline-flex items-center gap-2 text-teal text-sm font-medium hover:underline"
                >
                  Read the full methodology
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-semibold text-teal mb-2">
                    Academic Foundation
                  </p>
                  <p className="text-sm text-blue-100/70 leading-relaxed max-w-prose">
                    Based on Brand, Israeli &amp; Ngwe (2025) from Harvard Business
                    School, who demonstrated that LLM-generated WTP estimates
                    closely match real consumer panels.
                  </p>
                </div>
                <div className="w-12 h-px bg-white/10" />
                <div>
                  <p className="text-sm font-semibold text-teal mb-2">
                    Real Methodology
                  </p>
                  <p className="text-sm text-blue-100/70 leading-relaxed max-w-prose">
                    We use conjoint-style indirect elicitation — the same approach
                    used by professional research firms — not direct &quot;how much would
                    you pay?&quot; questions.
                  </p>
                </div>
                <div className="w-12 h-px bg-white/10" />
                <div>
                  <p className="text-sm font-semibold text-teal mb-2">
                    Honest Limitations
                  </p>
                  <p className="text-sm text-blue-100/70 leading-relaxed max-w-prose">
                    We clearly communicate what this approach can and cannot do.
                    It&apos;s best for early-stage exploration, not replacing
                    high-stakes primary research.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-bold text-navy mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              Try it now — it&apos;s free
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              3 free research runs per month. No credit card required.
              See what your consumers think in under 2 minutes.
            </p>
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-xl bg-navy text-white font-semibold px-10 h-14 text-lg hover:bg-navy-light transition-colors shadow-lg shadow-navy/25"
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

