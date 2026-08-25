'use client';

import { useEffect, useRef, type JSX, type ReactNode, type Ref } from 'react';
import { gsapReady, EASE, DUR } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** Intrinsic elements only — the ref must land on a real DOM node. */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * Scroll-entrance wrapper. No-fade guarantee: the end state is always full
 * opacity — reduced motion renders visible with no tween, and elements already
 * above the viewport on mount (anchor jumps) are set visible immediately
 * instead of waiting for a ScrollTrigger that would never fire correctly.
 */
export default function Reveal({ children, delay = 0, y = 28, as, className }: RevealProps) {
  // Type the polymorphic tag as 'div' for JSX: a bare ElementType collapses
  // the union of every intrinsic element's props into `never` / "too complex".
  // Runtime renders the actual tag; every intrinsic accepts ref + children.
  const Tag = (as ?? 'div') as 'div';
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const gsap = gsapReady();

    // Reduced motion: force the visible end state (a killed tween from a
    // previous mount may have left inline opacity behind).
    if (reduced) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    // Anchor-jump fallback: element is above the viewport — show it, no tween.
    if (el.getBoundingClientRect().top < 0) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y },
      {
        autoAlpha: 1,
        y: 0,
        duration: DUR.normal,
        ease: EASE.out,
        delay,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, delay, y]);

  return (
    <Tag ref={ref as Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
