import { LoginPage } from '@pages/login.page';
import { test as setup, expect } from '@playwright/test';
import { credentials } from '@utils/env';
import { ADMIN_STORAGE_STATE } from '@utils/paths';

setup('Authenticate into OrangeHRM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo();
  await loginPage.login(credentials.username, credentials.password);

  await expect(page).toHaveURL(/\/dashboard\//);
  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
