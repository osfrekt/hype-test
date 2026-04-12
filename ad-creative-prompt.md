# Ad/Creative Testing Feature: Full Implementation Prompt

## Context

HypeTest is an AI consumer research platform that simulates panels of 50 demographically-diverse consumer personas to evaluate product concepts. The codebase is a Next.js App Router project using:

- Anthropic SDK for LLM queries (`src/lib/*.ts` engines)
- Supabase for storage
- Stripe for billing
- Persona system in `src/lib/personas.ts` (generates panels of 50 consumers with age, gender, income, location, lifestyle, and category context)
- Shared components: Nav, Footer, UI components in `src/components/`

The existing test types follow a consistent pattern. Study each one before building:

- **Types**: `src/types/ab-test.ts`, `src/types/name-test.ts`, `src/types/pricing-test.ts`, etc.
- **Engines**: `src/lib/ab-test-engine.ts`, `src/lib/name-test-engine.ts`, `src/lib/research-engine.ts`, etc.
- **API routes**: `src/app/api/ab-test/route.ts`, `src/app/api/name-test/route.ts`, etc.
- **Pages**: Each test type has `src/app/{test-type}/new/page.tsx` (input form), `src/app/{test-type}/[id]/page.tsx` (results), `src/app/{test-type}/sample-rekt/page.tsx` (sample report)
- **Pricing**: `src/app/(marketing)/pricing/page.tsx` defines 4 tiers: Free, Starter ($49), Pro ($149), Team ($349)
- **Methodology**: `src/app/(marketing)/methodology/page.tsx` has research citations in a structured format (primary validation, supporting research, industry research)

Read every one of these files before writing any code. Understand the patterns deeply, then replicate them exactly.

## What to Build

### New feature: Ad/Creative Testing

A tool where users can test ad creative, messaging, taglines, or marketing copy against the same simulated consumer panel used across HypeTest. Users should be able to input:

1. **Brand context** (brand name, category, target audience description)
2. **Creative inputs** (support both text-based and image-based):
   - Ad copy / messaging / tagline (text input)
   - Optional: image URL for visual creative (the LLM can evaluate based on the described visual, or if using Claude's vision, the actual image)
3. **Test mode**: Either:
   - **Single creative test**: Evaluate one piece of creative against the panel (like the core research tool)
   - **A/B creative test**: Compare two pieces of creative head-to-head (like the existing A/B concept test)

### What the panel should evaluate for each creative

Each simulated persona should rate/respond to:

1. **Attention score** (1-5): Would this stop you scrolling? Would you notice this ad?
2. **Message clarity** (1-5): Do you understand what's being offered and why it matters?
3. **Persuasion score** (1-5): Does this make you want to learn more or take action?
4. **Brand fit** (1-5): Does this feel authentic to the brand described?
5. **Emotional response**: One-word emotional reaction (e.g., "curious", "confused", "excited", "indifferent")
6. **Key takeaway**: In one sentence, what is this ad saying to you?
7. **Would you click?**: Yes/No/Maybe
8. **Biggest strength**: One sentence on what works
9. **Biggest weakness**: One sentence on what doesn't

### Results should include

- Overall scores (aggregated across panel) for attention, clarity, persuasion, brand fit
- Click-through likelihood distribution (% yes / maybe / no)
- Emotional response word cloud or frequency breakdown
- Top 5 strengths and top 5 weaknesses (aggregated from verbatims)
- Demographic breakdown of scores (by age bracket, gender, income level, just like existing research reports)
- For A/B mode: clear winner declaration with margin, side-by-side comparison of all metrics
- Methodology card at the bottom (like existing reports)

### Sample report

Create a sample report at `/ad-test/sample-rekt/page.tsx` that shows what results look like, using Rekt (an energy drink brand) as the example. Make up realistic sample data showing a test of two ad concepts for Rekt.

## Pricing Tier Placement

Use your judgment on which tier this should sit in, but here's context for your decision:

- **Free tier** currently includes: core consumer research (3 runs/month)
- **Starter tier** ($49/mo) currently includes: A/B concept testing, name testing, pricing optimizer (30 runs/month)
- **Pro tier** ($149/mo) currently includes: Product discovery, audience finder, competitive teardown (100 runs/month)
- **Team tier** ($349/mo): Same as Pro but with 5 seats and shared library

Consider: Ad/creative testing is a natural extension of the testing tools. It's not core consumer research (that's product validation), and it's not strategic discovery (that's Pro). It most closely resembles the A/B concept testing in the Starter tier, but applied to ads rather than product concepts. Make your own call on where it fits, and update the pricing page accordingly. Add it to:

1. The `featureCategories` array in the pricing page (in the appropriate category)
2. The tool cards section at the bottom of the pricing page
3. The plan explainer cards if relevant
4. Gate it behind the appropriate plan in the API route (check how existing routes use `checkQuota`)

## Methodology and Research

Update the methodology page (`src/app/(marketing)/methodology/page.tsx`) to add a new section specifically about ad/creative testing methodology. This should sit after the existing consumer research methodology but before the limitations section.

### Research to cite for ad/creative testing

Add these to the methodology page in the same card format used for existing citations:

**Primary validation for ad/creative testing:**

1. **"LLM-Generated Ads: From Personalization Parity to Persuasion Superiority" (2025)**
   - URL: https://arxiv.org/html/2512.03373
   - Key finding: First systematic comparison of LLM-generated vs human-created advertising. LLM ads match humans on personalisation and outperform on persuasion under certain conditions.

2. **"Large Language Model in Creative Work" (2024) - Management Science**
   - URL: https://pubsonline.informs.org/doi/10.1287/mnsc.2023.03014
   - Key finding: Controlled experiment measuring real ad quality using social media click metrics. LLM feedback on human-written creative improved measurable performance.

3. **"Applying Large Language Models to Sponsored Search Advertising" (2024) - Marketing Science**
   - URL: https://pubsonline.informs.org/doi/10.1287/mksc.2023.0611
   - Key finding: Field experiments (30,799+ impressions). Giving the LLM more context about the brand and audience significantly improves ad quality output. Bigger models alone don't help; persona conditioning does.

**Supporting research:**

4. **"A Meta-Analysis of the Persuasive Power of Large Language Models" (2025)**
   - URL: https://www.arxiv.org/pdf/2512.01431
   - Key finding: First meta-analysis synthesising all existing research on LLM persuasiveness vs humans.

5. **"CXSimulator: User Behavior Simulation using LLM Embeddings for Web-Marketing Campaign Assessment" (2024)**
   - URL: https://arxiv.org/html/2407.21553v1
   - Key finding: Framework for assessing marketing campaign effects through simulated user behaviour without costly A/B tests.

6. **"How Good are LLMs in Generating Personalized Advertisements?" (2024) - ACM Web Conference**
   - URL: https://dl.acm.org/doi/abs/10.1145/3589335.3651520
   - Key finding: User study comparing LLM-generated ads tailored to personality traits against human-written ads across different online environments.

### Also add these to the existing consumer research citations (if not already present)

7. **PyMC Labs - "AI Synthetic Consumers Now Rival Real Surveys"**
   - URL: https://www.pymc-labs.com/blog-posts/AI-based-Customer-Research
   - Key finding: 90% correlation with product ranking in human surveys, 85%+ distributional similarity.

8. **Qualtrics (2025) - "The Synthetic Research Breakthrough"**
   - URL: https://www.qualtrics.com/articles/strategy-research/synthetic-research-breakthrough/
   - Key finding: Fine-tuned models significantly outperform general-purpose AI for consumer research.

### Methodology explanation for ad testing

Write a clear explanation of why LLM panels can evaluate ad creative, following the same structure as the existing "Why LLMs can simulate consumers" section. Key points to cover:

- LLMs have been trained on enormous volumes of ad copy, marketing campaigns, consumer reactions to advertising, click-through data discussions, and A/B test case studies. They've internalised what makes ads effective across different demographics.
- The Marketing Science paper specifically showed that persona conditioning (giving the LLM context about the audience) significantly improves ad evaluation quality. This is exactly what HypeTest does with its demographic personas.
- The Management Science paper validated that LLM evaluation of ad creative correlates with real social media engagement metrics (clicks). This isn't just subjective assessment; it tracks real-world performance.
- Include the same honest limitations section: ad testing works best for text-based creative; visual evaluation is more limited; results are directional signals, not replacements for real campaign analytics; performance may vary for highly niche or culturally specific audiences.

## Holistic Integration

Think about how ad/creative testing fits into the overall site beyond just adding a new route:

1. **Homepage** (`src/app/page.tsx`): If the homepage showcases test types or tools, add ad/creative testing there
2. **Navigation** (`src/components/nav.tsx`): If there's a dropdown or menu of tools, add it
3. **Compare page** (`src/app/compare/page.tsx`): If this exists for cross-test comparison, consider integration
4. **Email reports** (`src/lib/email.ts`): Add email report delivery for ad test results, following the pattern of `sendAbTestReport`
5. **Sitemap** (`src/app/sitemap.ts`): Add the new routes
6. **Dashboard/history**: If there's a test history view, make ad tests show up there too

## Important Notes

- Read the Next.js docs at `node_modules/next/dist/docs/` before writing any code (per AGENTS.md)
- Follow the exact patterns of existing test types. Don't invent new patterns.
- Use the same persona system from `src/lib/personas.ts`
- Use the same rate limiting, quota checking, and auth patterns from existing API routes
- Use the same UI components (Card, Badge, Progress, etc.) and styling conventions
- The brand is "HypeTest" and should be referenced consistently
- Keep copy concise and confident, not salesy
- Do not use em dashes or double dashes anywhere in copy
- Do not use AI-sounding phrases like "dive into", "leverage", "it's important to note"
- Always spell it "Rekt" (capital R, rest lowercase) in the sample report
