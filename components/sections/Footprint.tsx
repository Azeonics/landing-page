import {
  footprintHead,
  footprintIndiaLabel,
  footprintIndiaCount,
  indiaLocations,
  footprintInternationalLabel,
  footprintInternationalCount,
  internationalLocations,
} from '@/lib/content/contact';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';

interface FootprintProps {
  /** Anchor id for deep links (e.g. `/contact#footprint`). */
  id?: string;
}

function PinIcon() {
  return (
    <svg
      className="mfp-pin"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 1.5a4.7 4.7 0 0 0-4.7 4.7c0 3.4 4.7 8.3 4.7 8.3s4.7-4.9 4.7-8.3A4.7 4.7 0 0 0 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="6.2" r="1.7" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Global Footprint: India operating locations as cards, international
 * presence as a hairline cell grid. Server component — staggers via Reveal.
 */
export default function Footprint({ id = 'footprint' }: FootprintProps) {
  return (
    <section className="mfp" id={id}>
      <div className="wrap">
        <Reveal>
          <SectionHead head={footprintHead} />
        </Reveal>
        <div className="mfp-grid">
          <div className="mfp-col">
            <Reveal delay={0.06}>
              <div className="mfp-col-head">
                <span className="mfp-col-label">{footprintIndiaLabel}</span>
                <span className="mfp-col-count">{footprintIndiaCount}</span>
              </div>
            </Reveal>
            <div className="mfp-cards">
              {indiaLocations.map((loc, i) => (
                <Reveal key={loc.name} delay={0.1 + i * 0.06}>
                  <article className="mfp-card">
                    <div className="mfp-card-top">
                      <PinIcon />
                      <span className="mfp-card-label">{loc.label}</span>
                      <span className="mfp-card-tag">{loc.tag}</span>
                    </div>
                    <h3 className="mfp-card-name">{loc.name}</h3>
                    <p className="mfp-card-address">{loc.address}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mfp-col">
            <Reveal delay={0.12}>
              <div className="mfp-col-head">
                <span className="mfp-col-label">{footprintInternationalLabel}</span>
                <span className="mfp-col-count">{footprintInternationalCount}</span>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <ul className="mfp-cells">
                {internationalLocations.map((loc) => (
                  <li className="mfp-cell" key={loc.name}>
                    <span className="mfp-cell-region">{loc.region}</span>
                    <h3 className="mfp-cell-name">{loc.name}</h3>
                    <p className="mfp-cell-address">{loc.address}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
