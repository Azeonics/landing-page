'use client';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { assemblyHead, assemblySub, assemblyStages } from '@/lib/content/capabilities';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import AssemblyDiagram from '@/components/sections/AssemblyDiagram';
import { gsapReady } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DESKTOP_QUERY = '(min-width: 980px)';
/** Scrub distance for the pinned panel, as a multiple of viewport height. */
const SCRUB_VH = 320;

function subscribeDesktop(onChange: () => void): () => void {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

/**
 * "The Build": a scroll-scrubbed satellite assembly. Desktop + motion-OK: a
 * pinned 100svh panel where a blueprint CubeSat is assembled part by part as
 * the user scrolls (crisp SVG, staggered arrivals, overshoot docking), with a
 * synced caption rail — each stage mirrors a real capability on the floor.
 * Mobile or reduced motion: a plain stacked list of the same six stages.
 */
export default function CapabilityAssembly() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const pinned = isDesktop && !reduced;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    if (!pinned) return;
    const stagePanel = stageRef.current;
    if (!stagePanel) return;
    const gsap = gsapReady();

    const ctx = gsap.context(() => {
      // Tween a proxy and read ITS progress: ScrollTrigger's own onUpdate
      // reports raw scroll progress, so the scrub smoothing only exists on
      // the linked tween — reading the proxy is what makes catch-up easing real.
      const proxy = { value: 0 };
      gsap.to(proxy, {
        value: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stagePanel,
          pin: stagePanel,
          start: 'top top',
          end: `+=${SCRUB_VH}%`,
          scrub: 0.6,
        },
        onUpdate: () => {
          progressRef.current = proxy.value;
          const idx = Math.min(assemblyStages.length - 1, Math.floor(proxy.value * assemblyStages.length));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    }, stagePanel);

    return () => ctx.revert();
  }, [pinned]);

  if (!pinned) {
    return (
      <section className="masm" id="assembly" key="masm-static">
        <div className="wrap masm-head">
          <Reveal>
            <SectionHead head={assemblyHead} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="masm-sub">{assemblySub}</p>
          </Reveal>
          <div className="masm-static">
            {assemblyStages.map((stage, i) => (
              <Reveal key={stage.num} delay={i * 0.05}>
                <article className="masm-static-card">
                  <span className="masm-stage-num">{stage.num}</span>
                  <h3 className="masm-stage-title">{stage.title}</h3>
                  <p className="masm-stage-desc">{stage.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    // Distinct key from the static branch: GSAP's pin spacer reparents the DOM.
    <section className="masm" id="assembly" key="masm-pinned">
      <div className="wrap masm-head">
        <Reveal>
          <SectionHead head={assemblyHead} />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="masm-sub">{assemblySub}</p>
        </Reveal>
      </div>

      <div className="masm-stage" ref={stageRef}>
        <div className="masm-canvas" aria-hidden="true">
          <AssemblyDiagram progressRef={progressRef} />
        </div>
        <div className="wrap masm-stage-grid">
          <ol className="masm-rail" aria-label="Assembly stages">
            {assemblyStages.map((stage, i) => (
              <li key={stage.num} className={`masm-rail-item${i === active ? ' is-active' : ''}`}>
                <span className="masm-stage-num">{stage.num}</span>
                <h3 className="masm-stage-title">{stage.title}</h3>
                <p className="masm-stage-desc">{stage.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
