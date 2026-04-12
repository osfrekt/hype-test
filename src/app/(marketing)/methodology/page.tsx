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
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
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
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  What HypeTest does well
                </p>
              </div>
              <ul className="text-sm text-emerald-700/80 dark:text-emerald-400/70 space-y-1.5">
                <li>&bull; Early-stage concept validation</li>
                <li>&bull; Feature prioritisation and trade-off analysis</li>
                <li>&bull; Directional pricing and WTP estimation</li>
                <li>&bull; Surfacing consumer objections before launch</li>
                <li>&bull; Hypothesis generation for deeper research</li>
              </ul>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Where HypeTest has limits
                </p>
              </div>
              <ul className="text-sm text-amber-700/80 dark:text-amber-400/70 space-y-1.5">
                <li>&bull; Precise demographic segment targeting</li>
                <li>&bull; Truly novel categories with no market precedent</li>
                <li>&bull; High-stakes final launch decisions</li>
                <li>&bull; Non-US and non-English markets</li>
                <li>&bull; Replacing large-scale quantitative studies</li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Change 3: Why LLMs can simulate consumers */}
          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  Why LLMs can simulate consumers
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-primary mb-1.5">
                  1. LLMs as compressed market knowledge
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  LLMs were trained on billions of product reviews, pricing
                  discussions, purchase decision threads, and consumer forums.
                  They haven&apos;t just memorised facts about products; they&apos;ve
                  internalised the <em>decision patterns</em> that produce those
                  reviews. When you condition an LLM with a specific demographic
                  profile, it draws on these patterns to produce responses that
                  statistically mirror real consumer preferences in that
                  demographic. Think of it as a lossy compression of millions of
                  real consumer interactions.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-primary mb-1.5">
                  2. Why indirect elicitation matters
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Even with real humans, asking &ldquo;how much would you pay for
                  X?&rdquo; produces unreliable answers. People consistently
                  overstate their willingness to pay when asked directly (this
                  is called hypothetical bias) and it&apos;s well-documented in
                  behavioral economics. Professional research firms solved this
                  decades ago by switching to choice-based methods: instead of
                  asking what you&apos;d pay, they show you options at different
                  prices and ask you to choose. This same principle works with
                  LLM-simulated consumers, and for the same reason. The
                  forced-choice format produces more realistic price sensitivity
                  patterns.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-primary mb-1.5">
                  3. Distributional querying is the key innovation
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  A single LLM response is just a point estimate and not very
                  useful on its own. The breakthrough from Brand et al. (2025)
                  was querying the model many times with diverse persona
                  conditioning. Each persona responds slightly differently based
                  on their demographic profile, income, lifestyle, and category
                  experience. Aggregate 50+ of these responses and you get a
                  distribution that approximates real population-level preference
                  distributions. The R&sup2; = 0.89 result comes from comparing
                  these aggregated distributions against real panel data.
                </p>
              </div>
            </div>
          </section>

          {/* Change 7: Restructured research citations */}
          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  The foundational research
                </h2>
              </div>
            </div>

            {/* Primary validation */}
            <p className="text-xs font-semibold text-teal uppercase tracking-wider">
              Primary validation
            </p>
            <div className="bg-muted/50 rounded-xl p-5 border-2 border-teal/30">
              <p className="font-medium text-primary mb-1.5">
                <a
                  href="https://www.hbs.edu/ris/Publication%20Files/23-062_b8e4c6b3-27b2-4131-929a-85636faf8024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                >
                  Brand, Israeli &amp; Ngwe (2025). &ldquo;Using LLMs for Market
                  Research.&rdquo;
                </a>{" "}
                Harvard Business School Working Paper 23-062.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is the direct foundation for HypeTest&apos;s approach. The
                researchers validated conjoint-style LLM surveys against Prolific
                panels across multiple CPG categories. Key finding: aggregate WTP
                distributions from the LLM closely matched real panel
                distributions, with R&sup2; = 0.89.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                The key insight: by querying the LLM dozens of times per question
                with temperature=1.0, they generated a distribution of responses
                that simulates the natural variation you&apos;d see in a real
                consumer panel.
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 mt-3 border border-amber-100 dark:border-amber-800/30">
                <strong>Note:</strong> The R&sup2; = 0.89 correlation was demonstrated
                specifically for consumer packaged goods categories. Performance
                may vary for novel product categories, niche markets, or
                categories with limited training data representation.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                For an accessible overview, see the{" "}
                <a
                  href="https://hbr.org/2025/07/using-gen-ai-for-early-stage-market-research"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                >
                  HBR summary of this research
                </a>.
              </p>
            </div>

            {/* Supporting research */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6">
              Supporting research
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These studies provide broader evidence that LLMs can simulate human
              economic and preference behaviors.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://www.nber.org/papers/w31122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    Horton (2023). &ldquo;Large Language Models as Simulated Economic
                    Agents.&rdquo;
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Demonstrated that LLMs replicate classic behavioral economics
                  experiments, suggesting they have internalised human economic
                  decision-making patterns.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://doi.org/10.1093/pnasnexus/pgad032"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    Argyle et al. (2023). &ldquo;Out of One, Many.&rdquo;
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Showed that LLMs can simulate political preference distributions
                  across demographic groups when properly conditioned with persona
                  information.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://scholar.google.com/scholar?q=Li+LLM+perceptual+maps+brand+similarity+2024"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    Li et al. (2024). LLM-based perceptual maps.
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Demonstrated that LLMs can construct perceptual maps with brand
                  similarities that closely match human responses.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://onlinelibrary.wiley.com/doi/10.1002/mar.21982"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    Sarstedt et al. (2024). &ldquo;Using large language models to
                    generate silicon samples in consumer and marketing
                    research.&rdquo;
                  </a>{" "}
                  Psychology &amp; Marketing (Wiley).
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Demonstrated that LLM-generated consumer samples can replicate
                  key patterns found in traditional survey research.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://www.sciencedirect.com/special-issue/324829/generative-ai-synthetic-data-and-synthetic-respondents-in-marketing-research"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    International Journal of Research in Marketing (2025).
                    &ldquo;Generative AI, Synthetic Data, and Synthetic
                    Respondents in Marketing Research&rdquo; (Special Issue).
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A dedicated academic special issue exploring the validity and
                  applications of AI-generated synthetic respondents.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  Stanford/Google DeepMind (working paper). Digital agents
                  matching human survey responses.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Digital agents matched human survey responses with 85% accuracy
                  and 98% social behaviour correlation.
                </p>
              </div>
            </div>

            {/* Industry research */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6">
              Industry research
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Leading consultancies and research firms are independently
              validating synthetic consumer methods.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://www.bain.com/insights/how-synthetic-customers-bring-companies-closer-to-the-real-ones/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    Bain &amp; Company (2025). &ldquo;How Synthetic Customers
                    Bring Companies Closer to the Real Ones.&rdquo;
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Synthetic customer research can accelerate product development
                  cycles while maintaining directional accuracy.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://nielseniq.com/global/en/insights/education/2024/the-rise-of-synthetic-respondents/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    NielsenIQ (2024). &ldquo;The Rise of Synthetic Respondents in
                    Market Research.&rdquo;
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Industry validation that synthetic respondents are becoming a
                  standard tool in market research.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://www.pymc-labs.com/blog-posts/AI-based-Customer-Research"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    PyMC Labs. &ldquo;AI Synthetic Consumers Now Rival Real
                    Surveys.&rdquo;
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  90% correlation with product ranking, 85%+ distributional
                  similarity between AI and real consumer panels.
                </p>
              </div>
            </div>

            {/* Ad and creative testing research */}
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6">
              Ad and creative testing research
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These studies validate using LLMs for advertising evaluation,
              creative generation, and campaign testing.
            </p>

            <p className="text-xs font-semibold text-teal uppercase tracking-wider">
              Primary validation
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://arxiv.org/html/2512.03373"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    &ldquo;LLM-Generated Ads: From Personalization Parity to
                    Persuasion Superiority&rdquo; (2025).
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  First systematic comparison of LLM-generated vs human-created
                  advertising. LLM ads match humans on personalisation and
                  outperform on persuasion under certain conditions.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://pubsonline.informs.org/doi/10.1287/mnsc.2023.03014"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    &ldquo;Large Language Model in Creative Work&rdquo; (2024).
                  </a>{" "}
                  Management Science.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Controlled experiment measuring real ad quality using social
                  media click metrics. LLM feedback on human-written creative
                  improved measurable performance.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://pubsonline.informs.org/doi/10.1287/mksc.2023.0611"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    &ldquo;Applying Large Language Models to Sponsored Search
                    Advertising&rdquo; (2024).
                  </a>{" "}
                  Marketing Science.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Field experiments (30,799+ impressions). Persona conditioning
                  significantly improves ad quality. Bigger models alone
                  don&apos;t help; audience context does.
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
              Supporting
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://www.arxiv.org/pdf/2512.01431"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    &ldquo;A Meta-Analysis of the Persuasive Power of Large
                    Language Models&rdquo; (2025).
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  First meta-analysis synthesising all existing research on LLM
                  persuasiveness vs humans.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://arxiv.org/html/2407.21553v1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    &ldquo;CXSimulator: User Behavior Simulation for
                    Web-Marketing Campaign Assessment&rdquo; (2024).
                  </a>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Framework for assessing marketing campaign effects through
                  simulated user behaviour without costly A/B tests.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                <p className="font-medium text-primary text-sm mb-1">
                  <a
                    href="https://dl.acm.org/doi/abs/10.1145/3589335.3651520"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-2 hover:decoration-primary transition-colors"
                  >
                    &ldquo;How Good are LLMs in Generating Personalized
                    Advertisements?&rdquo; (2024).
                  </a>{" "}
                  ACM Web Conference.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  User study comparing LLM-generated ads tailored to personality
                  traits against human-written ads across different online
                  environments.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic mt-2">
              We track new research in this space actively. As more validation
              studies are published, we&apos;ll update this page and our confidence
              assessments. Last updated: April 2026.
            </p>
          </section>

          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  How HypeTest&apos;s methodology works
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <MethodStep
                number="1"
                title="Synthetic consumer panel generation"
                description="We generate 50-200 consumer personas with realistic demographic distributions (age, gender, income, location, lifestyle, category experience). These are not generic archetypes. They are grounded in realistic population distributions for the US market."
              />
              <MethodStep
                number="2"
                title="Conjoint-style indirect elicitation"
                description='Rather than asking "how much would you pay?" (which produces unreliable results even with real humans), we present choice tasks: product configurations at different price points, and ask each simulated consumer to choose. This is a simplified version of the same methodology used by professional research firms.'
              />
              <MethodStep
                number="3"
                title="Distributional querying"
                description="Each persona is queried independently with high temperature settings, producing natural variation in responses. This is critical: a single LLM response tells you nothing, but 50+ diverse responses produce a statistically meaningful distribution."
              />
              <MethodStep
                number="4"
                title="Structured aggregation"
                description="We aggregate responses to compute purchase intent scores, willingness-to-pay estimates, feature importance rankings, and thematic analysis of concerns and positives."
              />
            </div>
          </section>

          {/* Change 2: What a simulated survey looks like */}
          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  What a simulated survey looks like
                </h2>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Here&apos;s a concrete walkthrough of how a single persona experiences
              the survey. This is what actually runs behind the scenes for each
              of the 50+ panellists.
            </p>

            {/* Example persona card */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
              <p className="text-xs font-semibold text-teal uppercase tracking-wider mb-2">
                Example persona
              </p>
              <p className="text-sm text-primary font-medium">
                Sarah, 34, female, $85k household income, suburban Austin,
                health-conscious lifestyle, occasional premium buyer
              </p>
            </div>

            {/* Survey questions */}
            <div className="space-y-4">
              {/* Q1 */}
              <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <p className="text-sm font-semibold text-primary">Purchase Intent</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  &ldquo;On a scale of 1-5, how likely would you be to purchase
                  [Product X] at [price]?&rdquo;
                </p>
                <div className="flex gap-3 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium ${n === 4 ? 'border-teal bg-teal/10 text-teal' : 'border-border text-muted-foreground'}`}>
                      {n}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Standard Likert scale, the same format used in traditional consumer research.
                </p>
              </div>

              {/* Q2 */}
              <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  <p className="text-sm font-semibold text-primary">Price Sensitivity (Conjoint-style choice)</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  &ldquo;Which would you choose?&rdquo;
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'Product X', price: '$8.99', selected: false },
                    { label: 'Product X', price: '$12.99', selected: true },
                    { label: 'Product X', price: '$17.99', selected: false },
                    { label: 'None of these', price: '', selected: false },
                  ].map((opt, i) => (
                    <div key={i} className={`rounded-lg border-2 p-3 text-center text-sm ${opt.selected ? 'border-teal bg-teal/10' : 'border-border'}`}>
                      <p className="font-medium text-primary">{opt.label}</p>
                      {opt.price && <p className="text-muted-foreground text-xs">{opt.price}</p>}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2.5 border border-amber-100 dark:border-amber-800/30">
                  Indirect elicitation through forced-choice tasks reduces
                  hypothetical bias, the same reason professional research firms
                  moved away from open-ended WTP questions decades ago.
                </p>
              </div>

              {/* Q3 */}
              <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  <p className="text-sm font-semibold text-primary">Feature Importance</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  &ldquo;Rank these features by how much they&apos;d influence your decision.&rdquo;
                </p>
                <div className="space-y-1.5">
                  {[
                    { rank: 1, feature: 'Organic ingredients' },
                    { rank: 2, feature: 'Price per serving' },
                    { rank: 3, feature: 'Brand reputation' },
                    { rank: 4, feature: 'Packaging sustainability' },
                  ].map((item) => (
                    <div key={item.rank} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{item.rank}</span>
                      <span className="text-muted-foreground">{item.feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q4 */}
              <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">4</span>
                  <p className="text-sm font-semibold text-primary">Open-ended response</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  &ldquo;What&apos;s your biggest hesitation about this product?&rdquo;
                </p>
                <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;I&apos;d want to know more about the sourcing. At $12.99
                    it&apos;s in my range, but only if the organic claim is
                    third-party certified.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              This survey is run independently for each of the 50+ personas in
              the panel. Each persona responds based on their demographic
              profile, lifestyle, and category experience. The variation across
              personas produces a distribution of responses that mirrors what
              you&apos;d see from a real consumer panel.
            </p>
          </section>

          {/* Panel Construction */}
          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
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
                <h2 className="text-xl font-bold text-primary">
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
              approach trades some granularity for speed and accessibility,
              making research-grade directional insights available in minutes
              rather than weeks.
            </p>
          </section>

          {/* How ad and creative testing works */}
          <section className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  How ad and creative testing works
                </h2>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              LLMs have been trained on enormous volumes of ad copy, marketing
              campaigns, consumer reactions to advertising, click-through data
              discussions, and A/B test case studies. They have internalised what
              makes ads effective across different demographics and channels.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Research from Marketing Science (Xu et al., 2024) showed that
              giving the LLM context about the audience significantly improves
              ad evaluation quality. This is exactly what HypeTest does: each
              simulated panellist has a unique demographic profile that shapes
              how they respond to creative. A 22-year-old gamer evaluates an
              energy drink ad very differently than a 45-year-old executive.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              A controlled experiment published in Management Science (Zhu et
              al., 2024) demonstrated that LLM feedback on ad creative
              correlates with real social media engagement metrics such as
              click-through rates. This means LLM ad evaluation is not just
              subjective assessment; it tracks measurable real-world performance.
            </p>
          </section>

          {/* Change 4: Expanded limitations */}
          <section id="limitations" className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  Where this breaks down
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We believe transparency about limitations is essential to earning
              trust. Here are the specific failure modes we&apos;ve identified:
            </p>
            <ul className="space-y-4">
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Demographic segment precision is limited.</strong>{" "}
                  Current LLMs reflect <em>average</em> population preferences
                  more reliably than segment-specific ones. If you&apos;re trying
                  to understand what 18-24 year old Hispanic males in urban areas
                  think about your product specifically, the simulation won&apos;t
                  reliably differentiate that segment from the general population.
                  The Brand et al. research found that aggregate WTP was
                  well-matched but segment-level heterogeneity was less reliable.
                </span>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Novel categories with no market precedent.</strong>{" "}
                  The model&apos;s consumer knowledge comes from its training data.
                  For a product category that genuinely doesn&apos;t exist yet (not
                  a variation on an existing category, but something truly
                  unprecedented), the model has no reference patterns to draw on.
                  Results for novel categories should be treated with
                  significantly more skepticism. Works well for: &ldquo;a new oat
                  milk brand.&rdquo; Works less well for: &ldquo;a device that
                  translates dog emotions into text.&rdquo;
                </span>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Cultural and regional specificity.</strong> The training
                  data skews heavily toward English-language, US-centric consumer
                  patterns. Results for non-US markets, non-English-speaking
                  audiences, or culturally specific purchasing behaviors (e.g.,
                  gifting norms in East Asia, luxury perceptions in Gulf states)
                  are not reliable. We currently scope all results to a US general
                  population context.
                </span>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>The ceiling on precision.</strong> R&sup2; = 0.89 is strong
                  correlation but it&apos;s not 1.0. That remaining 11% gap matters
                  at the margins. If your pricing decision comes down to a $2
                  difference, this tool won&apos;t reliably distinguish between
                  $12.99 and $14.99. For that level of precision, you need real
                  panelists. HypeTest is designed for directional decisions:
                  should we pursue this concept? Is the $15-25 range right? Which
                  of these three features matters most?
                </span>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Recency gap.</strong> The model&apos;s training data has a
                  cutoff date. If your product depends on very recent cultural
                  trends, viral moments, or category disruptions that happened in
                  the last few months, those won&apos;t be reflected in the
                  simulation.
                </span>
              </li>
              <li className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0 font-bold">&times;</span>
                <span>
                  <strong>Ad creative testing has its own limits.</strong> Ad
                  creative testing works best for text-based messaging and
                  taglines. Visual evaluation is more limited since the model
                  evaluates described visuals rather than perceiving images the
                  way consumers do. Results are directional signals for creative
                  optimisation, not replacements for real campaign analytics.
                  Performance predictions may vary for highly visual, culturally
                  specific, or platform-native creative formats.
                </span>
              </li>
            </ul>
          </section>

          {/* Change 6: Confidence by category */}
          <section id="confidence-by-category" className="space-y-5 mb-10">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">
                  Confidence by category
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* High confidence */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    High confidence
                  </p>
                </div>
                <ul className="text-sm text-emerald-700/80 dark:text-emerald-400/70 space-y-1.5">
                  <li>&bull; Consumer packaged goods</li>
                  <li>&bull; Food &amp; beverage</li>
                  <li>&bull; Personal care</li>
                  <li>&bull; Household products</li>
                  <li>&bull; Pet products</li>
                </ul>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/50 mt-3">
                  Richest training data. Closest match to validated research.
                </p>
              </div>

              {/* Moderate confidence */}
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 border border-amber-100 dark:border-amber-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    Moderate confidence
                  </p>
                </div>
                <ul className="text-sm text-amber-700/80 dark:text-amber-400/70 space-y-1.5">
                  <li>&bull; Consumer electronics</li>
                  <li>&bull; Apparel &amp; fashion</li>
                  <li>&bull; Health &amp; wellness</li>
                  <li>&bull; Subscription services</li>
                  <li>&bull; DTC brands</li>
                </ul>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/50 mt-3">
                  Good results expected but less directly validated. Treat as strong directional signal.
                </p>
              </div>

              {/* Low confidence */}
              <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-5 border border-red-100 dark:border-red-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Low confidence
                  </p>
                </div>
                <ul className="text-sm text-red-700/80 dark:text-red-400/70 space-y-1.5">
                  <li>&bull; Luxury goods</li>
                  <li>&bull; B2B products</li>
                  <li>&bull; Financial services</li>
                  <li>&bull; Novel/unprecedented categories</li>
                  <li>&bull; Culturally specific products</li>
                </ul>
                <p className="text-xs text-red-600/70 dark:text-red-400/50 mt-3">
                  Use for hypothesis generation only, not for decision-making.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic">
              These confidence levels are our honest assessment based on training
              data coverage and validation research. We&apos;ll update them as we
              run more validation studies.
            </p>
          </section>

          <section className="space-y-4 mb-10">
            <h2 className="text-xl font-bold text-primary">
              When to use HypeTest
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Good for
                  </p>
                </div>
                <ul className="text-sm text-emerald-700/80 dark:text-emerald-400/70 space-y-1">
                  <li>&bull; Early-stage concept validation</li>
                  <li>&bull; Comparing feature trade-offs</li>
                  <li>&bull; Directional pricing research</li>
                  <li>&bull; Identifying consumer objections</li>
                  <li>&bull; Generating hypotheses for deeper research</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-5 border border-red-100 dark:border-red-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Not for
                  </p>
                </div>
                <ul className="text-sm text-red-700/80 dark:text-red-400/70 space-y-1">
                  <li>&bull; Final go/no-go launch decisions</li>
                  <li>&bull; Precise demographic targeting</li>
                  <li>&bull; Regulatory or compliance research</li>
                  <li>&bull; Replacing large-scale quantitative studies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Change 5: Validation CTA */}
          <div className="bg-navy dark:bg-navy-light text-white rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold mb-2">
              The best way to evaluate this? Run it against data you already have.
            </h2>
            <p className="text-sm text-white/70 mb-4 max-w-lg mx-auto">
              Pick a product you&apos;ve already done traditional consumer research
              on. Run it through HypeTest. Compare the purchase intent, WTP
              range, and feature rankings against your existing data. If the
              results are directionally aligned, you&apos;ll know exactly when to
              use HypeTest and when to invest in a full panel.
            </p>
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-xl bg-teal text-white font-semibold px-8 h-12 text-sm hover:bg-teal-dark transition-colors"
            >
              Run a validation test
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
      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <h3 className="font-medium text-primary mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
