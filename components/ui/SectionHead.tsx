import type { SectionHead as SectionHeadData } from '@/lib/content/types';
import { renderEm } from './richText';

interface SectionHeadProps {
  head: SectionHeadData;
  /** Set when the head sits on a light/teal surface instead of the navy bg. */
  dark?: boolean;
  /**
   * Heading level for the title. Use `1` for the first/primary heading on a
   * page so each route has exactly one `<h1>`; defaults to `2` for sections.
   */
  level?: 1 | 2;
}

export default function SectionHead({ head, dark = false, level = 2 }: SectionHeadProps) {
  const Title = level === 1 ? 'h1' : 'h2';
  return (
    <header className={`ui-section-head${dark ? ' ui-section-head--dark' : ''}`}>
      <div className="ui-section-head-row">
        <span className="ui-section-head-num">{head.num}</span>
        <span className="ui-section-head-label">{head.name}</span>
      </div>
      <Title className="ui-section-title">{renderEm(head.title)}</Title>
    </header>
  );
}
