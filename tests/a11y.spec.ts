import { test, expect } from '@fixtures/test';

test('PIM employee list: accessibility scan', async ({ employeeListPage, axe }) => {
  await employeeListPage.goTo();

  await expect.poll(() => employeeListPage.employeeNames()).not.toHaveLength(0);

  const results = await axe.analyze();

  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test("Admin users' list: accessibility scan", async ({ userManagementPage, axe }) => {
  await userManagementPage.goTo();

  await expect.poll(() => userManagementPage.userNames()).not.toHaveLength(0);

  const results = await axe.analyze();

  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});

test('Dashboard: accessibility scan', async ({ dashboardPage, axe }) => {
  await dashboardPage.goTo();

  await expect.poll(() => dashboardPage.widgetLoaded()).toBe(true);

  const results = await axe.analyze();

  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});
