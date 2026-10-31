import { test, expect } from '@fixtures/test';
import { buildEmployee } from '@utils/factories';

test(
  'Admin can edit an employee name',
  { tag: '@mobile' },
  async ({ authPage, employeeListPage, addEmployeePage, employeeDetailsPage }) => {
    const { firstName, lastName, employeeId } = buildEmployee();
    const newFirstName = `Edited${firstName}`;
    const newLastName = `${lastName}Edited`;

    // TODO: Phase D — cleanup
    await employeeListPage.goTo();
    await employeeListPage.openAddEmployeeForm();
    await addEmployeePage.addEmployee(firstName, lastName, employeeId);

    await expect(authPage).toHaveURL(/\/pim\/viewPersonalDetails/);
    await expect.poll(() => employeeDetailsPage.firstName()).toBe(firstName);

    await employeeDetailsPage.editName(newFirstName, newLastName);
    await authPage.reload();

    await expect.poll(() => employeeDetailsPage.firstName()).toBe(newFirstName);
    await expect.poll(() => employeeDetailsPage.lastName()).toBe(newLastName);
  }
);
