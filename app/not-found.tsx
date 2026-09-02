import SiteChrome from '@/components/layout/SiteChrome';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="merror">
        <div className="wrap merror-inner">
          <p className="merror-code">404 · Signal lost</p>
          <h1 className="merror-title">
            Lost in <em>orbit</em>.
          </h1>
          <p className="merror-sub">
            The page you&apos;re looking for has drifted out of range. Let&apos;s get you back on
            trajectory.
          </p>
          <div className="merror-cta">
            <Button href="/">Back to home</Button>
            <Button href="/contact#contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
