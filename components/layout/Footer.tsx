import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mfoot">
      <div className="wrap">
        <div className="mfoot-grid">
          <div className="mfoot-brand">
            <Link className="mfoot-brand-link" href="/" aria-label="Azeonics">
              <img
                className="mfoot-wordmark"
                src="/assets/azeonics-wordmark-dark.png"
                alt="Azeonics"
                width={1876}
                height={531}
              />
              <span className="mfoot-tagline">Idea 2 Orbit</span>
            </Link>
            <p>
              Idea 2 Orbit Innovation Hub — India&apos;s first integrated precision manufacturing, testing and
              innovation facility for drones, satellites and aerospace systems.
            </p>
          </div>
          <div className="mfoot-col">
            <h5>The Hub</h5>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/">Idea 2 Orbit</Link></li>
              <li><Link href="/capabilities">Capabilities</Link></li>
              <li><Link href="/capabilities">MaaS</Link></li>
            </ul>
          </div>
          <div className="mfoot-col">
            <h5>Services</h5>
            <ul>
              <li><Link href="/capabilities">Ground Station as a Service</Link></li>
              <li><Link href="/skilling">Skilling</Link></li>
              <li><a href="https://earthnow.tech" target="_blank" rel="noopener noreferrer">Earth Now</a></li>
              <li><Link href="/contact#audience">Who we serve</Link></li>
              <li><Link href="/contact#partners">Partners</Link></li>
            </ul>
          </div>
          <div className="mfoot-col">
            <h5>Connect</h5>
            <ul>
              <li><Link href="/contact#contact">Contact</Link></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Careers</a></li>
              <li><Link href="/contact#contact">Press</Link></li>
            </ul>
          </div>
        </div>
        <div className="mfoot-bot">
          <div>© 2026 Azeonics Private Limited — All rights reserved.</div>
          <div>Made in Thane, Maharashtra · ISRO-grade · Atmanirbhar Bharat</div>
        </div>
      </div>
    </footer>
  );
}
