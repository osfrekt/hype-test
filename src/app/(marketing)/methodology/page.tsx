import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";

export default function MethodologyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 py-16">
        <article className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            The Science Behind Simulated Consumer Research
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            HypeTest isn&apos;t asking an AI for its opinion on your product.
            It&apos;s running structured survey methodology through hundreds of
            demographically-specific simulated consumers to produce statistically
            aggregable results.
          </p>

          <Separator className="mb-10" />

          <section className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-navy">
              Why LLMs can simulate consumers
            </h2>
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

          <section className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-navy">
              The foundational research
            </h2>

            <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
              <p className="font-medium text-navy mb-2">
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
            </div>

            <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
              <p className="font-medium text-navy mb-2">
                Horton (2023). &ldquo;Large Language Models as Simulated Economic
                Agents.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Demonstrated that LLMs replicate classic behavioral economics
                experiments, suggesting they have internalised human economic
                decision-making patterns.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
              <p className="font-medium text-navy mb-2">
                Argyle et al. (2023). &ldquo;Out of One, Many.&rdquo;
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Showed that LLMs can simulate political preference distributions
                across demographic groups when properly conditioned with persona
                information.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
              <p className="font-medium text-navy mb-2">
                Li et al. (2024). LLM-based perceptual maps.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Demonstrated that LLMs can construct perceptual maps with brand
                similarities that closely match human responses.
              </p>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-navy">
              How HypeTest&apos;s methodology works
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-navy mb-1">
                  1. Synthetic consumer panel generation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We generate 50-200 consumer personas with realistic
                  demographic distributions (age, gender, income, location,
                  lifestyle, category experience). These are not generic
                  archetypes — they are grounded in realistic population
                  distributions for the US market.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-navy mb-1">
                  2. Conjoint-style indirect elicitation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rather than asking &ldquo;how much would you pay?&rdquo; (which produces
                  unreliable results even with real humans), we present choice
                  tasks: product configurations at different price points, and
                  ask each simulated consumer to choose. This is the same
                  methodology used by professional research firms like Nielsen
                  and Ipsos.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-navy mb-1">
                  3. Distributional querying
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each persona is queried independently with high temperature
                  settings, producing natural variation in responses. This is
                  critical — a single LLM response tells you nothing, but 50+
                  diverse responses produce a statistically meaningful
                  distribution.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-navy mb-1">
                  4. Structured aggregation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We aggregate responses to compute purchase intent scores,
                  willingness-to-pay estimates, feature importance rankings, and
                  thematic analysis of concerns and positives.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6 mb-12">
            <h2 className="text-xl font-bold text-navy">
              Limitations — what HypeTest cannot do
            </h2>
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

          <section className="space-y-4 mb-12">
            <h2 className="text-xl font-bold text-navy">
              When to use HypeTest
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                <p className="text-sm font-medium text-emerald-800 mb-2">
                  Good for
                </p>
                <ul className="text-sm text-emerald-700/80 space-y-1">
                  <li>&bull; Early-stage concept validation</li>
                  <li>&bull; Comparing feature trade-offs</li>
                  <li>&bull; Directional pricing research</li>
                  <li>&bull; Identifying consumer objections</li>
                  <li>&bull; Generating hypotheses for deeper research</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                <p className="text-sm font-medium text-red-800 mb-2">
                  Not for
                </p>
                <ul className="text-sm text-red-700/80 space-y-1">
                  <li>&bull; Final go/no-go launch decisions</li>
                  <li>&bull; Precise demographic targeting</li>
                  <li>&bull; Regulatory or compliance research</li>
                  <li>&bull; Replacing large-scale quantitative studies</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="bg-navy text-white rounded-xl p-8 text-center">
            <h2 className="text-lg font-bold mb-3">
              Try it yourself
            </h2>
            <p className="text-sm text-blue-200/80 mb-5 max-w-md mx-auto">
              The best way to evaluate this methodology is to run it on a
              product you already have data for — and see how the results
              compare.
            </p>
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-lg bg-teal text-white font-medium px-6 h-10 text-sm hover:bg-teal-dark transition-colors"
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
