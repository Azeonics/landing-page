import { test, expect } from '@playwright/test';
import { PAGES, hideDevOverlay, loadLazyImages, waitForStablePage } from './helpers';

const WIDTHS = [320, 768, 1024, 1440] as const;
const VIEWPORT_HEIGHT = 900;

/**
 * Visual regression: every route at every breakpoint, under reduced motion
 * (renders all Reveal/GSAP content visible and static, never mounts the 3D
 * hero) so full-page screenshots are deterministic.
 */
for (const { name, path } of PAGES) {
  for (const width of WIDTHS) {
    test(`${name} @ ${width}px matches baseline with no horizontal overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path, { waitUntil: 'networkidle' });
      await waitForStablePage(page);
      await hideDevOverlay(page);
      await loadLazyImages(page);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow, 'horizontal overflow (scrollWidth - innerWidth)').toBeLessThanOrEqual(0);

      await expect(page).toHaveScreenshot(`${name}-${width}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
}
