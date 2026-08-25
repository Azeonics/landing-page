import { Fragment, type ReactNode } from 'react';

/**
 * Splits `<em>…</em>` markers in a content string into real <em> elements —
 * no innerHTML. Shared by SectionHead, Hero, and any future title consumer.
 */
export function renderEm(title: string): ReactNode[] {
  return title.split(/<\/?em>/).map((part, i) =>
    i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>
  );
}
