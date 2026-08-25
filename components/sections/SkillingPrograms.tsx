import type { ReactNode } from 'react';
import {
  skillingHead,
  skillingLead,
  skillingSummary,
  programs,
  skillingCta,
} from '@/lib/content/skilling';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { renderEm } from '@/components/ui/richText';

interface SkillingProgramsProps {
  /** Rendered between the intro split and the program cards (e.g. the gallery collage). */
  gallery?: ReactNode;
}

/**
 * Skilling page centerpiece: section head, lead/summary intro split, an
 * optional gallery slot, the three tiered program cards (one featured), and
 * the apply CTA. Server component — hover/focus affordances are pure CSS,
 * entrance staggers come from Reveal wrappers.
 */
export default function SkillingPrograms({ gallery }: SkillingProgramsProps) {
  return (
    <section className="mskill" id="skilling">
      <div className="wrap">
        <Reveal>
          <SectionHead head={skillingHead} />
        </Reveal>

        <div className="mskill-intro">
          <Reveal>
            <p className="mskill-lead">{renderEm(skillingLead)}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mskill-summary">{skillingSummary}</p>
          </Reveal>
        </div>

        {gallery}

        <div className="mskill-prog-grid">
          {programs.map((program, i) => (
            <Reveal key={program.num} delay={i * 0.07}>
              <article
                className={`mskill-prog${program.featured ? ' mskill-prog--featured' : ''}`}
              >
                {program.featured && (
                  <span className="mskill-prog-badge">Most Popular</span>
                )}
                <span className="mskill-prog-num">{program.num}</span>
                <h3 className="mskill-prog-title">{program.title}</h3>
                <span className="mskill-prog-duration">{program.duration}</span>
                <p className="mskill-prog-desc">{program.desc}</p>
                <ul className="mskill-prog-points" aria-label={`${program.title} highlights`}>
                  {program.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mskill-prog-cta">
            <Button href={skillingCta.href} variant={skillingCta.variant}>
              {skillingCta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
