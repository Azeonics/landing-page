'use client';
import { useEffect, useRef } from 'react';
import { gsapReady } from '@/lib/animation';

interface AssemblyDiagramProps {
  /** Scroll progress 0..1 written by the pinned ScrollTrigger — read every tick. */
  progressRef: React.MutableRefObject<number>;
}

/* ---------------- geometry (viewBox 640×720, satellite centred) ---------------- */
const BODY_L = 250;
const BODY_R = 390;
const BODY_T = 160;
const BODY_B = 560;
const CX = (BODY_L + BODY_R) / 2;

/* ---------------- easing — precision stagger + overshoot docking ---------------- */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Cubic smoothstep for fades/sweeps. */
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
/** easeOutBack — parts dock with a tiny overshoot, like a latch seating. */
const back = (t: number) => {
  const c = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(c - 1, 3) + c1 * Math.pow(c - 1, 2);
};
/** Eased local progress of window [s, e] at global p. */
const win = (p: number, s: number, e: number, fn: (t: number) => number = smooth) =>
  fn((p - s) / (e - s));

/* ---------------- part registry: slide-in pieces (dx/dy = fly-in offset) ---------------- */
type Slide = { key: string; dx: number; dy: number; s: number; e: number; pop?: boolean };
const SLIDES: Slide[] = [
  // A/01 — machined structure: rails from the sides, caps from above/below.
  { key: 'rail-l', dx: -190, dy: 0, s: 0.01, e: 0.075 },
  { key: 'rail-r', dx: 190, dy: 0, s: 0.03, e: 0.095 },
  { key: 'cap-t', dx: 0, dy: -150, s: 0.06, e: 0.125 },
  { key: 'cap-b', dx: 0, dy: 150, s: 0.08, e: 0.145 },
  // A/02 — additive: thruster rises, brackets pop in (staggered).
  { key: 'thruster', dx: 0, dy: 130, s: 0.185, e: 0.26 },
  { key: 'brk-1', dx: 0, dy: 0, s: 0.24, e: 0.285, pop: true },
  { key: 'brk-2', dx: 0, dy: 0, s: 0.26, e: 0.305, pop: true },
  { key: 'brk-3', dx: 0, dy: 0, s: 0.28, e: 0.325, pop: true },
  { key: 'brk-4', dx: 0, dy: 0, s: 0.3, e: 0.333, pop: true },
  // A/03 — electronics: the PCB stack slides in from the right, staggered wave.
  { key: 'pcb-1', dx: 250, dy: 0, s: 0.35, e: 0.42 },
  { key: 'pcb-2', dx: 280, dy: 0, s: 0.375, e: 0.445 },
  { key: 'pcb-3', dx: 310, dy: 0, s: 0.4, e: 0.47 },
  { key: 'pcb-4', dx: 340, dy: 0, s: 0.425, e: 0.495 },
  // A/05 — integration: skins close from both sides.
  { key: 'skin-l', dx: -120, dy: 0, s: 0.675, e: 0.735 },
  { key: 'skin-r', dx: 120, dy: 0, s: 0.695, e: 0.755 },
];

const QUAL_S = 0.5;
const QUAL_E = 0.655;
const WING_S = 0.745;
const WING_E = 0.83;
const ANT_S = 0.79;
const ANT_E = 0.85;
const FINAL_S = 5 / 6;

/** Wing panel fold: scaleX from a hinge edge, expressed as an SVG transform string. */
const foldX = (hinge: number, k: number) => `translate(${hinge} 0) scale(${Math.max(k, 0.001)} 1) translate(${-hinge} 0)`;

/**
 * Blueprint exploded-view of a 3U CubeSat, scrubbed by scroll progress:
 * machined structure docks, thruster and brackets arrive, the PCB stack
 * staggers in, a qualification scan sweeps the body, skins close, solar
 * wings unfold panel by panel, the antenna extends, and an orbit ring draws
 * around the finished build. Pure SVG — crisp at any DPI, themed via CSS vars.
 */
export default function AssemblyDiagram({ progressRef }: AssemblyDiagramProps) {
  const refs = useRef<Record<string, SVGGElement | null>>({});
  const satRef = useRef<SVGGElement | null>(null);
  const scanRef = useRef<SVGGElement | null>(null);
  const wingPanelRefs = useRef<(SVGGElement | null)[]>([]);
  const antennaRef = useRef<SVGGElement | null>(null);
  const antennaTipRef = useRef<SVGCircleElement | null>(null);
  const orbitRef = useRef<SVGEllipseElement | null>(null);
  const dimRef = useRef<SVGGElement | null>(null);
  const qualLabelRefs = useRef<(SVGGElement | null)[]>([]);
  const stampRef = useRef<SVGGElement | null>(null);
  const ORBIT_LEN = 1300;

  useEffect(() => {
    const gsap = gsapReady();

    let lastP = -1;
    const tick = () => {
      const p = progressRef.current;
      const t = performance.now() / 1000;

      // Whole-build: vibration jitter during qualification, gentle float when flight-ready.
      const qualT = win(p, QUAL_S, QUAL_E);
      const envelope = Math.sin(clamp01(qualT) * Math.PI);
      const finalT = win(p, FINAL_S, 1);

      // Idle guard: nothing to redraw when the scrub is still and no
      // time-driven motion (qual jitter, flight-ready float) is active.
      if (p === lastP && envelope === 0 && finalT === 0) return;
      lastP = p;
      const jx = Math.sin(t * 43) * 3.2 * envelope;
      const jy = Math.cos(t * 57) * 2.2 * envelope + Math.sin(t * 1.4) * 4 * finalT;
      satRef.current?.setAttribute('transform', `translate(${jx} ${jy})`);

      // Slide-in parts: translate to rest with overshoot; pops scale up from centre.
      for (const part of SLIDES) {
        const el = refs.current[part.key];
        if (!el) continue;
        const k = win(p, part.s, part.e, back);
        const vis = p > part.s;
        el.style.opacity = vis ? String(Math.min(1, win(p, part.s, part.e) * 2.5)) : '0';
        el.setAttribute(
          'transform',
          part.pop
            ? `translate(${el.dataset.cx} ${el.dataset.cy}) scale(${Math.max(vis ? k : 0, 0.001)}) translate(-${el.dataset.cx} -${el.dataset.cy})`
            : `translate(${part.dx * (1 - k)} ${part.dy * (1 - k)})`,
        );
      }

      // Qualification scan line sweeps the body; labels tick on, then clear
      // out before the wings deploy into their column.
      if (scanRef.current) {
        scanRef.current.style.opacity = String(envelope);
        scanRef.current.setAttribute('transform', `translate(0 ${(BODY_B - BODY_T + 40) * qualT})`);
      }
      const qualFadeOut = 1 - win(p, 0.68, 0.73);
      qualLabelRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = String(smooth((qualT - (0.25 + i * 0.22)) / 0.12) * qualFadeOut);
      });

      // Solar wings: three panels a side, unfolding outward in sequence.
      wingPanelRefs.current.forEach((el, i) => {
        if (!el) return;
        const side = i < 3 ? -1 : 1;
        const idx = i % 3;
        const k = win(p, WING_S + idx * 0.022, WING_E - (2 - idx) * 0.01, back);
        const hinge = side === -1 ? BODY_L - 4 - idx * 56 : BODY_R + 4 + idx * 56;
        el.style.opacity = p > WING_S ? '1' : '0';
        el.setAttribute('transform', foldX(hinge, k));
      });

      // Antenna: mast scales up from its base; the tip rides the mast so the
      // circle never squashes into an ellipse mid-extension.
      const antK = win(p, ANT_S, ANT_E);
      if (antennaRef.current) {
        antennaRef.current.style.opacity = antK > 0.01 ? '1' : '0';
        antennaRef.current.setAttribute('transform', `translate(0 ${BODY_T - 8}) scale(1 ${Math.max(antK, 0.001)}) translate(0 ${-(BODY_T - 8)})`);
      }
      if (antennaTipRef.current) {
        antennaTipRef.current.style.opacity = antK > 0.01 ? String(antK) : '0';
        antennaTipRef.current.setAttribute('transform', `translate(0 ${56 * (1 - antK)})`);
      }

      // Orbit ring draws on around the finished satellite; stamp fades up.
      if (orbitRef.current) {
        orbitRef.current.style.strokeDashoffset = String(ORBIT_LEN * (1 - finalT));
        orbitRef.current.style.opacity = finalT > 0.01 ? '0.7' : '0';
      }
      if (stampRef.current) stampRef.current.style.opacity = String(smooth((finalT - 0.5) / 0.4));

      // Dimension callout belongs to the machining stage; fades once the build moves on.
      if (dimRef.current) {
        dimRef.current.style.opacity = String(win(p, 0.1, 0.15) * (1 - win(p, 0.62, 0.7)));
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [progressRef]);

  const setRef = (key: string) => (el: SVGGElement | null) => {
    refs.current[key] = el;
  };

  return (
    <svg viewBox="0 0 640 720" className="masm-svg" aria-hidden="true">
      <defs>
        <pattern id="masm-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--line-2)" />
        </pattern>
        <linearGradient id="masm-scan-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--teal-bright)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--teal-bright)" stopOpacity="0.14" />
        </linearGradient>
      </defs>

      {/* Blueprint ground: dot grid + corner crosshairs. */}
      <rect x="24" y="24" width="592" height="672" fill="url(#masm-grid)" />
      {[
        [40, 40],
        [600, 40],
        [40, 680],
        [600, 680],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="var(--ink-3)" strokeWidth="1" opacity="0.6">
          <line x1={x - 8} y1={y} x2={x + 8} y2={y} />
          <line x1={x} y1={y - 8} x2={x} y2={y + 8} />
        </g>
      ))}

      {/* Orbit ring — drawn on at flight-ready. */}
      <ellipse
        ref={orbitRef}
        cx={CX}
        cy={(BODY_T + BODY_B) / 2}
        rx="255"
        ry="170"
        fill="none"
        stroke="var(--teal)"
        strokeWidth="1"
        strokeDasharray={ORBIT_LEN}
        strokeDashoffset={ORBIT_LEN}
        opacity="0"
        transform={`rotate(-18 ${CX} ${(BODY_T + BODY_B) / 2})`}
      />

      {/* Build-target ghost: dashed silhouette of the finished satellite —
          always visible, so the stage never reads as empty before the scrub. */}
      <g stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="5 5" opacity="0.3" fill="none">
        <rect x={BODY_L - 9} y={BODY_T - 12} width={BODY_R - BODY_L + 18} height={BODY_B - BODY_T + 24} rx="2" />
        <rect x={BODY_L - 172} y={BODY_T + 40} width="164" height={BODY_B - BODY_T - 80} />
        <rect x={BODY_R + 8} y={BODY_T + 40} width="164" height={BODY_B - BODY_T - 80} />
        <line x1={CX} y1={BODY_T - 12} x2={CX} y2={BODY_T - 64} />
        <text x={CX} y={BODY_B + 84} fontFamily="var(--mono)" fontSize="11" letterSpacing="0.18em" fill="var(--ink-3)" stroke="none" textAnchor="middle">
          BUILD TARGET · 3U · SCROLL TO ASSEMBLE
        </text>
      </g>

      <g ref={satRef}>
        {/* A/01 · machined structure */}
        <g ref={setRef('rail-l')} opacity="0">
          <rect x={BODY_L - 5} y={BODY_T} width="10" height={BODY_B - BODY_T} fill="var(--bg-card)" stroke="var(--ink-2)" strokeWidth="1.5" />
        </g>
        <g ref={setRef('rail-r')} opacity="0">
          <rect x={BODY_R - 5} y={BODY_T} width="10" height={BODY_B - BODY_T} fill="var(--bg-card)" stroke="var(--ink-2)" strokeWidth="1.5" />
        </g>
        <g ref={setRef('cap-t')} opacity="0">
          <rect x={BODY_L - 9} y={BODY_T - 12} width={BODY_R - BODY_L + 18} height="12" rx="2" fill="var(--bg-card)" stroke="var(--ink-2)" strokeWidth="1.5" />
        </g>
        <g ref={setRef('cap-b')} opacity="0">
          <rect x={BODY_L - 9} y={BODY_B} width={BODY_R - BODY_L + 18} height="12" rx="2" fill="var(--bg-card)" stroke="var(--ink-2)" strokeWidth="1.5" />
        </g>

        {/* A/02 · additive: thruster + corner brackets */}
        <g ref={setRef('thruster')} opacity="0">
          <rect x={CX - 22} y={BODY_B + 14} width="44" height="16" rx="2" fill="var(--bg-card)" stroke="var(--ink-2)" strokeWidth="1.5" />
          <path d={`M ${CX - 14} ${BODY_B + 30} L ${CX + 14} ${BODY_B + 30} L ${CX + 22} ${BODY_B + 48} L ${CX - 22} ${BODY_B + 48} Z`} fill="none" stroke="var(--teal)" strokeWidth="1.5" />
        </g>
        {[
          [BODY_L + 5, BODY_T + 26],
          [BODY_R - 5, BODY_T + 26],
          [BODY_L + 5, BODY_B - 26],
          [BODY_R - 5, BODY_B - 26],
        ].map(([x, y], i) => (
          <g key={`brk-${i}`} ref={setRef(`brk-${i + 1}`)} data-cx={x} data-cy={y} opacity="0">
            <rect x={x - 7} y={y - 7} width="14" height="14" fill="none" stroke="var(--teal)" strokeWidth="1.5" />
          </g>
        ))}

        {/* A/03 · the PCB stack */}
        {[0, 1, 2, 3].map((i) => {
          const y = BODY_B - 84 - i * 92;
          return (
            <g key={`pcb-${i}`} ref={setRef(`pcb-${i + 1}`)} opacity="0">
              <rect x={BODY_L + 14} y={y} width={BODY_R - BODY_L - 28} height="16" rx="2" fill="var(--bg-2)" stroke="var(--teal)" strokeWidth="1.5" />
              <rect x={BODY_L + 26} y={y + 4} width="10" height="8" fill="var(--teal-bright)" />
              <rect x={BODY_L + 44} y={y + 4} width="18" height="8" fill="none" stroke="var(--ink-3)" strokeWidth="1" />
              <line x1={BODY_R - 34} y1={y + 8} x2={BODY_R - 20} y2={y + 8} stroke="var(--ink-3)" strokeWidth="1" />
            </g>
          );
        })}

        {/* A/05 · skins (translucent so the stack stays legible) */}
        <g ref={setRef('skin-l')} opacity="0">
          <rect x={BODY_L + 6} y={BODY_T + 6} width={(BODY_R - BODY_L) / 2 - 8} height={BODY_B - BODY_T - 12} fill="var(--bg-card)" fillOpacity="0.82" stroke="var(--ink-3)" strokeWidth="1" />
        </g>
        <g ref={setRef('skin-r')} opacity="0">
          <rect x={CX + 2} y={BODY_T + 6} width={(BODY_R - BODY_L) / 2 - 8} height={BODY_B - BODY_T - 12} fill="var(--bg-card)" fillOpacity="0.82" stroke="var(--ink-3)" strokeWidth="1" />
        </g>

        {/* A/05 · solar wings — three panels a side, hinge-folded */}
        {[-1, 1].flatMap((side, sIdx) =>
          [0, 1, 2].map((i) => {
            const w = 56;
            const x = side === -1 ? BODY_L - 4 - (i + 1) * w : BODY_R + 4 + i * w;
            return (
              <g
                key={`wing-${side}-${i}`}
                ref={(el) => {
                  wingPanelRefs.current[sIdx * 3 + i] = el;
                }}
                opacity="0"
              >
                <rect x={x} y={BODY_T + 40} width={w - 4} height={BODY_B - BODY_T - 80} fill="var(--bg-2)" stroke="var(--teal)" strokeWidth="1.5" />
                <line x1={x + (w - 4) / 2} y1={BODY_T + 46} x2={x + (w - 4) / 2} y2={BODY_B - 46} stroke="var(--line-2)" strokeWidth="1" />
              </g>
            );
          }),
        )}

        {/* A/05 · antenna — mast in a scaled group, tip translated separately */}
        <g ref={antennaRef} opacity="0">
          <line x1={CX} y1={BODY_T - 8} x2={CX} y2={BODY_T - 64} stroke="var(--ink-2)" strokeWidth="2" />
        </g>
        <circle ref={antennaTipRef} cx={CX} cy={BODY_T - 64} r="4.5" fill="var(--teal-bright)" opacity="0" />
      </g>

      {/* A/04 · qualification scan — sweeps in screen space over the body */}
      <g ref={scanRef} opacity="0">
        <rect x={BODY_L - 40} y={BODY_T - 60} width={BODY_R - BODY_L + 80} height="40" fill="url(#masm-scan-fade)" />
        <line x1={BODY_L - 40} y1={BODY_T - 20} x2={BODY_R + 40} y2={BODY_T - 20} stroke="var(--teal-bright)" strokeWidth="1.5" />
      </g>
      {['VIBE ✓', 'TVAC ✓', 'EMI/EMC ✓'].map((label, i) => (
        <g
          key={label}
          ref={(el) => {
            qualLabelRefs.current[i] = el;
          }}
          opacity="0"
        >
          <text x={470} y={250 + i * 30} fontFamily="var(--mono)" fontSize="12" letterSpacing="0.14em" fill="var(--teal)">
            {label}
          </text>
        </g>
      ))}

      {/* A/01 · dimension callout */}
      <g ref={dimRef} opacity="0" stroke="var(--ink-3)" strokeWidth="1">
        <line x1={BODY_R + 26} y1={BODY_T} x2={BODY_R + 26} y2={BODY_B} />
        <line x1={BODY_R + 20} y1={BODY_T} x2={BODY_R + 32} y2={BODY_T} />
        <line x1={BODY_R + 20} y1={BODY_B} x2={BODY_R + 32} y2={BODY_B} />
        <text x={BODY_R + 38} y={(BODY_T + BODY_B) / 2} fontFamily="var(--mono)" fontSize="11" letterSpacing="0.12em" fill="var(--ink-3)" stroke="none" transform={`rotate(90 ${BODY_R + 38} ${(BODY_T + BODY_B) / 2})`} textAnchor="middle">
          3U · 340 MM · ±5 µM
        </text>
      </g>

      {/* A/06 · flight-ready stamp */}
      <g ref={stampRef} opacity="0">
        <rect x={CX - 74} y={648} width="148" height="30" rx="15" fill="none" stroke="var(--teal)" strokeWidth="1.5" />
        <text x={CX} y={668} fontFamily="var(--mono)" fontSize="12" letterSpacing="0.2em" fill="var(--teal-bright)" textAnchor="middle">
          FLIGHT READY
        </text>
      </g>
    </svg>
  );
}
