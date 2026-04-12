import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";

const features = [
  { label: "Clean ingredients, zero sugar", score: 88 },
  { label: "$REKT token incentive / loyalty rewards", score: 76 },
  { label: "Bold flavours in sparkling water format", score: 68 },
];

export default function RektCaseStudyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <article className="max-w-3xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-muted px-2.5 py-1 rounded-full mb-4">
              Case Study
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Rekt Sparkling Water: 1 Million Cans in Year One
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We ran the winning concept through HypeTest retroactively.
              Here&apos;s how AI-simulated research compared to actual sales
              data.
            </p>
          </div>

          <Separator className="mb-10" />

          {/* The Story */}
          <section className="space-y-5 mb-10">
            <h2 className="text-xl font-bold text-primary">The story</h2>
            <p className="text-muted-foreground leading-relaxed">
              <a
                href="https://rekt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline"
              >
                Rekt
              </a>
              , an energy and wellness brand operated by Rekt Brands Inc.,
              launched a flavoured sparkling water with a unique go-to-market
              strategy: consumers earned $REKT tokens with every purchase,
              creating a loyalty loop that drove repeat purchases and
              word-of-mouth. The product hit 1 million cans sold in its first
              year.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              To test how accurately HypeTest&apos;s AI-simulated consumer panel
              would have predicted this outcome, we ran the original sparkling
              water concept through HypeTest retroactively, using the same
              product description and target audience that existed at launch.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The goal was simple: would HypeTest have told the Rekt team to go
              ahead with the launch? And how closely would the simulated
              consumer sentiment match real-world results?
            </p>
          </section>

          <Separator className="mb-10" />

          {/* HypeTest Results Card */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-5">
              HypeTest results
            </h2>
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
              {/* Top-line metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">72%</p>
                  <p className="text-xs text-muted-foreground">
                    Purchase Intent
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">$2.50</p>
                  <p className="text-xs text-muted-foreground">
                    Estimated WTP
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">GO</p>
                  <p className="text-xs text-muted-foreground">Verdict</p>
                </div>
              </div>

              {/* Feature bars */}
              <div className="space-y-3">
                {features.map((f) => (
                  <div key={f.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-bold text-primary">{f.score}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-teal h-1.5 rounded-full"
                        style={{ width: `${f.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Separator className="mb-10" />

          {/* What HypeTest got right */}
          <section className="mb-10">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <h2 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  What HypeTest got right
                </h2>
              </div>
              <ul className="text-sm text-emerald-700/80 dark:text-emerald-400/70 space-y-2">
                <li>
                  &bull; High purchase intent (72%) aligned with strong
                  real-world sales (1M+ cans)
                </li>
                <li>
                  &bull; Consumer interest in clean ingredients matched the
                  health-conscious positioning
                </li>
                <li>
                  &bull; Price sensitivity analysis suggested $2-3/can range,
                  consistent with actual retail pricing
                </li>
                <li>
                  &bull; The token incentive scored high as a differentiator,
                  which matched real-world repeat purchase rates
                </li>
              </ul>
            </div>
          </section>

          {/* What HypeTest couldn't predict */}
          <section className="mb-10">
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <h2 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  What HypeTest couldn&apos;t predict
                </h2>
              </div>
              <ul className="text-sm text-amber-700/80 dark:text-amber-400/70 space-y-2">
                <li>
                  &bull; The viral effect of the $REKT token incentive
                  (word-of-mouth amplification is hard to simulate)
                </li>
                <li>
                  &bull; Exact sales volume (AI panels predict intent, not
                  distribution or marketing execution)
                </li>
                <li>
                  &bull; The specific channels that drove most sales
                </li>
              </ul>
            </div>
          </section>

          <Separator className="mb-10" />

          {/* Key takeaway */}
          <section className="mb-10">
            <div className="bg-muted/40 rounded-2xl border border-border/50 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-primary mb-3">
                Key takeaway
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                HypeTest correctly identified this as a strong concept with high
                purchase intent and validated the price range. The results would
                have given a founder confidence to proceed with the launch. What
                HypeTest can&apos;t predict is execution quality, distribution,
                or viral mechanics like the $REKT token loop.
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center py-8">
            <Link
              href="/research/new"
              className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold px-8 h-12 text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Test your own product concept
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
