'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Ellipse-shaped motion paths (arc pairs) centred on (200, 180). Each lives
 * inside a rotated <g>, so the same path data drives both the drawn orbit and
 * the satellite's <animateMotion> — SMIL follows the raw path geometry, and
 * the group rotation transforms path and satellite identically.
 */
const ORBIT_INNER = 'M 118 180 A 82 34 0 1 1 282 180 A 82 34 0 1 1 118 180 Z';
const ORBIT_MID = 'M 76 180 A 124 52 0 1 1 324 180 A 124 52 0 1 1 76 180 Z';
const ORBIT_OUTER = 'M 40 180 A 160 68 0 1 1 360 180 A 160 68 0 1 1 40 180 Z';

interface SatelliteProps {
  pathId: string;
  /** Resting position on the path (its start point) when motion is off. */
  restX: number;
  restY: number;
  dur: string;
  animated: boolean;
}

/** Satellite dot: SMIL traveller when motion is allowed, static dot otherwise. */
function Satellite({ pathId, restX, restY, dur, animated }: SatelliteProps) {
  if (!animated) {
    return <circle cx={restX} cy={restY} r={3} fill="var(--teal-bright)" />;
  }
  return (
    <circle r={3} fill="var(--teal-bright)">
      <animateMotion dur={dur} repeatCount="indefinite">
        <mpath href={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}

interface OrbitalSvgProps {
  /**
   * 'inline' is the mobile placement (rendered right after the lead copy,
   * shown <=980px). It gets its own SMIL path ids — the diagram renders twice
   * in the section and duplicate ids would point both <mpath> travellers at
   * whichever instance comes first in the DOM.
   */
  variant?: 'desktop' | 'inline';
}

/**
 * Decorative ground-segment orbital diagram for the GSaaS section. Pure SMIL —
 * no JS animation loop. Reduced motion: SMIL ignores CSS, so the animated
 * children are simply not rendered and the satellites park on their orbits.
 */
export default function OrbitalSvg({ variant = 'desktop' }: OrbitalSvgProps) {
  const animated = !useReducedMotion();
  const idPrefix = variant === 'inline' ? 'mgsaas-inline' : 'mgsaas';

  return (
    <div className="mgsaas-visual" aria-hidden="true">
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" focusable="false">
        {/* Central body */}
        <circle
          cx={200}
          cy={180}
          r={22}
          fill="var(--teal)"
          fillOpacity={0.08}
          stroke="var(--teal)"
          strokeOpacity={0.4}
          strokeWidth={1}
        />

        {/* Inner orbit + SAT-01 */}
        <g transform="rotate(-14 200 180)">
          <path
            id={`${idPrefix}-orbit-inner`}
            d={ORBIT_INNER}
            fill="none"
            stroke="var(--teal)"
            strokeOpacity={0.35}
            strokeWidth={1}
          />
          <Satellite
            pathId={`${idPrefix}-orbit-inner`}
            restX={118}
            restY={180}
            dur="14s"
            animated={animated}
          />
        </g>

        {/* Middle orbit — path only, depth layer */}
        <g transform="rotate(9 200 180)">
          <path
            d={ORBIT_MID}
            fill="none"
            stroke="var(--teal)"
            strokeOpacity={0.25}
            strokeWidth={1}
          />
        </g>

        {/* Outer orbit + SAT-02 */}
        <g transform="rotate(-5 200 180)">
          <path
            id={`${idPrefix}-orbit-outer`}
            d={ORBIT_OUTER}
            fill="none"
            stroke="var(--teal)"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
          <Satellite
            pathId={`${idPrefix}-orbit-outer`}
            restX={40}
            restY={180}
            dur="22s"
            animated={animated}
          />
        </g>

        {/* Pass link: ground node → inner orbit, slow pulse */}
        <line
          x1={200}
          y1={330}
          x2={246}
          y2={202}
          stroke="var(--teal-bright)"
          strokeWidth={1}
          strokeDasharray="4 5"
          opacity={animated ? 0.1 : 0.3}
        >
          {animated && (
            <animate
              attributeName="opacity"
              values="0.1;0.5;0.1"
              dur="6s"
              repeatCount="indefinite"
            />
          )}
        </line>

        {/* Ground station node */}
        <g stroke="var(--teal)" strokeWidth={1.2} fill="none">
          <path d="M186 342 Q200 327 214 342" />
          <line x1={200} y1={342} x2={200} y2={353} />
          <line x1={191} y1={353} x2={209} y2={353} />
        </g>
        <circle cx={200} cy={333} r={2.5} fill="var(--teal-bright)" />
      </svg>
    </div>
  );
}
