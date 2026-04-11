# Logo Generation Prompt — HypeTest

Generate 6 distinct SVG logo variations for **HypeTest**, a SaaS product that simulates consumer research panels using AI. Each logo should be saved as a separate `.svg` file in a new `public/logos/` directory, plus a preview HTML page that displays all 6 side by side.

---

## Brand Context

- **Product**: HypeTest — AI-powered consumer research simulation
- **Tagline**: "Consumer research in minutes, not months"
- **What it does**: Simulates a panel of real consumers for any product/idea. Returns willingness-to-pay, feature priorities, purchase intent, and competitive positioning.
- **Audience**: CPG founders, product managers, brand strategists, researchers
- **Tone**: Scientific credibility meets startup speed. Trustworthy but not stuffy. Modern but not gimmicky.
- **Fonts**: Bricolage Grotesque (display), Manrope (body)
- **Colour palette** (OKLCH — use these as the primary palette):
  - Navy: `oklch(0.2 0.04 260)` → approx `#0f172a`
  - Navy light: `oklch(0.26 0.04 260)` → approx `#1e293b`
  - Teal: `oklch(0.65 0.19 220)` → approx `#0891b2`
  - Teal dark: `oklch(0.55 0.17 220)` → approx `#0e7490`
  - Foreground: `oklch(0.18 0.02 260)` → approx `#0c0f1a`
  - Background: `oklch(0.985 0.002 240)` → approx `#fafbfc`

---

## Logo Requirements

Each SVG must:
1. Be a **clean vector** — no raster images, no filters that degrade at scale
2. Work at **24×24** (favicon), **40×40** (nav), and **200×200** (marketing) sizes
3. Include both an **icon-only** version and a **wordmark** version (icon + "HypeTest" text) as separate `<g>` groups with IDs `icon` and `wordmark`
4. Use a `viewBox` with no fixed `width`/`height` so it scales cleanly
5. Use the brand colours above — each logo should primarily use navy + teal
6. Have **no external dependencies** (no linked fonts — convert any text to paths, or use basic SVG text with `font-family="system-ui, sans-serif"`)

---

## The 6 Variations

### 1. `logo-pulse.svg` — Signal Pulse
A stylised pulse/waveform that represents data insights emerging from noise. Think: a clean EKG-like line that forms a subtle upward trend or peaks. Conveys "we extract signal from noise."

### 2. `logo-prism.svg` — Prism / Refraction
A geometric prism shape (triangle or hexagonal) with light rays entering one side and splitting into multiple coloured paths on the other. Represents taking a single product idea and breaking it into many consumer perspectives.

### 3. `logo-panel.svg` — Abstract Panel
A cluster of small, slightly overlapping circles or rounded squares representing a diverse panel of simulated consumers. Should feel like a crowd but remain clean and geometric. One element slightly highlighted in teal to represent the "insight" emerging from the group.

### 4. `logo-lens.svg` — Research Lens
A magnifying glass or lens shape, but instead of a plain circle, the glass contains a small bar chart, scatter plot, or data pattern inside. Conveys "deep research at a glance."

### 5. `logo-hype.svg` — Typographic Mark
A custom typographic treatment of "HT" or "Ht" as a monogram. Should be bold, modern, and feel like it could stand alone as an app icon. Use negative space creatively.

### 6. `logo-spark.svg` — Spark / Ignition
A small diamond or spark shape combined with an upward arrow or growth indicator. Represents the moment an idea gets validated — the "spark" of consumer signal. Minimal, iconic, works great at small sizes.

---

## Preview Page

Create `public/logos/preview.html` that:
- Displays all 6 logos in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- Shows each logo at 3 sizes: 24px, 48px, and 160px
- Shows both the icon-only and wordmark versions
- Has a light background section AND a dark background section so we can see how they look on both
- Labels each variation with its name and concept description
- Uses basic inline CSS, no external dependencies

---

## Integration Prep

After generating all logos, update `src/components/nav.tsx`:
- Do NOT replace the current logo yet
- Instead, add a comment at the top of the file: `// New logo options available at /logos/preview.html — pick one and replace the inline SVG below`

---

## Quality Checks

- Open `public/logos/preview.html` in the browser (or just confirm the files exist and are valid SVG)
- Verify each SVG is under 5KB
- Verify each SVG has both `#icon` and `#wordmark` groups
- Verify no SVG uses raster images or external resources
