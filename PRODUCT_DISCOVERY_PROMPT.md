# HypeTest: Product Discovery Feature — Implementation Prompt

Use this prompt with Claude Code in the `hype-test` directory. Run it as a single session.

---

## Context

HypeTest is a Next.js 16 app (App Router, React 19, TypeScript, Tailwind 4, shadcn/ui, Recharts, Supabase, Anthropic SDK with claude-haiku-4-5-20251001) that simulates consumer research panels. Users describe a product, and the app generates 50 AI consumer personas who answer structured survey questions. Results include purchase intent, WTP, feature importance, concerns, positives, and verbatims.

**Important**: Read `AGENTS.md` at the project root before writing any code. It warns this version of Next.js may have breaking changes. Check `node_modules/next/dist/docs/` for correct API conventions.

### Key file locations

- **Types**: `src/types/research.ts` (ResearchInput, ResearchResult, ConsumerPersona)
- **Research engine**: `src/lib/research-engine.ts` (runResearch, queryPersona, aggregateResults, generateVerbatims)
- **Persona generation**: `src/lib/personas.ts` (generatePanel, generateTargetedPanel)
- **API route for research**: `src/app/api/research/route.ts` (POST, rate limiting, Supabase persistence)
- **Research form**: `src/app/research/new/page.tsx`
- **Results page**: `src/app/research/[id]/page.tsx`
- **Report renderer**: `src/components/report-view.tsx`
- **Charts**: `src/components/results-charts.tsx`
- **Navigation**: `src/components/nav.tsx`
- **Landing page**: `src/app/page.tsx`
- **Pricing**: `src/app/(marketing)/pricing/page.tsx`
- **DB migrations**: `supabase/migrations/`

### What this feature is

A **reverse research mode** called "Product Discovery." Instead of "I have a product, what do consumers think?", it's "I have a brand and audience, what products should I build?"

The flow:
1. User describes their brand, target audience, category, and optionally their existing product line
2. An LLM generates 8-10 rough product concepts based on that brand/audience context
3. Those concepts are run through a mini consumer panel (the same persona infrastructure) to gauge demand
4. The output is a ranked list of product opportunities with estimated WTP, consumer enthusiasm, and the reasoning behind each

This is a **premium feature**. It should be gated behind a Pro tier flag, but for now (no auth system), the gate should be bypassable so you can test. Use an environment variable `NEXT_PUBLIC_UNLOCK_PRO=true` to unlock it. When the env var is not set or is `false`, the feature should show a paywall/upgrade prompt instead of the form.

---

## Implementation plan

There are 6 parts. Implement them in order. Run `npm run build` after each part and fix any errors. Commit after each.

---

### Part 1: Types and data model

**File**: `src/types/discovery.ts` (new file)

Create the types for the discovery feature:

```typescript
export interface DiscoveryInput {
  brandName: string;
  brandDescription: string;
  category: string;
  targetAudience: string;
  existingProducts?: string; // comma-separated list of current products
  priceRange?: { min: number; max: number };
  priceUnit?: string;
  constraints?: string; // e.g. "must be shelf-stable", "no dairy", "under $5 per unit"
}

export interface ProductConcept {
  name: string;
  description: string; // 2-3 sentence product concept
  rationale: string; // why this fits the brand and audience
  estimatedPricePoint: { low: number; high: number };
}

export interface DiscoveryPanelResult {
  concept: ProductConcept;
  purchaseIntent: {
    score: number; // 0-100
    distribution: { label: string; count: number }[];
  };
  wtpRange: { low: number; mid: number; high: number };
  topExcitement: string; // most common positive reaction
  topHesitation: string; // most common concern
  demandRank: number; // 1 = highest demand
}

export interface DiscoveryResult {
  id: string;
  input: DiscoveryInput;
  concepts: DiscoveryPanelResult[];
  panelSize: number;
  methodology: {
    panelSize: number;
    demographicMix: string;
    conceptsGenerated: number;
    conceptsTested: number;
    confidenceNote: string;
  };
  createdAt: string;
  status: "running" | "complete" | "error";
}
```

---

### Part 2: Discovery engine

**File**: `src/lib/discovery-engine.ts` (new file)

This is the core engine. It has three phases:

**Phase 1: Concept generation.** Make a single Claude API call (claude-haiku-4-5-20251001, temperature 0.9, max_tokens 2000) with a prompt that takes the `DiscoveryInput` and generates 8 product concepts. The prompt should instruct the model to:
- Consider the brand positioning, target audience, and category
- Avoid concepts that overlap with existing products (if provided)
- Respect any constraints
- For each concept, provide: name, 2-3 sentence description, rationale for brand/audience fit, and estimated price range
- Return as a JSON array of `ProductConcept` objects

Parse the response. Fall back to 4 generic concepts for the category if parsing fails.

**Phase 2: Mini panel testing.** For each of the 8 concepts, run a lightweight consumer panel. Reuse the existing `generatePanel()` or `generateTargetedPanel()` from `src/lib/personas.ts` to create the panel once (use 30 personas instead of 50, to keep cost reasonable since we're testing 8 concepts). Then for each concept, query each persona with a simplified prompt (not the full 5-question survey). The mini survey should ask only 3 questions:

```
1. PURCHASE INTENT: 1-5 scale (same as existing)
2. PRICE SENSITIVITY: A (low) / B (mid) / C (high) / D (would not buy)
3. ONE-LINE REACTION: What's your honest first reaction to this product? (one sentence)
```

This keeps the per-concept cost low. Run the 8 concepts in parallel (each concept queries all 30 personas in batches of 10, same as existing). Use `Promise.allSettled` at the concept level so one failing concept doesn't kill the whole run.

**Phase 3: Aggregation and ranking.** For each concept:
- Compute purchase intent score (same formula as existing)
- Compute WTP range (same as existing)
- From the one-line reactions, use a single Claude call to extract the single most common excitement theme and the single most common hesitation theme (this is 1 API call per concept, 8 total)
- Rank concepts by purchase intent score descending

Return a `DiscoveryResult` with all 8 concepts ranked.

**Cost estimate**: 1 concept generation call + (8 concepts × 30 personas = 240 persona queries) + 8 theme extraction calls = ~249 API calls total. At Haiku 4.5 pricing, this should cost roughly $0.15-0.20 per discovery run. That's 3-4x the cost of a standard research run, which justifies making it a premium feature.

Export a `runDiscovery(input: DiscoveryInput, onProgress?: (stage: string, progress: number) => void): Promise<DiscoveryResult>` function.

Use `nanoid(12)` for the result ID (same as research engine).

**Important implementation detail**: The persona queries for each concept should use the same panel (generate it once, reuse across all 8 concepts). This ensures consistent evaluation across concepts.

---

### Part 3: API route and persistence

**File**: `src/app/api/discovery/route.ts` (new file)

Create a POST endpoint that mirrors the structure of `src/app/api/research/route.ts`:

- Same rate limiting approach (reuse the same in-memory map, or create a separate one — either is fine). Limit to 2 discovery runs per IP per 10 minutes (tighter than research since it's more expensive).
- `maxDuration = 300` (same as research route)
- Validate inputs: `brandName` required (max 200 chars), `brandDescription` required (max 5000 chars), `category` required (max 100 chars), `targetAudience` required (max 500 chars). Optional fields sanitised the same way as the research route.
- Call `runDiscovery(sanitizedInput)`
- Persist to Supabase (non-blocking, same pattern as research route)

**New Supabase migration**: `supabase/migrations/20260411_create_discovery_results.sql`

```sql
create table if not exists discovery_results (
  id text primary key,
  input jsonb not null,
  concepts jsonb not null,
  panel_size integer not null,
  methodology jsonb not null,
  status text not null default 'complete',
  created_at timestamptz not null default now()
);

create index if not exists idx_discovery_results_created_at
  on discovery_results (created_at desc);

alter table discovery_results enable row level security;

create policy "Public read access"
  on discovery_results for select using (true);

create policy "API insert access"
  on discovery_results for insert with check (true);
```

Persist the result mapping `concepts` as the full `DiscoveryPanelResult[]` array, and `input`, `panel_size`, `methodology` as their respective JSONB/integer fields.

---

### Part 4: Discovery input form

**File**: `src/app/discover/new/page.tsx` (new file)

Create a "use client" page with a form for the discovery inputs. Structure it similarly to `src/app/research/new/page.tsx` (same card layout, progress UI pattern, etc.).

**Pro gate**: At the top of the component, check `process.env.NEXT_PUBLIC_UNLOCK_PRO`. If it's not `"true"`, render a paywall card instead of the form:

```tsx
// Pro gate — show upgrade prompt when feature is locked
if (process.env.NEXT_PUBLIC_UNLOCK_PRO !== "true") {
  return (
    <>
      <Nav />
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-6">
            {/* Lock icon */}
          </div>
          <h1 className="text-2xl font-bold text-navy mb-3">Product Discovery is a Pro feature</h1>
          <p className="text-muted-foreground mb-6">
            Discover what products your audience actually wants.
            AI-generated concepts tested against a simulated consumer panel.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Product Discovery will be available on the Pro plan. Join the waitlist to be notified when it launches.
          </p>
          <Link href="/pricing" className="...">View pricing</Link>
        </div>
      </main>
    </>
  );
}
```

**Form fields** (when unlocked):

1. **Brand Name** (required) — text input, placeholder "e.g., REKT"
2. **Brand Description** (required) — textarea, placeholder "Describe your brand's positioning, values, and what you're known for"
3. **Category** (required) — same `<Select>` dropdown as the research form, same category list
4. **Target Audience** (required) — textarea, placeholder "e.g., Gen Z and millennial gamers, 18-35, who care about clean ingredients and bold flavours"
5. **Existing Products** (optional) — text input, placeholder "e.g., Energy drink, Protein bar, Hydration mix". Collapsible in an "Advanced options" section.
6. **Price Range** (optional) — same min/max number inputs as research form. Collapsible.
7. **Pricing Unit** (optional) — text input, placeholder "e.g., per can, per 4-pack, per box". Collapsible.
8. **Constraints** (optional) — text input, placeholder "e.g., must be shelf-stable, no dairy, under $5 per unit". Collapsible.

**Submit button**: "Discover Products (Pro)" — same dark navy style as the research button.

**Progress UI**: Same spinner/progress bar pattern as the research form. Stage messages:
- "Analysing your brand and audience..."
- "Generating product concepts..."
- "Testing concepts with consumer panel..."
- "Evaluating concept 1 of 8..."
- "Evaluating concept 2 of 8..." (etc.)
- "Ranking opportunities..."
- "Complete!"

On success, store result in sessionStorage as `discovery-{id}` and redirect to `/discover/{id}`.

---

### Part 5: Discovery results page

**File**: `src/app/discover/[id]/page.tsx` (new file)

A "use client" page that loads the discovery result from Supabase (with sessionStorage fallback, same pattern as `src/app/research/[id]/page.tsx`).

**Layout**:

**Header section**: Brand name, category badge, target audience description, date.

**Summary cards row** (3 cards):
- **Top Opportunity**: Name of the #1 ranked concept + its purchase intent score
- **Highest WTP**: Name of the concept with the highest mid WTP + the dollar amount
- **Concepts Tested**: "8 concepts / 30 panellists each"

**Concept cards**: Show all 8 concepts ranked by demand. Each concept card should include:

1. **Rank badge** (#1, #2, etc.) with colour coding: #1-2 green, #3-5 amber, #6-8 gray
2. **Concept name** as the card title
3. **Description** (2-3 sentences)
4. **Rationale** ("Why this fits your brand") in smaller muted text
5. **Mini metrics row**: Purchase Intent score (%), Estimated WTP ($X-$Y), and a small spark-style indicator
6. **Top excitement** (green text with check icon): the one-line positive theme
7. **Top hesitation** (red text with alert icon): the one-line concern theme
8. **"Test this concept"** button — links to `/research/new` with the concept pre-filled as query params: `name={concept.name}&desc={concept.description}&cat={category}` plus the price range if available. This lets users take a discovery concept and immediately run a full 50-person research panel on it. This is the key workflow: discover → test → validate.

**Methodology footer**: Same teal card style as research results. Show panel size, demographic mix, number of concepts generated/tested, and the confidence note: "Product concepts were generated by AI based on your brand and audience inputs, then evaluated by a simulated consumer panel. Results are directional and best used to prioritise which concepts to explore further with real consumers."

Use Recharts for a horizontal bar chart at the top comparing all 8 concepts by purchase intent score (concept name on Y axis, score on X axis, bars coloured green/amber/red based on score). This gives a visual overview before the detailed cards.

---

### Part 6: Navigation, landing page, and pricing integration

**Files**: `src/components/nav.tsx`, `src/app/page.tsx`, `src/app/(marketing)/pricing/page.tsx`

**Navigation** (`nav.tsx`): Add a "Discover" link in the nav between "Methodology" and "Pricing". It should always be visible (not conditionally shown like Compare). Link to `/discover/new`. Add a small "Pro" badge next to it using a `<span>` styled with `text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium ml-1`. This visually signals it's a premium feature.

**Landing page** (`page.tsx`): In the "How HypeTest works" section (the 3-step flow), add a 4th step or a secondary CTA below step 3. Something like:

```
Don't have a product yet?
Use Product Discovery to find out what your audience actually wants — then test the top concepts instantly.
[Discover products →]
```

Style it as a subtle callout card below the 3-step flow, not as a 4th step (keep the 3-step flow clean). Use a light amber/gold background to signal it's premium. Link to `/discover/new`.

**Pricing page** (`pricing/page.tsx`): In the "More power coming soon" waitlist card, add "Product Discovery" to the feature list. Place it first in the list to make it prominent: "Product Discovery (find what to build next), custom panels of up to 200 respondents, conjoint WTP breakdown by feature, ..."

---

## After all parts

1. Add `NEXT_PUBLIC_UNLOCK_PRO=true` to `.env.local` (create the file if it doesn't exist) so the feature is testable.
2. Run `npm run build` and fix any TypeScript or build errors.
3. Run `npx tsc --noEmit` for remaining type issues.
4. Commit all changes with a clear summary message.
5. Push to the `main` branch on GitHub.

---

## Cost and architecture notes (for reference, don't implement)

- A discovery run costs roughly $0.15-0.20 in API calls (vs ~$0.05 for a standard research run)
- The "Test this concept" button on the results page creates a natural upsell from discovery → research, doubling usage
- The env var gate is intentionally simple. When you build real auth/billing later, replace the env var check with a user tier check
- The same panel is reused across all 8 concept evaluations to ensure apples-to-apples comparison
- Only 30 personas per concept (vs 50 for full research) keeps cost manageable while providing directional signal
