import { test, expect } from '@fixtures/test';

test('Admin can add an employee and find it in the list', async ({
  authPage,
  employeeListPage,
  addEmployeePage,
}) => {
  //TODO: Phase D — cleanup. Each run adds a new employee to the database.
  const firstName = 'Test';
  const lastName = `Employee${Date.now()}`;
  const employeeId = String(Date.now()).slice(-8);

  await employeeListPage.goTo();
  await employeeListPage.openAddEmployeeForm();
  await addEmployeePage.addEmployee(firstName, lastName, employeeId);

  await expect(authPage).toHaveURL(/\/pim\/viewPersonalDetails\//);

  await employeeListPage.goTo();
  await employeeListPage.searchByName(`${firstName} ${lastName}`);

  await expect
    .poll(() => employeeListPage.employeeNames())
    .toContainEqual(expect.stringContaining(lastName));
});
