import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES, waitForStablePage } from './helpers';

const SEVERE = ['serious', 'critical'] as const;
const MAX_TABS = 80;

async function severeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter((violation) =>
    SEVERE.includes(violation.impact as (typeof SEVERE)[number])
  );
}

function formatViolations(violations: Awaited<ReturnType<typeof severeViolations>>): string {
  return violations
    .map(
      (violation) =>
        `[${violation.impact}] ${violation.id}: ${violation.help}\n` +
        violation.nodes.map((node) => `  → ${node.target.join(' ')}`).join('\n')
    )
    .join('\n');
}

test.describe('axe scans per page', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const { name, path } of PAGES) {
    test(`${name} has no serious or critical axe violations`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path, { waitUntil: 'networkidle' });
      await waitForStablePage(page);

      const violations = await severeViolations(page);
      expect(formatViolations(violations), 'serious/critical axe violations').toBe('');
    });
  }
});

test.describe('catalog product dialog', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('keyboard opens dialog, axe passes, Escape returns focus to card', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catalog', { waitUntil: 'networkidle' });
    await waitForStablePage(page);

    // Tab until the first product card has focus.
    let cardFocused = false;
    for (let i = 0; i < MAX_TABS; i++) {
      await page.keyboard.press('Tab');
      cardFocused = await page.evaluate(() =>
        Boolean(document.activeElement?.classList.contains('mcat-card'))
      );
      if (cardFocused) break;
    }
    expect(cardFocused, 'a .mcat-card became focused via Tab').toBe(true);

    const focusedCardName = await page.evaluate(
      () => document.activeElement?.querySelector('.mcat-card-name')?.textContent ?? ''
    );
    expect(focusedCardName).not.toBe('');

    await page.keyboard.press('Enter');
    const dialog = page.locator('[role="dialog"].mcat-overlay');
    await expect(dialog).toBeVisible();

    // Axe the open-dialog state.
    const violations = await severeViolations(page);
    expect(formatViolations(violations), 'serious/critical axe violations (dialog open)').toBe('');

    // Focus must be inside the dialog.
    const focusInDialog = await page.evaluate(() =>
      Boolean(document.activeElement?.closest('[role="dialog"]'))
    );
    expect(focusInDialog, 'focus moved into the dialog').toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);

    // Focus returns to the card that opened the dialog.
    const returnedName = await page.evaluate(() =>
      document.activeElement?.classList.contains('mcat-card')
        ? document.activeElement.querySelector('.mcat-card-name')?.textContent ?? ''
        : ''
    );
    expect(returnedName).toBe(focusedCardName);
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test('opens via hamburger, axe passes, Escape closes and restores focus', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForStablePage(page);

    const toggle = page.locator('.mnav-toggle');
    await toggle.click();

    const overlay = page.locator('#mnav-mobile-menu');
    await expect(overlay).toBeVisible();

    const violations = await severeViolations(page);
    expect(formatViolations(violations), 'serious/critical axe violations (menu open)').toBe('');

    await page.keyboard.press('Escape');
    await expect(overlay).toHaveCount(0);

    const focusOnToggle = await page.evaluate(() =>
      Boolean(document.activeElement?.classList.contains('mnav-toggle'))
    );
    expect(focusOnToggle, 'focus returned to hamburger').toBe(true);
  });
});

test.describe('contact form', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('every field is labelled and empty submit flags aria-invalid', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/contact', { waitUntil: 'networkidle' });
    await waitForStablePage(page);

    // Every visible form control has an associated <label for>.
    const unlabelled = await page.evaluate(() => {
      const controls = Array.from(
        document.querySelectorAll<HTMLElement>('.mcontact-form .mcontact-input')
      );
      return controls
        .filter((control) => !document.querySelector(`label[for="${control.id}"]`))
        .map((control) => control.id || control.tagName);
    });
    expect(unlabelled, 'controls without an associated label').toEqual([]);

    await page.locator('.mcontact-submit').click();

    const invalid = page.locator('.mcontact-form [aria-invalid="true"]');
    await expect(invalid).toHaveCount(4); // name, email, interest, message

    // Each invalid field points at its visible error message.
    const orphanErrors = await page.evaluate(() => {
      const fields = Array.from(
        document.querySelectorAll<HTMLElement>('.mcontact-form [aria-invalid="true"]')
      );
      return fields
        .filter((field) => {
          const id = field.getAttribute('aria-describedby');
          return !id || !document.getElementById(id);
        })
        .map((field) => field.id);
    });
    expect(orphanErrors, 'invalid fields missing aria-describedby error').toEqual([]);
  });
});
