import { test, expect } from '@playwright/test';
import { credentials } from '@utils/env';

test.describe('Authentication', () => {
  test('admin can log in and reach the dashboard', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');

    await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(credentials.firstName + ' ' + credentials.lastName)).toBeVisible();
  });
});
