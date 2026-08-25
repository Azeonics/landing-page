'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { skillingImages } from '@/lib/content/skilling';
import Reveal from '@/components/ui/Reveal';
import { gsapReady } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Parallax travel of the lead image, as a percentage of its own height. */
const PARALLAX_PERCENT = 6;
/** Overscale that keeps the image edges hidden across the parallax range. */
const PARALLAX_SCALE = 1.1;

/** Hardcoded editorial flourish — caption strip under the collage. */
const GALLERY_CAPTION = 'COHORT 01 · NANO-SATELLITE PROGRAM · THANE';

/**
 * Three-image cohort collage. Client component for one effect only: a mild
 * scrubbed parallax drift on the FIRST (tall) image — overscaled inside an
 * overflow-hidden frame so edges never show (same pattern as ManhaSpotlight).
 * Reduced motion: no tween — the image sits static at the CSS resting scale.
 */
export default function SkillingGallery() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    const target = parallaxRef.current;
    if (!root || !target) return;

    const gsap = gsapReady();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { yPercent: -PARALLAX_PERCENT, scale: PARALLAX_SCALE },
        {
          yPercent: PARALLAX_PERCENT,
          scale: PARALLAX_SCALE,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const [lead, ...rest] = skillingImages;

  return (
    <div className="mskill-gal" ref={rootRef}>
      <Reveal>
        <div className="mskill-gal-grid">
          <figure className="mskill-gal-main">
            <div className="mskill-gal-parallax" ref={parallaxRef}>
              <Image
                src={lead.src}
                alt={lead.alt ?? lead.placeholder ?? ''}
                fill
                className="mskill-gal-img"
                sizes="(max-width: 720px) 100vw, 40vw"
              />
            </div>
          </figure>
          {rest.map((image) => (
            <figure className="mskill-gal-side" key={image.src}>
              <Image
                src={image.src}
                alt={image.alt ?? image.placeholder ?? ''}
                fill
                className="mskill-gal-img"
                sizes="(max-width: 720px) 50vw, 30vw"
              />
            </figure>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="mskill-gal-caption">{GALLERY_CAPTION}</p>
      </Reveal>
    </div>
  );
}
