# Impeccable Full-Site Audit — Every Page, Every Component

Run a comprehensive Impeccable design audit across the entire HypeTest site. The first audit (Round 1) fixed P0/P1 issues: banned font, card grid, type hierarchy, chart colours, animations, spacing, loading state, brand tokens. The second audit prompt (Round 2) focused on consistency patterns. This audit is different: go through every single page and component one by one, visually and structurally, and flag everything.

Read `AGENTS.md` before writing any code.

---

## Site context

- **URL**: https://hypetest.ai
- **Stack**: Next.js App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova preset), Recharts
- **Fonts**: Bricolage Grotesque (display, h1-h3), Manrope (body), Geist Mono (mono)
- **Colour space**: OKLCH throughout. Brand tokens in `src/app/globals.css`: `--color-navy`, `--color-navy-light`, `--color-teal`, `--color-teal-dark`, `--color-teal-light`, `--color-navy-dark-mode`
- **Dark mode**: Class-based `.dark` on `<html>`, full dark palette in `globals.css`, theme toggle in nav
- **Base radius**: `0.625rem` (10px), scaled via `--radius-*` tokens

---

## How to run this audit

For EACH page listed below:

1. **Read the full file** (not just first 60 lines)
2. **Audit in light mode AND dark mode** — flag any hardcoded colours that don't adapt
3. **Audit at 3 breakpoints**: mobile (375px), tablet (768px), desktop (1280px)
4. **Check every element** against Impeccable's rules for: spacing, typography, colour, layout, alignment, hierarchy, consistency, accessibility

For each finding, tag it:
- **P0** — Broken (layout breaks, text unreadable, element hidden, contrast fails WCAG AA)
- **P1** — Accessibility or usability issue (missing focus states, touch targets too small, labels missing)
- **P2** — Visual inconsistency (spacing doesn't match sibling pages, font weight wrong, padding varies)
- **P3** — Polish (micro-alignment, subpixel rounding, subtle colour tweaks)

---

## Pages to audit (in this order)

### Global elements (audit these first, they appear on every page)

**1. Root layout** — `src/app/layout.tsx`
- Font loading: are all 3 fonts (Bricolage, Manrope, Geist Mono) loading correctly?
- `suppressHydrationWarning` present for dark mode flash prevention?
- Body classes: `min-h-full flex flex-col` — does this cause issues on any page?

**2. Global styles** — `src/app/globals.css`
- Light mode `:root` tokens: are all values reasonable? Any near-identical tokens that should be consolidated?
- Dark mode `.dark` tokens: do they maintain sufficient contrast from their light counterparts?
- The `[data-animate]` keyframes: do they respect `prefers-reduced-motion`?
- Print styles: are they complete? Do they break any layout?
- Is there any unused CSS?

**3. Navigation** — `src/components/nav.tsx`
- Logo + wordmark alignment at all breakpoints
- Nav links: spacing, hover states, active states (is current page highlighted?)
- "Pro" badge on Discover link: alignment, colour in light/dark
- Theme toggle button: size, padding, icon swap animation
- "Try it free" CTA button: does it stand out from nav links?
- Mobile: is there a hamburger menu or do nav items just hide? What happens on mobile?
- Sticky header: does `backdrop-blur-sm` work in dark mode? Is the border visible enough?

**4. Footer** — `src/components/footer.tsx`
- Column grid: does it collapse cleanly on mobile?
- Link colours and hover states in light/dark
- Company info: is the legal entity name and address present?
- Spacing between footer and page content above
- Border-top treatment: visible in both themes?

**5. Theme provider** — `src/components/theme-provider.tsx`
- Does the context correctly propagate to all children?
- Is the flash-prevention script in layout.tsx working? (Check for FOUC on dark mode)

---

### Marketing pages

**6. Landing page** — `src/app/page.tsx`
This is the most important page. Audit every section individually:

- **Hero section**: heading size at all breakpoints (uses `clamp()`), subheading line length, CTA button pair alignment, badge pill spacing
- **Social proof / R² section**: scatter plot SVG — does it render cleanly at all sizes? Are axis labels readable? Is the Harvard badge the right colour (should be teal, not red)? Dark mode: does the chart card background contrast with the section background?
- **How it works**: 3-step layout with arrow connectors — do arrows hide on mobile? Is step text alignment consistent? Discovery CTA banner: amber colours in dark mode?
- **What's in a report**: featured cards (dark bg) + icon list below. Are the dark cards readable in dark mode (dark-on-dark)? Icon alignment with text blocks?
- **Sample report**: renders `<SampleReport />` component — audit that component separately (see below)
- **Why this works**: dark navy section with teal accents. In dark mode, does this section still feel distinct from the regular dark background? Text opacity levels (`/70`) — are they readable?
- **CTA section**: final call to action. Enough spacing from section above? Button shadow in dark mode?

**7. Methodology page** — `src/app/(marketing)/methodology/page.tsx`
- "What HypeTest does well" / "Where HypeTest has limits" boxes: green/amber backgrounds in dark mode?
- Research citation formatting: are links styled consistently?
- 4-step methodology section: card spacing, icon alignment
- Panel construction detail: any tables or grids that break on mobile?
- "When to use" boxes: green/not-for styling in both themes

**8. Pricing page** — `src/app/(marketing)/pricing/page.tsx`
- Pricing card grid: how many tiers are shown? Do they align at the same height?
- Feature comparison list within each card: checkmarks, spacing, text wrapping
- Highlighted/recommended tier: is there a visual callout (border, badge, background)?
- CTA buttons per tier: consistent size and style?
- "Enterprise" mention: is it styled as a separate section or inline?
- Dark mode: do card backgrounds differentiate from page background?

**9. Privacy policy** — `src/app/(marketing)/privacy/page.tsx`
- Long-form text: line length (should be max ~75ch), line height, paragraph spacing
- Heading hierarchy: are H2s/H3s visually distinct?
- Any tables or lists: properly formatted?
- Link colours in body text: visible in both themes?
- Mobile readability: font size adequate?

**10. Terms of service** — `src/app/(marketing)/terms/page.tsx`
- Same text formatting checks as privacy page
- Section numbering: if numbered, is it consistent?
- Email addresses or contact info: are they linked?
- Any bold/emphasis: is it used sparingly and consistently?

**11. Validate page** — `src/app/(marketing)/validate/page.tsx`
- Form elements: input styling, label placement, validation states
- Results display: charts, accuracy scores, comparison layout
- Empty state: what shows before the user has submitted anything?

---

### Tool form pages (7 total)

For each of these, check the SAME set of criteria. Flag inconsistencies between them.

**Shared form audit checklist:**
- Container: is it `max-w-2xl mx-auto px-6`? Same on all 7?
- Card wrapping: same `<Card>` component with same padding?
- Page heading: same size, weight, margin-bottom?
- Subheading/description: same text style?
- Field labels: same `text-sm font-medium` pattern?
- Input heights: same across all fields and all forms?
- Textarea heights: consistent?
- Select dropdowns: same component, same styling?
- Spacing between fields: all `space-y-5`?
- Dividers/separators: same treatment?
- Advanced/optional sections: same collapsible pattern?
- Submit button: same height, same `bg-primary`, same text?
- Progress/loading state: same animated dot grid, same stage text pattern, same progress bar?
- Error display: same position, same styling?
- Mobile layout: everything stacks cleanly?
- Dark mode: all form elements adapt?

**12. Research form** — `src/app/research/new/page.tsx`
**13. A/B Test form** — `src/app/ab-test/new/page.tsx`
**14. Pricing Test form** — `src/app/pricing-test/new/page.tsx`
**15. Name Test form** — `src/app/name-test/new/page.tsx`
**16. Audience Test form** — `src/app/audience-test/new/page.tsx`
**17. Competitive form** — `src/app/competitive/new/page.tsx`
**18. Discovery form** — `src/app/discover/new/page.tsx`

After auditing all 7, produce a **cross-form consistency table** showing which forms deviate from the shared pattern and how.

---

### Tool result pages (7 total)

Same approach. Check these shared criteria:

**Shared results audit checklist:**
- Disclaimer banner: same amber styling, same copy pattern?
- Page heading with product name: same size, weight?
- Summary metric cards: same grid, same card sizes, same typography?
- Charts: same Recharts styling, same axis labels, same tooltips, same colour palette?
- Feature importance bars: do long labels truncate properly?
- Concerns/positives sections: same two-column layout?
- Verbatims: same card styling, same quote formatting?
- Methodology card: same muted background treatment?
- Action buttons (Run again, Share, Export): same placement, same styles?
- Loading state (when fetching from Supabase): same skeleton/spinner?
- Not-found state (invalid ID): handled gracefully?
- Mobile: charts readable? Cards stack properly?
- Dark mode: all chart colours visible against dark backgrounds?

**19. Research results** — `src/app/research/[id]/page.tsx` + `src/components/report-view.tsx` + `src/components/results-charts.tsx`
**20. A/B Test results** — `src/app/ab-test/[id]/page.tsx`
**21. Pricing Test results** — `src/app/pricing-test/[id]/page.tsx`
**22. Name Test results** — `src/app/name-test/[id]/page.tsx`
**23. Audience Test results** — `src/app/audience-test/[id]/page.tsx`
**24. Competitive results** — `src/app/competitive/[id]/page.tsx` + `src/components/competitive-radar-chart.tsx`
**25. Discovery results** — `src/app/discover/[id]/page.tsx`

After auditing all 7, produce a **cross-results consistency table** showing deviations.

---

### Utility pages

**26. Compare page** — `src/app/compare/page.tsx`
- Selection UI: how are research results chosen? Dropdown, cards, checkboxes?
- Comparison layout: side-by-side? Tabbed? Does it work with 2 vs 3 results?
- Charts in comparison mode: are they sized consistently?
- Empty state: what shows if user has < 2 results?
- Mobile: comparison views are notoriously hard on mobile. Does it degrade gracefully?

**27. Account page** — `src/app/account/page.tsx`
- Usage stats display: progress bars, quota numbers, plan badge
- Research history list: card styling, date formatting, status indicators
- Slack integration section: webhook input, test button, success/error states
- Plan management: upgrade/downgrade CTAs, billing portal link
- Empty states: new user with no history, no Slack connected
- Dark mode: all sections adapt?

---

### Shared components (audit independently)

**28. Sample report** — `src/components/sample-report.tsx`
- Is it a faithful representation of a real report, or a simplified version?
- Does it use the same styling as actual result pages?
- Are interactive elements (charts) functional or static?

**29. Performance over time** — `src/components/performance-over-time.tsx`
- Line chart: axis labels, grid lines, tooltip, legend
- Responsive: does it resize cleanly?
- Dark mode: line colours, grid colours, label colours

**30. Competitive radar chart** — `src/components/competitive-radar-chart.tsx`
- Radar shape: readable at small sizes?
- Labels: do they overflow the container?
- Colours: distinguishable in both themes?
- Legend: present and styled?

**31. All UI primitives** — `src/components/ui/*.tsx`
Spot-check these for consistency:
- `button.tsx`: do all variants (default, destructive, outline, secondary, ghost, link) work in dark mode?
- `card.tsx`: padding, border, radius consistent with usage across the site?
- `input.tsx` + `textarea.tsx`: focus ring colour, placeholder colour, disabled state
- `select.tsx`: dropdown styling, selected item styling
- `badge.tsx`: all variants visible in both themes?
- `tabs.tsx`: active tab indicator, inactive tab colour
- `progress.tsx`: bar colour, track colour, animation
- `dialog.tsx` + `sheet.tsx`: overlay darkness, content card styling in dark mode

---

## Output format

Produce fixes grouped by priority. For each fix:

```
**[P0/P1/P2/P3] [Page name] — [Short description]**
File: `path/to/file.tsx` (line X)
Current: [what it looks like now]
Fix: [what to change]
Affects: light / dark / both
Breakpoint: mobile / tablet / desktop / all
```

At the end, include:
1. **Cross-form consistency table** (7 forms compared)
2. **Cross-results consistency table** (7 result pages compared)
3. **Dark mode gap list** (every hardcoded colour that needs a `dark:` variant)
4. **Spacing normalisation map** (current inconsistent values → recommended standard values)

---

## Rules

1. Read every file listed. Do not skip pages or truncate reads.
2. Every finding must reference a specific file and line number.
3. Fix all P0 and P1 issues. Fix P2 issues that affect 3+ pages. Log P3 as comments.
4. Commit after each logical group of fixes (not one giant commit).
5. Do not change brand tokens, font choices, colour space, or page layouts.
6. Do not change copy or content.
7. If a component is well-implemented and consistent, say so. Don't manufacture issues.
