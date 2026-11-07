import { Page, Locator } from '@playwright/test';

export class EmployeeDetailsPage {
  private readonly page: Page;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly saveButton: Locator;
  private readonly successGrowler: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameField = page.getByRole('textbox', { name: 'Last Name' });
    this.saveButton = page
      .locator('form')
      .filter({ has: this.firstNameField })
      .getByRole('button', { name: 'Save' });
    this.successGrowler = page.getByText('Successfully Updated');
  }

  async goTo(empNumber: number): Promise<void> {
    await this.page.goto(`/web/index.php/pim/viewPersonalDetails/empNumber/${empNumber}`);
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

  empNumber(): number {
    const url = this.page.url();
    const empNumber = Number(url.split('/').pop());
    if (Number.isNaN(empNumber)) {
      throw new Error(`No empNumber at the end of the URL: ${url}`);
    }
    return empNumber;
  }
}
