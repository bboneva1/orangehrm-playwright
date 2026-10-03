import { expect, test } from '@fixtures/test';
import { credentials } from '@utils/env';

test('Add a user in User Management', async ({ authPage, userManagementPage, addUserPage }) => {
  //TO DO: Phase D - cleanup
  const employee = `${credentials.firstName} ${credentials.lastName}`;
  const username = `user${Date.now()}`;
  const password = 'Playwright!Qa#2026-Strong';

  await userManagementPage.goTo();
  await userManagementPage.openAddUserForm();

  await addUserPage.addUser('Admin', 'Enabled', employee, username, password);
  await expect(authPage).toHaveURL(/\/admin\/viewSystemUsers/);
  await userManagementPage.searchByUser(username);
  await expect
    .poll(() => userManagementPage.userNames())
    .toContainEqual(expect.stringContaining(username));
});
