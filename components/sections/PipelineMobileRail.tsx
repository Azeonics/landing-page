'use client';

import { useEffect, useRef } from 'react';
import { pipelineStages } from '@/lib/content/home';
import type { PipelineStage } from '@/lib/content/types';
import Reveal from '@/components/ui/Reveal';
import { gsapReady } from '@/lib/animation';

/** Progress at which the rocket hands off to the satellite. */
const SWAP_AT = 0.92;

/** Stage card shared by the plain stacked list and the rail variant. */
export function PipelineStageCard({ stage }: { stage: PipelineStage }) {
  return (
    <article className="mpipe-card">
      <span className="mpipe-card-num">{stage.num}</span>
      <h3 className="mpipe-card-title">{stage.title}</h3>
      <p className="mpipe-card-desc">{stage.desc}</p>
    </article>
  );
}

/**
 * Mobile + motion variant of the Journey: the stacked stage cards beside a
 * vertical trajectory rail — a burned line and a nose-down rocket scrubbed by
 * normal scroll (no pin), waypoint dots lighting as the burn tip passes them,
 * and a rocket → satellite crossfade at orbit insertion. Only mounted when
 * motion is allowed below the desktop breakpoint, so mounting is the gate:
 * the effect tears down with the component when the breakpoint or the motion
 * preference flips.
 */
export default function PipelineMobileRail() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLSpanElement | null>(null);
  const burnRef = useRef<HTMLSpanElement | null>(null);
  const rocketRef = useRef<SVGSVGElement | null>(null);
  const satRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const base = baseRef.current;
    const burn = burnRef.current;
    const rocket = rocketRef.current;
    const sat = satRef.current;
    if (!wrap || !base || !burn || !rocket || !sat) return;

    const gsap = gsapReady();
    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray<HTMLElement>('.mpipe-mrail-dot', wrap);

      // Dot centers in rail coordinates via the offset chain, accumulated up
      // to the wrapper. Offsets ignore transforms, so measuring stays exact
      // even mid-Reveal — but a transformed <li> *becomes* the offsetParent,
      // so the chain must be walked rather than read off the dot alone.
      const offsetWithin = (el: HTMLElement, ancestor: HTMLElement): number => {
        let y = el.offsetTop;
        let parent = el.offsetParent;
        while (parent instanceof HTMLElement && parent !== ancestor) {
          y += parent.offsetTop;
          parent = parent.offsetParent;
        }
        return y;
      };
      let railLength = base.offsetHeight;
      let dotCenters: number[] = [];
      const measure = () => {
        railLength = base.offsetHeight;
        dotCenters = dots.map(
          (dot) => offsetWithin(dot, wrap) + dot.offsetHeight / 2
        );
      };
      measure();

      gsap.set(rocket, { xPercent: -50, yPercent: -50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: measure,
          // Dots light when the burned line's tip passes their center — a
          // pure function of progress, so it is smooth and fully reversible
          // scrolling back up (a passed dot stays lit until un-passed).
          onUpdate: (self) => {
            const burned = self.progress * railLength;
            dots.forEach((dot, i) => {
              dot.classList.toggle('mpipe-mrail-dot--on', dotCenters[i] <= burned);
            });
          },
        },
      });

      tl.fromTo(
        burn,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, ease: 'none', duration: 1 },
        0
      );
      tl.fromTo(
        rocket,
        { y: 0 },
        { y: () => base.offsetHeight, ease: 'none', duration: 1 },
        0
      );
      // Orbit insertion: rocket → satellite + orbit-ring crossfade at the end.
      tl.fromTo(
        sat,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: 1 - SWAP_AT },
        SWAP_AT
      );
      tl.to(rocket, { autoAlpha: 0, ease: 'none', duration: 1 - SWAP_AT }, SWAP_AT);
    }, wrap);

    return () => {
      ctx.revert();
      // Class toggles happen outside gsap's style tracking — clear manually.
      wrap
        .querySelectorAll('.mpipe-mrail-dot--on')
        .forEach((dot) => dot.classList.remove('mpipe-mrail-dot--on'));
    };
  }, []);

  return (
    <div className="mpipe-mwrap" ref={wrapRef}>
      <div className="mpipe-mrail" aria-hidden="true">
        <span className="mpipe-mrail-base" ref={baseRef} />
        <span className="mpipe-mrail-burn" ref={burnRef} />
        {/* Rocket nose-down: it travels down the rail with scroll.
            Same glyph language as the desktop trajectory rocket. */}
        <svg className="mpipe-mrail-rocket" ref={rocketRef} viewBox="-12 -30 24 46">
          <g transform="rotate(180)">
            <path
              className="mpipe-rocket-body"
              d="M0 -14 C4 -8 4.5 -2 3 8 L-3 8 C-4.5 -2 -4 -8 0 -14 Z"
            />
            <path className="mpipe-rocket-fins" d="M-3 3 L-8 12 L-3 9 M3 3 L8 12 L3 9" />
            <circle className="mpipe-rocket-window" cx="0" cy="-5" r="1.6" />
            <g className="mpipe-rocket-exhaust">
              <line x1="0" y1="10" x2="0" y2="17" opacity="0.7" />
              <line x1="0" y1="19" x2="0" y2="23" opacity="0.4" />
              <line x1="0" y1="25" x2="0" y2="28" opacity="0.2" />
            </g>
          </g>
        </svg>
        {/* Orbit-insertion payoff at the rail end. Sized to the 44px rail
            column so the ring never clips the viewport edge. */}
        <svg className="mpipe-mrail-sat" ref={satRef} viewBox="0 0 44 32">
          <ellipse className="mpipe-orbit-ring" cx="22" cy="16" rx="20" ry="8" />
          <g className="mpipe-orbit-sat" transform="translate(22 16)">
            <rect x="-3" y="-3" width="6" height="6" />
            <line x1="-9" y1="0" x2="-4" y2="0" />
            <line x1="4" y1="0" x2="9" y2="0" />
          </g>
        </svg>
      </div>
      <ol className="mpipe-list mpipe-list--rail">
        {pipelineStages.map((stage, i) => (
          <Reveal key={stage.title} as="li" delay={Math.min(i * 0.06, 0.3)}>
            <span className="mpipe-mrail-dot" aria-hidden="true" />
            <PipelineStageCard stage={stage} />
          </Reveal>
        ))}
      </ol>
      <span className="mpipe-mrail-end" aria-hidden="true">
        ORBIT · GSaaS
      </span>
    </div>
  );
}
