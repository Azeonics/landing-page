'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  manhaEyebrow,
  manhaTitle,
  manhaParagraphs,
  manhaFeatures,
  manhaHeroImage,
  manhaCorners,
  manhaExtras,
} from '@/lib/content/skilling';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { renderEm } from '@/components/ui/richText';
import { gsapReady } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Parallax travel of the hero image, as a percentage of its own height. */
const PARALLAX_PERCENT = 8;
/** Overscale that keeps the image edges hidden across the parallax range. */
const PARALLAX_SCALE = 1.12;

/**
 * Manha Kit product spotlight. Client component for one effect only: a
 * scrubbed parallax drift on the hero image (the image is overscaled inside
 * an overflow-hidden frame, so edges never show). Reduced motion: no tween —
 * the image sits static at the CSS resting scale.
 */
export default function ManhaSpotlight() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const target = parallaxRef.current;
    if (!section || !target) return;

    const gsap = gsapReady();
    const tween = gsap.fromTo(
      target,
      { yPercent: -PARALLAX_PERCENT, scale: PARALLAX_SCALE },
      {
        yPercent: PARALLAX_PERCENT,
        scale: PARALLAX_SCALE,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  return (
    <section className="mmanha" id="manha" ref={sectionRef}>
      <div className="wrap">
        <div className="mmanha-grid">
          <Reveal>
            <figure className="mmanha-media">
              <div className="mmanha-media-inner" ref={parallaxRef}>
                <Image
                  src={manhaHeroImage.src}
                  alt={manhaHeroImage.alt ?? manhaHeroImage.placeholder ?? 'Manha nano-satellite kit'}
                  fill
                  className="mmanha-img"
                  sizes="(max-width: 980px) 100vw, 50vw"
                />
              </div>
              <span className="mmanha-corner mmanha-corner--tl">{manhaCorners.tl}</span>
              <span className="mmanha-corner mmanha-corner--br">{manhaCorners.br}</span>
            </figure>
          </Reveal>

          <div className="mmanha-text">
            <Reveal>
              <p className="mmanha-eyebrow">{manhaEyebrow}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mmanha-title">{renderEm(manhaTitle)}</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mmanha-paragraphs">
                {manhaParagraphs.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <dl className="mmanha-features">
                {manhaFeatures.map((feature) => (
                  <div className="mmanha-feature" key={feature.k}>
                    <dt className="mmanha-feature-k">{feature.k}</dt>
                    <dd className="mmanha-feature-v">{feature.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mmanha-extras">
                {manhaExtras.map((image) => (
                  <div className="mmanha-extra" key={image.src}>
                    <Image
                      src={image.src}
                      alt={image.alt ?? image.placeholder ?? 'Manha kit detail'}
                      fill
                      className="mmanha-img"
                      sizes="(max-width: 980px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mmanha-cta">
                <Button href="/catalog" variant="secondary">
                  Explore the catalog
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
