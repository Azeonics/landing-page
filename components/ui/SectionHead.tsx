import type { SectionHead as SectionHeadData } from '@/lib/content/types';
import { renderEm } from './richText';

interface SectionHeadProps {
  head: SectionHeadData;
  /** Set when the head sits on a light/teal surface instead of the navy bg. */
  dark?: boolean;
}

export default function SectionHead({ head, dark = false }: SectionHeadProps) {
  return (
    <header className={`ui-section-head${dark ? ' ui-section-head--dark' : ''}`}>
      <div className="ui-section-head-row">
        <span className="ui-section-head-num">{head.num}</span>
        <span className="ui-section-head-label">{head.name}</span>
      </div>
      <h2 className="ui-section-title">{renderEm(head.title)}</h2>
    </header>
  );
}
