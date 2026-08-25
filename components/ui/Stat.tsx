'use client';

import { useEffect, useRef } from 'react';
import { gsapReady } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Stat as StatData } from '@/lib/content/types';

const COUNT_DURATION = 1.2;
/** prefix (non-digits, e.g. '±') + clean number + trailing non-digits (e.g. 'k'). */
const CLEAN_NUMERIC = /^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/;

export default function Stat({ stat }: { stat: StatData }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = numRef.current;
    if (!el || reduced) return;
    // Values like '3–4' have digits after the number → not cleanly numeric, stay static.
    const match = stat.value.match(CLEAN_NUMERIC);
    if (!match) return;
    const [, prefix, num, rest] = match;
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;

    const gsap = gsapReady();
    const counter = { n: 0 };
    const tween = gsap.to(counter, {
      n: parseFloat(num),
      duration: COUNT_DURATION,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = prefix + counter.n.toFixed(decimals) + rest;
      },
      // Must end EXACTLY as the source string.
      onComplete: () => {
        el.textContent = stat.value;
      }
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      el.textContent = stat.value;
    };
  }, [reduced, stat.value]);

  return (
    <div className="ui-stat">
      <div className="ui-stat-value">
        <span ref={numRef}>{stat.value}</span>
        {stat.suffix && <span className="ui-stat-suffix">{stat.suffix}</span>}
      </div>
      <div className="ui-stat-label">{stat.label}</div>
    </div>
  );
}
