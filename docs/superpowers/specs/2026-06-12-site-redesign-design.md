# Azeonics Site Redesign — Design Spec

Date: 2026-06-12
Status: Awaiting user approval

## Locked decisions

| Decision | Choice |
|---|---|
| Visual direction | Dark mission-control luxury (dark-only, no light mode) |
| Motion system | Full scrollytelling — GSAP + ScrollTrigger (pinned, scrubbed sections) |
| 3D | Full 3D hero: Earth + orbiting satellite (Three.js, lazy-loaded) |
| Architecture | Full migration from HTML-string model to React components |
| Scope | All 5 pages rebuilt before launch (Home, Capabilities, Skilling, Catalog, Contact) |
| Copy | Light punch-up allowed — facts, claims, product names, structure preserved |
| Typography | Keep Instrument Serif + Space Grotesk + JetBrains Mono, rebalanced for dark |
| Performance | Home JS ≤ ~300kb gzipped; 3D chunk dynamically imported after first paint; LCP < 2.5s, CLS < 0.1, INP < 200ms enforced |
| Page transitions | Cinematic wipe — full-screen telemetry/shutter wipe between routes (~500–700ms) |
| Catalog UX | Richer cards + click-to-open product detail overlay; keep 29 products + category filters |
| Brand palette | Anchored to logo colors: teal `#0197BA` is the accent/glow color; dark surfaces derive from logo navy `#041E4B`. No washed-out palette anywhere — saturated navy surfaces, vivid teal accents, bright white type; no muddy greys or low-contrast pastel sections |
| Logo treatment | Reversed wordmark variant for dark backgrounds: letters recolored white/ice, teal planet + orbit swoosh + satellite preserved exactly. Generated from the existing PNG unless an official reversed asset is provided. Logo is a first-class element in nav, footer, and the page-transition wipe |

## Visual direction

Mission-control luxury built on the logo's own colors: surfaces are deepened tints of brand navy `#041E4B` (a navy-black base around `#020B1E`–`#06183B`, never grey-black), and teal `#0197BA` is the single accent — glows, active states, italic headline words, telemetry highlights, orbit lines. The old `#3E6AE1` blue is retired. Contrast stays high and saturated: bright white/ice type on navy, vivid teal at full strength, hairline borders from teal/ice at low alpha — no muddy greys, no washed-out pastel sections. Mono telemetry micro-labels (coordinates, timestamps, sequence numbers) recur as texture; grain/atmosphere on dark panels; existing photography re-graded toward the navy/teal world by CSS treatment. Instrument Serif carries large editorial headlines (light-on-dark with teal italic accents); JetBrains Mono does HUD/telemetry duty; Space Grotesk remains body/UI.

**Logo prominence:** a reversed wordmark variant is produced for dark backgrounds — letterforms recolored white/ice while the teal planet, orbit swoosh and satellite are preserved exactly. It appears in the nav (with the Idea 2 Orbit tagline), the footer at larger scale, and as the brand mark in the page-transition wipe. The teal planet motif doubles as the favicon/accent mark. Nothing else in the nav competes with it chromatically.

Design tokens move to CSS custom properties in a dedicated tokens layer (`styles/tokens.css` equivalent inside `app/`): color, type scale (clamp-based), spacing rhythm, durations, easings.

## Architecture

### What gets removed
- `lib/site-content.ts` HTML strings and `dangerouslySetInnerHTML` injection.
- `components/SiteBehavior.tsx` selector-wired DOM scripting.
- `public/image-slot.js` web component (replaced by `next/image`; current slide images already have real `src`s).

### New structure
```
components/
  layout/        Nav, MobileMenu, Footer, PageTransition (wipe)
  hero/          Hero, HeroScene (R3F Earth+satellite, dynamic import), HeroFallback (poster)
  sections/      Ticker, About, PipelineScrolly, CapabilitiesGrid, Maas, Gsaas,
                 SkillingPrograms, ManhaSpotlight, Audience, Partners, Footprint, ContactSection
  catalog/       CatalogFilter, CatalogGrid, ProductCard, ProductOverlay
  ui/            Button, SectionHead, Stat, Pill, RevealText, MagneticLink
hooks/           useReducedMotion, useScrollProgress (as needed)
lib/
  content/       home.ts, capabilities.ts, skilling.ts, catalog.ts, contact.ts
                 (typed data extracted from today's HTML strings — single source of truth)
  animation.ts   shared GSAP setup, easings, ScrollTrigger registration
```
Pages under `app/*/page.tsx` stay thin server components composing section components and passing typed content. The contact API route (`app/api/contact`) and Resend flow are untouched; the form is restyled only.

### Animation stack
- `gsap` + `ScrollTrigger` (npm, dynamically imported in client components).
- `three` + `@react-three/fiber` + `@react-three/drei` for the hero scene only, in its own lazy chunk behind an in-view/idle gate, with a static poster fallback for LCP and for `prefers-reduced-motion`.
- All scroll-driven motion uses transform/opacity/clip-path only; `prefers-reduced-motion` collapses scrollytelling to static layouts with simple fades; pinned sections degrade to stacked layout on small viewports where pinning is hostile.

## Page-by-page

### Home (flagship)
1. **Hero** — full-viewport 3D scene: dark Earth with atmosphere glow, starfield, a CubeSat tracing an orbit; serif headline + telemetry HUD overlays; scroll drifts the camera and hands off to the page (scrubbed). Poster image until the 3D chunk loads.
2. **Stats band** — count-up stats on enter.
3. **Ticker** — upgraded marquee with hover-pause.
4. **About/Hub** — editorial split with reveal-by-line headline animation.
5. **Idea 2 Orbit pipeline** — the centerpiece scrollytelling: section pins, six stages scrub through with progress rail, stage art and telemetry counters (replaces the static 6-column strip).
6. **Capabilities preview** — staggered grid, hover glow, link to /capabilities.
7. **MaaS** — plan rows with hover slide + magnetic CTA.
8. **GSaaS** — dark-on-darker section with animated SVG orbital rings/ground-station passes (2D, not 3D).
9. **Manha spotlight** — parallax product imagery, spec tiles animating in.
10. **Partners / Audience / CTA** — restyled, staggered entrances.

### Capabilities
Full grid of six capabilities with pinned intro headline, spec chips, facility imagery treated as cinematic panels with parallax.

### Skilling
Program cards (3) with featured treatment, image collage with parallax, cohort photo strip, CTA.

### Catalog
Filter chips with animated FLIP-style re-layout on filter, richer product cards (image, category, spec line, hover state), click opens a product detail overlay (image, description, category, contact CTA) built from existing copy. No new routes/search (explicitly out of scope).

### Contact
Restyled form (same fields + API), global footprint and audience sections, info rows with telemetry styling.

### Global
- Persistent nav (dark glass), wipe transition overlay on route change with brand mark/telemetry flourish.
- Footer restyled to the new system.
- OG images and metadata updated to dark identity.

## Error handling
- 3D scene: WebGL unavailable / chunk load failure → poster fallback renders permanently; no layout shift (reserved aspect box).
- Contact form behavior unchanged (existing validation + API error states, restyled).
- All images get explicit dimensions; below-fold media lazy-loads.

## Testing & verification
- Playwright visual regression at 320 / 768 / 1024 / 1440 for all 5 pages (dark only).
- Reduced-motion run: assert no pinned/scrubbed behavior and content fully visible.
- Keyboard nav + axe pass on nav, catalog overlay (focus trap), and form.
- Color-contrast check: all text passes WCAG AA on the navy surfaces; teal accent text used at sizes/weights where it passes.
- Lighthouse on home: LCP < 2.5s, CLS < 0.1; bundle check ≤ ~300kb gzipped home JS.
- `npm run build` + `npm run lint` green.

## Out of scope
- Light theme, search/deep-linked catalog product pages, copy rewrites beyond punch-up, CMS, new content/claims, Earth Now external app.
