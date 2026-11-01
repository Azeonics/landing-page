'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode
} from 'react';

/** Must match --duration-wipe in app/globals.css. */
const WIPE_DURATION_MS = 650;
/** Fallback in case animationend never fires. */
const WIPE_FALLBACK_MS = WIPE_DURATION_MS + 100;
/** Watchdog: if a pushed route never resolves, force the reveal so scroll is never left locked. */
const STUCK_COVER_TIMEOUT_MS = WIPE_FALLBACK_MS + 4000;

type WipeState = 'idle' | 'covering' | 'revealing';

interface PageTransitionContextValue {
  navigate: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function pathnameOf(href: string): string {
  const path = href.split('#')[0].split('?')[0];
  return path === '' ? '' : path;
}

function labelForHref(href: string): string {
  const path = pathnameOf(href);
  if (path === '/' || path === '') return 'THE HUB';
  return path.replace(/\//g, ' ').trim().toUpperCase();
}

function usePageTransition(): PageTransitionContextValue {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<WipeState>('idle');
  const [targetHref, setTargetHref] = useState<string>('');

  const panelRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<WipeState>(state);
  stateRef.current = state;
  const pathnameRef = useRef<string>(pathname);
  const previousPathnameRef = useRef<string>(pathname);
  pathnameRef.current = pathname;

  // Lock scrolling while the wipe is in flight; cleanup guarantees restore on
  // any state change or unmount, so a failed push can never leave it locked.
  useEffect(() => {
    if (state === 'idle') return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [state]);

  // covering: once the panel fully covers the viewport, push the new route.
  useEffect(() => {
    if (state !== 'covering' || !targetHref) return;
    const panel = panelRef.current;
    let hasPushed = false;

    const pushTarget = () => {
      if (hasPushed) return;
      hasPushed = true;
      router.push(targetHref);
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target !== panel || event.pseudoElement !== '') return;
      pushTarget();
    };

    panel?.addEventListener('animationend', onAnimationEnd);
    const fallbackTimer = window.setTimeout(pushTarget, WIPE_FALLBACK_MS);
    // Watchdog: if the route never resolves (failed push), reveal anyway so
    // the UI and scrolling are never stuck behind the panel.
    const watchdogTimer = window.setTimeout(() => setState('revealing'), STUCK_COVER_TIMEOUT_MS);

    return () => {
      panel?.removeEventListener('animationend', onAnimationEnd);
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(watchdogTimer);
    };
  }, [state, targetHref, router]);

  // Pathname actually changed while covered → reset scroll and reveal.
  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    if (stateRef.current !== 'covering') return;
    // Reveal the new page from the top; if the target has a hash, the
    // browser/Next anchor handling owns the scroll position instead.
    if (!targetHref.includes('#')) {
      window.scrollTo(0, 0);
    }
    setState('revealing');
  }, [pathname, targetHref]);

  // revealing: once the panel has swept off the top, return to idle.
  useEffect(() => {
    if (state !== 'revealing') return;
    const panel = panelRef.current;
    let isDone = false;

    const finish = () => {
      if (isDone) return;
      isDone = true;
      setState('idle');
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target !== panel || event.pseudoElement !== '') return;
      finish();
    };

    panel?.addEventListener('animationend', onAnimationEnd);
    const fallbackTimer = window.setTimeout(finish, WIPE_FALLBACK_MS);

    return () => {
      panel?.removeEventListener('animationend', onAnimationEnd);
      window.clearTimeout(fallbackTimer);
    };
  }, [state]);

  const navigate = useCallback(
    (href: string) => {
      // Reduced motion (checked at interaction time): skip the wipe entirely.
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      // Ignore re-entrant navigations while a wipe is already in flight.
      if (stateRef.current !== 'idle') return;
      const targetPath = pathnameOf(href) || pathnameRef.current;
      if (targetPath === pathnameRef.current) {
        router.push(href);
        return;
      }
      setTargetHref(href);
      setState('covering');
    },
    [router]
  );

  const contextValue = useMemo<PageTransitionContextValue>(() => ({ navigate }), [navigate]);

  const targetLabel = labelForHref(targetHref);

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {children}
      <div className={`wipe wipe--${state}`} aria-hidden="true">
        <div className="wipe-panel" ref={panelRef}>
          <Image
            src="/assets/azeonics-logo-dark.png"
            alt=""
            className="wipe-logo"
            width={2121}
            height={746}
            loading="eager"
          />
          <div className="wipe-telemetry">AZN &middot; ROUTE CHANGE &middot; {targetLabel}</div>
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}

type TransitionLinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next/link for INTERNAL navigations. Renders a real
 * <Link> (prefetch, middle-click, cmd/ctrl-click and SEO keep working) and
 * intercepts plain left-clicks only, routing them through the wipe.
 */
export function TransitionLink({ href, onClick, ...rest }: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      // Plain left-clicks only — let the browser/Link own everything else.
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const hrefString =
        typeof href === 'string'
          ? href
          : (href.pathname ?? '') + (href.search ?? '') + (href.hash ?? '');
      // External / protocol-relative URLs pass through natively.
      if (/^[a-z][a-z0-9+.-]*:/i.test(hrefString) || hrefString.startsWith('//')) return;

      // Same-pathname clicks (including hash-only) pass through without a wipe.
      const targetPath = pathnameOf(hrefString) || pathname;
      if (targetPath === pathname) return;

      event.preventDefault();
      navigate(hrefString);
    },
    [href, onClick, pathname, navigate]
  );

  return <Link href={href} onClick={handleClick} {...rest} />;
}
