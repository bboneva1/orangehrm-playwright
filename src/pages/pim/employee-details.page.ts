import { Page, Locator } from '@playwright/test';

export class EmployeeDetailsPage {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly saveButton: Locator;
  private readonly successGrowler: Locator;

  constructor(page: Page) {
    this.firstNameField = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameField = page.getByRole('textbox', { name: 'Last Name' });
    this.saveButton = page
      .locator('form')
      .filter({ has: this.firstNameField })
      .getByRole('button', { name: 'Save' });
    this.successGrowler = page.getByText('Successfully Updated');
  }

  async editName(firstName: string, lastName: string): Promise<void> {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.saveButton.click();
    await this.successGrowler.waitFor();
  }

  async firstName(): Promise<string> {
    return this.firstNameField.inputValue();
  }

  async lastName(): Promise<string> {
    return this.lastNameField.inputValue();
  }
}
