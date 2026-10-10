import { Locator, Page } from '@playwright/test';

export class AddEmployeePage {
  private readonly nameField: Locator;
  private readonly lastNameField: Locator;
  private readonly employeeIdField: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.nameField = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameField = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdField = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .getByRole('textbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async addEmployee(firstName: string, lastName: string, id: string): Promise<void> {
    await this.nameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.employeeIdField.fill(id);
    await this.saveButton.click();
  }
}
