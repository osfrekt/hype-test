# HypeTest Battle Test Audit -- Part 2
## Sections 1E (CXO), 1F (CTO), 1G (CCO)
**Date:** 2026-04-11
**Auditor:** Claude Opus 4.6

---

## Section 1E -- CXO (Chief Experience Officer)

### User Journey: New Visitor (Anonymous)

1. **🟠 No Footer on research form or results pages.** The `/research/new/page.tsx` and `/research/[id]/page.tsx` pages never import or render `<Footer>`. The footer contains legal links (Terms, Privacy), academic references, and the company copyright. A new visitor who enters via `/research/new` (the primary CTA) never sees the footer unless they navigate elsewhere. Same for all `/*/new/` tool pages and their result pages.
   - Files: `src/app/research/new/page.tsx`, `src/app/research/[id]/page.tsx`
   - Compare with: `src/app/page.tsx` (line 663), `src/app/dashboard/page.tsx` (line 536) which DO include `<Footer />`

2. **🟠 Mobile nav is a flat wall of 9 tools with no tier badges.** Desktop nav groups tools by tier (Free/Starter/Pro) with colored badges. The mobile hamburger menu (lines 246-285 `nav.tsx`) lists all 9 tools as flat links with no tier indicators except "Consumer Research" which has a `Free` badge. Users on mobile (likely a significant % given the startup audience) cannot tell which tools require a paid plan until they click through.
   - File: `src/components/nav.tsx`, lines 248-257

3. **🟠 Typo in verification step copy.** Line 856 of `/research/new/page.tsx`: "Enter it below to your research will start automatically." should read "Enter it below **and** your research will start automatically."
   - File: `src/app/research/new/page.tsx`, line 856

4. **🟡 "Compare" nav link depends on sessionStorage hydration.** The Compare link only appears if 2+ `research-*` keys exist in sessionStorage (lines 26-36 `nav.tsx`). This means: (a) it never shows on first visit even if the user has 5 saved results in Supabase, (b) it disappears when the user opens a new tab or clears browsing data, (c) it never shows for tool types other than `research-*`.
   - File: `src/components/nav.tsx`, lines 26-36

5. **🟡 No loading skeleton on result page.** `/research/[id]/page.tsx` shows a spinner with "Loading results..." text (line 197) but no skeleton UI. For reports that may take 1-2 seconds to fetch from Supabase, this is a jarring flash.
   - File: `src/app/research/[id]/page.tsx`, lines 176-201

6. **🟡 Delete confirmation uses `window.prompt()`.** The delete button on results (line 279 `[id]/page.tsx`) uses a browser `prompt()` dialog asking for email. This is ugly, blocks the main thread, and is not mobile-friendly. A modal component would be more appropriate.
   - File: `src/app/research/[id]/page.tsx`, lines 278-299

### User Journey: Returning User (Authenticated)

7. **🟡 Duplicate "Dashboard" link in desktop nav.** When authenticated, "Dashboard" appears both in the main nav bar (line 80-86) AND in the Account dropdown (line 168). Redundancy is minor but clutters the nav.
   - File: `src/components/nav.tsx`, lines 80-86 and 168

8. **🟡 Auth check fires on every page mount with no caching.** `nav.tsx` calls `supabase.auth.getUser()` on every mount (lines 38-44). Combined with the middleware also calling `supabase.auth.getUser()` (line 29 `middleware.ts`), every page load triggers at minimum 2 auth checks. This adds latency.
   - Files: `src/components/nav.tsx` lines 38-44, `src/middleware.ts` line 29

### User Journey: Upgrading User

9. **🟠 Mobile sticky bar on results page always shows "Upgrade" link.** The fixed bottom bar (lines 303-316 `[id]/page.tsx`) shows an "Upgrade" link regardless of the user's plan. A Pro or Team user still sees "Upgrade" after viewing their results.
   - File: `src/app/research/[id]/page.tsx`, line 315

10. **🟡 No upgrade prompt in the research form itself.** The form at `/research/new` never mentions that Pro users get 100 respondents vs. 50. The panel size difference is a key value prop but is invisible at the point of purchase intent.
    - File: `src/app/research/new/page.tsx`

### User Journey: Multi-Tool User

11. **🟡 No cross-tool navigation after completing a test.** After viewing a Consumer Research result, there is no CTA suggesting the user try A/B Testing, Name Testing, etc. Each tool is a dead end.
    - File: `src/app/research/[id]/page.tsx`

### Accessibility

12. **🔴 Dropdown menus are hover-only with no keyboard support.** The "Tools" dropdown (lines 93-143 `nav.tsx`) and Account dropdown (lines 159-183) use CSS `group-hover` for visibility. They have no `aria-expanded`, no `aria-haspopup`, no keyboard toggle, and no focus-trap. Keyboard-only and screen reader users cannot access the Tools menu at all.
    - File: `src/components/nav.tsx`, lines 93-143, 159-183

13. **🟠 Theme toggle button has no visible label.** The theme cycle button (lines 202-208 `nav.tsx`) has a `title` attribute but no `aria-label`. The SVG icons inside have no `aria-hidden` or accessible text.
    - File: `src/components/nav.tsx`, lines 202-208

14. **🟠 Collapsible sections in report have no ARIA attributes.** `CollapsibleSection` in `report-view.tsx` (lines 11-30) toggles content visibility but has no `aria-expanded`, `aria-controls`, or `id` linkage. Screen readers cannot determine section state.
    - File: `src/components/report-view.tsx`, lines 11-30

15. **🟡 No skip-to-content link.** The layout (`layout.tsx`) has no skip navigation link. With a sticky header + long tool dropdown, keyboard users must tab through many elements to reach content.
    - File: `src/app/layout.tsx`

### Mobile

16. **🟡 Mobile menu does not close on route change (only on explicit click).** Each link has `onClick={() => setMobileOpen(false)}` but if a user navigates via browser back/forward, the menu state is stale. No `usePathname` listener to auto-close.
    - File: `src/components/nav.tsx`, lines 246-285

---

## Section 1F -- CTO (Chief Technology Officer)

### Rate Limiting Architecture

17. **🔴 In-memory rate limiter resets on every serverless cold start.** `rate-limit.ts` uses a `Map<string, number[]>()` stored in module scope. On Vercel (serverless), each function invocation may be a new instance. An attacker can bypass rate limits simply by waiting for a cold start or by hitting different regions. Used across ALL 17+ API routes.
    - File: `src/lib/rate-limit.ts`, lines 1-32
    - Consumers: 17 different API route files (see grep results for `createRateLimiter`)

18. **🟠 Inconsistent rate limit thresholds across routes with no documentation.** Rate limits vary from 2 to 10 requests per 10-minute window across routes, with no apparent rationale:
    - `research/route.ts`: IP=3, email=5
    - `ab-test/route.ts`: 2
    - `competitive/route.ts`: 3
    - `integrations/slack/route.ts`: 10
    - `extract-product/route.ts`: 10
    - `auth/verify-email/route.ts`: 5
    - File: Various API routes

### sessionStorage Reliance

19. **🔴 sessionStorage is used as a primary data layer for result viewing.** Every tool's `[id]/page.tsx` falls back to sessionStorage when Supabase fetch fails. But sessionStorage is also the ONLY storage for the `/compare` feature (`src/app/compare/page.tsx`, lines 32-48). If a user shares a compare URL, the recipient sees nothing. sessionStorage is tab-scoped, so even opening results in a new tab loses data.
    - Files: All `[id]/page.tsx` files (8+ tools), `src/app/compare/page.tsx`

20. **🟠 Verification state stored in sessionStorage.** `hypetest-verification` token is stored in sessionStorage (`research/new/page.tsx` line 350, `discover/new/page.tsx` line 261). If a user starts verification, switches tabs, and comes back, the token is lost. This creates a confusing "verify again" loop.
    - Files: `src/app/research/new/page.tsx` line 350, `src/app/discover/new/page.tsx` line 261

### Code Duplication

21. **🔴 PLAN_LIMITS is duplicated in at least 2 files with identical values.** `account/page.tsx` (line 47-52) and `dashboard/page.tsx` (lines 45-50) both define the same `PLAN_LIMITS` constant. If plan limits change, both must be updated in sync.
    - Files: `src/app/account/page.tsx` lines 47-52, `src/app/dashboard/page.tsx` lines 45-50

22. **🟠 UserData and ResearchResult interfaces duplicated across files.** `account/page.tsx` and `dashboard/page.tsx` both define their own `UserData`, `ResearchResult`, and `TestResult` interfaces with slightly different shapes (account has `stripe_customer_id`, dashboard doesn't; dashboard `TestResult.input` is `Record<string, string>`, account is `Record<string, unknown>`).
    - Files: `src/app/account/page.tsx` lines 16-45, `src/app/dashboard/page.tsx` lines 19-44

23. **🟠 sessionStorage fallback pattern copy-pasted across 8+ result pages.** Every `[id]/page.tsx` has the same try-Supabase-then-sessionStorage pattern with identical error handling. This should be a shared hook.
    - Files: All `*/[id]/page.tsx` files

24. **🟠 Logo SVG inlined in both nav.tsx and footer.tsx.** The HypeTest magnifying glass SVG is duplicated verbatim in `nav.tsx` (lines 56-73) and `footer.tsx` (lines 17-24). Any brand update requires changes in both places.
    - Files: `src/components/nav.tsx` lines 56-73, `src/components/footer.tsx` lines 17-24

### RLS Policies

25. **🔴 RLS policies are wide open -- `using (true)` on nearly all tables.** Every table has `for select using (true)` and `for insert with check (true)`. This means:
    - ANY anonymous client can read ALL users' data (emails, names, companies, roles, plans, usage counts) via the `users` table
    - ANY anonymous client can read ALL research results, discovery results, etc.
    - ANY anonymous client can INSERT into any table
    - ANY anonymous client can UPDATE any row in the `users` table
    - The `email_followups` table has `for all using (true) with check (true)` -- full CRUD for anyone
    - Files: All migration files in `supabase/migrations/`
    - **Critical security issue: user PII (emails, names, companies) is queryable by anyone with the anon key**

26. **🟠 No DELETE policy on research_results table.** The delete endpoint at `/api/research/[id]` presumably deletes via Supabase, but there is no RLS delete policy on `research_results`. Either deletes are silently failing, or the API uses the service role key (which bypasses RLS but is a risk pattern).
    - File: `supabase/migrations/20260410_create_research_results.sql`

### maxDuration and Serverless Limits

27. **🟠 All AI-powered routes set `maxDuration = 300` (5 minutes).** This is the maximum for Vercel Pro. If the OpenAI/Anthropic API is slow or the panel is large, requests could still time out. There is no client-side polling or webhook pattern -- the client waits synchronously for up to 5 minutes.
    - Files: 10 API routes (research, ab-test, name-test, pricing-test, logo-test, ad-test, audience-test, competitive, discovery, discovery/round)

28. **🟡 No streaming or progress feedback to client.** `research-engine.ts` accepts an `onProgress` callback (line 17) but the API route passes `undefined` (line 137 `api/research/route.ts`). The client gets no progress updates during the 1-2 minute generation, just a loading spinner.
    - Files: `src/lib/research-engine.ts` line 17, `src/app/api/research/route.ts` line 137

### Error Handling

29. **🟠 `persistResult` failure is non-blocking but unrecoverable.** Line 149 of `api/research/route.ts`: if the Supabase insert fails, the error is logged but the result is returned to the client anyway. The result then only exists in the client's sessionStorage and will be lost if the tab closes. No retry mechanism, no queue.
    - File: `src/app/api/research/route.ts`, lines 148-151

30. **🟡 Catch blocks throughout codebase are empty or log-only.** Multiple `catch {}` blocks silently swallow errors: `nav.tsx` line 33, `research/[id]/page.tsx` lines 131, 143, 171. Makes debugging production issues very difficult.
    - Files: Multiple

### Bundle Size

31. **🟡 Three Google Fonts loaded globally.** `layout.tsx` loads Bricolage Grotesque (4 weights), Manrope, and Geist Mono. All are loaded on every page even though Geist Mono is likely only used in the verification code input.
    - File: `src/app/layout.tsx`, lines 6-20

32. **🟡 recharts is a heavy dependency (~400kB).** Used for charts in reports. Consider dynamic import with `next/dynamic` to avoid loading it on non-report pages.
    - File: `package.json` line 26

33. **⚪ @base-ui/react and shadcn are both included.** Potentially overlapping UI primitives. Worth auditing if both are needed.
    - File: `package.json` lines 13-14, 27

### Test Coverage

34. **🔴 Zero test files in the project.** No test runner configured (no jest, vitest, playwright, or cypress in devDependencies). No test scripts in `package.json`. No `*.test.*` or `*.spec.*` files outside of `node_modules`. For a product handling user PII and financial transactions (Stripe), this is a significant risk.
    - File: `package.json`

### CI/CD

35. **🔴 No CI/CD pipeline.** No `.github/workflows/` directory exists. No evidence of any CI configuration. This means:
    - No automated linting on PRs
    - No type checking on PRs
    - No test runs (there are no tests anyway)
    - No build verification before deploy
    - Database migrations are presumably applied manually

36. **🟡 Middleware runs on all non-static routes but skips `/api/`.** The matcher pattern `/((?!_next/static|_next/image|favicon.ico|brands/|api/).*)` excludes API routes from auth token refresh. This is intentional for performance but means API routes must handle auth independently.
    - File: `src/middleware.ts`, lines 34-37

---

## Section 1G -- CCO (Chief Communications Officer)

### Tone Consistency

37. **🟡 Mixed formality levels in microcopy.** The form uses casual ("Tell us about your product", "the better your research panel performs") while the disclaimer at the bottom is formal/legal ("Not suitable for high-stakes business decisions. Do not submit trade secrets or confidential information."). The verification email text is warm ("We sent a 6-digit code to {email}") but error messages are terse ("Research failed. Please try again.").
    - Files: `src/app/research/new/page.tsx` lines 516-518, 830-838, `src/app/api/research/route.ts` line 179

38. **🟡 Footer tagline says "Grounded in academic research" which oversells.** The footer (`footer.tsx` line 28-30) says "Consumer research in minutes, not months. Grounded in academic research." The methodology IS referenced via academic papers, but the actual product is LLM-simulated, not academically validated itself. This conflation could mislead users.
    - File: `src/components/footer.tsx`, lines 27-30

### Harvard Reference Handling

39. **🟠 Academic references in footer use inconsistent citation format.** The footer references use author-date format ("Brand, Israeli & Ngwe (2025)") which resembles Harvard/APA, but they are just hyperlinks with no full citation. The "Sarstedt et al. (2024)" link points to a Wiley DOI. The "Bain & Company (2025)" is not an academic source at all -- it is a consulting firm blog post. Mixing peer-reviewed sources with industry content under a "Research" heading implies equal academic weight.
    - File: `src/components/footer.tsx`, lines 49-64

40. **🟡 Methodology note in engine output is vague.** The `research-engine.ts` methodology string (line 547 area) says "See our methodology page for academic references and limitations" but the methodology page URL is not included in the report output itself. Users viewing a shared report link have no direct path to the methodology.
    - File: `src/lib/research-engine.ts`, line 547

### Disclaimer Prominence

41. **🔴 No disclaimer visible on the report/results page itself.** The disclaimer appears ONLY in: (a) the form page (`research/new/page.tsx` line 830-838, small `text-xs` gray text), (b) the print watermark (CSS, `globals.css` line 221), and (c) emails. The actual report page at `/research/[id]` has NO visible disclaimer that the data is AI-simulated. A user receiving a shared link sees a polished report with scores, charts, and verbatim quotes with zero indication that none of it comes from real consumers.
    - Files: `src/app/research/[id]/page.tsx` (no disclaimer present), `src/components/report-view.tsx`

42. **🟠 Print watermark is the only safeguard for PDF exports.** The "Download PDF" button just calls `window.print()`. The only AI-simulation notice in print is the CSS `body::after` watermark at the bottom of each page (line 221 `globals.css`). This is easily missed, trivially removable via browser dev tools before printing, and may not render in all browsers.
    - Files: `src/app/globals.css` lines 219-232, `src/app/research/[id]/page.tsx` line 254

### PR Risk

43. **🔴 Reports can be weaponized as fake market research.** A bad actor could run HypeTest, export the PDF, strip the tiny watermark, and present AI-generated scores as real consumer data to investors, board members, or partners. There is no prominent "AI-SIMULATED" badge in the report header, no mandatory watermark in the HTML view, and no report authentication or verification mechanism.
    - File: `src/components/report-view.tsx` (no watermark in HTML), `src/app/research/[id]/page.tsx`

44. **🟠 Footer copyright says "Rekt Brands Inc."** This is the parent company, but the product is "HypeTest". Users may be confused about who operates the service. The footer should say "HypeTest by Rekt Brands Inc." or similar for clarity.
    - File: `src/components/footer.tsx`, line 79

45. **🟡 The email "follow-up" scheduled 24 hours later could feel spammy.** `api/research/route.ts` line 216-225 schedules a follow-up email 24h after every research run. There is no opt-out mechanism visible in the form, no mention that a follow-up will be sent, and no unsubscribe link referenced in the scheduling logic.
    - File: `src/app/api/research/route.ts`, lines 216-225

### 404 Page

46. **🔴 No custom 404 page exists.** No `not-found.tsx` file exists anywhere in the `src/app/` directory tree. Users hitting invalid URLs get the default Next.js 404 page, which is unbranded, has no navigation, and provides no path back to the product. For a product with shareable result links, broken links are inevitable and should be handled gracefully.
    - Missing file: `src/app/not-found.tsx`

### Footer Accuracy

47. **🟡 Footer year is hydrated client-side, causing flash.** `footer.tsx` initializes `year` as empty string (line 8) and sets it in `useEffect` (line 9). During SSR the copyright shows "c " with no year, then flashes to "c 2026" on hydration. Minor but looks broken on slow connections.
    - File: `src/components/footer.tsx`, lines 8-10

48. **⚪ Footer "Case Studies" link points to a single case study.** The link text is plural ("Case Studies") but it goes to `/case-studies/rekt`, a single page. Either rename to "Case Study" or create a listing page.
    - File: `src/components/footer.tsx`, line 41

---

## Summary of Critical Findings (🔴)

| # | Section | Finding |
|---|---------|---------|
| 12 | CXO | Dropdown menus completely inaccessible to keyboard/screen reader users |
| 17 | CTO | In-memory rate limiter useless in serverless environment |
| 19 | CTO | sessionStorage as primary data layer -- tab-scoped, lost on close |
| 25 | CTO | RLS policies wide open -- all user PII publicly queryable |
| 34 | CTO | Zero test coverage for product handling PII and payments |
| 35 | CTO | No CI/CD pipeline |
| 41 | CCO | No AI-simulation disclaimer on report pages |
| 43 | CCO | Reports can be presented as real market research with minimal effort |
| 46 | CCO | No custom 404 page |

---

*End of Battle Test Part 2*
