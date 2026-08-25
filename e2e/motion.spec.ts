import { test, expect } from '@playwright/test';
import { waitForStablePage } from './helpers';

const VIEWPORT = { width: 1440, height: 900 } as const;
const STAGE_COUNT = 6;
const CANVAS_MOUNT_TIMEOUT_MS = 8_000;
const CANVAS_NEVER_MOUNTS_MS = 3_000;
const STAT_SETTLE_MS = 2_000;
const STAT_SECOND_READ_MS = 400;

test.use({ viewport: { ...VIEWPORT } });

test.describe('default motion', () => {
  test('pipeline pins and scrubbing advances the active stage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForStablePage(page);

    // GSAP wraps the pinned panel in a .pin-spacer.
    const spacer = page.locator('.pin-spacer');
    await expect(spacer).toHaveCount(1);

    const pinStart = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('.pin-spacer');
      return el ? el.getBoundingClientRect().top + window.scrollY : -1;
    });
    expect(pinStart).toBeGreaterThan(0);

    const telemetry = page.locator('.mpipe-telemetry');
    await page.evaluate((y) => window.scrollTo(0, y), pinStart);
    await expect(telemetry).toContainText('STAGE 01');

    // Two viewport-heights into the pin: the active stage must have advanced
    // (scrub: 0.6 smooths progress, so poll until it catches up).
    await page.evaluate(
      ({ y, vh }) => window.scrollTo(0, y + vh * 2),
      { y: pinStart, vh: VIEWPORT.height }
    );
    await expect
      .poll(async () => (await telemetry.textContent()) ?? '', {
        message: 'telemetry stage advances past 01',
      })
      .not.toContain('STAGE 01');
  });

  test('hero 3D canvas mounts when idle and has nonzero size', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const canvas = page.locator('.hero-scene-canvas canvas');
    await expect(canvas).toBeVisible({ timeout: CANVAS_MOUNT_TIMEOUT_MS });

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('hero stat counts up and settles on its exact source value', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForStablePage(page);

    // "2k" — students trained per year (4th hero stat); count-up tweens
    // 0k → 2k then snaps to the exact source string.
    // First span inside the value is the counted number; the suffix span follows it.
    const stat = page
      .locator('.hero-stats .ui-stat')
      .nth(3)
      .locator('.ui-stat-value > span')
      .first();
    await stat.scrollIntoViewIfNeeded();

    // Two-read stabilization: after the 1.2s tween window, consecutive reads
    // must be identical, numeric, and exactly the source value.
    await page.waitForTimeout(STAT_SETTLE_MS);
    const firstRead = await stat.textContent();
    await page.waitForTimeout(STAT_SECOND_READ_MS);
    const secondRead = await stat.textContent();

    expect(secondRead).toBe(firstRead);
    expect(secondRead).toMatch(/\d/);
    expect(secondRead).toBe('2k');
  });

  test('page wipe covers on nav click, then reveals on the new route', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForStablePage(page);

    await page.locator('.mnav-links a', { hasText: 'Catalog' }).click();

    // The wipe must start covering within 300ms of the click.
    await expect
      .poll(
        async () => (await page.locator('.wipe').getAttribute('class')) ?? '',
        { timeout: 300, intervals: [10, 25, 50], message: 'wipe enters covering state' }
      )
      .toContain('wipe--covering');

    await page.waitForURL('**/catalog', { timeout: 20_000 });
    await expect(page.locator('.wipe')).toHaveClass(/wipe--idle/);
  });

  test('ticker marquee animates', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const animationName = await page
      .locator('.mticker-track')
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).not.toBe('none');
  });
});

test.describe('reduced motion', () => {
  test('no pin, stacked pipeline cards, no 3D canvas, static ticker', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForStablePage(page);

    // Pipeline renders the static stacked list — no GSAP pin.
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    const cards = page.locator('.mpipe-card');
    await expect(cards).toHaveCount(STAGE_COUNT);
    for (let i = 0; i < STAGE_COUNT; i++) {
      await expect(cards.nth(i)).toBeVisible();
    }

    // Ticker is static.
    const animationName = await page
      .locator('.mticker-track')
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).toBe('none');

    // The R3F hero never mounts: idle callback window is 1.5s — give it 3s.
    await page.waitForTimeout(CANVAS_NEVER_MOUNTS_MS);
    await expect(page.locator('.hero-scene-canvas')).toHaveCount(0);
  });
});
