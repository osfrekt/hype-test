# HypeTest: CPG Founder Feedback Implementation Prompt

Use this prompt with Claude Code in the `hype-test` directory. Run it as a single session.

---

## Context

HypeTest is a Next.js 16 app (App Router, React 19, TypeScript, Tailwind 4, shadcn/ui, Recharts, Supabase, Anthropic SDK with claude-haiku-4-5-20251001) that simulates consumer research panels using LLMs.

The codebase has already been through one round of improvements. The current state includes: structured input form with category dropdown and advanced options (price range, pricing unit, target consumer, competitive products), targeted panel generation, competitive positioning in reports, a sample report on the landing page, an updated methodology page with "What this is / isn't" boxes, and a cleaned-up pricing page with waitlist. A `ReportView` shared component renders reports in both the results page and the landing page sample.

**Important**: Read `AGENTS.md` at the project root before writing any code. It warns this version of Next.js may differ from your training data. Check `node_modules/next/dist/docs/` for correct API conventions.

### Key file locations

- **Research form**: `src/app/research/new/page.tsx` (client component with URL auto-fill, name, description, category select, advanced options toggle for price range, pricing unit, target consumer, competitors)
- **Results page**: `src/app/research/[id]/page.tsx` (loads from Supabase, falls back to sessionStorage, renders `ReportView`)
- **Report renderer**: `src/components/report-view.tsx` (shared component used by results page and landing page sample)
- **Charts**: `src/components/results-charts.tsx` (Recharts: purchase intent bar chart, WTP spectrum gradient bar, competitive positioning bar chart)
- **Research engine**: `src/lib/research-engine.ts` (runResearch, queryPersona, aggregateResults, generateVerbatims, extractFeatures, inferPriceRange)
- **Persona generation**: `src/lib/personas.ts` (generatePanel, generateTargetedPanel)
- **Types**: `src/types/research.ts` (ResearchInput, ResearchResult, ConsumerPersona, etc.)
- **API route**: `src/app/api/research/route.ts` (POST handler with rate limiting, validation, Supabase persistence)
- **Landing page**: `src/app/page.tsx` (hero, validation, how it works, report components, sample report, why this works, CTA)
- **Methodology**: `src/app/(marketing)/methodology/page.tsx`
- **Pricing**: `src/app/(marketing)/pricing/page.tsx`
- **Navigation**: `src/components/nav.tsx`
- **DB schema**: `supabase/migrations/`

### Current ResearchResult type (for reference)

```typescript
interface ResearchResult {
  id: string;
  input: ResearchInput;
  panelSize: number;
  purchaseIntent: { score: number; distribution: { label: string; count: number }[] };
  wtpRange: { low: number; mid: number; high: number };
  featureImportance: { feature: string; score: number }[];
  topConcerns: string[];
  topPositives: string[];
  verbatims: { persona: string; quote: string }[];
  competitivePosition?: { distribution: { label: string; count: number }[]; competitors: string };
  methodology: { panelSize: number; demographicMix: string; questionsAsked: number; confidenceNote: string };
  createdAt: string;
  status: "running" | "complete" | "error";
}
```

---

## What to implement

There are 8 fixes/features below. Implement them in order. After each one, run `npm run build` and fix any errors before moving on. Commit after each one.

---

### Fix 1: Add data labels to the purchase intent bar chart

**File**: `src/components/results-charts.tsx`

The purchase intent bar chart currently shows bars without numbers on them. You have to hover to see the count. For a research report, the raw numbers need to be visible at a glance.

Add a Recharts `<LabelList>` to the `<Bar>` component in the purchase intent chart that shows the count value on top of each bar. Use `position="top"`, `fontSize={11}`, and `fill="#374151"` (gray-700). Only show the label if `count > 0` (use a custom formatter or `content` prop to suppress zero labels).

---

### Fix 2: Fix WTP spectrum when estimated avg equals the low end

**File**: `src/components/results-charts.tsx`

When `wtpRange.mid` equals `wtpRange.low`, the marker gets jammed into the left edge and overlaps with the "Budget buyers" label. The position is calculated as `((mid - low) / (high - low)) * 100`, which evaluates to 0%.

Add a minimum left position of 8% so the marker never overlaps the edge label. Also handle the edge case where `high === low` (divide by zero) by defaulting to 50%. The fix should be in the `style` calculation for the mid marker's `left` property.

---

### Fix 3: Fix truncated feature importance labels

**File**: `src/components/report-view.tsx`

The feature importance labels are in a `w-48 shrink-0 truncate` span, which cuts them off with ellipsis. Features like "Fraction of traditional research cost" get rendered as "Fraction of traditional rese..." which is useless.

Change the label container: remove `truncate` and `w-48`. Instead, use `w-56 shrink-0` with `line-clamp-2` and `text-wrap` so long labels wrap to a second line rather than being cut off. On mobile (`max-w-screen` or smaller viewports), the feature labels should appear above the bar on their own line rather than side-by-side. Use a responsive layout: on `md:` screens keep the horizontal layout, on small screens stack the label above the bar.

---

### Fix 4: Deduplicate concerns and positives properly

**File**: `src/lib/research-engine.ts`

The current deduplication in `aggregateResults()` uses `new Set()` on the raw strings, which only catches exact duplicates. In practice, many responses are near-identical paraphrases ("I'm skeptical that AI-simulated consumers can truly replicate real consumer behavior and decision-making nuances" vs "I'm skeptical that AI-simulated consumers can truly replicate real consumer behavior and preferences").

Replace the `new Set()` approach for both `concerns` and `positives` with a semantic deduplication step. After collecting all unique strings, use a simple heuristic: iterate through the list and skip any item whose first 40 characters match (case-insensitive) any already-selected item. This catches the most common duplication pattern (same opening clause with slightly different endings) without requiring an LLM call.

Also increase the variety: instead of taking the first 5 unique items, take 5 items from maximally diverse persona types. Sort the responses by persona income bracket (low to high) and take one from each quintile when possible before filling remaining slots.

---

### Fix 5: Improve verbatim diversity

**File**: `src/lib/research-engine.ts`

The current `generateVerbatims()` function randomly picks 5 responses and concatenates `topPositive + topConcern` with "However,". This produces verbatims that all follow the same syntactic pattern and feel template-generated.

Replace the implementation entirely. Instead of mechanical string concatenation, make a single Claude API call to generate the verbatims. Send a prompt that includes the full list of (positive, concern) pairs from all responses, plus a sample of 8-10 persona labels, and ask the model to write 5 distinct verbatim quotes from 5 different persona perspectives. The prompt should instruct:

- Each verbatim should sound like a different person speaking naturally
- Vary the structure: some should lead with enthusiasm, some with skepticism, some with practical questions, some with price sensitivity
- Include the persona demographic in the output
- Keep each verbatim to 1-3 sentences
- Do NOT start every verbatim with the same phrase

The function should fall back to the current mechanical approach if the API call fails.

Update the `max_tokens` to 500 for this call. Use temperature 0.9.

---

### Fix 6: Add "Share link" and "Run again" buttons to results page

**File**: `src/app/research/[id]/page.tsx` and `src/components/report-view.tsx`

Add a button bar at the top of the results page (between the Nav and the report content) with two buttons:

1. **"Copy share link"** — copies the current URL to the clipboard using `navigator.clipboard.writeText(window.location.href)`. Show a brief "Copied!" confirmation that fades after 2 seconds. Use a link icon from lucide-react (`Link2` or `Share2`).

2. **"Run again"** — links to `/research/new` with the current product's data pre-filled via URL search params. Encode `productName`, `productDescription`, and `category` as query params. On the `/research/new` page, read the search params on mount and pre-fill the form fields if they exist. Use the `RotateCcw` icon from lucide-react.

Style both as outline buttons (`variant="outline"`) with icon + text, right-aligned in a flex container. Add these buttons inside the results page itself (not inside ReportView) so they don't appear on the landing page sample report.

For the pre-fill on `/research/new`: use `useSearchParams()` from next/navigation. Read `name`, `desc`, and `cat` params and populate the state on mount via a `useEffect`.

---

### Fix 7: Show panel demographic breakdown in report methodology section

**Files**: `src/lib/research-engine.ts`, `src/types/research.ts`, `src/components/report-view.tsx`

The methodology box on the results page currently just says "US general population (varied age, income, gender, location)" which is vague. Add an actual demographic breakdown.

In `research-engine.ts`, after the panel is generated and responses are collected, compute a `panelBreakdown` object:

```typescript
{
  genderSplit: { male: number; female: number; nonBinary: number }, // percentages
  ageRange: { min: number; max: number; median: number },
  incomeRange: { min: number; max: number; median: number },
}
```

Calculate these from the actual `ConsumerPersona[]` panel (not the responses, the original panel). Add this to the `methodology` field in `ResearchResult`.

In `report-view.tsx`, render the breakdown in the methodology card as a compact one-liner below "Demographic mix", something like: "48% female, 48% male, 4% non-binary | Ages 22-67 (median 40) | Income $25k-$200k (median $75k)". Use pipe separators and keep it on one or two lines. Fall back to the existing `demographicMix` string if `panelBreakdown` is not present (for backwards compatibility with older results).

Add `panelBreakdown` as an optional field inside the `methodology` object in the `ResearchResult` type.

---

### Fix 8: Make the brand logo bar honest

**File**: `src/app/page.tsx`

The landing page currently has a section that says "THE SAME RESEARCH METHODOLOGY TRUSTED BY LEADING BRANDS" followed by "Snooz REKT Uncaged Nielsen Ipsos McKinsey". This is misleading because the framing implies these are customers or endorsers.

Change the heading to "BUILT ON METHODOLOGY USED BY" and only list the research/methodology firms: "Nielsen", "Ipsos", "McKinsey". Remove "Snooz", "REKT", and "Uncaged" from this bar since they're not methodology firms, they're product brands that would be users/customers.

If there's a separate customer logo bar elsewhere, that's fine, but it should be labelled "USED BY" or "OUR CUSTOMERS" and only include brands that actually use HypeTest.

---

## After all fixes

1. Run `npm run build` and fix any TypeScript or build errors.
2. Run `npx tsc --noEmit` to catch remaining type issues.
3. Commit all changes with a clear summary message.
4. Push to the `main` branch on GitHub.
