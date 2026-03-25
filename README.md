# HypeTest

AI-powered consumer research in minutes, not months. Simulate a panel of 50 diverse consumer personas to get purchase intent, willingness-to-pay estimates, feature priorities, and consumer concerns for any product or idea.

Built on methodology from Brand, Israeli & Ngwe (2025), Harvard Business School — demonstrating that LLM-simulated consumer panels produce WTP estimates comparable to real human panels.

## How it works

1. **Describe your product** — name and free-text description
2. **Panel simulation** — 50 consumer personas (varied age, income, gender, location, lifestyle) each answer a structured survey with purchase intent, conjoint-style price sensitivity, feature ranking, concerns, and positives
3. **Results report** — aggregated purchase intent score, WTP range, feature importance, top concerns/positives, and consumer verbatims

## Tech stack

- **Framework:** Next.js 16 (App Router, React 19)
- **AI:** Anthropic Claude API (Haiku 4.5 for persona queries)
- **UI:** Tailwind CSS 4, shadcn/ui, Recharts
- **Auth/DB:** Supabase (SSR) — wired up but not yet fully integrated
- **Language:** TypeScript

## Getting started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You'll need an [Anthropic API key](https://console.anthropic.com/) with access to `claude-haiku-4-5-20251001`.

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── (marketing)/
│   │   ├── methodology/page.tsx    # How it works page
│   │   └── pricing/page.tsx        # Pricing page
│   ├── research/
│   │   ├── new/page.tsx            # New research form + progress UI
│   │   └── [id]/page.tsx           # Results report page
│   └── api/
│       └── research/route.ts       # POST endpoint — runs the research engine
├── lib/
│   ├── research-engine.ts          # Core engine: persona querying, aggregation, verbatims
│   ├── personas.ts                 # Panel generation (demographics, lifestyles)
│   └── utils.ts                    # Tailwind merge utility
├── types/
│   └── research.ts                 # TypeScript interfaces for all research data
└── components/
    ├── nav.tsx                     # Site navigation
    ├── footer.tsx                  # Site footer
    ├── results-charts.tsx          # Recharts visualizations for results
    └── ui/                         # shadcn/ui primitives
```

## Key areas for contribution

- **Supabase integration** — auth and persisting research results (Supabase deps are installed but not wired into the research flow yet)
- **Streaming results** — the API currently returns all results at once; could use SSE for real-time progress
- **Panel customization** — let users configure panel size, demographics, or target market segments
- **Result sharing** — shareable links for research reports (requires persistence)
- **Improved WTP methodology** — the conjoint-style elicitation could be expanded with more price points and attribute trade-offs
- **Testing** — no tests yet

## Notes

- Results are stored in `sessionStorage` — refreshing the results page loses them (persistence via Supabase is the fix)
- The research engine batches persona queries (10 at a time) to avoid rate limits
- Each research run makes ~55 API calls to Claude Haiku (50 persona queries + feature extraction + price inference + verbatims)
- The `AGENTS.md` and `CLAUDE.md` files are for AI coding assistants (Claude Code) — they contain instructions for working with this codebase
