import { Locator, Page } from '@playwright/test';

export class AddEmployeePage {
  private readonly nameField: Locator;
  private readonly lastNameField: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.nameField = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameField = page.getByRole('textbox', { name: 'Last Name' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async addEmployee(firstName: string, lastName: string): Promise<void> {
    await this.nameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.saveButton.click();
  }
}
