import { LoginPage } from '@pages/login.page';
import { test, expect } from '@playwright/test';
import { credentials } from '@utils/env';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('admin can log in and reach the dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(credentials.username, credentials.password);

    await expect(page).toHaveURL(/\/dashboard\//);
    //TODO: move once DashboardPage object exists.
    await expect(page.getByText(credentials.firstName + ' ' + credentials.lastName)).toBeVisible();
  });
});
