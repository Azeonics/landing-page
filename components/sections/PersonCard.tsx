import Image from 'next/image';
import type { Person } from '@/lib/content/types';

/** Two-letter monogram from the first and last word of a name (e.g. "B N Raao" → "BR"). */
function monogram(name: string): string {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/**
 * A single leadership/team member. Renders a photo when supplied, otherwise a
 * calm initials monogram; the bio and LinkedIn link appear only when present.
 */
export default function PersonCard({ person }: { person: Person }) {
  const { name, role, bio, photo, linkedin } = person;
  return (
    <article className="mppl-card">
      <div className="mppl-photo">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 560px) 92vw, (max-width: 980px) 46vw, (max-width: 1600px) 30vw, 520px"
            loading="lazy"
            className="mppl-img"
          />
        ) : (
          <span className="mppl-monogram" aria-hidden="true">
            {monogram(name)}
          </span>
        )}
      </div>

      <div className="mppl-body">
        <h3 className="mppl-name">{name}</h3>
        <span className="mppl-role">{role}</span>
        {bio ? <p className="mppl-bio">{bio}</p> : null}
        {linkedin ? (
          <a
            className="mppl-linkedin"
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} on LinkedIn`}
          >
            <LinkedInIcon />
            <span>LinkedIn</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
