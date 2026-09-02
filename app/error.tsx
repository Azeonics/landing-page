'use client';

import { useEffect } from 'react';
import SiteChrome from '@/components/layout/SiteChrome';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for logging/monitoring.
    console.error(error);
  }, [error]);

  return (
    <SiteChrome>
      <section className="merror">
        <div className="wrap merror-inner">
          <p className="merror-code">System anomaly</p>
          <h1 className="merror-title">
            Something went <em>sideways</em>.
          </h1>
          <p className="merror-sub">
            An unexpected error interrupted this mission. Try again, or head back to base.
          </p>
          <div className="merror-cta">
            <button type="button" className="ui-btn ui-btn--primary" onClick={reset}>
              <span>Try again</span>
            </button>
            {/* Deliberate hard navigation: after a runtime error the client
                state may be corrupt, so a full reload is safer than <Link>. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="ui-btn ui-btn--secondary" href="/">
              <span>Back to home</span>
            </a>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
