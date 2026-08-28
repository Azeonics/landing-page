import Image from 'next/image';
import { teamPhoto } from '@/lib/content/about';
import Reveal from '@/components/ui/Reveal';

/**
 * Wide team photograph. Until a photo is supplied (`teamPhoto.src` empty), a
 * calm labelled placeholder frame holds the space with zero layout shift.
 */
export default function TeamPhoto({ id = 'team' }: { id?: string }) {
  return (
    <section className="mteam" id={id}>
      <div className="wrap">
        <Reveal>
          <figure className="mteam-fig">
            <div className="mteam-figure">
              {teamPhoto.src ? (
                <Image
                  src={teamPhoto.src}
                  alt={teamPhoto.alt ?? 'The Azeonics team'}
                  fill
                  sizes="(max-width: 1600px) 92vw, 2920px"
                  loading="lazy"
                  className="mteam-img"
                />
              ) : (
                <div className="mteam-ph" role="img" aria-label={teamPhoto.alt ?? 'Team photo'}>
                  <span className="mteam-ph-label">
                    {teamPhoto.placeholder ?? 'Team photograph'}
                  </span>
                </div>
              )}
            </div>
            <figcaption className="mteam-cap">
              The team behind India&apos;s Idea-to-Orbit hub
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
