# HypeTest Battle Test Audit - Part 1 (Sections 1A-1D)

**Date:** 2026-04-11
**Auditor:** Claude Opus 4.6 (automated)
**Scope:** CEO, CMO, CLO, CFO perspectives

---

## Section 1A: CEO Findings (Brand Risk, Claims, Positioning, Investor Perception)

### 🔴 CRITICAL — Live Anthropic API Key Committed in .env.local

- **File:** `.env.local`, line 1
- **Issue:** The file contains a real Anthropic API key (`sk-ant-api03-LzG...`), Supabase URL, and anon key. While `.env.local` is in `.gitignore`, it exists on disk and was readable by this audit. If this repo is ever shared, cloned to a new machine with a different .gitignore, or accessed by a collaborator, these secrets are exposed. The Anthropic key grants direct billing access.
- **Risk:** Unauthorized API usage, financial exposure, credential leak in any future repo migration.
- **Recommendation:** Rotate the Anthropic API key immediately. Confirm the key has not been committed in any git history (`git log -p -- .env.local`). Use a secrets manager or Vercel environment variables exclusively.

### 🟠 HIGH — Harvard R-squared Claim Prominently Featured Without Own Validation Data

- **Files:** `src/app/page.tsx` lines 55-62, 225-228, 468-472
- **Issue:** The landing page leads with "R-squared = 0.89" from Brand, Israeli & Ngwe (HBS Working Paper 23-062, 2025) as the primary credibility anchor. The disclaimers ("HypeTest is not affiliated with..."; "Illustrative chart... Not a representation of HypeTest validation data" at line 113) are present but visually subordinate. The hero badge says "Grounded in peer-reviewed research" (line 17) -- but an HBS Working Paper is not peer-reviewed (it is a pre-print). The methodology page says "hundreds of demographically-specific simulated consumers" (line 18) but free tier runs 50.
- **Risk:** If the HBS authors or Harvard counsel object, or if a journalist frames this as misleading, it becomes a brand-defining incident. Investors doing diligence will note the gap between "inspired by" and "validated by."
- **Recommendation:** (1) Change "peer-reviewed research" to "academic research" everywhere -- Working Papers are not peer-reviewed. (2) Publish HypeTest's own validation study, even a small one (run HypeTest on 5 products with known market data, publish R-squared). (3) Move the Harvard reference to the methodology page and lead the homepage with own data.

### 🟠 HIGH — "Used by founders of" Section Has Only Two Brands, Both Owned

- **File:** `src/app/page.tsx` lines 128-148
- **Issue:** The social proof bar shows Rekt and Snooz. Rekt is the parent company (Rekt Brands Inc. operates HypeTest per the Terms). Snooz appears to be another owned/affiliated brand. This is not genuine third-party social proof.
- **Risk:** Sophisticated buyers (startup founders, product managers) will recognize this immediately and lose trust. Investors will flag it as vanity metrics.
- **Recommendation:** Remove the "Used by founders of" section until there are genuine external customers, or reframe as "Built by the team behind Rekt" which is honest positioning.

### 🟡 MEDIUM — Rekt Product Featured as "Sample Report" on Landing Page

- **File:** `src/app/page.tsx` lines 342-435
- **Issue:** The landing page features a detailed sample report for "Rekt Energy + Focus Powder" with a direct Amazon link and a "1 million cans in Year 1" case study CTA. This blurs the line between product marketing for HypeTest and promotion of the parent company's product.
- **Risk:** Users may perceive HypeTest as a marketing tool for Rekt products rather than an independent research platform. Investor due diligence concern.
- **Recommendation:** Use a neutral, well-known product category example as the primary sample (the energy drink category example already exists above it). Move the Rekt case study to a dedicated `/case-studies` page.

### 🟡 MEDIUM — NEXT_PUBLIC_UNLOCK_PRO Flag in .env.local

- **File:** `.env.local` line 4
- **Issue:** `NEXT_PUBLIC_UNLOCK_PRO=true` is a client-exposed environment variable (NEXT_PUBLIC prefix). This may be bypassing plan restrictions during development but is exposed to the browser.
- **Risk:** If this flag gates Pro features client-side, any user can see it and understand the gating mechanism. If it's deployed to production, it may unlock Pro features for everyone.
- **Recommendation:** Confirm this flag is not in production env. Remove NEXT_PUBLIC prefix if it must exist; gate features server-side only.

---

## Section 1B: CMO Findings (Conversion Funnel, Copy, Social Proof, SEO, Email Capture)

### 🟠 HIGH — No Email Capture on Landing Page Before Research Flow

- **File:** `src/app/page.tsx` (entire file)
- **Issue:** The landing page has zero email capture mechanisms. Every CTA goes directly to `/research/new`. There is no newsletter signup, no lead magnet, no "get notified" form. The only email capture is the Team waitlist on the pricing page (line 590-638 of pricing/page.tsx). Visitors who are interested but not ready to run research are lost entirely.
- **Risk:** No way to nurture top-of-funnel traffic. No remarketing list. No way to announce features or convert later. Massive lead leakage.
- **Recommendation:** Add an email capture (e.g., "Get a sample report emailed to you") in the hero or after the sample report section. Even a simple "Join 500+ founders testing products with AI" capture bar would help.

### 🟠 HIGH — Pricing Page Checkout Modal Says "Stripe" but Uses LemonSqueezy

- **File:** `src/app/(marketing)/pricing/page.tsx` line 562; `src/app/api/billing/checkout/route.ts` (entire file)
- **Issue:** The checkout email modal says "You'll be redirected to Stripe to complete payment" but the actual checkout flow uses LemonSqueezy (`createCheckout` from `@lemonsqueezy/lemonsqueezy.js`). Users will land on a LemonSqueezy checkout page after being told it's Stripe.
- **Risk:** Immediate trust break at the most critical conversion moment. Users may abandon checkout thinking something is wrong.
- **Recommendation:** Change the copy to "You'll be redirected to our secure payment provider to complete payment" or update to reference LemonSqueezy by name.

### 🟡 MEDIUM — No SEO Metadata Visible in Page Components

- **Files:** `src/app/page.tsx`, `src/app/(marketing)/pricing/page.tsx`
- **Issue:** Neither file exports `metadata` or uses `generateMetadata`. The landing page and pricing page appear to have no custom title, description, or Open Graph tags defined in these components. (They may exist in a layout file, but the page-level overrides are missing.)
- **Risk:** Poor search engine rankings. Shared links on social media will show generic or missing previews.
- **Recommendation:** Add page-specific metadata exports to every marketing page, especially the landing page and pricing page.

### 🟡 MEDIUM — "Most popular" Badge on Pro Plan Without Evidence

- **File:** `src/app/(marketing)/pricing/page.tsx` line 219
- **Issue:** The Pro plan ($149/mo) is tagged "Most popular" but the product appears to be pre-revenue or very early revenue (only owned brands as social proof). This is a common SaaS pattern but is misleading if Pro is not actually the most-subscribed plan.
- **Risk:** Minor trust issue if questioned. Industry-standard practice but worth noting.
- **Recommendation:** Acceptable to keep for now; replace with real data ("Chosen by 60% of teams") once available.

### ⚪ LOW — Sample Report Uses Hardcoded Comparison Data

- **File:** `src/components/sample-report.tsx` lines 17-28
- **Issue:** The "traditional vs HypeTest" comparison uses hardcoded numbers (e.g., traditional 64% vs HypeTest 60% purchase intent). The footer disclaimer says "illustrative" but the side-by-side format implies a real validation.
- **Risk:** Minor. Adequately disclaimed on line 63-64 of sample-report.tsx.
- **Recommendation:** Consider labeling as "Simulated comparison" more prominently.

---

## Section 1C: CLO Findings (Terms Gaps, Privacy Compliance, GDPR/CCPA, Liability)

### 🔴 CRITICAL — No Cookie/Consent Banner Despite Sending Data to Third Parties

- **Files:** `src/app/(marketing)/privacy/page.tsx` lines 134-158
- **Issue:** The privacy policy lists Supabase, Vercel, Anthropic, and Resend as third-party data processors. User research inputs (potentially including confidential product ideas) are sent to Anthropic's API. Despite processing data through four third-party services, there is no cookie consent banner or data processing consent mechanism anywhere in the application. The privacy policy at Section 6 (line 163-172) says "We do not use tracking cookies" but this does not exempt the need for consent to send PII to third-party processors under GDPR.
- **Risk:** GDPR violation for EU users. The app collects name, email, company, role, and company size (line 31-37 of privacy) and sends research inputs to Anthropic without explicit consent. Fines up to 4% of annual turnover or 20M EUR.
- **Recommendation:** Implement a consent mechanism before data collection. At minimum, add a clear consent checkbox to the research submission form: "I agree that my data will be processed by HypeTest and its third-party providers as described in our Privacy Policy."

### 🟠 HIGH — No DPA (Data Processing Agreement) References for Sub-Processors

- **File:** `src/app/(marketing)/privacy/page.tsx` lines 134-158
- **Issue:** The privacy policy lists Anthropic, Supabase, Vercel, and Resend as sub-processors but does not reference DPAs with any of them. Under GDPR Article 28, data controllers must have DPAs with all processors.
- **Risk:** GDPR non-compliance. If an EU user's data is mishandled by a sub-processor, HypeTest has no contractual basis for accountability.
- **Recommendation:** Ensure DPAs are in place with all four sub-processors. Reference their availability in the privacy policy (e.g., "DPAs are available upon request").

### 🟠 HIGH — Research Results Publicly Accessible by URL Without Authentication

- **Files:** `src/app/(marketing)/terms/page.tsx` lines 114-132; `src/app/(marketing)/privacy/page.tsx` lines 100-108
- **Issue:** Both Terms (Section 6) and Privacy (Section 3) disclose that research results are publicly accessible to anyone with the URL. While this is disclosed, there is no opt-out mechanism, no password protection option, and no ability to make results private. Users submitting confidential product concepts have no way to restrict access.
- **Risk:** Trade secret exposure. A user testing a confidential product idea has results accessible to anyone who guesses or intercepts the URL. The disclaimer shifts liability but doesn't solve the problem.
- **Recommendation:** Add an option for authenticated-only access to research results, at minimum for paid plans. Consider making results private by default with an explicit "share" action.

### 🟠 HIGH — GDPR "Right to Object" and "Legal Basis" Not Specified

- **File:** `src/app/(marketing)/privacy/page.tsx` lines 178-202
- **Issue:** Section 7 mentions GDPR rights generically but does not specify the legal basis for processing (consent, legitimate interest, contractual necessity). GDPR Article 13 requires disclosure of the legal basis. The right to object is mentioned but there is no process described beyond emailing support.
- **Risk:** Non-compliance with GDPR transparency requirements. A supervisory authority could find the privacy policy inadequate.
- **Recommendation:** Add a "Legal Basis for Processing" section specifying: contractual necessity for research delivery, legitimate interest for service improvement, consent for marketing communications.

### 🟡 MEDIUM — No CCPA "Do Not Sell" Link or Opt-Out Mechanism

- **File:** `src/app/(marketing)/privacy/page.tsx` lines 197-202
- **Issue:** The CCPA section states "We do not sell personal information" but provides no "Do Not Sell My Personal Information" link as required by CCPA for businesses meeting the threshold. While HypeTest may not currently meet the CCPA threshold (50k+ consumers/year), the policy should be prepared.
- **Risk:** Low currently if under threshold, but non-compliant if the user base grows.
- **Recommendation:** Add a "Do Not Sell" link in the footer preemptively. It's cheap to implement and avoids scrambling later.

### 🟡 MEDIUM — Terms Lack Refund/Cancellation Policy

- **File:** `src/app/(marketing)/terms/page.tsx` (entire file)
- **Issue:** The Terms of Service have no section on refunds, cancellation, or billing disputes for paid plans ($49-$349/mo). Section 10 (Modifications) says HypeTest can "suspend or discontinue" the service at any time, but there is no reciprocal right for users to cancel or get prorated refunds.
- **Risk:** Chargeback disputes with no policy to reference. Consumer protection issues in jurisdictions requiring clear refund policies (EU Consumer Rights Directive requires 14-day cooling-off period for digital services).
- **Recommendation:** Add a "Billing and Cancellation" section covering: cancellation process, whether refunds are prorated, what happens to data upon cancellation.

### 🟡 MEDIUM — "Hundreds of" Consumers Claim on Methodology Page vs Actual 50

- **File:** `src/app/(marketing)/methodology/page.tsx` line 18
- **Issue:** The methodology page states "running structured survey methodology through hundreds of demographically-specific simulated consumers." The free tier uses 50 panelists, Starter uses 50, and Pro/Team use 100. None reach "hundreds" (plural).
- **Risk:** Potential false advertising claim. A competitor or regulator could challenge this.
- **Recommendation:** Change to "dozens to over a hundred" or specify the exact range per plan.

### ⚪ LOW — No Age Verification Mechanism Despite 18+ Requirement

- **File:** `src/app/(marketing)/privacy/page.tsx` lines 209-214
- **Issue:** The Children section states the service is not for under-18s but there is no age verification gate.
- **Risk:** Low for a B2B-oriented SaaS, but technically non-compliant with the stated policy.
- **Recommendation:** Add an age confirmation checkbox during signup if desired; otherwise acceptable risk.

---

## Section 1D: CFO Findings (API Cost, Margins, Revenue Leakage, Quota Enforcement, Billing)

### 🔴 CRITICAL — Free Tier API Cost Per Research Run is ~$0.25-0.50 With Zero Revenue

- **Files:** `src/lib/research-engine.ts` lines 13-14, 196-198; `src/lib/lemonsqueezy.ts` line 8
- **Issue:** Each free research run makes:
  - 50 persona queries (500 max_tokens each) to `claude-haiku-4-5-20251001`
  - ~4 additional aggregation/analysis calls (300-500 max_tokens each)
  - ~54 total API calls per run
  
  At Haiku 4.5 pricing (~$0.25/MTok input, ~$1.25/MTok output), with prompts ~1500 tokens input + 500 tokens output each:
  - Input: 54 calls x ~1500 tokens = ~81K input tokens = ~$0.02
  - Output: 54 calls x ~400 tokens = ~21.6K output tokens = ~$0.027
  - **Total per run: ~$0.05** (Haiku is cheap)
  
  However, free users get 3 runs/month with no revenue. At scale, with 1000 free users doing 3 runs each: 3000 runs x $0.05 = **$150/month in pure cost** with zero revenue.
  
  Pro users at 100 runs with 100 panelists: ~$0.10/run x 100 = $10/month cost against $149 revenue = healthy margin.
- **Risk:** Free tier is sustainable at current scale but becomes a cost sink at growth. The unit economics are sound for paid tiers.
- **Recommendation:** Monitor free-tier usage closely. Consider reducing free tier to 2 runs or 30 panelists if cost grows. The paid tier margins (~93%+ gross margin) are excellent.

### 🔴 CRITICAL — A/B Test Route Charges 2 Credits but Race Condition on incrementUsage

- **File:** `src/app/api/ab-test/route.ts` lines 130-131
- **Issue:** The A/B test route calls `incrementUsage(email, "research")` twice in succession with `.catch(console.error)`. Both calls are fire-and-forget (non-awaited). The quota check on line 64-65 checks `quota.remaining < 2` but this check happens before the research runs. If two A/B tests are submitted simultaneously by the same user, both could pass the quota check before either increment executes, resulting in consuming 4 credits while only 2 were available.
- **Risk:** Revenue leakage via over-consumption on paid plans. Free users could get extra runs.
- **Recommendation:** (1) Await the incrementUsage calls and do them BEFORE running the expensive research. (2) Use a single atomic increment of 2 instead of two separate calls. (3) Ideally, reserve credits before execution and release on failure.

### 🟠 HIGH — Usage Increment is Fire-and-Forget Across All Routes

- **Files:** `src/app/api/research/route.ts` line 156; all API routes
- **Issue:** Every route calls `incrementUsage(email, "research").catch(console.error)` AFTER the research has completed and the result has been returned. This means:
  1. If the increment fails (DB error, network issue), usage is never counted -- free runs.
  2. The research completes and returns before usage is tracked, creating a window for abuse.
  3. There's a race condition: a user could fire multiple requests simultaneously, all passing the quota check before any increment lands.
- **Risk:** Systematic under-counting of usage. Users on the free plan could get significantly more than 3 runs by rapid-firing requests.
- **Recommendation:** Increment usage BEFORE running research (optimistic deduction). If research fails, decrement. This is the standard pattern for quota-gated services.

### 🟠 HIGH — Checkout Endpoint Has No Authentication

- **File:** `src/app/api/billing/checkout/route.ts` (entire file)
- **Issue:** The checkout endpoint accepts any email + plan combination with no authentication. Anyone can create a checkout session for any email address. While LemonSqueezy handles payment security, the `getOrCreateUser(email)` call on line 19 means submitting a checkout request for a random email creates a user record in the database.
- **Risk:** Database pollution -- bots or attackers could create thousands of user records by hitting the checkout endpoint. No financial risk (LemonSqueezy handles payment) but operational/data integrity risk.
- **Recommendation:** Add rate limiting to the checkout endpoint. Require authentication (Supabase session) or at minimum email verification before creating checkout sessions.

### 🟠 HIGH — Webhook Signature Verification Uses Simple String Comparison (Not Timing-Safe)

- **File:** `src/app/api/billing/webhook/route.ts` lines 11-15
- **Issue:** The webhook signature comparison on line 15 uses `digest !== signature` which is a simple string equality check, not a timing-safe comparison. This is vulnerable to timing attacks where an attacker can determine the correct signature byte-by-byte by measuring response times.
- **Risk:** An attacker could forge webhook events to upgrade their plan to Pro/Team without paying, or downgrade others' plans.
- **Recommendation:** Use `crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))` instead of `!==`.

### 🟡 MEDIUM — Webhook Subscription_Updated Only Checks for Email in Active Status

- **File:** `src/app/api/billing/webhook/route.ts` lines 42-62
- **Issue:** In the `subscription_updated` handler, when status is "active" (line 43), it only updates if `email` exists in custom_data. But LemonSqueezy `subscription_updated` events for renewals may not include custom_data. The fallback to find by subscription_id only exists in the cancelled/expired branch (lines 49-59), not the active branch.
- **Risk:** If a subscription renews and the webhook fires `subscription_updated` with status "active" but without custom_data email, the update silently fails. The user keeps their plan (no immediate issue) but the subscription_id might not be updated.
- **Recommendation:** Add a fallback lookup by subscription_id in the "active" branch, same as the cancelled branch.

### 🟡 MEDIUM — Discovery Runs Not Gated Properly for Starter Plan

- **File:** `src/lib/lemonsqueezy.ts` line 9; `src/app/(marketing)/pricing/page.tsx` line 93
- **Issue:** The PLANS definition gives Starter `discoveryLimit: 10`, but the pricing page feature table shows Discovery as a Pro-only feature (lines 91-98 show all discovery features as `false` for Starter). If Starter users have 10 discovery credits in the backend but the UI says they don't have access, either the backend is over-permissive or the pricing page is under-selling.
- **Risk:** Either revenue leakage (Starter users get Discovery they shouldn't) or a missed upsell (Starter users could be offered limited Discovery).
- **Recommendation:** Align the PLANS definition with the pricing page. If Discovery is Pro-only, set Starter discoveryLimit to 0. If Starter should get some Discovery, update the pricing page.

### 🟡 MEDIUM — Database Column Names Reference "Stripe" but System Uses LemonSqueezy

- **Files:** `src/lib/users.ts` lines 11-12; `src/app/api/billing/webhook/route.ts` line 35
- **Issue:** User model has `stripe_customer_id` and `stripe_subscription_id` columns, with a comment in the webhook (line 35) saying "reuse column for LS customer ID." This is a tech debt indicator but also means anyone reading the database schema would assume Stripe integration.
- **Risk:** Confusion during onboarding of new developers or during investor technical due diligence. No functional risk.
- **Recommendation:** Rename columns to `payment_customer_id` and `payment_subscription_id` via a migration.

### ⚪ LOW — Team Plan ($349/mo) Listed but Not Yet Available

- **Files:** `src/lib/lemonsqueezy.ts` line 11; `src/app/(marketing)/pricing/page.tsx` line 49
- **Issue:** Team plan is defined in PLANS with a price of $34,900 (cents) but the pricing page shows it as waitlist-only. The `LEMONSQUEEZY_TEAM_VARIANT_ID` environment variable may not exist, which would cause the checkout to fail gracefully (line 15 of checkout/route.ts).
- **Risk:** None currently. But if the variant ID is set without the waitlist gate being enforced server-side, users could subscribe to Team prematurely.
- **Recommendation:** Ensure server-side validation rejects "team" plan checkouts until launch.

---

## Summary

| Persona | Critical | High | Medium | Low |
|---------|----------|------|--------|-----|
| CEO     | 1        | 2    | 2      | 0   |
| CMO     | 0        | 2    | 2      | 1   |
| CLO     | 1        | 3    | 3      | 1   |
| CFO     | 2        | 3    | 3      | 1   |
| **Total** | **4**  | **10** | **10** | **3** |

**Top 3 actions by urgency:**
1. Rotate the exposed Anthropic API key in `.env.local` and verify it was never committed to git history.
2. Fix webhook signature verification to use timing-safe comparison (`crypto.timingSafeEqual`).
3. Move usage increment to BEFORE research execution across all API routes to close the quota bypass race condition.
