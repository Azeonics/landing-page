import Image from 'next/image';
import { audienceHead, audienceCards } from '@/lib/content/contact';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';

interface AudienceProps {
  /** Anchor id for deep links (e.g. `/#audience`). */
  id?: string;
}

/**
 * "Who We Serve": four audience cards on the raised band surface.
 * Server component — card hover is CSS, entrance staggers come from Reveal.
 */
export default function Audience({ id = 'audience' }: AudienceProps) {
  return (
    <section className="maud" id={id}>
      <div className="wrap">
        <Reveal>
          <SectionHead head={audienceHead} />
        </Reveal>
        <div className="maud-grid">
          {audienceCards.map((card, i) => (
            <Reveal key={card.num} delay={i * 0.06}>
              <article className="maud-card">
                {card.image ? (
                  <div className="maud-img">
                    <Image
                      src={card.image}
                      alt={card.imagePlaceholder ?? card.name}
                      fill
                      sizes="(max-width: 560px) 92vw, (max-width: 980px) 46vw, 324px"
                      loading="lazy"
                      className="maud-photo"
                    />
                  </div>
                ) : null}
                <span className="maud-num">{card.num}</span>
                <h3 className="maud-name">{card.name}</h3>
                <span className="maud-meta">{card.meta}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
