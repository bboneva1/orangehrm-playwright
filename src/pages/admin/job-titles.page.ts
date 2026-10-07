import { Locator, Page } from '@playwright/test';

export class JobTitlesPage {
  private readonly page: Page;
  private readonly addButton: Locator;
  private readonly jobTitleRows: Locator;
  private readonly confirmDelete: Locator;
  private readonly successGrowler: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.jobTitleRows = page
      .getByRole('table')
      .getByRole('row')
      .filter({ has: page.getByRole('cell') });
    this.confirmDelete = page.getByRole('button', { name: 'Yes, Delete' });
    this.successGrowler = page.getByText('Successfully Deleted');
  }

  async goTo(): Promise<void> {
    await this.page.goto('/web/index.php/admin/viewJobTitleList');
  }

  async openJobTitleForm(): Promise<void> {
    await this.addButton.click();
  }

  async jobTitles(): Promise<string[]> {
    return this.jobTitleRows.allInnerTexts();
  }

  async deleteJobTitle(jobTitle: string): Promise<void> {
    // The row's action buttons are icons with no accessible name, so the delete button
    // is picked by its trash icon (.bi-trash), inside the row whose cell matches the title exactly.

    await this.jobTitleRows
      .filter({ has: this.page.getByRole('cell', { name: jobTitle, exact: true }) })
      .getByRole('button')
      .filter({ has: this.page.locator('.bi-trash') })
      .click();
    await this.confirmDelete.click();
    await this.successGrowler.waitFor();
  }
}
