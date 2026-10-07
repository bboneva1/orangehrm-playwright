import { Locator, Page } from '@playwright/test';

export class AddJobTitlePage {
  private readonly jobTitleField: Locator;
  private readonly jobDescriptionField: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    // The Job Title input has no placeholder and its label is a separate element, so getByRole
    // can't name it. The locator scopes to the .oxd-input-group containing the label first.

    this.jobTitleField = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Job Title' })
      .getByRole('textbox');
    this.jobDescriptionField = page.getByRole('textbox', { name: 'Type description here' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async addJobTitle(title: string, description: string): Promise<void> {
    await this.jobTitleField.fill(title);
    await this.jobDescriptionField.fill(description);
    await this.saveButton.click();
  }
}
