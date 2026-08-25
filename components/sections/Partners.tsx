import { partnersHead, partnersIntro, partners } from '@/lib/content/contact';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';

interface PartnersProps {
  /** Anchor id for deep links (e.g. `/#partners`). */
  id?: string;
}

/**
 * Partners & Clients: seamless 1px-gap name grid (typography-only "logos").
 * Server component. A single Reveal wraps the whole grid — 24 staggered
 * reveals would be visual noise.
 */
export default function Partners({ id = 'partners' }: PartnersProps) {
  return (
    <section className="mpart" id={id}>
      <div className="wrap">
        <Reveal>
          <SectionHead head={partnersHead} />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mpart-intro">{partnersIntro}</p>
        </Reveal>
        <Reveal delay={0.14}>
          <ul className="mpart-grid" aria-label="Partners and clients">
            {partners.map((partner) => (
              <li
                key={partner.name}
                className={`mpart-cell${partner.style ? ` mpart-cell--${partner.style}` : ''}`}
              >
                <span className="mpart-name">{partner.name}</span>
                {partner.sub ? <span className="mpart-sub">{partner.sub}</span> : null}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
