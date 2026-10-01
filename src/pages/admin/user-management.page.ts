import { Locator, Page } from '@playwright/test';

export class UserManagementPage {
  private readonly page: Page;
  private readonly userNameField: Locator;
  private readonly userSearchButton: Locator;
  private readonly addUserButton: Locator;
  private readonly userRows: Locator;

  constructor(page: Page) {
    this.page = page;
    //the input has no placeholder and the label text is in a separate element,
    //so the locator scopes to the group containing 'Username' label.
    this.userNameField = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .getByRole('textbox');
    this.userSearchButton = page.getByRole('button', { name: 'Search' });
    this.addUserButton = page.getByRole('button', { name: 'Add' });
    this.userRows = page
      .getByRole('table')
      .getByRole('row')
      .filter({ has: page.getByRole('cell') });
  }

  async goTo(): Promise<void> {
    await this.page.goto('/web/index.php/admin/viewSystemUsers');
  }

  async searchByUser(username: string): Promise<void> {
    await this.userNameField.fill(username);
    await this.userSearchButton.click();
  }

  async openAddUserForm(): Promise<void> {
    await this.addUserButton.click();
  }

  async userNames(): Promise<string[]> {
    return this.userRows.allInnerTexts();
  }
}
