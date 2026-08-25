/**
 * Pure-CSS hero poster: navy planet-limb glow, two starfield layers, and an
 * Earth-limb arc curving through the lower-right. Zero JS, zero image bytes.
 * Permanent fallback for reduced-motion / no-WebGL users; the R3F scene (T10)
 * mounts on top of it inside .hero-scene.
 */
export default function HeroFallback() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <div className="hero-fallback-stars hero-fallback-stars--far" />
      <div className="hero-fallback-stars hero-fallback-stars--near" />
      <div className="hero-fallback-limb" />
    </div>
  );
}
