import { AddUserPage } from '@pages/admin/add-user.page';
import { UserManagementPage } from '@pages/admin/user-management.page';
import { AddEmployeePage } from '@pages/pim/add-employee.page';
import { EmployeeListPage } from '@pages/pim/employee-list.page';
import { EmployeeDetailsPage } from '@pages/pim/employee-details.page';
import { JobTitlesPage } from '@pages/admin/job-titles.page';
import { AddJobTitlePage } from '@pages/admin/add-job-title.page';
import { ApplyLeavePage } from '@pages/leave/apply-leave.page';
import { MyLeavePage } from '@pages/leave/my-leave.page';
import { AxeBuilder } from '@axe-core/playwright';
import { DashboardPage } from '@pages/dashboard.page';
import { test as base, type Page } from '@playwright/test';
import { buildEmployee, NewEmployee } from '@utils/factories';
import { EmployeesApi } from '@api/employees.api';

type Fixtures = {
  authPage: Page;
  employeeListPage: EmployeeListPage;
  addEmployeePage: AddEmployeePage;
  userManagementPage: UserManagementPage;
  addUserPage: AddUserPage;
  employeeDetailsPage: EmployeeDetailsPage;
  jobTitlesPage: JobTitlesPage;
  addJobTitlePage: AddJobTitlePage;
  applyLeavePage: ApplyLeavePage;
  myLeavePage: MyLeavePage;
  axe: AxeBuilder;
  dashboardPage: DashboardPage;
  testEmployee: NewEmployee & { empNumber: number };
};

//only WCAG A/AA rules (2.0 and 2.1) run, and the known ones are switched off.
//OrangeHRM fails these 5 rules on every page today, so "zero violations" would be red forever.
//it lets through on purpose: every best-practice rule, any of the 5 known problems,  new unlabelled fields, anything axe can't see.
//The list made on 2026-10-13. Remove a rule once OrangeHRM fixes it.
const KNOWN_A11Y_VIOLATIONS = ['button-name', 'color-contrast', 'html-has-lang', 'label', 'list'];

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

  jobTitlesPage: async ({ authPage }, use) => {
    await use(new JobTitlesPage(authPage));
  },

  addJobTitlePage: async ({ authPage }, use) => {
    await use(new AddJobTitlePage(authPage));
  },

  applyLeavePage: async ({ authPage }, use) => {
    await use(new ApplyLeavePage(authPage));
  },

  myLeavePage: async ({ authPage }, use) => {
    await use(new MyLeavePage(authPage));
  },

  axe: async ({ authPage }, use) => {
    await use(
      new AxeBuilder({ page: authPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules(KNOWN_A11Y_VIOLATIONS)
    );
  },

  dashboardPage: async ({ authPage }, use) => {
    await use(new DashboardPage(authPage));
  },

  testEmployee: async ({ request }, use) => {
    const employeesApi = new EmployeesApi(request);
    const employee = buildEmployee();
    const empNumber = await employeesApi.create(employee);
    await use({ ...employee, empNumber });
    await employeesApi.delete(empNumber);
  },
});

export { expect } from '@playwright/test';
