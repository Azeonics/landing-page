import SiteChrome from '@/components/layout/SiteChrome';
import SectionHead from '@/components/ui/SectionHead';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Careers',
  description:
    'Join Azeonics — help build India’s first integrated idea-to-orbit innovation hub. We’re always keen to meet exceptional engineering, manufacturing, aerospace and skilling talent.',
  path: '/careers'
});

const head = {
  num: '—',
  name: 'Careers',
  title: 'Build India’s <em>idea-to-orbit</em> future.'
};

const areas = [
  'Precision manufacturing & 5-axis CNC machining',
  'Aerospace & satellite engineering — AIT, ADCS, avionics',
  'Electronics, PCB design & embedded systems',
  'Test & qualification — TVAC, EMI/EMC, vibration',
  'Product & software engineering',
  'Space-tech skilling, ground-station & mission operations'
];

export default function CareersPage() {
  return (
    <SiteChrome>
      <section className="mlead">
        <div className="wrap mlead-inner">
          <Reveal>
            <SectionHead head={head} level={1} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mlead-body">
              Azeonics is building India’s first integrated precision manufacturing, testing and
              innovation facility for drones, satellites and aerospace systems. We’re a small,
              fast-moving team turning ideas into flight-qualified hardware — and we’re growing.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mlead-body">
              We don’t always have specific openings listed, but we’re keen to meet exceptional
              people across:
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mlead-list">
              {areas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.26}>
            <p className="mlead-note">
              Send your CV and a note to{' '}
              <a className="mlead-link" href="mailto:careers@azeonics.com">
                careers@azeonics.com
              </a>{' '}
              — tell us what you want to build.
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <div className="mlead-cta">
              <Button href="/contact#contact">Get in touch</Button>
              <Button href="/" variant="secondary">
                Explore the hub
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteChrome>
  );
}
