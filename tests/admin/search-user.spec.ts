import { credentials } from '@utils/env';
import { test, expect } from '@fixtures/test';

test('Search for the admin user in users list', async ({ userManagementPage }) => {
  await userManagementPage.goTo();
  await userManagementPage.searchByUser(credentials.username);
  await expect
    .poll(() => userManagementPage.userNames())
    .toContainEqual(expect.stringContaining(credentials.username));
});
