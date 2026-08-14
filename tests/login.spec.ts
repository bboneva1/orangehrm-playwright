import { test, expect } from '@playwright/test';
import { credentials } from '../playwright.config';

/**
 * YOUR test to write. Scaffolding only below.
 *
 * Goal: log into OrangeHRM and assert you landed on the dashboard.
 *
 * Locator priority (from the roadmap):
 *   getByRole -> getByLabel -> getByText -> data-testid -> CSS
 *
 * Hints, not answers:
 *  - Login page is at /web/index.php/auth/login
 *  - OrangeHRM's inputs have no <label for>, so getByLabel may not work.
 *    getByRole('textbox', { name: ... }) or getByPlaceholder are worth trying first.
 *    If both fail, that failure is informative - note WHY in CLAUDE.md.
 *  - A good dashboard assertion is not `expect(page).toHaveURL(...)` alone.
 *    What visible thing proves a human is logged in?
 *  - Do not add manual waits. If you reach for waitForTimeout, stop and ask why.
 *
 * Run it:  npm run test:ui   (best feedback loop while writing)
 */

test.describe('Authentication', () => {
  test('admin can log in and reach the dashboard', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');

    // TODO: fill username with credentials.username
    // TODO: fill password with credentials.password
    // TODO: submit
    // TODO: assert the dashboard is visible

    expect(credentials.username).toBeTruthy(); // placeholder - delete this line
  });
});
