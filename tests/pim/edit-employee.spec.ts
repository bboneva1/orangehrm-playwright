import { test, expect } from '@fixtures/test';

test('Admin can edit an employee name', async ({
  authPage,
  employeeListPage,
  addEmployeePage,
  employeeDetailsPage,
}) => {
  const firstName = 'Test';
  const lastName = `Employee${Date.now()}`;
  const newFirstName = 'Edited';
  const newLastName = `Edited${Date.now()}`;

  // TODO: Phase D — cleanup
  await employeeListPage.goTo();
  await employeeListPage.openAddEmployeeForm();
  await addEmployeePage.addEmployee(firstName, lastName);

  await expect(authPage).toHaveURL(/\/pim\/viewPersonalDetails/);
  await expect.poll(() => employeeDetailsPage.firstName()).toBe(firstName);

  await employeeDetailsPage.editName(newFirstName, newLastName);
  await authPage.reload();

  await expect.poll(() => employeeDetailsPage.firstName()).toBe(newFirstName);
  await expect.poll(() => employeeDetailsPage.lastName()).toBe(newLastName);
});
