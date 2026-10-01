import { credentials } from '@utils/env';
import { test, expect } from '@fixtures/test';
import { UserManagementPage } from '@pages/admin/user-management.page';

test('Search for the admin user in users list', async ({ authPage }) => {
  const userManagementPage = new UserManagementPage(authPage);
  await userManagementPage.goTo();
  await userManagementPage.searchByUser(credentials.username);
  await expect
    .poll(() => userManagementPage.userNames())
    .toContainEqual(expect.stringContaining(credentials.username));
});
