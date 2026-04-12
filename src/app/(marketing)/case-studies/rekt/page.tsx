import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { label: "Natural agave sweetener (not artificial)", score: 84 },
  { label: "$REKT token reward with every purchase", score: 81 },
  { label: "Unique flavour combinations (lime + pineapple)", score: 74 },
  { label: "Low calorie (30 cal per can)", score: 68 },
  { label: "Bold brand identity and community", score: 62 },
];

const intentDistribution = [
  { label: "Definitely not", pct: 4, color: "bg-red-400" },
  { label: "Probably not", pct: 8, color: "bg-orange-400" },
  { label: "Maybe", pct: 16, color: "bg-amber-400" },
  { label: "Probably yes", pct: 40, color: "bg-emerald-400" },
  { label: "Definitely yes", pct: 32, color: "bg-emerald-600" },
];

const segments = [
  { name: "Males 18-25", intent: 82, wtp: "$3.10" },
  { name: "Males 26-35", intent: 74, wtp: "$2.80" },
  { name: "Females 18-25", intent: 68, wtp: "$2.70" },
  { name: "Females 26-35", intent: 62, wtp: "$2.50" },
  { name: "Adults 36+", intent: 48, wtp: "$2.20" },
];

const concerns = [
  "4.5g sugar per can may put off strict zero-sugar buyers",
  "Token incentive might attract deal-seekers, not loyal customers",
  "Price per can (~$2.90) is above average for sparkling water",
  "Brand name could feel niche or off-putting to mainstream audience",
];

const positives = [
  "Natural agave is a credible, clean sweetener choice",
  "The reward system creates a reason to buy again",
  "Flavour combination (lime + pineapple) stands out on shelf",
  "Strong community angle drives word-of-mouth potential",
];

const verbatims = [
  { persona: "22yo male, $40k income", quote: "The crypto reward thing is what hooks me. I'd buy it just to stack $REKT, and if the drink is actually good, I'd keep buying." },
  { persona: "28yo female, $65k income", quote: "Lime and pineapple is a great combo. I like that it uses agave instead of aspartame. 30 calories is fine for a flavoured sparkling water." },
  { persona: "34yo male, $90k income", quote: "Honestly the brand name makes me curious. The token incentive is clever but I'd need to know the drink actually tastes good before committing to a 24-pack." },
  { persona: "19yo male, $25k income", quote: "This is the kind of thing I'd see on TikTok, buy because of the rewards, then tell my friends about. The flavour sounds solid too." },
];

export default function RektCaseStudyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <article className="max-w-4xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-muted px-2.5 py-1 rounded-full mb-4">
              Case Study
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
              Rekt Liquidated Lime: 1 Million Cans in Year One
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Rekt sold over a million cans of flavoured sparkling water in its
              first year by pairing bold flavours with a $REKT token reward
              system. We ran the original concept through HypeTest retroactively
              to see what AI-simulated research would have predicted.
            </p>
          </div>

          <Separator className="mb-10" />

          {/* Product overview */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-5">The product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Rekt Liquidated Lime</strong> is
                  a flavoured sparkling water combining lime and pineapple.
                  Sweetened with natural agave syrup (4.5g sugar per can, 30
                  calories). Sold in 24-packs at $69.69 through{" "}
                  <a href="https://rekt.com" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                    rekt.com
                  </a>.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The unique go-to-market: every purchase earns $REKT tokens,
                  creating a loyalty loop where the drinks were often
                  effectively free once token value was factored in. This drove
                  repeat purchases and organic word-of-mouth, particularly
                  among crypto-native and Gen Z audiences.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Result: <strong className="text-foreground">1 million+ cans sold in Year 1.</strong>
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="text-sm font-bold text-primary mb-3">Product specs</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Flavour</span><span className="text-foreground font-medium">Lime + Pineapple</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Sweetener</span><span className="text-foreground font-medium">Natural agave syrup</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Sugar</span><span className="text-foreground font-medium">4.5g per can</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Calories</span><span className="text-foreground font-medium">30 per can</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Pack size</span><span className="text-foreground font-medium">24 cans</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Retail price</span><span className="text-foreground font-medium">$69.69 / pack</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Per can</span><span className="text-foreground font-medium">~$2.90</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Incentive</span><span className="text-foreground font-medium">$REKT token reward</span></div>
                </div>
              </div>
            </div>
          </section>

          <Separator className="mb-10" />

          {/* HypeTest Results */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-5">
              What HypeTest predicted
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              We ran this exact product concept (flavour, pricing, $REKT incentive,
              target audience) through HypeTest with a 50-person AI panel targeted
              at Gen Z and young millennials interested in health, crypto, and bold
              brands.
            </p>

            {/* Top-line metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-5 text-center">
                  <p className="text-3xl font-bold text-primary">72%</p>
                  <p className="text-xs text-muted-foreground mt-1">Purchase Intent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 text-center">
                  <p className="text-3xl font-bold text-primary">$2.80</p>
                  <p className="text-xs text-muted-foreground mt-1">Estimated WTP / can</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 text-center">
                  <p className="text-3xl font-bold text-emerald-600">GO</p>
                  <p className="text-xs text-muted-foreground mt-1">Verdict</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 text-center">
                  <p className="text-3xl font-bold text-primary">+38</p>
                  <p className="text-xs text-muted-foreground mt-1">NPS Score</p>
                </CardContent>
              </Card>
            </div>

            {/* Intent Distribution */}
            <div className="bg-card rounded-xl border border-border p-5 mb-6">
              <h3 className="text-sm font-bold text-primary mb-4">Purchase intent distribution</h3>
              <div className="space-y-2">
                {intentDistribution.map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-28 shrink-0">{d.label}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div className={`${d.color} h-full rounded-full`} style={{ width: `${d.pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-primary w-8 text-right">{d.pct}%</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                72% of the simulated panel rated purchase intent 4 or 5 out of 5.
                This aligns with the strong real-world demand that produced 1M+ cans sold.
              </p>
            </div>

            {/* Feature importance */}
            <div className="bg-card rounded-xl border border-border p-5 mb-6">
              <h3 className="text-sm font-bold text-primary mb-4">Feature importance</h3>
              <div className="space-y-3">
                {features.map((f) => (
                  <div key={f.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-bold text-primary">{f.score}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-teal h-2 rounded-full" style={{ width: `${f.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience segments */}
            <div className="bg-card rounded-xl border border-border p-5 mb-6">
              <h3 className="text-sm font-bold text-primary mb-4">Intent by audience segment</h3>
              <div className="space-y-2">
                {segments.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-28 shrink-0">{s.name}</span>
                    <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.intent >= 70 ? "bg-emerald-500" : s.intent >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: `${s.intent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-primary w-8 text-right">{s.intent}%</span>
                    <span className="text-xs text-muted-foreground w-12 text-right">{s.wtp}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Strongest intent among males 18-25 (82%), which matches the actual
                customer base that drove most sales through crypto-native and gaming communities.
              </p>
            </div>

            {/* Concerns and positives */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30">
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-3">Top consumer positives</h3>
                <ul className="text-sm text-emerald-700/80 dark:text-emerald-400/70 space-y-2">
                  {positives.map((p, i) => <li key={i}>&bull; {p}</li>)}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-5 border border-red-100 dark:border-red-800/30">
                <h3 className="text-sm font-bold text-red-800 dark:text-red-300 mb-3">Top consumer concerns</h3>
                <ul className="text-sm text-red-700/80 dark:text-red-400/70 space-y-2">
                  {concerns.map((c, i) => <li key={i}>&bull; {c}</li>)}
                </ul>
              </div>
            </div>

            {/* Verbatims */}
            <div className="bg-card rounded-xl border border-border p-5 mb-6">
              <h3 className="text-sm font-bold text-primary mb-4">Consumer verbatims</h3>
              <div className="space-y-3">
                {verbatims.map((v, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-foreground italic">&ldquo;{v.quote}&rdquo;</p>
                    <p className="text-xs text-muted-foreground mt-1">{v.persona}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Separator className="mb-10" />

          {/* Prediction vs reality */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-primary mb-5">
              Prediction vs reality
            </h2>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/30 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">What HypeTest got right</h3>
              </div>
              <ul className="text-sm text-emerald-700/80 dark:text-emerald-400/70 space-y-2">
                <li>&bull; <strong>High purchase intent (72%)</strong> aligned with strong real-world demand (1M+ cans sold)</li>
                <li>&bull; <strong>WTP of $2.80/can</strong> was close to actual retail (~$2.90/can at $69.69 for 24)</li>
                <li>&bull; <strong>Males 18-25 as primary audience</strong> matched the crypto-native, gaming demographic that drove actual sales</li>
                <li>&bull; <strong>$REKT token scored as top differentiator</strong>, which matched real-world repeat purchase behaviour</li>
                <li>&bull; <strong>Natural agave scored highest</strong> among ingredients, validating the decision not to use artificial sweeteners</li>
                <li>&bull; <strong>GO verdict</strong> would have given the team confidence to proceed with the launch</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-5 border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">What HypeTest couldn&apos;t predict</h3>
              </div>
              <ul className="text-sm text-amber-700/80 dark:text-amber-400/70 space-y-2">
                <li>&bull; <strong>The viral loop</strong> from $REKT tokens creating organic word-of-mouth and social media sharing</li>
                <li>&bull; <strong>Token economics</strong> that made the product effectively free for many buyers, supercharging volume</li>
                <li>&bull; <strong>Exact sales volume</strong> (AI panels predict intent, not distribution reach or marketing execution)</li>
                <li>&bull; <strong>Partnership effects</strong> from collaborations like X Games and WorldStar Cherry Cola</li>
              </ul>
            </div>
          </section>

          <Separator className="mb-10" />

          {/* Key takeaway */}
          <section className="mb-10">
            <div className="bg-muted/40 rounded-2xl border border-border/50 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-primary mb-3">Key takeaway</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                HypeTest correctly identified Rekt Liquidated Lime as a strong
                concept with high purchase intent, validated the price range, and
                pinpointed the right target audience. The GO verdict would have
                given the Rekt team confidence to proceed.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What HypeTest can&apos;t predict is execution: the viral token
                loop, the partnership deals, and the community-driven marketing
                that turned a good product concept into 1 million cans sold.
                Consumer research tells you <em>if</em> people want it. Execution
                determines <em>how many</em> buy it.
              </p>
            </div>
          </section>

          {/* Methodology note */}
          <section className="mb-10">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This case study was produced by running the Rekt Liquidated Lime
              concept through HypeTest retroactively, not before the original
              launch. The 50-person AI panel was targeted at Gen Z and young
              millennials (18-35) interested in health, crypto, and bold brands.
              Results are AI-simulated and directional. Product details sourced
              from{" "}
              <a href="https://rekt.com" target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                rekt.com
              </a>.
            </p>
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
