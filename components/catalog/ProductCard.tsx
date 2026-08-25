'use client';

import Image from 'next/image';
import type { Product } from '@/lib/content/types';

interface ProductCardProps {
  product: Product;
  /** Receives the product plus the card button element so focus can return to it. */
  onOpen: (product: Product, trigger: HTMLButtonElement) => void;
  /** Ref callback used by the catalog's FLIP measurement map. */
  cardRef: (el: HTMLButtonElement | null) => void;
}

/**
 * Full-card button (keyboard-openable) for one catalog product: square
 * contain-fit image, serif name, mono category, clamped description.
 */
export default function ProductCard({ product, onOpen, cardRef }: ProductCardProps) {
  return (
    <button
      type="button"
      ref={cardRef}
      className="mcat-card"
      onClick={(event) => onOpen(product, event.currentTarget)}
    >
      <span className="mcat-card-img">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 480px) 92vw, (max-width: 720px) 46vw, (max-width: 980px) 31vw, 324px"
            className="mcat-card-photo"
          />
        )}
      </span>
      <span className="mcat-card-name">{product.name}</span>
      <span className="mcat-card-cat">{product.category}</span>
      <span className="mcat-card-desc">{product.desc}</span>
    </button>
  );
}
