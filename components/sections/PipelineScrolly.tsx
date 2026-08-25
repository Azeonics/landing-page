'use client';

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { pipelineHead, pipelineStages } from '@/lib/content/home';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import PipelineMobileRail, {
  PipelineStageCard,
} from '@/components/sections/PipelineMobileRail';
import { gsapReady } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DESKTOP_QUERY = '(min-width: 981px)';
const STAGE_COUNT = pipelineStages.length;

/** Scrub distance for the pinned panel, as a multiple of viewport height. */
const PIN_DISTANCE = '+=500%';
/** Rest beats between stage crossfades — at rest a stage is always fully opaque. */
const REST = 0.8;
const FADE = 0.4;

/**
 * Ascent trajectory: launch pad bottom-left, gravity-turn curve flattening
 * into orbit top-right. Shared by the faint base path and the bright "burned"
 * overlay; also the measuring path for waypoints and the rocket.
 */
const ASCENT_PATH_D = 'M 48 516 C 48 372 156 128 372 64';
const TRAJ_VIEWBOX = '0 0 420 560';
/** Path end point — orbit insertion. Keep in sync with ASCENT_PATH_D. */
const ORBIT_CENTER = { x: 372, y: 64 } as const;
/** Lookahead along the path (user units) for the rocket's heading. */
const HEADING_LOOKAHEAD = 2;
/** ALT/VEL readout ceilings — LEO insertion figures. */
const MAX_ALT_KM = 550;
const MAX_VEL_KMS = 7.6;

type TrajPoint = Readonly<{ x: number; y: number }>;

const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/**
 * SSR renders the mobile list (snapshot false); useSyncExternalStore
 * re-renders synchronously before paint on hydration, so desktop visitors
 * never see a flash of the stacked list.
 */
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

const padStage = (i: number) => String(i + 1).padStart(2, '0');

const formatReadout = (progress: number): string => {
  const alt = String(Math.round(progress * MAX_ALT_KM)).padStart(3, '0');
  const vel = (progress * MAX_VEL_KMS).toFixed(1);
  return `ALT ${alt} KM · VEL ${vel} KM/S`;
};

/**
 * "Idea 2 Orbit" pipeline. Desktop + motion-OK: the six stages scrub through
 * a pinned 100svh panel (GSAP ScrollTrigger pin + scrub), with a rocket
 * ascent trajectory (waypoints as stage indicators), a progressive starfield
 * and a live ALT/VEL telemetry readout. Mobile or reduced motion: a plain
 * stacked list of stage cards — no pin, no scrub.
 */
export default function PipelineScrolly() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const pinned = isDesktop && !reduced;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const burnRef = useRef<SVGPathElement | null>(null);
  const rocketRef = useRef<SVGGElement | null>(null);
  const orbitRef = useRef<SVGGElement | null>(null);
  const starsFarRef = useRef<HTMLDivElement | null>(null);
  const starsNearRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [waypoints, setWaypoints] = useState<readonly TrajPoint[]>([]);

  useEffect(() => {
    if (!pinned) return;
    const stagePanel = stageRef.current;
    const path = pathRef.current;
    const burn = burnRef.current;
    const rocket = rocketRef.current;
    const orbit = orbitRef.current;
    const starsFar = starsFarRef.current;
    const starsNear = starsNearRef.current;
    if (!stagePanel || !path || !burn || !rocket || !orbit || !starsFar || !starsNear) {
      return;
    }

    // Waypoints: evenly parameterized by arc length — robust against any
    // viewBox/path-geometry change, no hand-tuned coordinates.
    const total = path.getTotalLength();
    setWaypoints(
      pipelineStages.map((_, i) => {
        const p = path.getPointAtLength((total * i) / (STAGE_COUNT - 1));
        return { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 };
      })
    );

    // Rocket placement: position from getPointAtLength, heading from a short
    // central-difference lookahead (atan2). +90° because the glyph points up.
    // Written straight to the transform attribute — no React state per frame.
    const placeRocket = (t: number) => {
      const at = t * total;
      const aheadAt = Math.min(at + HEADING_LOOKAHEAD, total);
      const behindAt = Math.max(aheadAt - HEADING_LOOKAHEAD, 0);
      const p = path.getPointAtLength(at);
      const ahead = path.getPointAtLength(aheadAt);
      const behind = path.getPointAtLength(behindAt);
      const angle =
        (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI + 90;
      rocket.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`);
    };
    placeRocket(0);

    const gsap = gsapReady();
    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>('.mpipe-stage-block', stagePanel);
      if (blocks.length !== STAGE_COUNT) return;

      // Inline start state overrides the CSS resting state (first visible).
      gsap.set(blocks, { autoAlpha: 0, y: 24 });
      gsap.set(blocks[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stagePanel,
          pin: stagePanel,
          start: 'top top',
          end: PIN_DISTANCE,
          scrub: 0.6,
          // Stage activation via progress thresholds: pure function of
          // progress, so it stays correct scrubbing backwards (unlike
          // timeline .call(), which does not reverse reliably).
          onUpdate: (self) => {
            const idx = Math.min(
              STAGE_COUNT - 1,
              Math.floor(self.progress * STAGE_COUNT)
            );
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx); // coarse: one state update per stage change
            }
            // ALT/VEL readout runs every frame — textContent only, no React.
            const readout = readoutRef.current;
            if (readout) readout.textContent = formatReadout(self.progress);
          },
        },
      });

      // Crossfade choreography: rest → outgoing up+fade → incoming from below.
      for (let i = 1; i < STAGE_COUNT; i++) {
        tl.to(
          blocks[i - 1],
          { autoAlpha: 0, y: -24, duration: FADE, ease: 'none' },
          `+=${REST}`
        ).fromTo(
          blocks[i],
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: FADE, ease: 'none' },
          `<${FADE / 2}`
        );
      }
      // The last stage's fade-in starts FADE before the loop's end — that is
      // the deploy moment (orbit reveal / rocket handoff).
      const deployAt = tl.duration() - FADE;
      // Tail rest so the final stage parks at full opacity.
      tl.to({}, { duration: REST });

      const span = tl.duration();

      // Burned portion of the trajectory: pathLength=1 + dasharray 1, so the
      // dashoffset 1→0 is the linear scroll progress (like the old rail fill).
      tl.fromTo(
        burn,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: 'none', duration: span },
        0
      );

      // Rocket rides the path: proxy tween (no MotionPathPlugin installed).
      const flight = { t: 0 };
      tl.to(
        flight,
        { t: 1, ease: 'none', duration: span, onUpdate: () => placeRocket(flight.t) },
        0
      );

      // Progressive starfield: the sky darkens into space across the ascent.
      tl.fromTo(starsFar, { opacity: 0.15 }, { opacity: 0.5, ease: 'none', duration: span }, 0);
      tl.fromTo(starsNear, { opacity: 0 }, { opacity: 0.35, ease: 'none', duration: span }, 0);

      // Stage 6 payoff: orbit + satellite fade in while the rocket fades out
      // (it "became" the payload). Ends exactly at timeline end.
      tl.fromTo(
        orbit,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'none', duration: FADE + REST },
        deployAt
      );
      tl.to(rocket, { autoAlpha: 0, ease: 'none', duration: FADE }, deployAt + FADE / 2);
    }, stagePanel);

    return () => {
      ctx.revert(); // kills the timeline + ScrollTrigger, restores styles
      activeRef.current = 0;
      setActive(0);
    };
  }, [pinned]);

  if (!pinned) {
    // Mobile with motion gets the vertical trajectory rail; reduced motion
    // (any width) keeps the plain stacked list.
    const mobileRail = !isDesktop && !reduced;

    return (
      <section className="mpipe" id="pipeline" key="mpipe-list">
        <div className="wrap mpipe-head">
          <Reveal>
            <SectionHead head={pipelineHead} />
          </Reveal>
          {mobileRail ? (
            <PipelineMobileRail />
          ) : (
            <ol className="mpipe-list">
              {pipelineStages.map((stage, i) => (
                <Reveal key={stage.title} as="li" delay={Math.min(i * 0.06, 0.3)}>
                  <PipelineStageCard stage={stage} />
                </Reveal>
              ))}
            </ol>
          )}
        </div>
      </section>
    );
  }

  const activeStage = pipelineStages[active];

  return (
    // Distinct key from the stacked-list branch: GSAP's pin spacer reparents
    // .mpipe-stage, so React must replace the whole <section> on breakpoint
    // changes instead of diffing children it no longer owns (removeChild crash).
    <section className="mpipe" id="pipeline" key="mpipe-pinned">
      <div className="wrap mpipe-head">
        <Reveal>
          <SectionHead head={pipelineHead} />
        </Reveal>
      </div>

      <div className="mpipe-stage" ref={stageRef}>
        <div className="mpipe-stars mpipe-stars--far" ref={starsFarRef} aria-hidden="true" />
        <div className="mpipe-stars mpipe-stars--near" ref={starsNearRef} aria-hidden="true" />

        <div className="wrap mpipe-stage-grid">
          <div className="mpipe-content">
            {pipelineStages.map((stage, i) => (
              <div className="mpipe-stage-block" key={stage.title}>
                <span className="mpipe-stage-eyebrow">
                  STAGE {padStage(i)} / {padStage(STAGE_COUNT - 1)}
                </span>
                <span className="mpipe-stage-bignum" aria-hidden="true">
                  {padStage(i)}
                </span>
                <h3 className="mpipe-stage-title">{stage.title}</h3>
                <p className="mpipe-stage-desc">{stage.desc}</p>
              </div>
            ))}
          </div>

          <div className="mpipe-traj" aria-hidden="true">
            <svg
              className="mpipe-traj-svg"
              viewBox={TRAJ_VIEWBOX}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Launch pad: base + gantry */}
              <g className="mpipe-pad">
                <line x1="24" y1="524" x2="80" y2="524" />
                <line x1="30" y1="524" x2="30" y2="486" />
                <line x1="30" y1="494" x2="40" y2="494" />
              </g>
              <text className="mpipe-traj-micro" x="24" y="544">
                T-0 · THANE
              </text>
              <text className="mpipe-traj-micro" x="266" y="22">
                LEO INSERTION
              </text>

              {/* Ascent path: faint base + bright burned overlay */}
              <path className="mpipe-traj-base" d={ASCENT_PATH_D} ref={pathRef} />
              <path
                className="mpipe-traj-burn"
                d={ASCENT_PATH_D}
                pathLength={1}
                ref={burnRef}
              />

              {/* Waypoints — the stage indicators (old rail ticks reborn) */}
              {waypoints.length === STAGE_COUNT &&
                pipelineStages.map((stage, i) => (
                  <g
                    key={stage.title}
                    className={`mpipe-wp${i <= active ? ' mpipe-wp--on' : ''}`}
                    transform={`translate(${waypoints[i].x} ${waypoints[i].y})`}
                  >
                    <circle className="mpipe-wp-dot" r="6" />
                    <text className="mpipe-wp-label" x="14" y="4">
                      {padStage(i)}
                    </text>
                  </g>
                ))}

              {/* Stage 6 payoff: orbit ellipse + deployed satellite */}
              <g className="mpipe-orbit" ref={orbitRef}>
                <ellipse
                  className="mpipe-orbit-ring"
                  cx={ORBIT_CENTER.x}
                  cy={ORBIT_CENTER.y}
                  rx="42"
                  ry="14"
                  transform={`rotate(-16 ${ORBIT_CENTER.x} ${ORBIT_CENTER.y})`}
                />
                <g className="mpipe-orbit-sat" transform="translate(408.5 48.5)">
                  <rect x="-3" y="-3" width="6" height="6" />
                  <line x1="-9" y1="0" x2="-4" y2="0" />
                  <line x1="4" y1="0" x2="9" y2="0" />
                </g>
              </g>

              {/* The rocket: line-art glyph pointing up in local coords;
                  transform is driven imperatively from the timeline. */}
              <g className="mpipe-rocket" ref={rocketRef}>
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
          </div>
        </div>

        <p className="mpipe-telemetry" aria-live="off">
          <span className="mpipe-telemetry-line">
            T-MINUS · STAGE {padStage(active)}/{padStage(STAGE_COUNT - 1)} ·{' '}
            {activeStage.title.toUpperCase()}
          </span>
          <span className="mpipe-telemetry-line mpipe-telemetry-readout" ref={readoutRef}>
            {formatReadout(0)}
          </span>
        </p>
      </div>
    </section>
  );
}
