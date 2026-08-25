# Azeonics Mission-Control Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all 5 pages of the Azeonics site as a dark mission-control experience — typed React components, GSAP scrollytelling, a lazy-loaded 3D Earth+satellite hero, cinematic wipe transitions — anchored to the logo palette (`#0197BA` teal, `#041E4B` navy).

**Architecture:** Replace the HTML-string + `dangerouslySetInnerHTML` + selector-wired-DOM model with thin server pages composing client/server section components fed by typed content modules (`lib/content/*`). Animation is centralized (`lib/animation.ts`, GSAP + ScrollTrigger); 3D lives in one lazy chunk (`components/hero/HeroScene.tsx`, R3F). The contact API route is untouched.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, plain CSS (token-driven `globals.css`), `gsap` + `ScrollTrigger`, `three` + `@react-three/fiber` + `@react-three/drei`, Playwright for QA.

**Spec:** `docs/superpowers/specs/2026-06-12-site-redesign-design.md`

**Testing note:** No unit-test framework exists in this repo and the work is overwhelmingly visual. Per-task verification = `npm run build` (must stay green) + preview-browser screenshot checks against the task's acceptance criteria. Playwright visual/a11y/reduced-motion coverage is added as the final phase (Tasks 19–20). Where a step is pure logic (content extraction, logo recolor), verification is a concrete node assertion command.

---

## Phase 0 — Foundation

### Task 1: Install animation + 3D dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install gsap three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 2: Verify build still green**

Run: `npm run build`
Expected: build succeeds (no source uses the libs yet).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gsap, three, react-three-fiber, drei"
```

### Task 2: Generate reversed wordmark (dark-mode logo)

Recolor the navy letterforms of `public/assets/azeonics-wordmark.png` and `azeonics-logo.png` to ice-white while preserving the teal planet/orbit gradient pixels and alpha. Heuristic: a pixel is "navy letterform" when it is dark and blue-dominant but NOT teal (teal has high green ≈ blue; navy has low green).

**Files:**
- Create: `scripts/make-dark-logo.mjs`
- Create: `public/assets/azeonics-wordmark-dark.png` (generated)
- Create: `public/assets/azeonics-logo-dark.png` (generated)

- [ ] **Step 1: Write the script**

```js
// scripts/make-dark-logo.mjs
import sharp from 'sharp';

const ICE = { r: 234, g: 242, b: 255 };

async function reverse(input, output) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a === 0) continue;
    const isTeal = g > 90 && b > 110 && g > r + 40; // teal planet/orbit gradient
    const isNavy = !isTeal && b > r && r < 120 && g < 120; // dark blue letterforms
    if (isNavy) {
      // Preserve anti-aliasing: blend toward ICE by how dark the pixel is
      const t = 1 - Math.max(r, g, b) / 255 * 0.2;
      data[i] = Math.round(ICE.r * t + r * (1 - t));
      data[i + 1] = Math.round(ICE.g * t + g * (1 - t));
      data[i + 2] = Math.round(ICE.b * t + b * (1 - t));
    }
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(output);
  console.log('wrote', output);
}

await reverse('public/assets/azeonics-wordmark.png', 'public/assets/azeonics-wordmark-dark.png');
await reverse('public/assets/azeonics-logo.png', 'public/assets/azeonics-logo-dark.png');
```

- [ ] **Step 2: Run it**

Run: `node scripts/make-dark-logo.mjs`
Expected: both `-dark.png` files written.

- [ ] **Step 3: Visually verify**

Read both generated PNGs with the Read tool. Acceptance: letters are ice-white with clean anti-aliased edges; the planet and orbit swoosh remain teal-gradient; satellite glyph legible. If the threshold misclassifies (e.g., teal turned white or navy left dark), tune `isTeal`/`isNavy` constants and re-run.

- [ ] **Step 4: Commit**

```bash
git add scripts/make-dark-logo.mjs public/assets/azeonics-wordmark-dark.png public/assets/azeonics-logo-dark.png
git commit -m "feat(brand): generate reversed wordmark for dark surfaces"
```

### Task 3: Design tokens + base styles (new `globals.css` foundation)

Replace the `:root` block and base element styles. Old component CSS stays temporarily (sections still render old pages until migrated) — but old token VALUES flip to dark so nothing is half-themed during migration. The old `--accent: #3E6AE1` is remapped to teal.

**Files:**
- Modify: `app/globals.css` (replace lines 1–30, the `:root` + base block)

- [ ] **Step 1: Replace tokens**

```css
:root {
  /* Brand anchors */
  --teal: #0197BA;
  --teal-bright: #00C2EA;
  --navy: #041E4B;

  /* Surfaces — deepened navy tints, never grey-black */
  --bg: #020B1E;
  --bg-2: #051430;
  --bg-card: #061B3D;
  --bg-raise: #0A2350;

  /* Ink on dark */
  --ink: #EAF2FF;
  --ink-2: #B8C9E4;
  --ink-3: #7E93B8;

  /* Accent (legacy var names kept so unmigrated CSS stays coherent) */
  --accent: var(--teal);
  --accent-deep: var(--teal-bright);
  --brand-navy: var(--navy);

  /* Lines */
  --line: rgba(1, 151, 186, 0.16);
  --line-2: rgba(184, 201, 228, 0.28);

  /* Glow */
  --glow: 0 0 24px rgba(1, 151, 186, 0.35);
  --glow-strong: 0 0 48px rgba(0, 194, 234, 0.45);

  /* Type */
  --serif: "Instrument Serif", "Times New Roman", serif;
  --sans: "Space Grotesk", -apple-system, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, monospace;
  --text-base: clamp(1rem, 0.94rem + 0.3vw, 1.125rem);
  --text-hero: clamp(3rem, 1.2rem + 6.5vw, 7.5rem);
  --text-section: clamp(2.4rem, 1.4rem + 4vw, 4.5rem);

  /* Rhythm */
  --space-section: clamp(5rem, 3.5rem + 6vw, 11rem);

  /* Motion */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-wipe: 650ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-cinematic: cubic-bezier(0.83, 0, 0.17, 1);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { color-scheme: dark; }
html, body { background: var(--bg); color: var(--ink); font-family: var(--sans); -webkit-font-smoothing: antialiased; }
body { overflow-x: hidden; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; border: none; background: none; color: inherit; }
img { max-width: 100%; display: block; }
h1, h2, h3, h4, p { overflow-wrap: break-word; }
::selection { background: var(--teal); color: var(--bg); }
```

Also in this step, fix dark-on-dark leftovers in the old CSS so the interim site is usable: `.gsaas`/`.manha`/`footer` backgrounds (`var(--ink)`, `#171A20`) → `var(--bg-2)`; `.footer-logo .logo-img` filter removed (swap src to the dark wordmark in Task 5/6 instead); `.cat-img` background `#f7f9fb` → `var(--bg-card)`.

- [ ] **Step 2: Verify in preview**

Run preview on `/`. Acceptance: dark navy surfaces everywhere, teal accents, legible ice text, no white flash sections, no invisible text.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(design): dark mission-control design tokens anchored to logo palette"
```

### Task 4: Extract typed content modules from HTML strings

Read `lib/site-content.ts` and transcribe ALL copy into typed data. This is manual transcription (the HTML is the source of truth; light punch-up allowed but keep facts/claims/names). No rendering changes yet.

**Files:**
- Create: `lib/content/types.ts`
- Create: `lib/content/home.ts`
- Create: `lib/content/capabilities.ts`
- Create: `lib/content/skilling.ts`
- Create: `lib/content/catalog.ts`
- Create: `lib/content/contact.ts`

- [ ] **Step 1: Define types**

```ts
// lib/content/types.ts
export interface Stat { value: string; label: string }
export interface PipelineStage { num: string; title: string; desc: string }
export interface Capability { num: string; title: string; desc: string; specs: string[] }
export interface Plan { num: string; title: string; price: string; desc: string }
export interface Program { num: string; title: string; duration: string; desc: string; points: string[]; featured?: boolean }
export interface Product { name: string; desc: string; category: string; group: string; image?: string }
export interface CatalogGroup { id: string; title: string; count: string }
export interface AudienceCard { num: string; name: string; meta: string }
export interface Partner { name: string; sub?: string; style?: 'sans' | 'mono' | 'italic' }
export interface Location { label: string; name: string; address: string; tag: string }
export interface Region { region: string; status: string }
```

- [ ] **Step 2: Transcribe each page**

For every section in `lib/site-content.ts` (`homeHtml`: hero, stats, ticker, about, pipeline ×6, capabilities ×6, maas plans, gsaas bands+services, skilling preview, manha features, audience ×4, partners, contact info; `catalogHtml`: all 29 products with name/desc/category/group; etc.) create exported constants in the matching content module. Products must reference `catalogImages` keys from `lib/site-data.ts` verbatim (the name-key match is what wires images). Carousel slide data is imported from `lib/site-data.ts` (keep that file).

- [ ] **Step 3: Verify completeness with a count assertion**

Run:
```bash
npx tsx -e "import('./lib/content/catalog.ts').then(m => { const n = m.products.length; if (n !== 29) throw new Error('expected 29 products, got ' + n); console.log('29 products OK'); })" 2>/dev/null || node --experimental-strip-types -e "..."
```
(If `tsx` is unavailable: `npm run build` after Task 7 exercises the imports; minimally run `npx tsc --noEmit` here.)
Expected: 29 products; `npx tsc --noEmit` clean.

- [ ] **Step 4: Commit**

```bash
git add lib/content/
git commit -m "feat(content): extract typed content modules from HTML strings"
```

---

## Phase 1 — Layout system

### Task 5: Animation core + motion hooks

**Files:**
- Create: `lib/animation.ts`
- Create: `hooks/useReducedMotion.ts`

- [ ] **Step 1: Write the modules**

```ts
// lib/animation.ts
'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
export function gsapReady() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export const EASE = { out: 'expo.out', cinematic: 'power4.inOut' } as const;
export const DUR = { fast: 0.4, normal: 0.8, slow: 1.4 } as const;
export { ScrollTrigger };
```

```ts
// hooks/useReducedMotion.ts
'use client';
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add lib/animation.ts hooks/useReducedMotion.ts
git commit -m "feat(motion): GSAP core registration and reduced-motion hook"
```

### Task 6: Page-transition wipe (TransitionProvider + TransitionLink)

Cinematic wipe: a fixed full-screen navy panel with the dark logo mark + telemetry line sweeps in (clip-path), route changes behind it, sweeps out. Implemented as a context provider in `app/layout.tsx`; `TransitionLink` intercepts internal navigations, plays the cover animation (~`--duration-wipe`), calls `router.push`, and the provider reveals on pathname change. `prefers-reduced-motion`: instant navigation, no wipe.

**Files:**
- Create: `components/layout/PageTransition.tsx` (provider + overlay + `TransitionLink`)
- Modify: `app/layout.tsx` (wrap children with provider)
- Modify: `app/globals.css` (append `.wipe` styles)

- [ ] **Step 1: Implement provider, overlay and `TransitionLink`** — overlay structure:

```tsx
<div className={`wipe ${state}`} aria-hidden="true">
  <img src="/assets/azeonics-logo-dark.png" alt="" className="wipe-logo" />
  <div className="wipe-telemetry mono">AZN · ROUTE CHANGE · T-0{/* pathname */}</div>
</div>
```

States: `idle` (clip-path fully offscreen) → `covering` (clip-path expands over viewport, `--ease-cinematic`, 650ms) → push → `revealing` on new pathname → `idle`. Use only `clip-path`/`transform`/`opacity`.

- [ ] **Step 2: Verify in preview** — navigate between `/` and `/contact`; wipe covers, route swaps, wipe reveals; with reduced motion emulated, navigation is instant.

- [ ] **Step 3: Commit**

```bash
git add components/layout/PageTransition.tsx app/layout.tsx app/globals.css
git commit -m "feat(motion): cinematic telemetry wipe page transitions"
```

### Task 7: Nav, MobileMenu, Footer components (replace PageShell chrome)

Rebuild the chrome from `components/PageShell.tsx` as standalone components using the dark wordmark and `TransitionLink`. PageShell keeps existing pages alive until each page migrates; new components are used by migrated pages via a shared `SiteChrome` wrapper (nav + children + footer).

**Files:**
- Create: `components/layout/Nav.tsx` (includes mobile menu state — React state, no DOM ids)
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/SiteChrome.tsx`
- Modify: `app/globals.css` (nav glass: `background: color-mix(in oklab, var(--bg) 78%, transparent); backdrop-filter: blur(18px); border-bottom: 1px solid var(--line)`; logo swap to `azeonics-wordmark-dark.png`; teal hover glow on links; footer on `--bg-2`)

- [ ] **Step 1: Implement** — same links/structure as PageShell (Hub, Capabilities, Skilling, Catalog, Earth Now external, Contact, Book-a-slot CTA), mobile menu as React state with focus return, dark wordmark `<img>` with explicit width/height.
- [ ] **Step 2: Verify in preview** — desktop nav, mobile menu at 375px (preview_resize), keyboard: tab order + Escape closes menu.
- [ ] **Step 3: Commit**

```bash
git add components/layout/ app/globals.css
git commit -m "feat(layout): dark Nav, MobileMenu, Footer with reversed wordmark"
```

### Task 8: UI primitives

**Files:**
- Create: `components/ui/SectionHead.tsx` (num + label + serif title with teal `<em>`)
- Create: `components/ui/Button.tsx` (primary: teal fill + glow hover; secondary: ice hairline)
- Create: `components/ui/Reveal.tsx` (children slide-up+fade on enter via gsap/IntersectionObserver; respects reduced motion; **never leaves content below full opacity** — no-fade rule)
- Create: `components/ui/Stat.tsx` (count-up number on enter using gsap `textContent` tween; serif numeral, mono label)
- Create: `components/ui/TelemetryTag.tsx` (mono micro-label, teal)

- [ ] **Step 1: Implement all five** (each < 80 lines; client components where they animate).
- [ ] **Step 2: Verify** — `npx tsc --noEmit` clean; temporary render check on home in preview.
- [ ] **Step 3: Commit**

```bash
git add components/ui/
git commit -m "feat(ui): SectionHead, Button, Reveal, Stat, TelemetryTag primitives"
```

---

## Phase 2 — Home page

### Task 9: Hero (layout, poster fallback, HUD)

**Files:**
- Create: `components/hero/Hero.tsx` (server: layout + copy from `lib/content/home.ts`)
- Create: `components/hero/HeroHud.tsx` (client: mono telemetry overlays — coordinates of Thane facility `19.2183° N, 72.9781° E`, UTC clock, `SYS NOMINAL` chips, animated in)
- Create: `components/hero/HeroFallback.tsx` (static: navy gradient + starfield CSS + Earth poster `public/assets/hero-poster.jpg` rendered via a generated radial-gradient canvas export or the existing `gsaas.png` re-graded — reserved `aspect-ratio` box, zero CLS)
- Modify: `app/globals.css` (hero styles)

Hero composition: full-viewport (`min-height: 100svh`) canvas area; headline (serif, `--text-hero`, "From Earth Intelligence to *Space Excellence*." with teal italic em) over the scene's left third; stats band docked at the bottom; scroll cue.

- [ ] **Step 1: Implement Hero + HUD + Fallback** (scene slot renders `HeroFallback` for now).
- [ ] **Step 2: Verify in preview** — screenshot at 1440 and 375; headline legible over fallback, HUD animates, no CLS (preview_console_logs clean).
- [ ] **Step 3: Commit**

```bash
git add components/hero/ app/globals.css
git commit -m "feat(home): hero layout with telemetry HUD and poster fallback"
```

### Task 10: HeroScene — R3F Earth + orbiting satellite (lazy)

**Files:**
- Create: `components/hero/HeroScene.tsx` (client; default export for `next/dynamic`)
- Modify: `components/hero/Hero.tsx` (dynamic import with `ssr: false`, `loading: HeroFallback`; mount gated on `requestIdleCallback` + `!useReducedMotion()` + WebGL support check)

Scene contents (drei makes each cheap):
- `<Stars>` starfield (drei) at low count (~3000).
- Earth: `<Sphere args={[1.6, 64, 64]}>` with dark `meshStandardMaterial` (navy base `#041E4B`, emissive teal city-glow via fresnel-ish rim: a second slightly larger sphere with `BackSide` additive teal material = atmosphere glow).
- Satellite: small box+panel group following a parametric inclined circular orbit (`useFrame`: `x = R*cos(t), z = R*sin(t), y = R*sin(t)*0.35`), with a teal `Line` (drei) tracing the orbit path.
- Camera: starts at `[0, 0.4, 4.2]`; a ScrollTrigger scrub maps page scroll (0 → end of hero) to a slow camera drift `z: 4.2 → 3.2`, `y: 0.4 → 0.9` and Earth rotation.
- `dpr={[1, 1.75]}`, `frameloop` switches to `never` when hero is fully out of view (IntersectionObserver) to free the main thread.
- On WebGL context failure → render `HeroFallback` permanently.

- [ ] **Step 1: Implement scene.**
- [ ] **Step 2: Verify in preview** — Earth + atmosphere glow + orbiting satellite visible; scroll drifts camera; CPU calm after scrolling past hero; console free of three warnings spam.
- [ ] **Step 3: Bundle check**

Run: `npm run build` — note home First Load JS; the three/r3f chunk must be in a separate async chunk (visible in build output), home route shared JS ≲ 300kb gz total budget.

- [ ] **Step 4: Commit**

```bash
git add components/hero/
git commit -m "feat(home): lazy 3D Earth + orbiting satellite hero scene"
```

### Task 11: Stats band + Ticker

**Files:**
- Create: `components/sections/StatsBand.tsx` (4 stats from content via `Stat` count-up)
- Create: `components/sections/Ticker.tsx` (CSS marquee, duplicated track for seamless loop, `:hover { animation-play-state: paused }`, teal ✦ separators; reduced motion → static wrapped list)
- Modify: `app/globals.css`

- [ ] **Step 1: Implement.** — [ ] **Step 2: Verify in preview** (counters fire once on enter; marquee loops seamlessly). — [ ] **Step 3: Commit** `feat(home): stats count-up band and ticker marquee`.

### Task 12: About + Idea 2 Orbit pipeline scrollytelling (centerpiece)

**Files:**
- Create: `components/sections/About.tsx` (editorial split; headline reveals line-by-line via gsap stagger on enter; meta card on `--bg-card` with teal hairlines)
- Create: `components/sections/PipelineScrolly.tsx` (client)
- Modify: `app/globals.css`

PipelineScrolly behavior (the six stages from content):
- Wrapper `position: relative; height: 600svh`; inner panel pinned via ScrollTrigger (`pin: true, scrub: 0.6, end: '+=500%'`).
- Left: stage number `01–06` (mono, teal), serif stage title, description — crossfade+slide between stages (full opacity at rest — no half-faded states).
- Right: stage glyph/art panel + a vertical progress rail; rail fill `scaleY` scrubbed 0→1; six tick marks light up teal as passed.
- Telemetry strip shows `STAGE 0n / 06 · <stage codename>`.
- Reduced motion / `max-width: 720px`: no pin — stages render as a stacked list with simple Reveal entrances (the existing grid treatment, restyled).

- [ ] **Step 1: Implement About.** — [ ] **Step 2: Implement PipelineScrolly.**
- [ ] **Step 3: Verify in preview** — scroll through: section pins, six stages scrub in order, rail fills, unpins cleanly (no jump); at 375px it's a stacked list; reduced-motion emulation shows static stack.
- [ ] **Step 4: Commit** `feat(home): about section and pinned six-stage pipeline scrollytelling`.

### Task 13: Capabilities preview + MaaS sections

**Files:**
- Create: `components/sections/CapabilitiesGrid.tsx` (reusable: `items: Capability[]`, `preview?: boolean` — preview shows 6 cards linking to /capabilities; cards: teal icon, serif title, spec chips; hover = border glow `box-shadow: var(--glow)` + translateY(-3px); staggered Reveal entrances)
- Create: `components/sections/Maas.tsx` (lead + plan rows; row hover slides 6px with teal left rule; CTA Button)
- Modify: `app/globals.css`

- [ ] **Step 1: Implement both.** — [ ] **Step 2: Verify in preview** (stagger order, hover glow, AA contrast on chips). — [ ] **Step 3: Commit** `feat(home): capabilities grid and MaaS sections`.

### Task 14: GSaaS + Manha spotlight

**Files:**
- Create: `components/sections/Gsaas.tsx` (on `--bg-2`; animated inline SVG: concentric orbit rings, a ground-station node, a satellite dot animating along a ring via SMIL/`<animateMotion>` with a teal pass-link line that pulses when the dot crosses overhead; band stats VHF/UHF/S/X; services rows)
- Create: `components/sections/ManhaSpotlight.tsx` (parallax `manha-hero.png` — gsap `yPercent` scrub ±8%; spec tiles Reveal-staggered; corner telemetry labels; extras images lazy)
- Modify: `app/globals.css`

- [ ] **Step 1: Implement both.** — [ ] **Step 2: Verify in preview** (SVG orbit animates, parallax subtle and 60fps, images sized with explicit dimensions). — [ ] **Step 3: Commit** `feat(home): GSaaS orbital section and Manha parallax spotlight`.

### Task 15: Audience + Partners + assemble the home page

**Files:**
- Create: `components/sections/Audience.tsx`, `components/sections/Partners.tsx` (restyled grids, staggered entrances, hover raise)
- Modify: `app/page.tsx` — replace `PageShell` usage:

```tsx
import SiteChrome from '@/components/layout/SiteChrome';
import Hero from '@/components/hero/Hero';
import StatsBand from '@/components/sections/StatsBand';
import Ticker from '@/components/sections/Ticker';
import About from '@/components/sections/About';
import PipelineScrolly from '@/components/sections/PipelineScrolly';
import CapabilitiesGrid from '@/components/sections/CapabilitiesGrid';
import Maas from '@/components/sections/Maas';
import Gsaas from '@/components/sections/Gsaas';
import ManhaSpotlight from '@/components/sections/ManhaSpotlight';
import Audience from '@/components/sections/Audience';
import Partners from '@/components/sections/Partners';
// (metadata export preserved from current page.tsx)

export default function HomePage() {
  return (
    <SiteChrome>
      <Hero />
      <StatsBand />
      <Ticker />
      <About />
      <PipelineScrolly />
      <CapabilitiesGrid preview />
      <Maas />
      <Gsaas />
      <ManhaSpotlight />
      <Audience />
      <Partners />
    </SiteChrome>
  );
}
```

- [ ] **Step 1: Implement + assemble.**
- [ ] **Step 2: Full-page verify in preview** — scroll `/` end-to-end at 1440 and 375; every section present in spec order; no console errors; `npm run build` green.
- [ ] **Step 3: Commit** `feat(home): assemble home page on new component system`.

---

## Phase 3 — Inner pages

### Task 16: Capabilities page

**Files:**
- Create: `components/sections/CapabilitiesIntro.tsx` (pinned intro headline: serif title scrubs from 110% scale/clip to settled while facility imagery panels parallax behind; unpinned stacked on mobile/reduced-motion)
- Modify: `app/capabilities/page.tsx` (SiteChrome + CapabilitiesIntro + full `CapabilitiesGrid` + Maas + Gsaas reuse; metadata preserved)

- [ ] **Step 1: Implement.** — [ ] **Step 2: Verify in preview** (both breakpoints). — [ ] **Step 3: Commit** `feat(capabilities): rebuild capabilities page`.

### Task 17: Skilling page

**Files:**
- Create: `components/sections/SkillingPrograms.tsx` (3 program cards from content, middle featured on `--bg-raise` with teal glow border; li markers `→` teal; staggered entrances)
- Create: `components/sections/SkillingGallery.tsx` (image collage with mild parallax; `next/image`, explicit dims)
- Modify: `app/skilling/page.tsx` (SiteChrome + intro + gallery + programs + ManhaSpotlight reuse + CTA)

- [ ] **Step 1: Implement.** — [ ] **Step 2: Verify in preview.** — [ ] **Step 3: Commit** `feat(skilling): rebuild skilling page`.

### Task 18: Catalog page — filter, cards, product overlay

**Files:**
- Create: `components/catalog/Catalog.tsx` (client orchestrator: filter state, group visibility)
- Create: `components/catalog/ProductCard.tsx` (image from `catalogImages[name]`, serif name, category tag, desc; hover: glow border + image scale 1.04)
- Create: `components/catalog/ProductOverlay.tsx` (modal panel: large image, name, group, full desc, "Book a slot" CTA → `/contact#contact`; `role="dialog"` `aria-modal`, focus trap, Escape + backdrop close, body scroll lock; enter = clip-path wipe from card side, 350ms)
- Modify: `app/catalog/page.tsx` (SiteChrome + Catalog fed by `lib/content/catalog.ts`)

Filter animation: on chip change, gsap FLIP-style — capture card positions, toggle group visibility, animate `transform` deltas + entrance for newly visible cards (~400ms, `--ease-out-expo`). Reduced motion: instant toggle.

- [ ] **Step 1: Implement Catalog + ProductCard.** — [ ] **Step 2: Implement ProductOverlay with focus trap.**
- [ ] **Step 3: Verify in preview** — all 29 products render with images; each chip filters correctly (counts match groups); overlay opens/closes by mouse, Escape, backdrop; focus returns to the opening card; keyboard-only pass.
- [ ] **Step 4: Commit** `feat(catalog): animated filtering, rich cards, product detail overlay`.

### Task 19: Contact page

**Files:**
- Create: `components/sections/ContactSection.tsx` (client: form with the same field names/payload as today's `app/api/contact` handler — read the route file and keep the contract byte-identical; submit states: idle/sending/success/error with teal success + visible error message; inputs on `--bg-card`, teal focus ring)
- Create: `components/sections/Footprint.tsx` (locations + regions from content, telemetry pins)
- Modify: `app/contact/page.tsx` (SiteChrome + ContactSection + Footprint + Audience + Partners reuse; ids `#contact`, `#footprint`, `#audience`, `#partners` preserved — nav/footer deep links depend on them)

- [ ] **Step 1: Read `app/api/contact/route.ts`, mirror its expected payload in the form.**
- [ ] **Step 2: Implement.** — [ ] **Step 3: Verify in preview** — submit with invalid then valid data; network tab shows the POST and handled response; deep-link anchors scroll correctly.
- [ ] **Step 4: Commit** `feat(contact): rebuild contact page wired to existing API`.

---

## Phase 4 — Cleanup & QA

### Task 20: Delete the legacy system + update metadata/OG

**Files:**
- Delete: `lib/site-content.ts`, `components/SiteBehavior.tsx`, `components/PageShell.tsx`, `public/image-slot.js`
- Modify: `lib/site-data.ts` (keep `carouselSlides` only if still consumed — if the new design dropped the hero carousel in favor of the 3D scene, fold any still-used slide imagery into content modules and delete the file)
- Modify: `app/opengraph-image.tsx`, `app/*/opengraph-image.tsx`, `lib/og.tsx`, `app/icon.svg`, `app/apple-icon.tsx` — dark navy OG canvases, teal accent, dark logo; metadata descriptions unchanged
- Modify: `app/globals.css` — remove all dead legacy component CSS (old carousel/pipe-strip/old nav etc.); final file should be token layer + new component styles only
- Modify: `CLAUDE.md` — rewrite the architecture section: content lives in `lib/content/*` typed modules + section components; the HTML-string model is gone

- [ ] **Step 1: Grep before delete** — `grep -rn "site-content\|SiteBehavior\|PageShell\|image-slot" app components lib` must return nothing outside the files being deleted.
- [ ] **Step 2: Delete, prune CSS, update OG + CLAUDE.md.**
- [ ] **Step 3: Verify** — `npm run build` green; all 5 routes render in preview; OG image endpoints return the dark design (`curl -s localhost:3000/opengraph-image -o /tmp/og.png` + Read).
- [ ] **Step 4: Commit** `refactor: remove HTML-string content system; dark OG images; docs updated`.

### Task 21: Playwright QA suite

**Files:**
- Create: `playwright.config.ts` (webServer: `npm run dev`, projects: chromium; viewports parameterized in tests)
- Create: `e2e/visual.spec.ts`, `e2e/a11y.spec.ts`, `e2e/motion.spec.ts`
- Modify: `package.json` (add `"test:e2e": "playwright test"`, devDeps `@playwright/test`, `@axe-core/playwright`)

- [ ] **Step 1: Install** — `npm i -D @playwright/test @axe-core/playwright && npx playwright install chromium`.
- [ ] **Step 2: Write specs:**

```ts
// e2e/visual.spec.ts — every page × {320, 768, 1024, 1440}: load, wait for fonts,
// disable animations via page.emulateMedia({ reducedMotion: 'reduce' }) for stability,
// expect(page).toHaveScreenshot(`${name}-${width}.png`, { fullPage: true });

// e2e/a11y.spec.ts — per page: AxeBuilder analyze, expect no serious/critical violations;
// catalog overlay: open first product, axe again, Escape closes, focus restored;
// contact form labels associated.

// e2e/motion.spec.ts — reducedMotion 'reduce': home renders all section headings visible
// without scrolling pinned (no pin spacers in DOM: expect .pin-spacer count = 0);
// default motion: pipeline section pins (pin spacer exists) and hero canvas mounts.
```

- [ ] **Step 3: Run** — `npx playwright test` → all green (first run records baselines; re-run to confirm stability).
- [ ] **Step 4: Commit** `test(e2e): visual regression, axe accessibility, reduced-motion coverage`.

### Task 22: Performance + final gates

- [ ] **Step 1: Bundle audit** — `npm run build`; record per-route First Load JS in the plan checklist. Home total (including async three chunk fetched post-paint) target ≤ ~300kb gz; the *synchronous* home chunk must stay ≤ 150kb gz.
- [ ] **Step 2: Lighthouse** — against `npm run start` build: `npx lighthouse http://localhost:3000 --preset=desktop --quiet`. Gates: LCP < 2.5s, CLS < 0.1, TBT < 200ms. Fix regressions (usual suspects: hero poster `fetchpriority="high"` + preload, font `display: swap`, image dimensions).
- [ ] **Step 3: react-doctor** — `npm run doctor`; fix flagged issues in changed files.
- [ ] **Step 4: Contrast sweep** — verify teal-on-navy text usages pass AA (teal `#0197BA` on `#020B1E` ≈ 5.4:1 — OK for normal text; never place teal text on `--bg-raise` without checking).
- [ ] **Step 5: Final commit + summary** `chore: performance, lighthouse and a11y gates green`.

---

## Self-review notes

- Spec coverage: palette/logo (T2, T3, T7), scrollytelling centerpiece (T12), 3D hero + fallback + budget (T9, T10, T22), wipe transitions (T6), catalog overlay (T18), contact API untouched (T19), legacy removal (T20), all QA gates (T21, T22). Light copy punch-up happens inside T4 transcription.
- Hero carousel from the old home is intentionally superseded by the 3D hero (spec home list has no carousel); `carouselSlides` imagery is reused in About/Capabilities panels where the spec calls for facility imagery — resolved in T20 Step re `site-data.ts`.
- Type consistency: content types defined once in T4 and imported everywhere; `catalogImages` keys remain the product-name join (T4 Step 2, T18).
