'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { carouselSlides } from '@/lib/site-data';
import { renderEm } from '@/components/ui/richText';
import { gsapReady } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Page-intro copy. Hardcoded here (not in lib/content) deliberately — this is
 * the /capabilities page's own opening line, not shared section content.
 */
const INTRO_EYEBROW = '02 · CAPABILITIES';
const INTRO_TITLE = 'Six capabilities, one <em>integrated floor</em>.';
const INTRO_SUB =
  'Machining, additive, electronics, qualification, integration and skilling — aerospace-grade infrastructure, available pay-per-use under one roof.';

/** The four facility images, in floor-tour order; captions come from carouselSlides. */
const FACILITY_SRCS = [
  '/assets/5-axis-machining-of-satellites-structures.png',
  '/assets/cubesat-integration-in-iso-7-room.png',
  '/assets/thermal-vacuum-and-vibration-chambers.png',
  '/assets/3d-printed-thrusters-and-propellant-tanks.png',
] as const;

type Slide = (typeof carouselSlides)[number];

const facilitySlides: Slide[] = FACILITY_SRCS.flatMap((src) => {
  const slide = carouselSlides.find((s) => s.src === src);
  return slide ? [slide] : [];
});

/** Filmstrip drift range while the section scrolls through the viewport. */
const DRIFT_FROM = 4;
const DRIFT_TO = -12;

const DESKTOP_QUERY = '(min-width: 981px)';
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/** SSR snapshot false → server renders the static (scrollable) strip. */
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

const padFrame = (i: number) => String(i + 1).padStart(2, '0');

/**
 * Cinematic /capabilities opener: centered serif headline over a horizontal
 * filmstrip of the four facility images. Desktop + motion-OK: GSAP scrubs the
 * strip sideways (xPercent 4 → -12) as the section crosses the viewport — no
 * pinning (controller-approved simplification: the plan's pinned intro was
 * downgraded so adjacent pages don't stack two pinned sections). Mobile or
 * reduced motion: static strip, horizontally scrollable with scroll-snap.
 */
export default function CapabilitiesIntro() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const animated = isDesktop && !reduced;

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!animated) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const gsap = gsapReady();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { xPercent: DRIFT_FROM },
        {
          xPercent: DRIFT_TO,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [animated]);

  return (
    <section className="mcapintro" ref={sectionRef}>
      <div className="mcapintro-glow" aria-hidden="true" />

      <div className="wrap mcapintro-head">
        <p className="mcapintro-eyebrow">{INTRO_EYEBROW}</p>
        <h1 className="mcapintro-title">{renderEm(INTRO_TITLE)}</h1>
        <p className="mcapintro-sub">{INTRO_SUB}</p>
      </div>

      {/* Static variant scrolls horizontally — must be keyboard-reachable. */}
      <div
        className={`mcapintro-strip${animated ? '' : ' mcapintro-strip--static'}`}
        {...(animated
          ? {}
          : { tabIndex: 0, role: 'region', 'aria-label': 'Facility gallery' })}
      >
        <div className="mcapintro-track" ref={trackRef}>
          {facilitySlides.map((slide, i) => (
            <figure className="mcapintro-frame" key={slide.src}>
              <div className="mcapintro-img">
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 720px) 78vw, (max-width: 980px) 44vw, 32vw"
                  className="mcapintro-photo"
                  priority={i < 2}
                />
              </div>
              <figcaption className="mcapintro-caption">
                <span className="mcapintro-caption-num">{padFrame(i)}</span>
                {slide.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
