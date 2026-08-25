import type { Page } from '@playwright/test';

export const PAGES = [
  { name: 'home', path: '/' },
  { name: 'capabilities', path: '/capabilities' },
  { name: 'skilling', path: '/skilling' },
  { name: 'catalog', path: '/catalog' },
  { name: 'contact', path: '/contact' },
] as const;

/** Hide the Next.js dev-tools indicator so it never lands in screenshots. */
export async function hideDevOverlay(page: Page): Promise<void> {
  await page.addStyleTag({
    content: 'nextjs-portal { display: none !important; }',
  });
}

/** Deterministic settle: network idle + web fonts resolved. */
export async function waitForStablePage(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
}

/**
 * Walk the page once (triggers lazy `next/image` loads), wait for every
 * in-DOM image to finish, then return to the top. Keeps full-page
 * screenshots deterministic without arbitrary timeouts.
 */
export async function loadLazyImages(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            })
        )
    )
  );
  await page.evaluate(() => window.scrollTo(0, 0));
}
