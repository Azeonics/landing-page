'use client';

import { useEffect, useState } from 'react';
import TelemetryTag from '@/components/ui/TelemetryTag';

const CLOCK_TICK_MS = 1000;
/** Thane facility coordinates. */
const FACILITY_COORDS = '19.2183° N · 72.9781° E';
/** SSR/first-paint placeholder — avoids a hydration mismatch on the clock. */
const CLOCK_PLACEHOLDER = 'T --:--:-- UTC';

function formatUtcClock(now: Date): string {
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  const ss = String(now.getUTCSeconds()).padStart(2, '0');
  return `T ${hh}:${mm}:${ss} UTC`;
}

/**
 * Decorative telemetry overlay: facility coordinates + live UTC clock
 * (top-right) and system status tags (bottom-right). Pointer-transparent,
 * hidden from AT, and removed entirely below 720px.
 */
export default function HeroHud() {
  const [clock, setClock] = useState(CLOCK_PLACEHOLDER);

  useEffect(() => {
    const tick = () => setClock(formatUtcClock(new Date()));
    tick();
    const id = setInterval(tick, CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-hud" aria-hidden="true">
      <div className="hero-hud-top">
        <span>{FACILITY_COORDS}</span>
        <span className="hero-hud-clock">{clock}</span>
      </div>
      <div className="hero-hud-bottom">
        <TelemetryTag pulse>SYS NOMINAL &#9646;</TelemetryTag>
        <TelemetryTag>LINK ACQUIRED</TelemetryTag>
      </div>
    </div>
  );
}
