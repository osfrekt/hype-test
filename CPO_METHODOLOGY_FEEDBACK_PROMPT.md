# HypeTest: Methodology Page Overhaul (CPO Feedback)

Use this prompt with Claude Code in the `hype-test` directory. Run it as a single session.

---

## Context

HypeTest is a Next.js 16 app (App Router, React 19, TypeScript, Tailwind 4, shadcn/ui, Recharts, Supabase, Anthropic SDK with claude-haiku-4-5-20251001) that simulates consumer research panels using LLMs.

We had a Fortune 500 CPO review the methodology page and the landing page's methodology-related sections. The feedback was detailed and specific. The core takeaway: the value proposition (speed + cost) is clear, but the methodology explanation reads like it was written to impress a generalist, not to convince someone who actually buys research. It needs more depth, more transparency, and a concrete "validate against your own data" conversion path.

**Important**: Read `AGENTS.md` at the project root before writing any code. It warns this version of Next.js may differ from your training data. Check `node_modules/next/dist/docs/` for correct API conventions.

### Key file locations

- **Methodology page**: `src/app/(marketing)/methodology/page.tsx`
- **Landing page**: `src/app/page.tsx`
- **Sample report**: `src/components/sample-report.tsx`
- **Report renderer**: `src/components/report-view.tsx`
- **Research engine**: `src/lib/research-engine.ts` (the actual survey logic)
- **Persona generation**: `src/lib/personas.ts`
- **Types**: `src/types/research.ts`
- **Navigation**: `src/components/nav.tsx`

### CPO feedback summary (verbatim themes)

1. **"Not yet convinced it works."** The R² = 0.89 claim does a lot of heavy lifting without enough support. What categories was it tested on? What demographics? Was it across price points or clustered in a narrow band? One Harvard paper with n=300 isn't enough to generalise.

2. **"The mechanism isn't explained well enough."** The page says LLMs absorbed consumer patterns, but doesn't explain WHY conjoint-style indirect elicitation works better with LLMs than direct questioning, or why 50 synthetic personas approximate population-level distributions. These are the questions a technical buyer would ask.

3. **"I'd need category-specific validation, a head-to-head comparison path, and transparency on failure modes."** Where does this break down? If you tell me it works everywhere, I trust you less.

4. **"Too simple for a sophisticated buyer."** Name-dropping Nielsen/Ipsos/McKinsey feels like borrowed credibility without substance. Saying "conjoint-style indirect elicitation" without showing a sample question is just jargon dressed as methodology.

5. **"The positioning is contradictory."** You can't simultaneously claim R² = 0.89 and then disclaim this as "directional insights only." Pick a lane. Either this is a legitimate proxy for consumer research, or it's a screening tool. The page tries to be both and weakens both positions.

---

## What to implement

There are 8 changes below. Implement them in order. After each one, run `npm run build` and fix any errors before moving on. Commit after each one.

---

### Change 1: Resolve the positioning contradiction on the landing page

**File**: `src/app/page.tsx`

The landing page currently leads with "R² = 0.89 correlation with real consumer panels" as a hero-level claim, then later says this is for "early-stage exploration, not replacing high-stakes primary research." This contradicts itself and a CPO will notice immediately.

Resolve this by reframing the R² claim with proper context. Change the heading from "R² = 0.89 correlation with real consumer panels" to something like "R² = 0.89 correlation with real panels in CPG categories". Add a one-sentence qualifier directly under it: "Demonstrated across consumer packaged goods in Brand, Israeli & Ngwe (2025). Performance varies by category, with strongest results where training data is rich."

In the "Why this works" section at the bottom, change "Honest Limitations" copy from the current vague "we clearly communicate what this approach can and cannot do" to something concrete: "Best for CPG, food & beverage, personal care, and household products. Less proven for luxury, B2B, or truly novel categories. We show you exactly where reliability drops so you can decide when to invest in traditional research."

Remove the line "The same methodology used by Nielsen, Ipsos, and McKinsey" from the R² section. This is the biggest credibility issue. HypeTest uses a *simplified version inspired by* conjoint analysis, which is what those firms use. The current framing implies equivalence. Replace it with: "Uses a simplified conjoint-style approach inspired by the same methodology used in professional market research."

Also update the "Built on methodology used by" logo bar at the bottom. Change the heading to "Methodology inspired by" and keep Nielsen/Ipsos/McKinsey, but add a subtitle line: "HypeTest uses a simplified version of choice-based conjoint analysis, the methodology standard at leading research firms."

---

### Change 2: Add a "How the simulation actually works" walkthrough to the methodology page

**File**: `src/app/(marketing)/methodology/page.tsx`

The current methodology page explains what happens at a high level (generate personas, run surveys, aggregate) but never shows what this actually looks like. A CPO wants to see the mechanism, not just the description.

Add a new section between "How HypeTest's methodology works" and "Panel construction" called "What a simulated survey looks like". This should show a concrete example of the survey flow for a single persona. Use a styled card/box layout (consistent with the rest of the page) that walks through:

**Example persona card**: "Sarah, 34, female, $85k household income, suburban Austin, health-conscious lifestyle, occasional premium buyer"

**Then show the 4 questions she would be asked** (these should match what `research-engine.ts` actually does in `queryPersona`):

1. **Purchase Intent**: "On a scale of 1-5, how likely would you be to purchase [Product X] at [price]?" (Show that this is a standard Likert scale, same as used in traditional research)

2. **Price Sensitivity (Conjoint-style choice)**: "Which would you choose?" with three options at different price points plus a "None of these" option. Explain in a small annotation *why* this works better than asking "how much would you pay?" directly: "Indirect elicitation through forced-choice tasks reduces hypothetical bias, the same reason professional research firms moved away from open-ended WTP questions decades ago."

3. **Feature Importance**: "Rank these features by how much they'd influence your decision" (show a sample ranking)

4. **Open-ended response**: "What's your biggest hesitation about this product?" / "What excites you most?"

Use a visual treatment that feels like you're looking at a survey instrument, not reading a paragraph about one. Think: light background card, numbered questions, radio buttons or selection indicators (non-functional, just visual). Keep it compact but concrete.

Below the example, add a short paragraph: "This survey is run independently for each of the 50+ personas in the panel. Each persona responds based on their demographic profile, lifestyle, and category experience. The variation across personas produces a distribution of responses that mirrors what you'd see from a real consumer panel."

---

### Change 3: Explain WHY the approach works, not just THAT it works

**File**: `src/app/(marketing)/methodology/page.tsx`

The current "Why LLMs can simulate consumers" section says LLMs absorbed consumer patterns from training data. This is true but shallow. A CPO wants to understand the mechanism well enough to trust it.

Replace the current content of this section with a more rigorous explanation structured around three key insights:

**Insight 1: LLMs as compressed market knowledge.** LLMs were trained on billions of product reviews, pricing discussions, purchase decision threads, and consumer forums. They haven't just memorised facts about products; they've internalised the *decision patterns* that produce those reviews. When you condition an LLM with a specific demographic profile, it draws on these patterns to produce responses that statistically mirror real consumer preferences in that demographic. Think of it as a lossy compression of millions of real consumer interactions.

**Insight 2: Why indirect elicitation matters.** Even with real humans, asking "how much would you pay for X?" produces unreliable answers. People consistently overstate their willingness to pay when asked directly (this is called hypothetical bias, and it's well-documented in behavioral economics). Professional research firms solved this decades ago by switching to choice-based methods: instead of asking what you'd pay, they show you options at different prices and ask you to choose. This same principle works with LLM-simulated consumers, and for the same reason. The forced-choice format produces more realistic price sensitivity patterns.

**Insight 3: Distributional querying is the key innovation.** A single LLM response is just a point estimate and not very useful on its own. The breakthrough from Brand et al. (2025) was querying the model many times with diverse persona conditioning. Each persona responds slightly differently based on their demographic profile, income, lifestyle, and category experience. Aggregate 50+ of these responses and you get a distribution that approximates real population-level preference distributions. The R² = 0.89 result comes from comparing these aggregated distributions against real panel data.

Format each insight as a subsection within the existing section styling. Use the same icon+heading pattern that exists on the page. Keep paragraphs tight, 2-3 sentences each.

---

### Change 4: Add a "Where this breaks down" section that builds trust through honesty

**File**: `src/app/(marketing)/methodology/page.tsx`

The current limitations section lists four bullet points. It's fine but generic. A sophisticated buyer reads limitations to assess whether you *actually understand* the weaknesses. Vague limitations signal you're checking a box rather than being transparent.

Replace the current limitations section with a more detailed and specific version. Keep the same visual treatment (red icon, styled list) but make each limitation concrete:

1. **Demographic segment precision is limited.** Current LLMs reflect *average* population preferences more reliably than segment-specific ones. If you're trying to understand what 18-24 year old Hispanic males in urban areas think about your product specifically, the simulation won't reliably differentiate that segment from the general population. The Brand et al. research found that aggregate WTP was well-matched but segment-level heterogeneity was less reliable.

2. **Novel categories with no market precedent.** The model's consumer knowledge comes from its training data. For a product category that genuinely doesn't exist yet (not a variation on an existing category, but something truly unprecedented), the model has no reference patterns to draw on. Results for novel categories should be treated with significantly more skepticism. Works well for: "a new oat milk brand." Works less well for: "a device that translates dog emotions into text."

3. **Cultural and regional specificity.** The training data skews heavily toward English-language, US-centric consumer patterns. Results for non-US markets, non-English-speaking audiences, or culturally specific purchasing behaviors (e.g., gifting norms in East Asia, luxury perceptions in Gulf states) are not reliable. We currently scope all results to a US general population context.

4. **The ceiling on precision.** R² = 0.89 is strong correlation but it's not 1.0. That remaining 11% gap matters at the margins. If your pricing decision comes down to a $2 difference, this tool won't reliably distinguish between $12.99 and $14.99. For that level of precision, you need real panelists. HypeTest is designed for directional decisions: should we pursue this concept? Is the $15-25 range right? Which of these three features matters most?

5. **Recency gap.** The model's training data has a cutoff date. If your product depends on very recent cultural trends, viral moments, or category disruptions that happened in the last few months, those won't be reflected in the simulation.

---

### Change 5: Add a "Validate against your own data" CTA path

**Files**: `src/app/(marketing)/methodology/page.tsx`, `src/app/page.tsx`

The CPO's top feedback was: "I'd want to run this on a product I've already fielded traditional research for, and compare." This is the highest-intent conversion path and it doesn't exist on the site.

On the methodology page, replace the current generic "Try it yourself" CTA at the bottom with a more specific validation-oriented CTA:

**Heading**: "The best way to evaluate this? Run it against data you already have."

**Body text**: "Pick a product you've already done traditional consumer research on. Run it through HypeTest. Compare the purchase intent, WTP range, and feature rankings against your existing data. If the results are directionally aligned, you'll know exactly when to use HypeTest and when to invest in a full panel."

**Button**: "Run a validation test" (links to `/research/new`)

On the landing page, add a similar but more compact CTA somewhere in the "Why this works" section. Add a small callout box (use the same amber/highlight treatment as the "Don't have a product yet?" Discovery CTA) that says: "Already have research data? Run HypeTest on the same product and compare results. It's the fastest way to build confidence in the methodology." Link to `/research/new`.

---

### Change 6: Add category-specific confidence indicators to the methodology page

**File**: `src/app/(marketing)/methodology/page.tsx`

The CPO feedback highlighted that the R² = 0.89 claim is presented as universal when it was validated in specific categories. Add a section called "Confidence by category" between the "Where this breaks down" section and the "When to use HypeTest" section.

Create a visual table or grid that shows expected reliability across categories. Use a three-tier system with color coding:

- **High confidence** (green): Consumer packaged goods, food & beverage, personal care, household products, pet products. These categories have the richest training data and the closest match to the validated research.

- **Moderate confidence** (amber): Consumer electronics, apparel & fashion, health & wellness, subscription services, DTC brands. Good results expected but less directly validated. Treat as strong directional signal.

- **Low confidence** (red/muted): Luxury goods, B2B products, financial services, novel/unprecedented categories, culturally specific products. Use for hypothesis generation only, not for decision-making.

Style this as a compact grid with three columns. Use the same emerald/amber/red color palette that already exists on the page for the "Good for" / "Not for" cards. Keep it clean and scannable.

Below the grid, add a one-liner: "These confidence levels are our honest assessment based on training data coverage and validation research. We'll update them as we run more validation studies."

---

### Change 7: Tighten the research citations on the methodology page

**File**: `src/app/(marketing)/methodology/page.tsx`

The current research section lists four papers but treats them all equally. The Brand et al. paper is the direct foundation; the other three are supporting evidence. A researcher or technical buyer will notice if you're padding.

Restructure the section to make the hierarchy clear:

**Primary validation** (larger card, more detail): Brand, Israeli & Ngwe (2025). Keep the existing description but add: "This is the direct foundation for HypeTest's approach. The researchers validated conjoint-style LLM surveys against Prolific panels across multiple CPG categories. Key finding: aggregate WTP distributions from the LLM closely matched real panel distributions, with R² = 0.89."

**Supporting research** (smaller, more compact): Group the other three papers into a "Supporting research" subsection with shorter descriptions. Frame them as: "These studies provide broader evidence that LLMs can simulate human economic and preference behaviors." Keep each to one sentence max.

Also add a note at the bottom of the section: "We track new research in this space actively. As more validation studies are published, we'll update this page and our confidence assessments. Last updated: April 2026."

---

### Change 8: Clean up the landing page "Why this works" section to match the new methodology narrative

**File**: `src/app/page.tsx`

The landing page "Why this works" section currently has three subsections: Academic Foundation, Real Methodology, and Honest Limitations. Update these to be consistent with the changes made above:

**Academic Foundation**: Change to: "Based on Brand, Israeli & Ngwe (2025) from Harvard Business School, who validated that LLM-simulated conjoint surveys produce WTP estimates that closely match real consumer panels in CPG categories (R² = 0.89, n=300)." Add the category qualifier.

**Real Methodology**: Change to: "Each product is tested through a simulated panel of 50+ consumer personas, each with realistic demographics and category experience. Instead of asking 'how much would you pay?' (which produces unreliable answers even with real humans), we use forced-choice tasks at different price points." Make it concrete rather than abstract.

**Honest Limitations**: Change to: "Best validated for CPG, food & beverage, and household products. Less proven for luxury, B2B, or truly novel categories. We publish confidence levels by category so you know exactly what you're getting." Link the words "confidence levels by category" to `/methodology#confidence-by-category` (add an `id` to the relevant section on the methodology page).

---

## After all changes

1. Run `npm run build` and fix any TypeScript or build errors.
2. Run `npx tsc --noEmit` to catch remaining type issues.
3. Review all changed pages visually by checking the JSX structure makes sense and there are no layout issues (orphaned containers, missing closing tags, broken responsive classes).
4. Commit all changes with a clear summary message.
5. Push to the `main` branch on GitHub.
