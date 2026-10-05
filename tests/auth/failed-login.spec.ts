import { LoginPage } from '@pages/login.page';
import { test, expect } from '@playwright/test';
import { credentials } from '@utils/env';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Negative cases for authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goTo();
  });

  test('Wrong password', async () => {
    await loginPage.login(credentials.username, 'wrong-password');

    expect(await loginPage.errorMessage()).toBe('Invalid credentials');
  });

  test('Wrong user', async () => {
    await loginPage.login('wrong-username', credentials.password);

    expect(await loginPage.errorMessage()).toBe('Invalid credentials');
  });

  test('Empty fields', async () => {
    await loginPage.login('', '');

    expect(await loginPage.emptyFieldError('Username')).toContain('Required');
    expect(await loginPage.emptyFieldError('Password')).toContain('Required');
  });
});
