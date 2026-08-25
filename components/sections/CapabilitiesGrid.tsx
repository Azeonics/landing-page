import { capabilities, capabilitiesHead } from '@/lib/content/capabilities';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { capabilityIcons } from './capabilityIcons';

interface CapabilitiesGridProps {
  /** Home-page mode: appends an "Explore all capabilities" CTA. */
  preview?: boolean;
  /** Hide the SectionHead when a page intro already carries the same headline. */
  withHead?: boolean;
}

/**
 * Six-capability bento grid. Server component — hover/focus affordances are
 * pure CSS, entrance staggers come from Reveal wrappers (delay loops per row).
 */
export default function CapabilitiesGrid({ preview = false, withHead = true }: CapabilitiesGridProps) {
  return (
    <section className="mcap" id="capabilities">
      <div className="wrap">
        {withHead && (
          <Reveal>
            <SectionHead head={capabilitiesHead} />
          </Reveal>
        )}

        <div className="mcap-grid">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.num} delay={(i % 3) * 0.07}>
              <article className="mcap-card">
                <div className="mcap-card-top">
                  <span className="mcap-num">{cap.num}</span>
                  <span className="mcap-icon">{cap.icon ? capabilityIcons[cap.icon] : null}</span>
                </div>
                <h3 className="mcap-title">{cap.title}</h3>
                <p className="mcap-desc">{cap.desc}</p>
                <ul className="mcap-specs" aria-label={`${cap.title} specs`}>
                  {cap.specs.map((spec) => (
                    <li className="mcap-spec" key={spec}>
                      {spec}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        {preview && (
          <Reveal delay={0.1}>
            <div className="mcap-cta">
              <Button href="/capabilities" variant="secondary">
                Explore all capabilities
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
