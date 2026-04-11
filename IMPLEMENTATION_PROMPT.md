# HypeTest: Full Feature Implementation Prompt

Use this prompt with Claude Code in the `hype-test` directory. Run it as a single session.

---

## Context

HypeTest is a Next.js 16 app (App Router, React 19, TypeScript, Tailwind 4, shadcn/ui, Recharts, Supabase, Anthropic SDK) that simulates consumer research panels using LLMs. Users describe a product, and the app generates a panel of 50 AI personas who answer structured survey questions. Results include purchase intent, willingness-to-pay, feature importance, concerns, positives, and verbatims.

The app is live at hype-test.vercel.app. The free tier works. Pro and Teams tiers are marked "Coming soon."

The codebase lives at:

- **Pages**: `src/app/` (layout, page, research/new, research/[id], api/research, (marketing)/methodology, (marketing)/pricing)
- **Core engine**: `src/lib/research-engine.ts` (runResearch, queryPersona, aggregateResults, generateVerbatims, extractFeatures, inferPriceRange, inferCategory)
- **Persona generation**: `src/lib/personas.ts` (generatePanel with weighted demographics)
- **Types**: `src/types/research.ts` (ResearchResult, ResearchInput, ConsumerPersona, etc.)
- **Components**: `src/components/` (nav, footer, results-charts, ui/)
- **DB**: `supabase/migrations/20260410_create_research_results.sql` (single table: research_results)

Important: Read `AGENTS.md` at the project root before writing any code. It warns that this version of Next.js may have breaking changes from what you expect. Check `node_modules/next/dist/docs/` for the correct API conventions before implementing any new pages or routes.

---

## What to implement

There are 7 features below. Implement them in order. After each feature, make sure the app builds (`npm run build`) before moving on. Commit after each feature with a clear message.

---

### Feature 1: Structured product input form

**File**: `src/app/research/new/page.tsx`

The current form has only two fields (product name and description). Replace it with a richer, structured form that gives users control and gives the engine better data.

**Add these fields:**

1. **Product Name** (keep existing)
2. **Product Description** (keep existing, but shorten placeholder)
3. **Category** — a `<Select>` dropdown with these options: Food & Beverage, Health & Wellness, Technology, Fashion & Apparel, Home & Garden, Beauty & Personal Care, Education, Finance, Other. Map to the categories already in `inferCategory()` in research-engine.ts. When a category is selected, pass it as `category` in the API payload so the engine skips inference.
4. **Price Range** — two number inputs (Min and Max) in a row, with a dollar sign prefix. Optional. When filled, pass as `priceRange` in the payload so the engine skips `inferPriceRange()`.
5. **Target Consumer** — a textarea with placeholder "e.g., Health-conscious women 25-40, metro areas, $80k+ household income". Optional. Pass as `targetMarket` in the payload. (The engine already accepts this field but doesn't use it yet — that's handled in Feature 2.)
6. **Competitive Products** — a text input with placeholder "e.g., Brita, Hydro Flask, Sodastream". Optional. This is a new field — add `competitors?: string` to `ResearchInput` in `src/types/research.ts`.

Add a collapsible "Advanced options" section (use a `<details>` or a simple toggle state) that contains the Target Consumer, Competitive Products, and Price Range fields. Category stays in the main section alongside name and description.

Keep the existing validation (name and description required). Keep the existing submit handler but update the payload to include the new optional fields. Keep the progress UI as-is.

Update the API route (`src/app/api/research/route.ts`) to sanitise the new `competitors` field the same way it sanitises `targetMarket`.

---

### Feature 2: Target consumer persona filtering

**File**: `src/lib/personas.ts` and `src/lib/research-engine.ts`

When `targetMarket` is provided in the input, the panel should skew toward that demographic instead of using general population distributions.

In `personas.ts`, add a new export: `generateTargetedPanel(size: number, category: string, targetDescription: string): ConsumerPersona[]`. This function should:

1. Call the Anthropic API (claude-haiku-4-5-20251001) with a prompt that takes the `targetDescription` and returns a JSON object with suggested demographic skews: `{ ageRange: [min, max], genderSkew: { male: float, female: float, "non-binary": float }, incomeRange: [min, max], locationSkew: string[], lifestyleSkew: string[] }`.
2. Use those skews to filter/weight the existing arrays in personas.ts when generating the panel. Keep 20% of the panel as general population (for contrast) and 80% skewed to the target.
3. Fall back to `generatePanel()` if the API call fails.

In `research-engine.ts`, update `runResearch()`: if `input.targetMarket` exists, call `generateTargetedPanel()` instead of `generatePanel()`.

Update the methodology output to reflect when a targeted panel was used: change `demographicMix` to say "Targeted panel: [targetMarket description] (80%) + general population (20%)" instead of "US general population."

---

### Feature 3: Competitive positioning

**File**: `src/lib/research-engine.ts` and `src/types/research.ts`

When `competitors` is provided, add competitive context to the persona query and collect competitive preference data.

In `research-engine.ts`, update the `queryPersona()` prompt: if `input.competitors` exists, add a 6th question after the existing 5:

```
6. COMPETITIVE PREFERENCE: Compared to [competitors], how does [productName] compare?
   A) Much better than alternatives
   B) Somewhat better
   C) About the same
   D) Somewhat worse
   E) Much worse
   F) Not familiar with the alternatives
```

Add a new field to `PanelResponse`: `competitivePreference?: "much_better" | "better" | "same" | "worse" | "much_worse" | "unfamiliar"`.

Parse the response and map A-F to those values.

In `ResearchResult` (types/research.ts), add: `competitivePosition?: { distribution: { label: string; count: number }[]; competitors: string }`.

In `aggregateResults()`, compute the competitive distribution and attach it to the result.

On the results page (`src/app/research/[id]/page.tsx`), render the competitive positioning as a horizontal stacked bar chart (using Recharts) only when the data exists. Place it after the WTP spectrum chart.

Add a new Supabase migration file `supabase/migrations/20260411_add_competitive_position.sql` that adds a `competitive_position jsonb` nullable column to `research_results`. Update `persistResult()` in the API route to include it.

---

### Feature 4: Side-by-side comparison view

Create a new page at `src/app/compare/page.tsx`.

This page lets users select 2-3 previous research runs and view them side by side.

**How it works:**

1. The page reads all research IDs stored in sessionStorage (keys matching `research-*`) and also fetches recent results from Supabase (last 20, ordered by created_at desc).
2. Display a list of available runs with product name and date. User selects 2-3 using checkboxes.
3. Once selected, show a comparison table/grid with columns for each product and rows for:
   - Purchase Intent Score
   - WTP Range (low / mid / high)
   - Top Feature
   - Top Concern
   - Panel Size
4. Below the table, show overlaid bar charts for purchase intent distribution (all products on one chart, grouped bars) and feature importance (side by side).

Use the existing shadcn Card and Badge components. Use Recharts for the charts. Add a "Compare" link to the Nav component (`src/components/nav.tsx`) that only shows if there are 2+ results in sessionStorage.

Keep it client-side only for now (no new API routes). The comparison page should be a "use client" component.

---

### Feature 5: Sample report on landing page

**File**: `src/app/page.tsx`

The landing page describes what's in a report but never shows one. Add an interactive sample report section.

Between the "What's in a HypeTest report" section and the "Why this works" section, add a new section called "See a real report." This section displays a hardcoded example report for a product called "FreshBrew Portable Cold Brew Maker" with realistic-looking data:

- Purchase Intent: 68%, distribution roughly [4, 8, 12, 16, 10] across the 5 levels
- WTP: low $35, mid $48, high $65
- Feature Importance: "5-minute brew time" (92), "Portable & backpack-friendly" (78), "Dishwasher safe" (65), "BPA-free materials" (58)
- Top Concerns: ["Durability concerns for travel use", "Taste quality vs traditional cold brew", "Cleaning difficulty despite dishwasher claim"]
- Top Positives: ["Speed advantage is compelling", "Portability fills a real gap", "Price point feels reasonable"]
- 3 sample verbatims

Render this using the same `ResultsCharts` component and the same card layout used in `src/app/research/[id]/page.tsx`. Extract the report rendering into a shared component (`src/components/report-view.tsx`) that both the results page and the landing page sample can use. This avoids duplicating the layout.

Add a subtle label/badge that says "Sample data" so users know it's not live.

---

### Feature 6: Methodology page improvements

**File**: `src/app/(marketing)/methodology/page.tsx`

Make these changes to the methodology page:

1. Add a "What this is and isn't" summary box at the very top of the page, before any other content. Two columns: left column titled "What HypeTest does well" with 4-5 short bullets (early validation, feature prioritisation, directional pricing, objection surfacing, hypothesis generation). Right column titled "Where HypeTest has limits" with 4-5 short bullets (precise demographic targeting, truly novel categories with no market precedent, high-stakes final launch decisions, non-US/non-English markets, replacing large-scale quantitative studies). Use a green-tinted background for the left column and an amber-tinted background for the right.

2. In the "Foundational Research" section, add a note under the Brand et al. citation specifying that the R² = 0.89 was demonstrated for consumer packaged goods categories specifically, and that performance may vary for novel product categories or niche markets.

3. Add a new section called "Panel Construction" between the existing methodology steps and the limitations section. Explain how personas are constructed: "Each simulated panellist is assigned a unique demographic profile drawn from US census-representative distributions across age (22-67), gender (48% male, 48% female, 4% non-binary), household income ($25k-$200k), geographic location (12 region types), lifestyle orientation (10 consumer archetypes), and category-specific purchase experience. When a target consumer is specified, 80% of the panel is skewed toward the target demographics while 20% remains general population for contrast."

4. Add a "Conjoint methodology detail" subsection that clarifies: "HypeTest uses a simplified choice-based approach inspired by conjoint analysis. Each panellist is presented with the product at three price points (low, mid, high) and asked to choose. This is structurally simpler than full adaptive conjoint (which uses orthogonal attribute combinations across multiple choice sets), but captures the core insight: indirect elicitation produces more realistic WTP estimates than direct 'how much would you pay?' questions. We describe this as 'conjoint-style' to be transparent about both the methodology's strengths and its simplification."

---

### Feature 7: Pricing page cleanup

**File**: `src/app/(marketing)/pricing/page.tsx`

1. Remove the Pro and Teams tier cards entirely. Replace them with a single card below the Free tier that says: "More power coming soon — Custom panels, competitive positioning, PDF export, team collaboration, and API access." Add an email input and a "Join the waitlist" button. For now, the button should just copy the email to a `waitlist_emails` array stored in a Supabase table. Add a migration `supabase/migrations/20260411_create_waitlist.sql` to create the table: `id serial primary key, email text not null unique, created_at timestamptz default now()`. Wire the waitlist form to a new API route at `src/app/api/waitlist/route.ts` that inserts into this table. Validate email format server-side.

2. Update the Free tier card to be more prominent now that it's the only "real" tier. Give it a teal border and a "Start free" CTA that links to `/research/new`.

---

## After all features

1. Run `npm run build` and fix any TypeScript or build errors.
2. Run `npx tsc --noEmit` to catch any remaining type issues.
3. Review all new Supabase migration files for correctness.
4. Commit all changes with a clear message summarising the full feature set.
5. Push to the `main` branch on GitHub.
