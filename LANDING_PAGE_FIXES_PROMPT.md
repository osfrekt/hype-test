# Landing Page Fixes Prompt

Two changes to the landing page at `src/app/page.tsx`. Read `AGENTS.md` before writing any code.

---

## Fix 1: Harvard badge colour looks like an error

The "Harvard Business School Working Paper" pill badge (line ~53) currently uses red styling:

```tsx
className="inline-flex items-center gap-2 bg-red-900/10 border border-red-900/20 text-red-900 text-sm font-semibold px-3 py-1.5 rounded-full mb-4"
```

The red makes it look like a warning or error message, not a credibility signal. Change it to use the brand teal palette instead, matching the style of the hero pill badge above it:

- Background: `bg-teal/10`
- Border: `border border-teal/20`
- Text: `text-teal-dark dark:text-teal-light`

Keep the book icon SVG as-is, just update the colour classes on the containing `div`.

---

## Fix 2: Add a sales-focused "Why HypeTest" section

The page currently has a "Why this works" section that focuses on methodology and academic credibility. That's good, but the page is missing a straightforward, benefit-driven section that answers "why should I care?" for someone skimming.

Add a new section **between the "How HypeTest works" section and the "What's in a HypeTest report" section**. It should be a simple, punchy value proposition block with 3 benefit points.

### Structure

```
Section title: "Why HypeTest"
Subtitle: (none — keep it tight)

Three benefit cards in a row (stack on mobile), each with:
- A short bold headline
- 1-2 sentences of supporting copy

Benefit 1:
  Headline: "Real accuracy, not AI guesswork"
  Copy: "Built on peer-reviewed methodology that achieved R² = 0.89 correlation with real consumer panels. This isn't a chatbot opinion — it's structured research."

Benefit 2:
  Headline: "Save months and thousands"
  Copy: "Traditional consumer panels cost $20-50k and take 4-6 weeks. HypeTest gives you comparable insights in under 2 minutes, completely free."

Benefit 3:
  Headline: "Know before you launch"
  Copy: "Test product ideas, pricing, and positioning before spending a penny on production. Find out what consumers actually want, not what you hope they want."
```

### Styling

- Section background: plain (no `bg-card`), to create visual contrast with the `bg-card` sections above and below it
- Cards: `bg-card rounded-2xl border border-border/50 p-6`
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-5`
- Headlines: `text-base font-bold text-primary mb-2`
- Copy: `text-sm text-muted-foreground leading-relaxed`
- Section title: same `font-bold text-primary` heading style used by other sections, with the responsive `clamp()` font size pattern
- Section padding: `py-14` matching adjacent sections

No CTA button in this section. Keep it purely informational so it reads as value props, not another conversion push.

---

## What NOT to change

- Do not touch the "Why this works" section — it stays as-is
- Do not change copy in any other section
- Do not modify any other components
