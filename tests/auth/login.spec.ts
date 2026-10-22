import { LoginPage } from '@pages/login.page';
import { test, expect } from '@playwright/test';
import { credentials } from '@utils/env';
import { DashboardPage } from '@pages/dashboard.page';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('admin can log in and reach the dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.goTo();
    await loginPage.login(credentials.username, credentials.password);

    await expect(page).toHaveURL(/\/dashboard\//);

    await expect
      .poll(() => dashboardPage.loggedInUserName())
      .toBe(credentials.firstName + ' ' + credentials.lastName);
  });
});
