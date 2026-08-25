# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run `next lint`

E2E tests use Playwright — `npm run test:e2e` (visual regression, axe accessibility, motion behavior; baselines in `e2e/*-snapshots/`).

## Architecture

This is a Next.js 15 (App Router) + React 19 + TypeScript marketing site for Azeonics, styled as a dark "mission control" theme. The path alias `@/*` maps to the project root. Styling is a single global stylesheet, `app/globals.css` — no CSS modules or Tailwind.

**Content lives in typed modules, not in components.** Each route under `app/<name>/page.tsx` is a thin server component that composes section components inside `SiteChrome` (nav + `<main>` + footer). All copy, stats, product data, etc. come from `lib/content/*` (`home.ts`, `capabilities.ts`, `skilling.ts`, `catalog.ts`, `contact.ts`, shared `types.ts`). To change page copy, edit `lib/content/*` — not the components. Inline emphasis in title strings uses `<em>…</em>` markers, split into real elements (no innerHTML) by `renderEm` in `components/ui/richText.tsx`. `lib/site-data.ts` holds `catalogImages` (product name → image path, consumed by `lib/content/catalog.ts` — keys must match product names exactly) and `carouselSlides` (facility image captions, consumed by `CapabilitiesIntro`).

**Components are organized by surface area:**
- `components/layout/` — `SiteChrome`, `Nav`, `Footer`, and `PageTransition` (a cinematic wipe overlay; `PageTransitionProvider` wraps the app in `app/layout.tsx`, and internal links navigate via its `TransitionLink` so routes change behind the wipe panel)
- `components/hero/` — home hero; `HeroScene` is a lazy-loaded React Three Fiber Earth/satellite scene mounted by `HeroSceneMount` over a pure-CSS poster fallback that stays mounted underneath (instant fallback, zero CLS)
- `components/sections/` — one component per page section (About, PipelineScrolly, Maas, Gsaas, ManhaSpotlight, …)
- `components/catalog/` — catalog grid, FLIP-animated filtering, product detail overlay
- `components/ui/` — primitives: `Button`, `SectionHead`, `Stat`, `TelemetryTag`, `Reveal` (GSAP scroll-reveal wrapper)

**Animation:** GSAP + ScrollTrigger. Always obtain gsap via `gsapReady()` from `lib/animation.ts` (registers ScrollTrigger once, client-only); shared easings/durations live there as `EASE`/`DUR`. Scroll-driven sections (e.g. the pinned `PipelineScrolly`) build their timelines in client components inside `useEffect` and kill them on cleanup.

**Reduced motion is a convention, not an afterthought.** Client components check `hooks/useReducedMotion.ts` and skip GSAP timelines / render static variants (e.g. PipelineScrolly renders a stacked card list, the hero never mounts the R3F canvas). CSS animations are disabled in `@media (prefers-reduced-motion: reduce)` blocks per section.

**CSS conventions in `app/globals.css`:** design tokens (brand colors, type scale, rhythm, motion durations/easings) are CSS custom properties in `:root` — never hardcode brand colors elsewhere. Section classes use an `m`-prefix naming scheme (`.mnav-*`, `.mfoot-*`, `.mabout-*`, `.mcap-*`, `.mcat-*`, `.mcontact-*`, …); hero classes are `hero-*`, UI primitives `ui-*`, page transition `wipe*`. `.wrap` is the shared max-width container.

**Metadata/OG:** `lib/metadata.ts` (`pageMetadata`) builds per-page metadata; `lib/og.tsx` (`renderOgImage`) is the shared dark-brand OG template used by `app/**/opengraph-image.tsx`. Brand hex values are duplicated there intentionally — `next/og` can't read CSS variables.

**API:** `app/api/contact/route.ts` handles the contact form (validation, honeypot, rate limiting, Resend email). `ContactSection` posts to it; keep the request contract in sync.
