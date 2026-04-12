# HypeTest Battle Test -- Sections 3 & 4

---

## Section 3: Consumer Perspectives

---

### 3A: Startup Entrepreneur

**Persona:** Bootstrapped founder, pre-revenue, testing a DTC product idea. Budget-conscious, time-poor, needs signal fast. Probably found HypeTest via Twitter or Product Hunt.

#### Journey Map

1. Lands on homepage --> reads "Consumer research in minutes, not months" --> immediately relevant
2. Sees "Try it free, no credit card" --> clicks through to `/research/new`
3. Fills in product details --> gets report in ~2 minutes
4. Reviews report --> decides whether idea has legs
5. If promising --> needs next steps (pricing test, name test, A/B test)

#### Findings

**[3A-01] STRONG: Zero-friction first run.** No credit card, no signup wall before seeing value. The "Try it free, no credit card" CTA is the exact right messaging for a bootstrapped founder. Google OAuth or email-only are both available. This is best-in-class onboarding for a PLG tool.

**[3A-02] STRONG: Form is well-designed with smart defaults.** Category selection auto-fills target consumer and competitors via `CATEGORY_DEFAULTS`. The URL auto-fill feature (`handleExtract`) reduces friction further. The "Research quality" indicator gamifies completeness. This founder will fill in more fields because the UI rewards it.

**[3A-03] STRONG: Sample report exists.** Link to `/research/sample-rekt` is right on the form page ("View a sample report"). The founder can see what they will get before investing effort. This is a confidence-builder.

**[3A-04] CONCERN: No guidance on what to do with results.** The report delivers data (purchase intent, WTP, feature importance, concerns, verbatims, Go/No-Go scorecard) but the founder doesn't know what a "good" score is without benchmarks. The `categoryBenchmark` field exists in `report-view.tsx` and fetches live benchmarks, which helps -- but only if the category has enough data. For niche categories, benchmarks may be empty or misleading.

**[3A-05] CONCERN: 3 free runs per month is tight for iteration.** A startup founder testing an idea will want to iterate: test version A, tweak based on concerns, test version B. Three runs gets consumed in a single sitting. The next tier is $49/mo (Starter, 30 runs) -- that is a steep jump for a pre-revenue founder who just discovered the tool.

**[3A-06] GAP: No "save and come back" on the form.** If the founder is interrupted mid-form (common for bootstrapped founders), there is no draft-saving. All form state is local React state. Leaving the page loses everything. The form has 9+ fields -- non-trivial to re-enter.

**[3A-07] GAP: Follow-up email is delayed.** The cron job runs daily at 9 AM (`vercel.json`: `"0 9 * * *"`). If the founder runs a test at 10 AM, the follow-up suggesting next steps arrives the next morning. The moment of highest intent is immediately after viewing results. The follow-up email should fire inline or within minutes, not 23 hours later.

**[3A-08] CONCERN: No in-app "what to do next" after results.** The follow-up email (`sendFollowUpEmail`) contains smart next-step suggestions (if score >= 60: test pricing, A/B test, name test; if < 60: try different concept, find audience, discover). But these suggestions are ONLY in the email. The report page itself (`report-view.tsx`) does not surface contextual next steps based on the score. The founder has to wait for an email to get guidance that should be in the UI.

**[3A-09] MINOR: Methodology page oversells academic rigor.** The hero references "R-squared = 0.89" from an HBS working paper, but the landing page disclaimer says "Illustrative chart inspired by findings... Not a representation of HypeTest validation data." A skeptical founder may find this contradictory. The methodology page honestly discloses limitations ("Where HypeTest has limits") which is good, but the landing page scatter plot feels misleading.

---

### 3B: Fortune 500 CPO (Chief Product Officer)

**Persona:** VP/SVP Product at a large enterprise. Has budget but needs procurement-friendly pricing, SOC 2 compliance signals, team collaboration, and integration with existing workflows. Evaluating HypeTest as a complement to (not replacement for) Qualtrics/Ipsos.

#### Journey Map

1. Learns about HypeTest from a direct report or conference
2. Visits homepage --> checks methodology and credibility
3. Looks at pricing --> evaluates Team plan
4. Needs: SSO, team seats, audit trail, data export, SLA
5. Wants to pilot with one team before rolling out

#### Findings

**[3B-01] BLOCKER: Team plan is "coming soon" (waitlist only).** The `plans` array shows Team at $349/mo but with `isWaitlist: true`. The CTA is "Join waitlist" which scrolls to an email capture form. A Fortune 500 CPO will not wait. They will evaluate a competitor that is ready now.

**[3B-02] BLOCKER: No enterprise security signals.** No mention of SOC 2, GDPR compliance, data retention policies, or where data is processed. The privacy page exists but enterprise buyers need explicit security documentation. There is no `/security` page.

**[3B-03] BLOCKER: No SSO/SAML.** Auth is Google OAuth or magic link email only (Supabase auth). No SAML, no SCIM, no directory sync. Enterprise procurement will flag this.

**[3B-04] BLOCKER: No API access.** A Fortune 500 CPO would want to integrate HypeTest into their product development workflow (Jira, Confluence, internal tools). There is no public API, no webhooks (beyond Slack), no Zapier integration. The only programmatic surface is the internal REST API.

**[3B-05] CONCERN: Shared report links have no access control.** The email report says "This link is permanent and accessible to anyone who has it." Enterprise users need access-controlled sharing -- not public URLs. Sensitive product concepts being tested could leak via these links.

**[3B-06] CONCERN: No audit trail or admin controls.** The `account/page.tsx` shows individual account management. There is no team admin view, no usage analytics across team members, no role-based access control.

**[3B-07] GAP: Slack integration is the only workflow integration.** The pricing page lists "Slack notifications" as a Starter+ feature. But enterprise teams also need: email digests, Notion/Confluence integration, CSV/Excel export (beyond PDF), and calendar scheduling for recurring research.

**[3B-08] MINOR: Pro plan at $149/mo (1 seat) is awkward for enterprise.** If the CPO wants to pilot with 3 people, they need either 3 Pro subscriptions ($447/mo) or the non-existent Team plan. There is no way to add seats to Pro.

---

### 3C: Mid-Market CPO

**Persona:** Head of Product at a 100-500 person company. Has some budget, team of 5-15 PMs. Needs to validate concepts faster than the current process (customer interviews + surveys). Pragmatic buyer.

#### Journey Map

1. Lands on homepage --> attracted by speed and cost savings
2. Runs a free test to evaluate quality
3. If impressed --> considers Starter ($49) or Pro ($149)
4. Wants team to adopt --> looks at collaboration features
5. Evaluates against existing tools (SurveyMonkey, Typeform, UserTesting)

#### Findings

**[3C-01] STRONG: Price-to-value ratio is compelling.** $149/mo for 100 research runs + Pro tools (ad testing, logo testing, audience finder, competitive teardown, product discovery) is dramatically cheaper than any traditional research alternative. This is a very easy budget approval for a mid-market CPO.

**[3C-02] STRONG: Tool breadth is impressive.** Nine distinct research tools across the dashboard (`ALL_TOOLS` in `dashboard/page.tsx`): Consumer Research, A/B Testing, Name Testing, Pricing Optimizer, Ad Testing, Logo Testing, Product Discovery, Audience Finder, Competitive Teardown. This covers most of the product development cycle.

**[3C-03] CONCERN: No collaboration features on Starter or Pro.** "Shared research library" is Team-only. Pro is 1 seat. If the CPO's PM team runs individual accounts, there is no way to see each other's research, build on previous findings, or avoid duplicate tests. This is a real workflow problem for a team of PMs.

**[3C-04] CONCERN: No comparison or trend tracking across runs.** The dashboard (`dashboard/page.tsx`) lists past research results but there is no way to compare two runs side-by-side (e.g., v1 vs v2 of a concept after addressing concerns). "Performance tracking over time" is listed as a Starter+ feature in the pricing table, but the dashboard implementation shows a flat list of results with no trend visualization.

**[3C-05] GAP: No onboarding flow.** After signing up and running the first test, there is no guided onboarding. No "here is what you can do next" wizard, no email sequence introducing features, no in-app tooltips. The only onboarding email is the result delivery (`sendResearchReport`) and the follow-up cron. A mid-market buyer needs to see the full value of the toolkit to justify the spend to their CFO.

**[3C-06] GAP: Dashboard does not show research quality or ROI.** A mid-market CPO needs to justify the spend. The dashboard shows a list of past tests but doesn't summarize: total tests run, average purchase intent across products tested, concepts killed vs advanced, or estimated time/money saved. This makes renewal harder.

**[3C-07] CONCERN: Category list is narrow.** The form offers 9 categories: Food & Beverage, Health & Wellness, Technology, Fashion & Apparel, Home & Garden, Beauty & Personal Care, Education, Finance, Other. A mid-market company in B2B SaaS, logistics, construction, insurance, etc. is forced into "Other" which likely degrades the AI panel's accuracy (no category-specific defaults, potentially weaker benchmarks).

---

### 3D: Random Idea Person

**Persona:** Someone with a shower thought -- "What if there was an app that..." Not a business person. Found HypeTest via a blog post or social share. No budget, no technical knowledge, just curiosity.

#### Journey Map

1. Arrives at homepage --> "Consumer research in minutes, not months" -- sounds cool
2. Clicks "Try it free, no credit card"
3. Stares at form asking for product name, problem, features, differentiator...
4. Gets overwhelmed or fills in vague answers
5. Gets a report --> not sure what to do with it

#### Findings

**[3D-01] STRONG: The "Auto-fill from URL" is irrelevant but harmless.** This person does not have a URL. But the form gracefully handles this -- URL auto-fill is clearly optional and separated from the main form with a divider.

**[3D-02] CONCERN: Form is too structured for an idea-stage person.** The form requires: Product Name (required), Problem (required), and asks for Features, Differentiator, Target Consumer, Competitors, Pricing. An idea-stage person has "an app that matches dog walkers with busy professionals" -- they don't know their differentiator, competitive set, or pricing. The form is designed for someone who has already done some thinking.

**[3D-03] STRONG: Product Discovery is the right tool but is paywalled.** The landing page has a callout: "Don't have a product yet? Use Product Discovery to find what your audience actually wants." This is exactly what the Random Idea Person needs. But Product Discovery requires Pro ($149/mo). There is no way for a casual idea person to access this tool, even as a one-time trial.

**[3D-04] CONCERN: Non-authenticated flow requires too much PII.** If the idea person does not sign in with Google, the form demands: Name (required), Work email (required), Company (required), Role (required). An idea person does not have a "company" or "work email." This feels enterprise-y and will cause bounce. The `required` attribute on company and work email will literally block form submission.

**[3D-05] GAP: No "idea mode" or simplified input.** Something like: "Describe your idea in one sentence, and we will structure it for you." The existing form assumes the user can decompose their idea into problem/features/differentiator. An AI pre-processing step that takes free-text and populates the form fields would dramatically improve this persona's experience.

**[3D-06] CONCERN: Report is too sophisticated for a casual user.** Purchase intent scores, WTP ranges, feature importance rankings, consumer verbatims, Go/No-Go scorecards, demographic segment breakdowns -- this is professional research output. The idea person wants a simple answer: "Is this a good idea? Yes/No. Here is why." The Go/No-Go scorecard partially addresses this but is buried among dense data.

**[3D-07] MINOR: Three free runs is generous for this persona.** The idea person will likely only ever run one test. Three runs per month is more than enough. But if they run out and want to try another idea, the $49/mo jump is not happening.

---

## Section 4: SaaS Revenue Analysis

### 4A: Revenue Expert

---

#### 4A-01: Pricing Architecture

**Current structure:**
| Plan | Price | Research Runs | Discovery Runs | Key Feature Gate |
|------|-------|---------------|----------------|------------------|
| Free | $0 | 3/mo | 0 | Core research only |
| Starter | $49/mo | 30/mo | 10/mo | A/B, Name, Pricing tools |
| Pro | $149/mo | 100/mo | 50/mo | All tools + audience, competitive, ad, logo |
| Team | $349/mo | 500/mo | 200/mo | 5 seats + shared library (WAITLIST) |

**[4A-01a] RISK: No annual pricing.** There is zero mention of annual billing anywhere in the codebase. No discount for annual commitment. This means:
- Higher churn (monthly subscribers cancel more easily)
- Lower LTV (no upfront cash collection)
- No price anchoring ("$39/mo billed annually" vs "$49/mo monthly")
- Missing the most basic SaaS pricing optimization

**[4A-01b] RISK: No usage-based pricing component.** The model is purely seat + feature + quota. There is no overage billing, no per-run pricing above the cap, no credit system. When a Starter user hits 30 runs, they are hard-blocked with an error message: "You've used all 30 research runs this month on the starter plan. Upgrade at hypetest.ai/pricing for more." This is a cliff, not a ramp. Revenue is left on the table from power users who would pay per-run rather than upgrading tiers.

**[4A-01c] CONCERN: Free-to-Starter gap is steep.** $0 to $49/mo is a 100% -> infinity% price increase. For the tool's current feature set (AI-generated research), many users will question whether the Starter tools (A/B testing, name testing, pricing optimizer) are worth $49/mo when the core value (consumer research) is free. Consider: a $19/mo "Lite" plan with 10 runs and one Starter tool, or a one-time purchase option for individual runs.

**[4A-01d] STRONG: Feature gating is well-structured.** The tiering is logical: Free = core research, Starter = testing tools (A/B, name, pricing), Pro = strategic tools (discovery, audience, competitive, ad, logo). Each tier adds genuinely new capabilities rather than just more of the same. This gives users reasons to upgrade beyond volume.

---

#### 4A-02: Conversion Funnel

**[4A-02a] STRONG: Zero-friction entry point.** Landing page -> form -> results with no mandatory signup. The `isAuthUser` check on the form only shows the name/email/company fields for non-authenticated users. Users can submit without creating an account (just an email). This is excellent for top-of-funnel.

**[4A-02b] CONCERN: No in-app upgrade prompt at the moment of highest intent.** When a user gets a strong result (high purchase intent), they are most likely to want to test further. But the report page does not contain contextual upsell CTAs like "Your product scored 72% purchase intent -- test your pricing to maximize revenue (Starter plan)." The follow-up email has these suggestions but arrives up to 24 hours later (daily cron at 9 AM).

**[4A-02c] RISK: Checkout flow for non-authenticated users is clunky.** On the pricing page, clicking "Get Starter" or "Get Pro" when not logged in opens a modal asking for email, then redirects to LemonSqueezy checkout. The user has to enter their email twice (once in the modal, once at checkout). Authenticated users skip the modal -- but many prospects hitting the pricing page directly from Google won't be logged in.

**[4A-02d] GAP: No trial of paid features.** There is no way to try A/B testing, name testing, or pricing optimizer before paying. No 7-day trial, no single free run of a paid tool. Users must commit to $49/mo on faith. Adding one free run of each Starter tool would dramatically improve conversion.

**[4A-02e] CONCERN: Pricing page mentions "Stripe" but billing is LemonSqueezy.** The checkout email modal says "You'll be redirected to Stripe to complete payment" (`src/app/(marketing)/pricing/page.tsx` line 562) but the actual checkout uses LemonSqueezy (`src/app/api/billing/checkout/route.ts`). This is a trust-breaking inconsistency.

---

#### 4A-03: Expansion Revenue

**[4A-03a] CONCERN: No natural upgrade trigger.** The quota check (`checkQuota` in `users.ts`) hard-blocks at the limit. There is no "you have 2 runs remaining this month" warning, no proactive email at 80% usage, no in-app nudge. The user hits the wall and gets an error. This is a frustrating experience that can cause churn rather than upgrade.

**[4A-03b] GAP: No add-on purchases.** No ability to buy extra runs without upgrading the full plan. No one-time research packs. No "buy 10 more runs for $20" option. This means users who are between tiers have no spending path.

**[4A-03c] GAP: No seat expansion on Pro.** Pro is 1 seat. If a user wants to add a colleague, they must either wait for Team (waitlist) or have the colleague create a separate account. There is no "add a seat for $X/mo" option.

**[4A-03d] MISSED OPPORTUNITY: Discovery-to-Research upsell loop is weak.** Product Discovery (Pro) generates concepts. The natural next step is to run Consumer Research on the best concept. But there is no one-click "Test this concept" button that pre-fills the research form from a Discovery result. This cross-tool flow is where expansion revenue lives.

---

#### 4A-04: Retention Hooks

**[4A-04a] WEAK: Only one automated retention touchpoint.** The follow-up email cron is the ONLY automated re-engagement mechanism. It fires once per research run, 24+ hours later. There are no:
- Weekly/monthly email digests summarizing research activity
- "You haven't run a test in 2 weeks" re-engagement emails
- In-app notifications about new features or tools
- Benchmark updates ("Your category's average purchase intent changed")

**[4A-04b] CONCERN: No data moat or switching cost.** All reports are accessible via shareable links. There is no proprietary data that accumulates over time (e.g., company-specific consumer profiles, historical trend analysis, competitive intelligence database). A user can cancel and lose nothing except access to run new tests. Past results remain accessible.

**[4A-04c] GAP: No "research library" for non-Team users.** The dashboard shows a flat list of past results but there is no tagging, searching, filtering, or organizing capability. Over time, a user's research history becomes an asset -- but only if they can find and reference it. Making the library more powerful for paid users would increase stickiness.

**[4A-04d] GAP: No integration lock-in.** Slack webhook is the only integration. No CRM integration, no Notion/Confluence, no Jira. Enterprise users who embed HypeTest into their workflow become harder to cancel. Currently there is almost nothing to embed.

---

#### 4A-05: Growth Loops

**[4A-05a] WEAK: No referral program.** There is no "invite a friend" mechanism, no referral credits, no viral coefficient driver. For a product that delivers shareable reports, this is a significant missed opportunity.

**[4A-05b] PARTIAL: Shareable report links are a passive growth loop.** Reports are public via shareable URLs. If a founder shares their HypeTest report with investors or advisors, those viewers become aware of HypeTest. But there is no CTA on shared reports to encourage viewers to run their own test. The `report-view.tsx` component does not include a "Run your own test" prompt for non-owners viewing a shared link.

**[4A-05c] GAP: No content/SEO growth loop.** No public report gallery, no "trending products tested" page, no aggregate insights ("What consumers think about energy drinks in 2026"). The data HypeTest generates could be an SEO asset but it is entirely private.

**[4A-05d] GAP: No community or network effects.** No forum, no Slack community, no user showcase. For a research tool, community around methodology and best practices would drive retention and word-of-mouth.

---

#### 4A-06: Revenue Risks

**[4A-06a] CRITICAL: LemonSqueezy billing with Stripe references.** The codebase uses LemonSqueezy for billing (`lemonsqueezy.ts`, `billing/checkout/route.ts`, `billing/webhook/route.ts`) but the pricing page UI says "Stripe" and the database columns are named `stripe_customer_id` and `stripe_subscription_id` (reused for LS IDs per the comment in the webhook: "reuse column for LS customer ID"). This suggests a migration from Stripe to LemonSqueezy that was not fully cleaned up. The user-facing "Stripe" mention is incorrect and could confuse customers.

**[4A-06b] RISK: No dunning management.** The webhook handles `subscription_cancelled` and `subscription_expired` by downgrading to free. But there is no failed payment recovery flow -- no email to the user saying "your payment failed, update your card," no grace period, no retry logic. LemonSqueezy may handle some of this natively, but the app has no awareness of payment failures.

**[4A-06c] RISK: Free tier may be too generous.** 3 research runs/month with full report (purchase intent, WTP, features, concerns, verbatims, Go/No-Go, demographics, benchmarks) plus shareable links and PDF export. This is a complete research report that many users (especially idea-stage founders and students) will never need to exceed. The free tier should either reduce the report depth (e.g., no verbatims, no demographic breakdown) or reduce to 1 run/month to create more upgrade pressure.

**[4A-06d] RISK: Month reset logic has a subtle issue.** In `users.ts`, the reset check uses `new Date() >= resetAt`. The reset date is set to the 1st of the next month. But if a user's first run is on January 31st, `month_reset_at` is set to February 1st. If they run a second test on February 1st, the reset fires immediately, giving them a fresh 3 runs. This is slightly generous but not catastrophic. However, the reset logic runs on every `getOrCreateUser` call, which means it only fires when the user is active. Inactive users don't get reset, which is fine.

**[4A-06e] RISK: No revenue from the highest-value persona.** The Fortune 500 / enterprise buyer (Section 3B) has the highest willingness to pay but cannot buy. Team plan is waitlist-only. No enterprise plan, no custom pricing, no "Contact Sales" with a calendly link. The pricing page only offers `support@hypetest.ai` as a contact. Enterprise deals that could be $10k-50k/year are being lost to inaction.

**[4A-06f] CONCERN: Cost of goods scales linearly with revenue.** Every research run calls an LLM API (likely Claude or GPT-4) to simulate 50-100 consumer personas. As usage grows, LLM costs grow proportionally. There is no caching of similar queries, no lighter model for common categories, no progressive enhancement where the first pass uses a cheaper model and deeper analysis uses the expensive one. At scale, margins could compress significantly.

---

### Summary: Top 10 Highest-Impact Findings

| # | Tag | Finding | Impact |
|---|-----|---------|--------|
| 1 | 4A-01a | No annual pricing | Revenue, LTV |
| 2 | 4A-02b | No in-app upgrade prompt at moment of intent | Conversion |
| 3 | 3A-07 / 4A-04a | Follow-up email delayed 24hrs, only retention touchpoint | Retention, Conversion |
| 4 | 3B-01 / 4A-06e | Team/Enterprise plan not available | Revenue ceiling |
| 5 | 4A-02d | No trial of paid features | Conversion |
| 6 | 4A-03a | Hard block at quota with no warning | Churn risk |
| 7 | 4A-06a | LemonSqueezy billing with Stripe UI references | Trust |
| 8 | 3A-08 | No contextual next steps in report UI | Activation |
| 9 | 3C-03 | No collaboration on Starter/Pro | Team adoption |
| 10 | 3D-04 | Non-auth form requires Company/Work email (blocks casual users) | Top-of-funnel |
