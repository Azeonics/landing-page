import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

/* Brand anchors (mirrors :root in app/globals.css — next/og can't read CSS vars) */
const NAVY_BG = '#020B1E';
const NAVY = '#041E4B';
const TEAL = '#0197BA';
const TEAL_BRIGHT = '#00C2EA';
const INK = '#EAF2FF';
const INK_3 = '#7E93B8';

type OgArgs = { eyebrow: string; title: string };

export function renderOgImage({ eyebrow, title }: OgArgs) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: NAVY_BG,
          backgroundImage: `radial-gradient(circle at 82% 12%, rgba(1, 151, 186, 0.28), transparent 55%), radial-gradient(circle at 8% 92%, rgba(4, 30, 75, 0.85), transparent 60%)`,
          padding: '72px',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke={TEAL} strokeWidth="1.2" />
            <ellipse cx="16" cy="16" rx="15" ry="6" stroke={TEAL_BRIGHT} strokeWidth="0.7" opacity="0.6" />
            <circle cx="16" cy="16" r="2.4" fill={TEAL_BRIGHT} />
          </svg>
          <div style={{ color: INK, fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em' }}>Azeonics</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              color: TEAL_BRIGHT,
              fontSize: 22,
              letterSpacing: '0.18em',
              textTransform: 'uppercase'
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              color: INK,
              fontSize: 76,
              lineHeight: 1.04,
              letterSpacing: '-0.03em',
              maxWidth: 980
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 220,
              height: 3,
              background: `linear-gradient(90deg, ${TEAL_BRIGHT}, ${TEAL}, transparent)`
            }}
          />
        </div>

        <div style={{ color: INK_3, fontSize: 24, letterSpacing: '0.04em' }}>
          Idea 2 Orbit Innovation Hub · Thane, Maharashtra · India
        </div>
      </div>
    ),
    ogSize
  );
}
