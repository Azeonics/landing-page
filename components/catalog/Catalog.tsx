'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  catalogHead,
  catalogIntro,
  componentPartnersLabel,
  componentPartners,
  filterChips,
  catalogGroups,
  products,
} from '@/lib/content/catalog';
import type { Product } from '@/lib/content/types';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import ProductCard from './ProductCard';
import ProductOverlay from './ProductOverlay';
import { gsapReady, EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const FLIP_DURATION = 0.4;
const ENTER_STAGGER = 0.02;
const ENTER_Y = 16;

/**
 * Catalog page orchestrator: intro + partner strip + filter chips + grouped
 * product grids with FLIP-animated filtering, plus the product detail overlay.
 *
 * FLIP: the chip handler snapshots viewport rects of every mounted card
 * (keyed by product name — names are unique) *before* setState; after the
 * filtered re-render, a layout effect clears stale tweens, re-measures, and
 * tweens surviving cards from their position delta and entering cards from
 * a small fade/rise. Reduced motion skips all of it (instant swap).
 */
export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const cardEls = useRef(new Map<string, HTMLButtonElement>());
  const prevRects = useRef<Map<string, DOMRect> | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();

  const handleFilter = (filter: string) => {
    if (filter === activeFilter) return;
    if (!reduced) {
      const rects = new Map<string, DOMRect>();
      cardEls.current.forEach((el, name) => rects.set(name, el.getBoundingClientRect()));
      prevRects.current = rects;
    }
    setActiveFilter(filter);
  };

  useLayoutEffect(() => {
    const prev = prevRects.current;
    prevRects.current = null;
    if (!prev || reduced) return;
    const gsap = gsapReady();

    // Reset any in-flight tweens first so the "after" measurements are the
    // cards' natural (untransformed) positions.
    cardEls.current.forEach((el) => {
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'transform,opacity,visibility' });
    });

    const entering: HTMLElement[] = [];
    cardEls.current.forEach((el, name) => {
      const before = prev.get(name);
      if (!before) {
        entering.push(el);
        return;
      }
      const after = el.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (dx === 0 && dy === 0) return;
      gsap.fromTo(
        el,
        { x: dx, y: dy },
        { x: 0, y: 0, duration: FLIP_DURATION, ease: EASE.out, clearProps: 'transform' }
      );
    });

    if (entering.length > 0) {
      gsap.fromTo(
        entering,
        { autoAlpha: 0, y: ENTER_Y },
        {
          autoAlpha: 1,
          y: 0,
          duration: FLIP_DURATION,
          ease: EASE.out,
          stagger: ENTER_STAGGER,
          clearProps: 'transform,opacity,visibility',
        }
      );
    }
  }, [activeFilter, reduced]);

  const handleOpen = (product: Product, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setOpenProduct(product);
  };

  const handleClose = () => {
    setOpenProduct(null);
    triggerRef.current?.focus();
  };

  const setCardEl = (name: string) => (el: HTMLButtonElement | null) => {
    if (el) {
      cardEls.current.set(name, el);
    } else {
      cardEls.current.delete(name);
    }
  };

  const visibleGroups = catalogGroups.filter(
    (group) => activeFilter === 'all' || group.id === activeFilter
  );

  return (
    <section className="mcat" id="catalog">
      <div className="wrap">
        <Reveal>
          <SectionHead head={catalogHead} level={1} />
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mcat-intro">{catalogIntro}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mcat-partners">
            <span className="mcat-partners-label">{componentPartnersLabel}</span>
            {componentPartners.map((partner) => (
              <span key={partner.name} className="mcat-partner">
                <Image src={partner.logo} alt={partner.name} width={189} height={30} />
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mcat-filter" role="group" aria-label="Filter products">
            {filterChips.map((chip) => {
              const isActive = activeFilter === chip.filter;
              return (
                <button
                  key={chip.filter}
                  type="button"
                  className={`mcat-chip${isActive ? ' mcat-chip--active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => handleFilter(chip.filter)}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mcat-groups">
          {visibleGroups.map((group, groupIndex) => (
            <section key={group.id} className="mcat-group" aria-label={group.title}>
              <header className="mcat-group-head">
                <h3 className="mcat-group-title">{group.title}</h3>
                <span className="mcat-group-count">{group.count}</span>
              </header>
              <div className="mcat-grid">
                {products
                  .filter((product) => product.group === group.id)
                  .map((product, productIndex) => (
                    <ProductCard
                      key={product.name}
                      product={product}
                      onOpen={handleOpen}
                      cardRef={setCardEl(product.name)}
                      priority={groupIndex === 0 && productIndex === 0}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {openProduct && (
        <ProductOverlay
          product={openProduct}
          groupTitle={
            catalogGroups.find((group) => group.id === openProduct.group)?.title ??
            openProduct.group
          }
          onClose={handleClose}
        />
      )}
    </section>
  );
}
