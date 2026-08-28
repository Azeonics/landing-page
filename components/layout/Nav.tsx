'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TransitionLink } from '@/components/layout/PageTransition';

const PRIMARY_LINKS = [
  { href: '/', label: 'The Hub' },
  { href: '/about', label: 'About' },
  { href: '/capabilities', label: 'Capabilities' },
  { href: '/skilling', label: 'Skilling' },
  { href: '/catalog', label: 'Catalog' }
] as const;

const MOBILE_EXTRA_LINKS = [
  { href: '/contact#footprint', label: 'Global Footprint' },
  { href: '/contact#partners', label: 'Partners' }
] as const;

const EARTH_NOW_URL = 'https://earthnow.tech';

function ExtIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13 L13 3 M6 3 H13 V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);

  // While the overlay is open: focus its close button, lock body scroll,
  // listen for Escape and trap Tab focus inside the overlay. Cleanup (close
  // or unmount) restores scroll and returns focus to the hamburger.
  useEffect(() => {
    if (!isMenuOpen) return;
    const toggleButton = toggleRef.current;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const overlay = overlayRef.current;
      if (!overlay) return;
      const focusable = overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      toggleButton?.focus();
    };
  }, [isMenuOpen]);

  const isActive = (href: string) => pathname === href.split('#')[0];
  const linkClass = (href: string) => (isActive(href) ? 'is-active' : undefined);

  return (
    <>
      <nav className="mnav" aria-label="Main navigation">
        <div className="mnav-inner">
          <TransitionLink className="mnav-brand" href="/" aria-label="Azeonics — Idea 2 Orbit">
            <img
              className="mnav-wordmark"
              src="/assets/azeonics-wordmark-dark.png"
              alt="Azeonics"
              width={1876}
              height={531}
            />
            <span className="mnav-tagline">Idea 2 Orbit</span>
          </TransitionLink>

          <div className="mnav-links">
            {PRIMARY_LINKS.map(({ href, label }) => (
              <TransitionLink key={href} href={href} className={linkClass(href)}>
                {label}
              </TransitionLink>
            ))}
            <a className="mnav-ext" href={EARTH_NOW_URL} target="_blank" rel="noopener noreferrer">
              Earth Now
              <ExtIcon className="mnav-ext-icon" />
            </a>
            <TransitionLink href="/contact" className={linkClass('/contact')}>
              Contact
            </TransitionLink>
          </div>

          <TransitionLink className="mnav-cta" href="/contact#contact">
            Book a slot
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 13 L13 3 M6 3 H13 V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </TransitionLink>

          <button
            ref={toggleRef}
            type="button"
            className="mnav-toggle"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mnav-mobile-menu"
            onClick={openMenu}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 5h12 M2 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          ref={overlayRef}
          className="mnav-overlay"
          id="mnav-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button ref={closeRef} type="button" className="mnav-close" aria-label="Close menu" onClick={closeMenu}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
          {PRIMARY_LINKS.map(({ href, label }) => (
            <TransitionLink key={href} href={href} onClick={closeMenu}>
              {label}
            </TransitionLink>
          ))}
          <a
            className="mnav-overlay-ext"
            href={EARTH_NOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Earth Now
            <ExtIcon className="mnav-ext-icon" />
          </a>
          {MOBILE_EXTRA_LINKS.map(({ href, label }) => (
            <TransitionLink key={href} href={href} onClick={closeMenu}>
              {label}
            </TransitionLink>
          ))}
          <TransitionLink className="mnav-overlay-cta" href="/contact#contact" onClick={closeMenu}>
            Book a slot
          </TransitionLink>
        </div>
      )}
    </>
  );
}
