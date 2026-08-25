import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020B1E'
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <defs>
            <radialGradient id="planet" cx="35%" cy="32%" r="80%">
              <stop offset="0%" stopColor="#00C2EA" />
              <stop offset="55%" stopColor="#0197BA" />
              <stop offset="100%" stopColor="#041E4B" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="9" fill="url(#planet)" />
          <ellipse
            cx="16"
            cy="16"
            rx="13"
            ry="4.8"
            stroke="#00C2EA"
            strokeWidth="1"
            opacity="0.7"
            transform="rotate(-18 16 16)"
          />
          <circle cx="27.2" cy="11.6" r="1.3" fill="#EAF2FF" />
        </svg>
      </div>
    ),
    size
  );
}
