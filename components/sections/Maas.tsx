import { maasHead, maasLead, maasBody, maasPlans } from '@/lib/content/capabilities';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { renderEm } from '@/components/ui/richText';

/**
 * Manufacturing-as-a-Service: editorial text column beside the plan ledger.
 * Server component — plan-row hover motion is CSS (::before teal rule),
 * entrance staggers come from Reveal wrappers.
 */
export default function Maas() {
  return (
    <section className="mmaas" id="maas">
      <div className="wrap">
        <div className="mmaas-grid">
          <div className="mmaas-text">
            <Reveal>
              <SectionHead head={maasHead} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mmaas-lead">{renderEm(maasLead)}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mmaas-body">
                {maasBody.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="mmaas-plans">
            {maasPlans.map((plan, i) => (
              <Reveal key={plan.num} delay={i * 0.06}>
                <article className="mmaas-plan">
                  <span className="mmaas-plan-num">{plan.num}</span>
                  <h3 className="mmaas-plan-title">{plan.title}</h3>
                  <span className="mmaas-plan-cadence">{plan.cadence}</span>
                  <p className="mmaas-plan-desc">{plan.desc}</p>
                </article>
              </Reveal>
            ))}
            <Reveal delay={maasPlans.length * 0.06}>
              <div className="mmaas-cta">
                <Button href="/contact#contact" variant="secondary">
                  Book a slot
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
