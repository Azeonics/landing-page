import type { ReactNode } from 'react';

interface IconProps {
  children: ReactNode;
}

/** Shared frame: 24×24 line-art, stroke-only, inherits color from the card. */
function Icon({ children }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/**
 * Line-art icons keyed by the `icon` ids in lib/content/capabilities.ts.
 * Each is ≤6 geometric elements at a consistent 1.4 stroke.
 */
export const capabilityIcons: Record<string, ReactNode> = {
  /* Spindle block + quill + tool tip over a fixtured part. */
  cnc: (
    <Icon>
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M12 7v3" />
      <path d="M10.5 10 12 13.5 13.5 10" />
      <rect x="5.5" y="16" width="13" height="4.5" rx="1" />
    </Icon>
  ),

  /* Layered pyramid building up, melt-pool dots rising above. */
  additive: (
    <Icon>
      <rect x="4.5" y="17" width="15" height="3.5" rx="0.75" />
      <rect x="7" y="13" width="10" height="3.5" rx="0.75" />
      <rect x="9.5" y="9" width="5" height="3.5" rx="0.75" />
      <circle cx="12" cy="6" r="0.5" />
      <circle cx="12" cy="3.2" r="0.5" />
    </Icon>
  ),

  /* Chip package with breakout traces and through-hole pads. */
  pcb: (
    <Icon>
      <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
      <path d="M12 8.5V3.5M12 15.5v5M8.5 12H6.4M15.5 12h2.1" />
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </Icon>
  ),

  /* Emitter dot with three propagating signal arcs. */
  sensor: (
    <Icon>
      <circle cx="7" cy="17" r="1.4" />
      <path d="M11 13a5.66 5.66 0 0 1 0 8" />
      <path d="M14 12a8.6 8.6 0 0 1 0 10" />
      <path d="M17 11a11.66 11.66 0 0 1 0 12" />
    </Icon>
  ),

  /* Horizontal vacuum chamber with a thermal wave inside. */
  tvac: (
    <Icon>
      <ellipse cx="7" cy="12" rx="2.8" ry="6" />
      <path d="M7 6h10M7 18h10" />
      <path d="M17 6a2.8 6 0 0 1 0 12" />
      <path d="M11 12c.7-1.2 1.4 1.2 2.1 0s1.4 1.2 2.1 0" />
    </Icon>
  ),

  /* Contamination shield with a four-point sparkle. */
  cleanroom: (
    <Icon>
      <path d="M12 3.5l7 2.8v5.2c0 4.4-2.9 7.5-7 9-4.1-1.5-7-4.6-7-9V6.3z" />
      <path d="M12 8.2l.8 2.7 2.6.8-2.6.8-.8 2.7-.8-2.7-2.6-.8 2.6-.8z" />
    </Icon>
  ),
};
