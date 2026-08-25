'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { Product } from '@/lib/content/types';
import Button from '@/components/ui/Button';
import TelemetryTag from '@/components/ui/TelemetryTag';

interface ProductOverlayProps {
  product: Product;
  /** Title of the catalog group the product belongs to (mono eyebrow). */
  groupTitle: string;
  onClose: () => void;
}

const TITLE_ID = 'mcat-overlay-title';
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Product detail dialog, portaled to <body>. Owns the modal behaviors:
 * Escape / backdrop-click close, Tab focus trap, body scroll lock, and
 * initial focus on the close button. Focus return to the opening card is
 * the parent's job (it holds the trigger element).
 */
export default function ProductOverlay({ product, groupTitle, onClose }: ProductOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isInside = active instanceof HTMLElement && panel.contains(active);

      if (event.shiftKey) {
        if (!isInside || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!isInside || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="mcat-overlay" role="dialog" aria-modal="true" aria-labelledby={TITLE_ID}>
      <div className="mcat-overlay-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="mcat-overlay-panel" ref={panelRef}>
        <button
          type="button"
          ref={closeRef}
          className="mcat-overlay-close"
          aria-label="Close"
          onClick={onClose}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
            <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <div className="mcat-overlay-media">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 720px) 92vw, 420px"
              className="mcat-overlay-photo"
            />
          )}
        </div>
        <div className="mcat-overlay-body">
          <span className="mcat-overlay-group">{groupTitle}</span>
          <h3 className="mcat-overlay-name" id={TITLE_ID}>
            {product.name}
          </h3>
          <p className="mcat-overlay-desc">{product.desc}</p>
          <div className="mcat-overlay-spec">
            <TelemetryTag>{product.category}</TelemetryTag>
          </div>
          <div className="mcat-overlay-ctas">
            <Button href="/contact#contact">Book a slot</Button>
            <button type="button" className="ui-btn ui-btn--secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
