import {
  gsaasHead,
  gsaasLead,
  gsaasBody,
  gsaasBands,
  gsaasServices,
} from '@/lib/content/capabilities';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import OrbitalSvg from '@/components/sections/OrbitalSvg';
import { renderEm } from '@/components/ui/richText';

/**
 * Ground Station as a Service: editorial text column beside the SMIL orbital
 * diagram. Server component — the only client piece is OrbitalSvg, which
 * gates its SMIL children on prefers-reduced-motion.
 *
 * The orbital visual renders twice (both decorative, aria-hidden): the
 * desktop instance in the right grid column (hidden <=980px) and an inline
 * instance right after the lead paragraph (hidden >980px), so on mobile the
 * visual appears before the body/bands/services instead of stacking last.
 * CSS display toggling keeps this a server component — no isDesktop store,
 * no hydration flash.
 */
export default function Gsaas() {
  return (
    <section className="mgsaas" id="gsaas">
      <div className="wrap">
        <div className="mgsaas-grid">
          <div className="mgsaas-text">
            <Reveal>
              <SectionHead head={gsaasHead} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mgsaas-lead">{renderEm(gsaasLead)}</p>
            </Reveal>
            <Reveal delay={0.12} className="mgsaas-vslot mgsaas-vslot--inline">
              <OrbitalSvg variant="inline" />
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mgsaas-body">{gsaasBody}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <ul className="mgsaas-bands">
                {gsaasBands.map((band) => (
                  <li className="mgsaas-band" key={band.band}>
                    <span className="mgsaas-band-value">{band.band}</span>
                    <span className="mgsaas-band-label">{band.label}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mgsaas-services">
                {gsaasServices.map((service) => (
                  <div className="mgsaas-service" key={service.num}>
                    <span className="mgsaas-service-num">{service.num}</span>
                    <span className="mgsaas-service-text">{service.text}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="mgsaas-vslot mgsaas-vslot--desktop">
            <OrbitalSvg />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
