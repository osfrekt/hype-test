import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";

export default function MethodologyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-3">
            The Science Behind Simulated Consumer Research
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            HypeTest isn&apos;t asking an AI for its opinion on your product.
            It&apos;s running structured survey methodology through hundreds of
            demographically-specific simulated consumers to produce statistically
            aggregable results.
          </p>

          {/* What this is and isn't */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <p className="text-sm font-semibold text-emerald-800">
                  What HypeTest does well
                </p>
              </div>
              <ul className="text-sm text-emerald-700/80 space-y-1.5">
                <li>&bull; Early-stage concept validation</li>
                <li>&bull; Feature prioritisation and trade-off analysis</li>
                <li>&bull; Directional pricing and WTP estimation</li>
                <li>&bull; Surfacing consumer objections before launch</li>
                <li>&bull; Hypothesis generation for deeper research</li>
              </ul>
            </div>
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <p className="text-sm font-semibold text-amber-800">
                  Where HypeTest has limits
                </p>
              </div>
              <ul className="text-sm text-amber-700/80 space-y-1.5">
                <li>&bull; Precise demographic segment targeting</li>
                <li>&bull; Truly novel categories with no market precedent</li>
                <li>&bull; High-stakes final launch decisions</li>
                <li>&bull; Non-US and non-English markets</li>
                <li>&bull; Replacing large-scale quantitative studies</li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">
                  Why LLMs can simulate consumers
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Large language models are trained on vast corpora that include
              millions of product reviews, purchase discussions, price
              comparisons, and consumer forums. They have implicitly absorbed the
              patterns of how people evaluate, compare, and decide about
              products. When prompted to role-play as a specific consumer
              profile, they draw on these internalised patterns to produce
              realistic preference responses.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This isn&apos;t speculation. Peer-reviewed research has validated this
              approach across multiple studies.
            </p>
          </section>

          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">
                  The foundational research
                </h2>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-5 border border-border/50">
              <p className="font-medium text-navy mb-1.5">
                Brand, Israeli &amp; Ngwe (2025). &ldquo;Using LLMs for Market
                Research.&rdquo; Harvard Business School Working Paper 23-062.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The researchers ran conjoint-style surveys through GPT and found
                that the resulting willingness-to-pay estimates closely matched
                those from real consumer panels (Prolific, n=300 per study). The
                key insight: by querying the LLM dozens of times per question
                with temperature=1.0, they generated a distribution of responses
                that simulates the natural variation you&apos;d see in a real
                consumer panel.
              </p>
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3 mt-3 border border-amber-100">
                <strong>Note:</strong> The R&sup2; = 0.89 correlation was demonstrated
                specifically for consumer packaged goods categories. Performance
                may vary for novel product categories, niche markets, or
                categories with limited training data representation.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-5 border border-border/50">
              <p className="font-medium text-navy mb-1.5">
                Horton (2023). &ldquo;Large Language Models as Simulated Economic
                Agents.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Demonstrated that LLMs replicate classic behavioral economics
                experiments, suggesting they have internalised human economic
                decision-making patterns.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-5 border border-border/50">
              <p className="font-medium text-navy mb-1.5">
                Argyle et al. (2023). &ldquo;Out of One, Many.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Showed that LLMs can simulate political preference distributions
                across demographic groups when properly conditioned with persona
                information.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-5 border border-border/50">
              <p className="font-medium text-navy mb-1.5">
                Li et al. (2024). LLM-based perceptual maps.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Demonstrated that LLMs can construct perceptual maps with brand
                similarities that closely match human responses.
              </p>
            </div>
          </section>

          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">
                  How HypeTest&apos;s methodology works
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <MethodStep
                number="1"
                title="Synthetic consumer panel generation"
                description="We generate 50-200 consumer personas with realistic demographic distributions (age, gender, income, location, lifestyle, category experience). These are not generic archetypes — they are grounded in realistic population distributions for the US market."
              />
              <MethodStep
                number="2"
                title="Conjoint-style indirect elicitation"
                description='Rather than asking "how much would you pay?" (which produces unreliable results even with real humans), we present choice tasks: product configurations at different price points, and ask each simulated consumer to choose. This is the same methodology used by professional research firms like Nielsen and Ipsos.'
              />
              <MethodStep
                number="3"
                title="Distributional querying"
                description="Each persona is queried independently with high temperature settings, producing natural variation in responses. This is critical — a single LLM response tells you nothing, but 50+ diverse responses produce a statistically meaningful distribution."
              />
              <MethodStep
                number="4"
                title="Structured aggregation"
                description="We aggregate responses to compute purchase intent scores, willingness-to-pay estimates, feature importance rankings, and thematic analysis of concerns and positives."
              />
            </div>
          </section>

          {/* Panel Construction */}
          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">
                  Panel construction
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Each simulated panellist is assigned a unique demographic profile
              drawn from US census-representative distributions across age
              (22-67), gender (48% male, 48% female, 4% non-binary), household
              income ($25k-$200k), geographic location (12 region types),
              lifestyle orientation (10 consumer archetypes), and
              category-specific purchase experience.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When a target consumer is specified, 80% of the panel is skewed
              toward the target demographics while 20% remains general population
              for contrast. The target skew is derived by asking the LLM to
              interpret the target description into specific demographic
              parameters (age range, gender distribution, income bracket,
              location types, and lifestyle traits).
            </p>
          </section>

          {/* Conjoint methodology detail */}
          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">
                  Conjoint methodology detail
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              HypeTest uses a simplified choice-based approach inspired by
              conjoint analysis. Each panellist is presented with the product at
              three price points (low, mid, high) and asked to choose. This is
              structurally simpler than full adaptive conjoint (which uses
              orthogonal attribute combinations across multiple choice sets), but
              captures the core insight: indirect elicitation produces more
              realistic WTP estimates than direct &ldquo;how much would you
              pay?&rdquo; questions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We describe this as &ldquo;conjoint-style&rdquo; to be transparent about
              both the methodology&apos;s strengths and its simplification. The
              approach trades some granularity for speed and accessibility —
              making research-grade directional insights available in minutes
              rather than weeks.
            </p>
          </section>

          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">
                  Limitations — what HypeTest cannot do
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We believe transparency about limitations is essential to earning
              trust. Here is what this approach cannot reliably do:
            </p>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Demographic segment precision.</strong> Current LLMs do
                  not reliably reflect heterogeneous preferences across specific
                  demographic groups (gender, income, political affiliation).
                  Even with fine-tuning, models better reflect average population
                  WTP rather than segment-specific estimates.
                </span>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Novel product categories.</strong> Results are best for
                  existing product categories where training data is rich. If
                  your product is truly unprecedented with no comparable
                  products, results will be less reliable.
                </span>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Replacing high-stakes research.</strong> HypeTest is not a
                  replacement for real consumer research when the stakes are high
                  (major product launches, large investments). It is best for
                  early-stage exploration, hypothesis generation, and narrowing
                  options before investing in traditional research.
                </span>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Cultural and regional specificity.</strong> Current
                  models are primarily trained on English-language data with US
                  cultural biases. Results should be treated as reflective of a
                  US general population context.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 mb-10">
            <h2 className="text-xl font-bold text-navy">
              When to use HypeTest
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <p className="text-sm font-medium text-emerald-800">
                    Good for
                  </p>
                </div>
                <ul className="text-sm text-emerald-700/80 space-y-1">
                  <li>&bull; Early-stage concept validation</li>
                  <li>&bull; Comparing feature trade-offs</li>
                  <li>&bull; Directional pricing research</li>
                  <li>&bull; Identifying consumer objections</li>
                  <li>&bull; Generating hypotheses for deeper research</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  <p className="text-sm font-medium text-red-800">
                    Not for
                  </p>
                </div>
                <ul className="text-sm text-red-700/80 space-y-1">
                  <li>&bull; Final go/no-go launch decisions</li>
                  <li>&bull; Precise demographic targeting</li>
                  <li>&bull; Regulatory or compliance research</li>
                  <li>&bull; Replacing large-scale quantitative studies</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="bg-navy text-white rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold mb-2">
              Try it yourself
            </h2>
            <p className="text-sm text-blue-200/80 mb-4 max-w-md mx-auto">
              The best way to evaluate this methodology is to run it on a
              product you already have data for — and see how the results
              compare.
            </p>
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-xl bg-teal text-white font-semibold px-8 h-12 text-sm hover:bg-teal-dark transition-colors"
            >
              Run your first study free
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function MethodStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <h3 className="font-medium text-navy mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
