import Image from 'next/image';
import { hubHead, hubLead, hubParagraphs, hubMeta, hubImage } from '@/lib/content/home';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';

interface AboutProps {
  /** Anchor id for deep links (the home page uses `hub`). */
  id?: string;
}

/**
 * "The Hub" editorial section: split text/meta grid plus a wide facility
 * photograph. Server component — all motion comes from Reveal wrappers.
 */
export default function About({ id = 'about' }: AboutProps) {
  return (
    <section className="mabout" id={id}>
      <div className="wrap">
        <div className="mabout-grid">
          <div className="mabout-text">
            <Reveal>
              <SectionHead head={hubHead} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mabout-lead">{hubLead}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mabout-body">
                {hubParagraphs.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.22}>
            <aside className="mabout-meta" aria-label="Facility facts">
              {hubMeta.map((row) => (
                <div className="mabout-meta-row" key={row.k}>
                  <span className="mabout-meta-k">{row.k}</span>
                  <span className="mabout-meta-v">{row.v}</span>
                </div>
              ))}
            </aside>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <figure className="mabout-figure">
            <Image
              src={hubImage.src}
              alt={hubImage.alt ?? hubImage.placeholder ?? 'Azeonics facility'}
              fill
              sizes="(max-width: 1440px) 92vw, 1344px"
              loading="lazy"
              className="mabout-img"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
