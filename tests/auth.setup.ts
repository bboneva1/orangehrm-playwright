import { test as setup, expect } from '@playwright/test';
import { credentials } from '@utils/env';
import { ADMIN_STORAGE_STATE } from '@utils/paths';

setup('Authenticate into OrangeHRM', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await page.getByRole('textbox', { name: 'Username' }).fill(credentials.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
