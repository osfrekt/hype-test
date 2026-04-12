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
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 dark:from-blue-950/20 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 pt-16 pb-14 text-center relative">
            <div data-animate="1" className="inline-flex items-center gap-2 bg-teal/10 text-teal-dark text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              Grounded in peer-reviewed research
            </div>
            <h1 data-animate="2" className="font-extrabold text-primary tracking-tight leading-[1.08] mb-5" style={{ fontSize: 'clamp(2.25rem, 1.5rem + 3vw, 3.75rem)' }}>
              Consumer research in
              <br />
              minutes, not months.
            </h1>
            <p data-animate="3" className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Simulate a panel of AI consumer personas for any product or idea.
              Get willingness-to-pay estimates, feature priorities, and purchase
              intent. Powered by AI, grounded in academic methodology.
            </p>
            <div data-animate="4" className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/research/new"
                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold px-10 h-14 text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Try it free, no credit card
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
        <section className="py-14 border-y border-border/50 bg-card">
          <div className="max-w-6xl mx-auto px-6">
            {/* Stat + R-squared visual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 text-teal-dark text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                  Harvard Business School Working Paper
                </div>
                <h2 className="font-bold text-primary leading-tight mb-4" style={{ fontSize: 'clamp(1.75rem, 1.25rem + 2vw, 2.5rem)' }}>
                  Independent research found R&sup2; = 0.89 between LLM and real panels
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  In an independent study, Brand, Israeli &amp; Ngwe (Harvard Business School Working Paper 23-062, 2025) found that LLM-simulated conjoint surveys produced WTP estimates closely matching real Prolific panels (n=300) across CPG categories. HypeTest&apos;s methodology is inspired by their findings. HypeTest is not affiliated with or endorsed by Harvard Business School or the paper&apos;s authors.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  We use a simplified conjoint-style approach inspired by choice-based methods used in professional market research, at a fraction of the cost and time. Results are strongest in categories with rich consumer data.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-baseline gap-2">
                    <span className="font-bold text-primary text-base">Free</span>
                    <span>vs $20-50k for a traditional panel</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="font-bold text-primary text-base">2 minutes</span>
                    <span>vs 4-6 weeks turnaround</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="font-bold text-primary text-base">50+ panellists</span>
                    <span>simulated with demographic diversity</span>
                  </li>
                </ul>
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
                  Illustrative chart inspired by findings in Brand, Israeli &amp; Ngwe (2025), HBS Working Paper 23-062. Not a representation of HypeTest validation data.
                </p>
              </div>
            </div>

            {/* Brand logos / social proof */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                Choice-based conjoint analysis is an industry-standard methodology in professional market research. HypeTest uses a simplified, LLM-powered version of this approach. HypeTest is not affiliated with or endorsed by any research firm.
              </p>
            </div>
          </div>
        </section>

        {/* Used by */}
        <section className="py-6 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider shrink-0">
                Used by founders of
              </p>
              <div className="flex items-center gap-8">
                <a href="https://rekt.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brands/rekt-black.svg" alt="Rekt" className="h-5 dark:hidden" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brands/rekt-yellow.svg" alt="Rekt" className="h-5 hidden dark:block" />
                </a>
                <a href="https://snoozlife.co.uk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brands/snooz.svg" alt="Snooz" className="h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 bg-card">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-bold text-primary mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              How HypeTest works
            </h2>
            <p className="text-muted-foreground max-w-xl mb-14">
              Three steps to insights that used to cost $20-50k and take weeks.
            </p>
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-0">
              {/* Step 1 */}
              <div>
                <span className="text-xs font-bold text-teal uppercase tracking-widest">Step 1</span>
                <h3 className="text-lg font-bold text-primary mt-2 mb-2">Describe your product</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[28ch]">
                  Tell us about your product, feature, or idea. Free-text is fine. We&apos;ll extract what we need.
                </p>
              </div>
              <div className="hidden md:flex items-center px-6 pt-8">
                <svg width="32" height="12" viewBox="0 0 32 12" fill="none"><path d="M0 6h28m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" className="text-border" /></svg>
              </div>
              {/* Step 2 */}
              <div>
                <span className="text-xs font-bold text-teal uppercase tracking-widest">Step 2</span>
                <h3 className="text-lg font-bold text-primary mt-2 mb-2">We simulate your consumers</h3>
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
                <h3 className="text-lg font-bold text-primary mt-2 mb-2">Get your research report</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[28ch]">
                  Purchase intent, willingness-to-pay, feature importance, and consumer concerns, all in under 2 minutes.
                </p>
              </div>
            </div>

            {/* Discovery CTA */}
            <div className="mt-14 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                  Don&apos;t have a product yet?
                </p>
                <p className="text-sm text-amber-700/80 dark:text-amber-400/70">
                  Use Product Discovery to find what your audience actually wants.
                </p>
              </div>
              <Link
                href="/discover/new"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 hover:underline shrink-0"
              >
                Discover products
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Why HypeTest */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-bold text-primary mb-8" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              Why HypeTest
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h3 className="text-base font-bold text-primary mb-2">Real accuracy, not AI guesswork</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Built on peer-reviewed methodology that achieved R&sup2; = 0.89
                  correlation with real consumer panels. This isn&apos;t a chatbot
                  opinion. It&apos;s structured research.
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h3 className="text-base font-bold text-primary mb-2">Save months and thousands</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Traditional consumer panels cost $20-50k and take 4-6 weeks.
                  HypeTest gives you comparable directional insights in under 2
                  minutes, completely free.
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h3 className="text-base font-bold text-primary mb-2">Know before you launch</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Test product ideas, pricing, and positioning before spending a
                  penny on production. Find out what consumers actually want, not
                  what you hope they want.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-14 bg-card">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-bold text-primary mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              What&apos;s in a HypeTest report
            </h2>
            <p className="text-muted-foreground max-w-xl mb-12">
              Not another AI opinion. Structured research methodology with aggregated results.
            </p>

            {/* Featured: Purchase Intent + WTP side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="bg-navy dark:bg-navy-light rounded-2xl p-6 text-white">
                <span className="text-xs font-bold text-teal-light uppercase tracking-widest">Core metric</span>
                <h3 className="text-lg font-bold mt-2 mb-2">Purchase Intent Score</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  What percentage of consumers would actually buy your product, on a validated 5-point scale.
                </p>
              </div>
              <div className="bg-navy dark:bg-navy-light rounded-2xl p-6 text-white">
                <span className="text-xs font-bold text-teal-light uppercase tracking-widest">Core metric</span>
                <h3 className="text-lg font-bold mt-2 mb-2">Willingness-to-Pay Range</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Data-derived price estimates from conjoint-style choice tasks, not guesses.
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
                  <h3 className="text-sm font-semibold text-primary mb-1">Feature Importance</h3>
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
                  <h3 className="text-sm font-semibold text-primary mb-1">Consumer Concerns</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Top objections and hesitations. The things you need to address.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-teal text-lg mt-0.5 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-1">Consumer Verbatims</h3>
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
                  <h3 className="text-sm font-semibold text-primary mb-1">Methodology Disclosure</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Full transparency on panel composition and confidence level.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample report */}
        <section className="py-14 bg-card">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-bold text-primary text-center mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              See how it compares
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
              How do HypeTest results compare to publicly available industry
              data? Here&apos;s an illustrative example using the energy drink
              category.
            </p>
            <SampleReport />

            {/* Rekt sample report */}
            <div className="mt-16 pt-12 border-t border-border/50">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-muted px-2.5 py-1 rounded-full mb-3">
                  Full sample report
                </span>
                <h3 className="text-xl font-bold text-primary">
                  Rekt Energy + Focus Powder
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5">
                  <a href="https://www.amazon.com/Rekt-Energy-Focus-Powder-Cherry/dp/B0GSGB13LJ" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">View product on Amazon &rarr;</a>
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 max-w-3xl mx-auto">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">68%</p>
                    <p className="text-xs text-muted-foreground">Purchase Intent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">$36</p>
                    <p className="text-xs text-muted-foreground">Estimated WTP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">GO</p>
                    <p className="text-xs text-muted-foreground">Verdict</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">200mg natural caffeine + L-Theanine</span>
                      <span className="font-bold text-primary">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-teal h-1.5 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Nootropic blend for focus</span>
                      <span className="font-bold text-primary">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-teal h-1.5 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Zero sugar, zero calories</span>
                      <span className="font-bold text-primary">71%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-teal h-1.5 rounded-full" style={{ width: "71%" }} />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mb-6">
                  <p className="text-sm text-foreground italic">
                    &ldquo;Zero sugar and zero calories with actual nootropics is exactly what
                    I want for work focus. The 30-serving tub makes it cheaper per serving
                    than buying Celsius cans every day.&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    28yo female, $65k income
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <Link
                    href="/research/new"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
                  >
                    Run your own report free &rarr;
                  </Link>
                  <a
                    href="/research/sample-rekt"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  >
                    View full sample report
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why this works */}
        <section className="py-14 bg-navy dark:bg-navy-light text-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16">
              <div>
                <h2 className="font-bold mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
                  Why this works
                </h2>
                <p className="text-white/70 leading-relaxed mb-6">
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
                  <p className="text-sm text-white/70 leading-relaxed max-w-prose">
                    Built on findings from Brand, Israeli &amp; Ngwe (Harvard Business
                    School Working Paper 23-062, 2025), an independent study that
                    found LLM-simulated conjoint surveys closely match real
                    consumer panel WTP estimates in CPG categories (R&sup2; = 0.89, n=300).
                  </p>
                </div>
                <div className="w-12 h-px bg-white/10" />
                <div>
                  <p className="text-sm font-semibold text-teal mb-2">
                    Real Methodology
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed max-w-prose">
                    Each product is tested through a simulated panel of 50+
                    consumer personas, each with realistic demographics and
                    category experience. Instead of asking &ldquo;how much would
                    you pay?&rdquo; (which produces unreliable answers even with
                    real humans), we use forced-choice tasks at different price
                    points.
                  </p>
                </div>
                <div className="w-12 h-px bg-white/10" />
                <div>
                  <p className="text-sm font-semibold text-teal mb-2">
                    Honest Limitations
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed max-w-prose">
                    Best validated for CPG, food &amp; beverage, and household
                    products. Less proven for luxury, B2B, or truly novel
                    categories. We publish{" "}
                    <Link href="/methodology#confidence-by-category" className="text-teal underline hover:text-teal/80">
                      confidence levels by category
                    </Link>{" "}
                    so you know exactly what you&apos;re getting.
                  </p>
                </div>
                <div className="w-12 h-px bg-white/10" />
                {/* Change 5: Validation CTA */}
                <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-sm font-semibold text-white mb-1">
                    Already have research data?
                  </p>
                  <p className="text-sm text-white/70 mb-3">
                    Run HypeTest on the same product and compare results. It&apos;s
                    the fastest way to build confidence in the methodology.
                  </p>
                  <Link
                    href="/research/new"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
                  >
                    Run a validation test
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research toolkit */}
        <section className="py-14 bg-card">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-bold text-primary text-center mb-2" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              Your complete research toolkit
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
              Seven specialized tools for every stage of product development.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/research/new" className="block bg-background rounded-2xl border border-border/50 p-5 hover:border-teal/30 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-primary group-hover:text-teal transition-colors">Consumer Research</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400">Free</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">50-person AI panel with purchase intent, WTP, feature ranking, concerns, and a Go/No-Go verdict.</p>
              </Link>
              <Link href="/ab-test/new" className="block bg-background rounded-2xl border border-border/50 p-5 hover:border-teal/30 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-primary group-hover:text-teal transition-colors">A/B Concept Testing</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal/10 text-teal-dark">Starter</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Test two product concepts head-to-head against the same panel. Clear winner with side-by-side metrics.</p>
              </Link>
              <Link href="/name-test/new" className="block bg-background rounded-2xl border border-border/50 p-5 hover:border-teal/30 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-primary group-hover:text-teal transition-colors">Name Testing</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal/10 text-teal-dark">Starter</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Test 3-5 product name options. Ranked by consumer appeal with first impressions.</p>
              </Link>
              <Link href="/pricing-test/new" className="block bg-background rounded-2xl border border-border/50 p-5 hover:border-teal/30 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-primary group-hover:text-teal transition-colors">Pricing Optimizer</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal/10 text-teal-dark">Starter</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Test 5 price points and see the demand curve. Find the revenue-maximizing price for your product.</p>
              </Link>
              <Link href="/discover/new" className="block bg-background rounded-2xl border border-border/50 p-5 hover:border-teal/30 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-primary group-hover:text-teal transition-colors">Product Discovery</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">Pro</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">AI generates product concepts for your brand and tests them. Keep iterating until you find a winner.</p>
              </Link>
              <Link href="/audience-test/new" className="block bg-background rounded-2xl border border-border/50 p-5 hover:border-teal/30 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-primary group-hover:text-teal transition-colors">Audience Finder</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">Pro</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Test your product across 5 audience segments. Find which demographic has the highest intent.</p>
              </Link>
              <Link href="/competitive/new" className="block bg-background rounded-2xl border border-border/50 p-5 hover:border-teal/30 hover:shadow-sm transition-all group sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-primary group-hover:text-teal transition-colors">Competitive Teardown</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">Pro</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Compare your product vs a competitor with a radar chart across 5 dimensions.</p>
              </Link>
            </div>
            <div className="text-center mt-8">
              <Link href="/pricing" className="text-sm font-medium text-teal hover:underline">
                See all features and pricing &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing preview */}
        <section className="py-14">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-bold text-primary mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              Plans for every stage
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Start free with 3 research runs per month. Upgrade for testing tools,
              product discovery, and higher limits.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-xl font-bold text-primary">Free</p>
                <p className="text-xs text-muted-foreground mt-1">3 runs/month</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-xl font-bold text-primary">$49<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-1">30 runs + tools</p>
              </div>
              <div className="bg-card rounded-xl border border-teal shadow-sm shadow-teal/10 p-4 text-center">
                <p className="text-xl font-bold text-primary">$149<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-1">100 runs + discovery</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 text-center">
                <p className="text-xl font-bold text-primary">$349<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-1">500 runs + 5 seats</p>
              </div>
            </div>
            <Link href="/pricing" className="text-sm font-medium text-teal hover:underline">
              Compare all features &rarr;
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-card">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-bold text-primary mb-3" style={{ fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 1.875rem)' }}>
              Try it now. It&apos;s free.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              3 free research runs per month. No credit card required.
              See what your consumers think in under 2 minutes.
            </p>
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold px-10 h-14 text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
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

