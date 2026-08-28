import type { Person, SectionHead as SectionHeadData } from '@/lib/content/types';
import SectionHead from '@/components/ui/SectionHead';
import Reveal from '@/components/ui/Reveal';
import PersonCard from '@/components/sections/PersonCard';

interface PeopleGridProps {
  head: SectionHeadData;
  people: Person[];
  /** Optional lead sentence shown under the heading for context. */
  intro?: string;
  /** Anchor id for deep links (e.g. `key-people`, `hods`). */
  id?: string;
  /** Raise the section onto the band surface (alternating rhythm). */
  band?: boolean;
}

/**
 * A titled grid of people, reused for both "Key People" and "Heads of
 * Department". Server component — entrance staggers come from Reveal.
 */
export default function PeopleGrid({ head, people, intro, id, band = false }: PeopleGridProps) {
  return (
    <section className={`mppl${band ? ' mppl--band' : ''}`} id={id}>
      <div className="wrap">
        <Reveal>
          <SectionHead head={head} />
        </Reveal>
        {intro ? (
          <Reveal delay={0.06}>
            <p className="mppl-intro">{intro}</p>
          </Reveal>
        ) : null}
        <div className="mppl-grid">
          {people.map((person, i) => (
            <Reveal key={person.name} delay={i * 0.06}>
              <PersonCard person={person} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
