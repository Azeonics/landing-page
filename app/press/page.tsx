import SiteChrome from '@/components/layout/SiteChrome';
import SectionHead from '@/components/ui/SectionHead';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Press',
  description:
    'Press & media resources for Azeonics — India’s Idea 2 Orbit Innovation Hub. Media inquiries, interviews, speaking requests and brand assets.',
  path: '/press'
});

const head = {
  num: '—',
  name: 'Press & Media',
  title: 'For the <em>storytellers</em>.'
};

const facts: { k: string; v: string }[] = [
  { k: 'Legal Entity', v: 'Azeonics Private Limited' },
  { k: 'Headquarters', v: 'Thane, Maharashtra, India' },
  { k: 'Focus', v: 'Drones · Satellites · Aerospace' },
  { k: 'Press Contact', v: 'info@azeonics.com' },
  { k: 'Phone', v: '+91-9668913303' }
];

export default function PressPage() {
  return (
    <SiteChrome>
      <section className="mlead">
        <div className="wrap mlead-inner">
          <Reveal>
            <SectionHead head={head} level={1} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mlead-body">
              Azeonics — the Idea 2 Orbit Innovation Hub — is India’s first integrated precision
              manufacturing, testing and innovation facility for drones, satellites and aerospace
              systems, delivered as a pay-per-use, manufacturing-as-a-service model.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mlead-body">
              For media inquiries, interviews, speaking requests or brand assets, reach out to{' '}
              <a className="mlead-link" href="mailto:info@azeonics.com">
                info@azeonics.com
              </a>{' '}
              and we’ll get back within one working day.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <dl className="mlead-facts">
              {facts.map((row) => (
                <div className="mlead-facts-row" key={row.k}>
                  <dt>{row.k}</dt>
                  <dd>{row.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mlead-cta">
              <Button href="/contact#contact">Contact the team</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteChrome>
  );
}
