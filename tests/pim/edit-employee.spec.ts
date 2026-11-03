import { test, expect } from '@fixtures/test';

test(
  'Admin can edit an employee name',
  { tag: '@mobile' },
  async ({ authPage, employeeDetailsPage, testEmployee }) => {
    const { firstName, lastName, empNumber } = testEmployee;

    const newFirstName = `Edited${firstName}`;
    const newLastName = `${lastName}Edited`;

    await employeeDetailsPage.goTo(empNumber);

    await expect(authPage).toHaveURL(/\/pim\/viewPersonalDetails/);
    await expect.poll(() => employeeDetailsPage.firstName()).toBe(firstName);

    await employeeDetailsPage.editName(newFirstName, newLastName);
    await authPage.reload();

    await expect.poll(() => employeeDetailsPage.firstName()).toBe(newFirstName);
    await expect.poll(() => employeeDetailsPage.lastName()).toBe(newLastName);
  }
);
