import {
  aboutHead,
  aboutLead,
  aboutParagraphs,
  aboutMeta,
} from '@/lib/content/about';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';

/**
 * The Azeonics story: split editorial text column beside a facts panel.
 * Reuses the `.mabout` layout. Server component — motion via Reveal.
 */
export default function AboutStory({ id = 'story' }: { id?: string }) {
  return (
    <section className="mabout" id={id}>
      <div className="wrap">
        <div className="mabout-grid">
          <div className="mabout-text">
            <Reveal>
              <SectionHead head={aboutHead} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mabout-lead">{aboutLead}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mabout-body">
                {aboutParagraphs.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.22}>
            <aside className="mabout-meta" aria-label="Company facts">
              {aboutMeta.map((row) => (
                <div className="mabout-meta-row" key={row.k}>
                  <span className="mabout-meta-k">{row.k}</span>
                  <span className="mabout-meta-v">{row.v}</span>
                </div>
              ))}
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
