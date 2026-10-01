import { expect, test } from '@fixtures/test';
import { credentials } from '@utils/env';
import { UserManagementPage } from '@pages/admin/user-management.page';
import { AddUserPage } from '@pages/admin/add-user.page';

test('Add a user in User Management', async ({ authPage }) => {
  //TO DO: Phase D - cleanup
  const employee = `${credentials.firstName} ${credentials.lastName}`;
  const username = `user${Date.now()}`;
  const password = 'Playwright!Qa#2026-Strong';
  const userManagementPage = new UserManagementPage(authPage);

  await userManagementPage.goTo();
  await userManagementPage.openAddUserForm();

  const addUserPage = new AddUserPage(authPage);

  await addUserPage.addUser('Admin', 'Enabled', employee, username, password);
  await expect(authPage).toHaveURL(/\/admin\/viewSystemUsers/);
  await userManagementPage.searchByUser(username);
  await expect
    .poll(() => userManagementPage.userNames())
    .toContainEqual(expect.stringContaining(username));
});
