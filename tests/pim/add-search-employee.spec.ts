import { test, expect } from '@fixtures/test';
import { AddEmployeePage } from '@pages/pim/add-employee.page';
import { EmployeeListPage } from '@pages/pim/employee-list.page';

test('Admin can add an employee and find it in the list', async ({ authPage }) => {
  //TODO: Phase D — cleanup. Each run adds a new employee to the database.
  const firstName = 'Test';
  const lastName = `Employee${Date.now()}`;
  const addEmployeePage = new AddEmployeePage(authPage);
  const employeeList = new EmployeeListPage(authPage);

  await employeeList.goTo();
  await employeeList.openAddEmployeeForm();
  await addEmployeePage.addEmployee(firstName, lastName);

  await expect(authPage).toHaveURL(/\/pim\/viewPersonalDetails\//);

  await employeeList.goTo();
  await employeeList.searchByName(`${firstName} ${lastName}`);

  await expect
    .poll(() => employeeList.employeeNames())
    .toContainEqual(expect.stringContaining(lastName));
});
