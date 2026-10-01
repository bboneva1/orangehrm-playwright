import { Locator, Page } from '@playwright/test';

export type UserRole = 'Admin' | 'ESS';
export type UserStatus = 'Enabled' | 'Disabled';

export class AddUserPage {
  private readonly page: Page;
  private readonly employeeNameField: Locator;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly confirmPassField: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // The inputs have no placeholder and the label is a separate element, so getByRole
    // can't name them. Each locator scopes to the .oxd-input-group containing the label.
    this.employeeNameField = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Name' })
      .getByRole('textbox');
    this.usernameField = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .getByRole('textbox');
    this.passwordField = page
      .locator('.oxd-input-group')
      .filter({ has: page.getByText('Password', { exact: true }) })
      .getByRole('textbox');
    this.confirmPassField = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Confirm Password' })
      .getByRole('textbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async addUser(
    role: UserRole,
    status: UserStatus,
    employee: string,
    username: string,
    password: string
  ): Promise<void> {
    await this.selectFromDropdown('User Role', role);
    await this.selectFromDropdown('Status', status);
    await this.employeeNameField.fill(employee);
    await this.page.getByRole('option', { name: employee }).click();
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.confirmPassField.fill(password);
    await this.saveButton.click();
  }

  private async selectFromDropdown(label: string, option: string): Promise<void> {
    // The inputs have no placeholder and the label is a separate element, so getByRole
    // can't name them. Each locator scopes to the .oxd-input-group containing the label.
    const group = this.page.locator('.oxd-input-group').filter({ hasText: label });
    await group.getByText('-- Select --').click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }
}
