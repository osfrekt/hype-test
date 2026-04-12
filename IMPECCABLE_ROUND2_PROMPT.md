# Impeccable Round 2 — UI/UX Polish Audit

Run a second Impeccable audit pass on the HypeTest codebase. The first round (11 commits) fixed P0/P1 issues: banned font replacement, card grid breakup, type hierarchy, chart colours, animations, spacing, loading state, and brand tokens. This round focuses on consistency, polish, and the expanded feature set that now exists.

Read `AGENTS.md` before writing any code.

---

## Site context

- **URL**: https://hypetest.ai
- **Stack**: Next.js (App Router), React, TypeScript, Tailwind CSS 4, shadcn/ui, Recharts
- **Fonts**: Bricolage Grotesque (display, on h1-h3), Manrope (body), Geist Mono (mono)
- **Colour space**: OKLCH throughout. Brand tokens: `--color-navy`, `--color-teal`, `--color-teal-dark`, `--color-navy-light`, `--color-teal-light`, `--color-navy-dark-mode`
- **Dark mode**: Class-based `.dark` toggle with full OKLCH dark palette in `globals.css`
- **Base radius**: `0.625rem` (10px)

---

## Pages to audit

The site has grown significantly. Make sure the audit covers ALL of these:

### Marketing pages
- `src/app/page.tsx` — Landing page (hero, social proof, how it works, what you get, sample report, why this works, CTA)
- `src/app/(marketing)/methodology/page.tsx`
- `src/app/(marketing)/pricing/page.tsx`
- `src/app/(marketing)/privacy/page.tsx`
- `src/app/(marketing)/terms/page.tsx`
- `src/app/(marketing)/validate/page.tsx`

### Tool pages (forms + results)
- `src/app/research/new/page.tsx` + `src/app/research/[id]/page.tsx`
- `src/app/ab-test/new/page.tsx` + `src/app/ab-test/[id]/page.tsx`
- `src/app/pricing-test/new/page.tsx` + `src/app/pricing-test/[id]/page.tsx`
- `src/app/name-test/new/page.tsx` + `src/app/name-test/[id]/page.tsx`
- `src/app/audience-test/new/page.tsx` + `src/app/audience-test/[id]/page.tsx`
- `src/app/competitive/new/page.tsx` + `src/app/competitive/[id]/page.tsx`
- `src/app/discover/new/page.tsx` + `src/app/discover/[id]/page.tsx`

### Shared components
- `src/components/nav.tsx`
- `src/components/footer.tsx`
- `src/components/report-view.tsx`
- `src/components/results-charts.tsx`
- `src/components/sample-report.tsx`
- `src/components/performance-over-time.tsx`
- `src/components/competitive-radar-chart.tsx`
- `src/components/theme-provider.tsx`
- All `src/components/ui/*.tsx` primitives

### Styles
- `src/app/globals.css`

---

## Known issues to check for

These were identified during codebase review. The audit should confirm and fix them, plus flag anything else Impeccable catches.

### 1. Spacing inconsistency across sections
Landing page vertical section padding alternates between `py-12`, `py-14`, and `py-16` with no clear rationale. Pick one value (recommend `py-16` or `py-20`) and apply it consistently to all landing page sections. Inner spacing (`mb-3`, `mb-4`, `mb-5` between headings and body) also varies section to section.

### 2. Border opacity lacks hierarchy rules
Borders use `border-border/50`, `border-border/20`, `border-teal/20`, and plain `border-border` without a clear system. Establish a rule:
- Structural borders (section dividers, card edges): `border-border/50`
- Subtle/decorative borders: `border-border/30`
- Accent borders (teal-highlighted sections): `border-teal/20`
- Remove any bare `border-border` that aren't intentionally full-opacity

### 3. Card padding inconsistency
Cards across the site use `p-4`, `p-6`, `px-4 py-6`, `px-6 py-4` with no pattern. Standardise:
- Compact cards (metric tiles, badges): `p-4`
- Standard cards (form sections, report sections): `p-6`
- Featured cards (hero-level, dark background): `p-8`

### 4. Font weight hierarchy unclear
`font-medium`, `font-semibold`, `font-bold`, and `font-extrabold` are used without consistent mapping to element types. Establish:
- `font-extrabold`: h1 only
- `font-bold`: h2, h3, card titles
- `font-semibold`: nav links, button text, labels
- `font-medium`: body emphasis, badge text
- Never use `font-extrabold` on anything smaller than a page heading

### 5. Form pages may not share consistent patterns
With 7 different tool forms (research, ab-test, pricing-test, name-test, audience-test, competitive, discover), check that they all follow the same layout pattern:
- Same `max-w-2xl mx-auto px-6` container
- Same Card wrapping
- Same field spacing (`space-y-5` between fields, `space-y-1.5` within label+input groups)
- Same submit button styling and height
- Same progress/loading state pattern

### 6. Results pages may not share consistent patterns
Similarly, 7 result pages should share:
- Same disclaimer banner styling
- Same section heading treatment
- Same chart container spacing
- Same "Run again" / "Share" button placement if those exist

### 7. Button size scale
The button component has `xs`, `sm`, `default`, `lg` sizes. Check that:
- Primary CTAs on landing page use `lg`
- Form submit buttons use `default` or `lg` consistently
- Inline/secondary actions use `sm`
- No page uses raw height classes (`h-9`, `h-11`, `h-14`) directly instead of the button size variants

### 8. Dark mode coverage gaps
Dark mode was added recently. Check every page for:
- Hardcoded colour values that don't swap (e.g., `text-red-700`, `bg-white`, `bg-gray-50`, hex colours in SVGs)
- `bg-amber-50`, `bg-emerald-50`, `bg-red-50` or similar Tailwind palette colours that need `dark:` variants
- Chart colours that become invisible on dark backgrounds
- Border colours that disappear against dark cards

### 9. Mobile responsiveness
Check all pages at 375px width for:
- Text overflow or truncation issues
- Cards that don't stack properly
- Charts that are too small to read
- Buttons or CTAs that are too narrow to tap
- Horizontal scroll caused by fixed-width elements

### 10. Accessibility
- Colour contrast ratios for all text/background combinations (especially `text-muted-foreground` on both light and dark backgrounds)
- All interactive elements must have visible focus states
- Charts need `aria-label` or `aria-describedby`
- SVG icons should have `aria-hidden="true"` if decorative, or proper labels if meaningful
- Form inputs need associated labels (not just placeholders)

---

## How to run

1. Run `npx impeccable audit` (or however the CLI is invoked) against the full `src/` directory
2. Prioritise fixes as P0 (broken), P1 (accessibility/usability), P2 (visual consistency), P3 (polish)
3. Fix all P0 and P1 issues. Fix P2 issues if they affect more than 2 pages. Log P3 issues as comments for later.
4. Commit after each logical group of fixes (not one giant commit)

---

## Do NOT change

- The brand colour tokens themselves (navy, teal palette) — those are final
- Font choices (Bricolage Grotesque, Manrope, Geist Mono) — those are final
- The OKLCH colour space approach — do not convert to hex/hsl
- Any copy/content — this is a visual/structural audit only
- The overall page layouts and section order on the landing page
