import { tickerItems } from '@/lib/content/home';

/**
 * Seamless marquee ticker displaying rotating capability keywords.
 * The track duplicates items twice and uses CSS animation to translate
 * -50%, creating an infinite seamless loop.
 *
 * Accessibility: The duplicate sequence is aria-hidden; the first is real content.
 * Reduced motion: Static wrapped list, centered.
 * Hover: Animation pauses.
 */
export default function Ticker() {
  return (
    <div className="mticker" aria-hidden="false">
      <div className="mticker-track">
        {/* Real content (first sequence) */}
        {tickerItems.map((item, idx) => (
          <span key={`first-${idx}`} className="mticker-item">
            {item}
            {idx < tickerItems.length - 1 && (
              <span className="mticker-sep" aria-hidden="true">
                ✦
              </span>
            )}
          </span>
        ))}

        {/* Duplicate for seamless loop (aria-hidden) */}
        <div aria-hidden="true" className="mticker-duplicate">
          {tickerItems.map((item, idx) => (
            <span key={`second-${idx}`} className="mticker-item">
              {item}
              {idx < tickerItems.length - 1 && (
                <span className="mticker-sep" aria-hidden="true">
                  ✦
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
