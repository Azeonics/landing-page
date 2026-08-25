import { hero } from '@/lib/content/home';
import { renderEm } from '@/components/ui/richText';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import Stat from '@/components/ui/Stat';
import TelemetryTag from '@/components/ui/TelemetryTag';
import HeroFallback from './HeroFallback';
import HeroSceneMount from './HeroSceneMount';
import HeroHud from './HeroHud';

/**
 * Full-bleed hero stage. The background layer (.hero-scene) reserves the
 * space the R3F canvas swaps into in T10 — no CLS when it mounts; the CSS
 * poster stays underneath as the permanent fallback.
 */
export default function Hero() {
  return (
    <section className="hero-stage" aria-labelledby="hero-heading">
      <div className="hero-scene">
        <HeroFallback />
        <HeroSceneMount />
      </div>

      <div className="hero-fg wrap">
        <div className="hero-copy">
          <Reveal as="div">
            <div className="hero-eyebrow-row">
              <TelemetryTag pulse>{hero.eyebrow}</TelemetryTag>
              <TelemetryTag>{hero.pill}</TelemetryTag>
            </div>
            <h1 id="hero-heading" className="hero-title">
              {hero.titleLines.map((line) => (
                <span key={line} className="hero-title-line">
                  {renderEm(line)}
                </span>
              ))}
            </h1>
          </Reveal>

          <Reveal as="div" delay={0.08}>
            <p className="hero-sub">{hero.sub}</p>
          </Reveal>

          <Reveal as="div" delay={0.16}>
            <div className="hero-ctas">
              {hero.ctas.map((cta) => (
                <Button key={cta.href} href={cta.href} variant={cta.variant}>
                  {cta.label}
                </Button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="hero-stats">
          {hero.stats.map((stat) => (
            <Stat key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <HeroHud />
    </section>
  );
}
