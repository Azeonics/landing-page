'use client';

import type { ReactNode } from 'react';
import { TransitionLink } from '@/components/layout/PageTransition';

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}

function Arrow() {
  return (
    <svg className="ui-btn-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13 L13 3 M6 3 H13 V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Button({ href, children, variant = 'primary', external = false }: ButtonProps) {
  const className = `ui-btn ui-btn--${variant}`;

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        <span>{children}</span>
        <Arrow />
      </a>
    );
  }

  return (
    <TransitionLink className={className} href={href}>
      <span>{children}</span>
      <Arrow />
    </TransitionLink>
  );
}
