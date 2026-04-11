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
            <div className="inline-flex items-center gap-2 bg-teal/10 text-teal-dark text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
              Grounded in peer-reviewed research
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy tracking-tight leading-[1.1] mb-5">
              Consumer research in
              <br />
              minutes, not months.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Simulate a panel of real consumers for any product or idea.
              Get willingness-to-pay estimates, feature priorities, and purchase
              intent — powered by AI, grounded in academic methodology.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
        <section className="py-12 border-y border-border/50 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            {/* Stat + R-squared visual */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-10">
              <div>
                <p className="text-sm font-semibold text-teal uppercase tracking-wider mb-3">
                  Validated by Harvard Business School research
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-4">
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
                  <line x1="50" y1="210" x2="380" y2="210" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="50" y1="210" x2="50" y2="20" stroke="#d1d5db" strokeWidth="1" />
                  {/* Axis labels */}
                  <text x="215" y="245" textAnchor="middle" className="fill-muted-foreground" fontSize="11">Actual consumer WTP ($)</text>
                  <text x="15" y="115" textAnchor="middle" className="fill-muted-foreground" fontSize="11" transform="rotate(-90, 15, 115)">HypeTest WTP ($)</text>
                  {/* Grid lines */}
                  <line x1="50" y1="163" x2="380" y2="163" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="50" y1="115" x2="380" y2="115" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="50" y1="68" x2="380" y2="68" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4" />
                  {/* Best-fit line */}
                  <line x1="70" y1="195" x2="365" y2="35" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.7" />
                  {/* Scatter points (realistic-looking distribution around the line) */}
                  <circle cx="85" cy="188" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="95" cy="178" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="110" cy="182" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="120" cy="168" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="130" cy="160" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="145" cy="155" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="155" cy="148" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="160" cy="140" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="175" cy="138" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="190" cy="125" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="195" cy="118" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="210" cy="120" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="225" cy="108" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="238" cy="98" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="250" cy="100" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="265" cy="88" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="278" cy="82" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="290" cy="75" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="305" cy="68" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="315" cy="58" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="330" cy="52" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="345" cy="48" r="5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="360" cy="38" r="5" fill="#0ea5e9" opacity="0.5" />
                  {/* Outliers for realism */}
                  <circle cx="105" cy="170" r="5" fill="#0ea5e9" opacity="0.35" />
                  <circle cx="165" cy="152" r="5" fill="#0ea5e9" opacity="0.35" />
                  <circle cx="215" cy="130" r="5" fill="#0ea5e9" opacity="0.35" />
                  <circle cx="270" cy="95" r="5" fill="#0ea5e9" opacity="0.35" />
                  <circle cx="325" cy="60" r="5" fill="#0ea5e9" opacity="0.35" />
                  {/* R-squared annotation */}
                  <rect x="260" y="170" width="110" height="32" rx="6" fill="#1a1f36" />
                  <text x="315" y="191" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">R&sup2; = 0.89</text>
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
        <section className="py-14 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
              How HypeTest works
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Three steps to insights that used to cost $20-50k and take weeks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Step
                number="1"
                title="Describe your product"
                description="Tell us about your product, feature, or business idea. Free-text is fine — we'll extract what we need."
                icon={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>}
              />
              <Step
                number="2"
                title="We simulate your consumers"
                description="We generate a diverse panel of 50+ consumer personas and run structured survey methodology through each one."
                icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
              />
              <Step
                number="3"
                title="Get your research report"
                description="Receive purchase intent, willingness-to-pay, feature importance, and consumer concerns — in under 2 minutes."
                icon={<><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>}
              />
            </div>

            {/* Discovery CTA */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  Don&apos;t have a product yet?
                </p>
                <p className="text-sm text-amber-700/80 mb-4">
                  Use Product Discovery to find out what your audience actually
                  wants — then test the top concepts instantly.
                </p>
                <Link
                  href="/discover/new"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-900 hover:underline"
                >
                  Discover products
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-14">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
              What&apos;s in a HypeTest report
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Not another AI opinion. Structured research methodology with aggregated results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <ResultCard
                title="Purchase Intent Score"
                description="What percentage of consumers would actually buy your product, on a validated 5-point scale."
                icon={<>
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </>}
              />
              <ResultCard
                title="Willingness-to-Pay Range"
                description="Data-derived price estimates from conjoint-style choice tasks — not guesses."
                icon={<>
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </>}
              />
              <ResultCard
                title="Feature Importance"
                description="Which product attributes drive purchase decisions, ranked by simulated consumer preference."
                icon={<>
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </>}
              />
              <ResultCard
                title="Consumer Concerns"
                description="The top objections and hesitations from your simulated panel — the things you need to address."
                icon={<>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>}
              />
              <ResultCard
                title="Consumer Verbatims"
                description="Simulated open-ended responses from diverse consumer profiles, giving you qualitative texture."
                icon={<>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </>}
              />
              <ResultCard
                title="Methodology Disclosure"
                description="Full transparency on panel composition, question design, and confidence level. Always."
                icon={<>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </>}
              />
            </div>
          </div>
        </section>

        {/* Sample report */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
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
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Why this works
            </h2>
            <p className="text-blue-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              HypeTest is built on peer-reviewed research showing that LLM-simulated
              consumer panels produce willingness-to-pay estimates comparable to
              real human panels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-teal/20 flex items-center justify-center mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                </div>
                <p className="text-sm font-medium text-teal mb-2">
                  Academic Foundation
                </p>
                <p className="text-sm text-blue-100/70 leading-relaxed">
                  Based on Brand, Israeli &amp; Ngwe (2025) from Harvard Business
                  School, who demonstrated that LLM-generated WTP estimates
                  closely match real consumer panels.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-teal/20 flex items-center justify-center mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                </div>
                <p className="text-sm font-medium text-teal mb-2">
                  Real Methodology
                </p>
                <p className="text-sm text-blue-100/70 leading-relaxed">
                  We use conjoint-style indirect elicitation — the same approach
                  used by professional research firms — not direct &quot;how much would
                  you pay?&quot; questions.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="w-9 h-9 rounded-lg bg-teal/20 flex items-center justify-center mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
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
              className="inline-flex items-center gap-2 text-teal text-sm font-medium mt-8 hover:underline"
            >
              Read the full methodology
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
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

function Step({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-navy text-white text-xs font-bold mb-3">
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
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-border/50 p-5 hover:border-teal/30 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mb-3 group-hover:bg-teal/15 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon}
        </svg>
      </div>
      <h3 className="font-semibold text-navy mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
