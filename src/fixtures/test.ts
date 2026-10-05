import { AddUserPage } from '@pages/admin/add-user.page';
import { UserManagementPage } from '@pages/admin/user-management.page';
import { AddEmployeePage } from '@pages/pim/add-employee.page';
import { EmployeeListPage } from '@pages/pim/employee-list.page';
import { EmployeeDetailsPage } from '@pages/pim/employee-details.page';
import { test as base, type Page } from '@playwright/test';

type Fixtures = {
  authPage: Page;
  employeeListPage: EmployeeListPage;
  addEmployeePage: AddEmployeePage;
  userManagementPage: UserManagementPage;
  addUserPage: AddUserPage;
  employeeDetailsPage: EmployeeDetailsPage;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await page.goto('/web/index.php/dashboard/index');
    await use(page);
  },

  employeeListPage: async ({ authPage }, use) => {
    await use(new EmployeeListPage(authPage));
  },

  addEmployeePage: async ({ authPage }, use) => {
    await use(new AddEmployeePage(authPage));
  },

  userManagementPage: async ({ authPage }, use) => {
    await use(new UserManagementPage(authPage));
  },

  addUserPage: async ({ authPage }, use) => {
    await use(new AddUserPage(authPage));
  },

  employeeDetailsPage: async ({ authPage }, use) => {
    await use(new EmployeeDetailsPage(authPage));
  },
});

export { expect } from '@playwright/test';
