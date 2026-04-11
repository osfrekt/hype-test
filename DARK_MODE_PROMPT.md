# HypeTest: Dark Mode Implementation Prompt

Use this prompt with Claude Code in the `hype-test` directory. Run it as a single session.

---

## Context

HypeTest is a Next.js 16 app using Tailwind 4, shadcn/ui (base-nova preset, neutral base), React 19, and OKLCH colour tokens defined as CSS variables in `src/app/globals.css`. The app currently has light mode only, but much of the dark mode infrastructure is already in place:

- `@custom-variant dark (&:is(.dark *))` is already defined in globals.css (line 5), meaning the `.dark` class on an ancestor activates dark mode
- shadcn/ui components (button, input, textarea, badge, select) already have `dark:` classes baked in
- All colours use semantic CSS variable tokens (`--background`, `--foreground`, `--card`, `--primary`, etc.)
- Fonts: Bricolage Grotesque (display), Manrope (body), Geist Mono (mono)
- Custom brand tokens: `--color-navy`, `--color-navy-light`, `--color-teal`, `--color-teal-dark`

**Important**: Read `AGENTS.md` at the project root before writing any code. It warns this Next.js version may differ from your training data. Check `node_modules/next/dist/docs/` for correct API conventions.

### Key files

- **CSS variables & theme**: `src/app/globals.css` (all `:root` tokens here, no `.dark` block yet)
- **Root layout**: `src/app/layout.tsx` (html element, no theme class management yet)
- **Navigation**: `src/components/nav.tsx` (where the toggle will go)
- **Landing page**: `src/app/page.tsx` (has dark sections like "Why this works" with hardcoded bg-navy)
- **Report view**: `src/components/report-view.tsx` (cards, charts, methodology box)
- **Charts**: `src/components/results-charts.tsx` (Recharts with OKLCH-derived colours, hardcoded grid/text colours)
- **Footer**: `src/components/footer.tsx`
- **Methodology page**: `src/app/(marketing)/methodology/page.tsx`
- **Pricing page**: `src/app/(marketing)/pricing/page.tsx`
- **Research form**: `src/app/research/new/page.tsx`
- **Discovery pages** (if they exist): `src/app/discover/new/page.tsx`, `src/app/discover/[id]/page.tsx`

---

## What to implement

There are 5 parts. Do them in order. Run `npm run build` after each, fix errors, commit after each.

---

### Part 1: Dark mode colour palette

**File**: `src/app/globals.css`

Add a `.dark` block after the `:root` block that redefines all the semantic colour tokens for dark mode. Stay in OKLCH colour space to match the existing system. The dark palette should feel like a professional data product (think Linear, Vercel dashboard), not a generic grey-on-black inversion.

```css
.dark {
  --background: oklch(0.13 0.015 260);
  --foreground: oklch(0.93 0.01 260);
  --card: oklch(0.17 0.015 260);
  --card-foreground: oklch(0.93 0.01 260);
  --popover: oklch(0.17 0.015 260);
  --popover-foreground: oklch(0.93 0.01 260);
  --primary: oklch(0.93 0.01 260);
  --primary-foreground: oklch(0.13 0.015 260);
  --secondary: oklch(0.22 0.015 260);
  --secondary-foreground: oklch(0.88 0.01 260);
  --muted: oklch(0.22 0.015 260);
  --muted-foreground: oklch(0.65 0.015 260);
  --accent: oklch(0.7 0.17 220);
  --accent-foreground: oklch(0.13 0.015 260);
  --destructive: oklch(0.65 0.22 27);
  --border: oklch(0.27 0.015 260);
  --input: oklch(0.27 0.015 260);
  --ring: oklch(0.7 0.17 220);
  --chart-1: oklch(0.7 0.17 220);
  --chart-2: oklch(0.6 0.16 260);
  --chart-3: oklch(0.75 0.13 180);
  --chart-4: oklch(0.65 0.18 300);
  --chart-5: oklch(0.8 0.1 80);
  --sidebar: oklch(0.13 0 0);
  --sidebar-foreground: oklch(0.93 0 0);
  --sidebar-primary: oklch(0.93 0 0);
  --sidebar-primary-foreground: oklch(0.13 0 0);
  --sidebar-accent: oklch(0.22 0 0);
  --sidebar-accent-foreground: oklch(0.93 0 0);
  --sidebar-border: oklch(0.27 0 0);
  --sidebar-ring: oklch(0.45 0 0);
}
```

Also update the `@theme inline` block to add dark-aware versions of the brand tokens. Add these lines inside the existing `@theme inline { }`:

```css
  --color-navy-dark-mode: oklch(0.85 0.03 260);
  --color-teal-light: oklch(0.75 0.16 220);
```

These give you lighter navy and teal variants to use in dark mode where the existing navy/teal would have poor contrast against dark backgrounds.

---

### Part 2: Theme provider and persistence

**File**: `src/components/theme-provider.tsx` (new file)

Create a minimal theme provider that manages the `.dark` class on the `<html>` element and persists the preference to localStorage. Do NOT use next-themes or any external library. Keep it simple:

```typescript
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("hypetest-theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (theme === "dark" || (theme === "system" && systemDark)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("hypetest-theme", theme);
  }, [theme]);

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**File**: `src/app/layout.tsx`

Wrap `{children}` in the `ThemeProvider`. Add `suppressHydrationWarning` to the `<html>` element to prevent a flash mismatch since the theme class is set client-side.

**Flash prevention**: Add an inline script in layout.tsx's `<head>` that reads localStorage and applies the `.dark` class before React hydrates:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        try {
          var theme = localStorage.getItem('hypetest-theme');
          var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (theme === 'dark' || (!theme && systemDark) || (theme === 'system' && systemDark)) {
            document.documentElement.classList.add('dark');
          }
        } catch(e) {}
      })();
    `,
  }}
/>
```

---

### Part 3: Theme toggle in navigation

**File**: `src/components/nav.tsx`

Add a theme toggle button to the nav bar, positioned between the nav links and the "Try it free" CTA button.

The toggle should cycle through three states: light → dark → system. Use icons from lucide-react: `Sun` for light, `Moon` for dark, `Monitor` for system. Show only the icon (no text) to keep the nav compact. Add a tooltip or `title` attribute showing the current mode.

Style it as a ghost button: `p-2 rounded-lg hover:bg-muted transition-colors`. In dark mode, make sure the icon colour is visible (use `text-foreground`).

The toggle calls `setTheme()` from the `useTheme` hook.

---

### Part 4: Fix hardcoded colours throughout the app

This is the most important part. Many components use hardcoded colours that won't adapt in dark mode. Go through every file and fix these:

**`src/components/nav.tsx`**:
- The nav header has `bg-white/80`. Change to `bg-background/80`.
- The logo icon has `stroke="white"`. This is fine (it's inside a navy background box).
- The nav text is `text-navy`. Change to `text-foreground` or `text-primary`.

**`src/components/footer.tsx`**:
- Check for hardcoded bg/text colours and replace with semantic tokens.

**`src/app/page.tsx`** (landing page):
- The hero section likely has `bg-blue-50/50` or similar hardcoded light backgrounds. Change to `bg-accent/5` or similar.
- The "Why this works" section has a dark navy background (`bg-navy` or similar). This works in light mode but in dark mode it'll look odd against the dark background. Wrap it in a conditional: in dark mode, use a slightly elevated surface colour (`bg-card` or `bg-secondary`) with a subtle border instead of the full dark treatment. Or keep it as-is if the contrast works.
- The brand bar section may have hardcoded text colours.
- The sample report section may have a light background that needs adapting.

**`src/components/report-view.tsx`**:
- `text-navy` references throughout. Change to `text-primary` or `text-foreground`.
- The methodology card uses `border-teal/20 bg-teal/5`. These work in both modes since they're opacity-based on the teal token, but verify the contrast is sufficient in dark mode.
- `text-red-700` and `text-emerald-700` for concerns/positives headings. These need dark variants: add `dark:text-red-400` and `dark:text-emerald-400`.

**`src/components/results-charts.tsx`**:
- Recharts grid lines are hardcoded: `stroke="#e5e7eb"`. These will be invisible in dark mode. Change to a CSS variable reference. Since Recharts doesn't read CSS variables directly, read the computed value using a ref or pass the colours as props. The simplest approach: use `stroke="currentColor"` with a low opacity wrapper, or hardcode two values and switch based on a `dark` class check. A practical approach: read `document.documentElement.classList.contains('dark')` in a `useMemo` and set grid colour to `"#374151"` in dark mode and `"#e5e7eb"` in light mode.
- Tooltip `border: "1px solid #e5e7eb"` needs the same treatment.
- Any `fill="#374151"` on labels needs to flip to a lighter colour in dark mode.

**`src/app/research/new/page.tsx`**:
- `text-navy` references. Change to `text-primary`.
- `bg-navy` on buttons. Change to `bg-primary`.
- The progress bar uses `bg-teal` which should work in both modes.

**`src/app/(marketing)/methodology/page.tsx`**:
- The green/amber tinted boxes ("What HypeTest does well" / "Where HypeTest has limits") use `bg-emerald-50` and `bg-amber-50` (or similar). In dark mode these need to become `dark:bg-emerald-950/30` and `dark:bg-amber-950/30`.
- `text-navy` references. Change to `text-foreground`.

**`src/app/(marketing)/pricing/page.tsx`**:
- `border-teal` on the free tier card. Works in both modes.
- `bg-navy` on buttons. Change to `bg-primary`.
- `text-navy` references.

**General rule**: Search the entire `src/` directory for these patterns and replace them:
- `text-navy` → `text-primary` (in most cases)
- `bg-navy` (on buttons/CTAs) → `bg-primary`
- `bg-white` → `bg-background` or `bg-card`
- `hover:bg-navy-light` → `hover:bg-primary/90`
- Any hardcoded hex colour in inline styles → use a dark mode check or CSS variable

Also search for `bg-navy` used as a section background (like the "Why this works" dark section on the landing page). These intentionally dark sections need special treatment: in light mode they're the dramatic contrast element, in dark mode they should either invert to a light card or use a subtly different surface. Use your judgment per section.

---

### Part 5: Discovery pages (if they exist)

If `src/app/discover/new/page.tsx` and `src/app/discover/[id]/page.tsx` exist, apply the same dark mode fixes as the research pages: replace hardcoded `text-navy`, `bg-navy`, `bg-white` with semantic tokens.

If the discovery pages don't exist yet, skip this step.

---

## After all parts

1. Run `npm run build` and fix any errors.
2. Run `npx tsc --noEmit`.
3. Test visually: toggle between light and dark mode and check every page (landing, methodology, pricing, research form, results, discovery if exists). Make sure:
   - No white text on white backgrounds
   - No black text on black backgrounds
   - Charts are readable in both modes
   - The methodology teal box has sufficient contrast
   - The loading spinner/progress bar is visible in dark mode
   - The "Why this works" dark section on the landing page works in both modes
4. Commit all changes.
5. Push to main.
