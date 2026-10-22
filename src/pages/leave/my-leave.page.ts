import { Locator, Page } from '@playwright/test';

export class MyLeavePage {
  private readonly page: Page;
  private readonly leaveRows: Locator;
  private readonly cancelGrowler: Locator;
  private readonly fromDate: Locator;
  private readonly toDate: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leaveRows = page
      .getByRole('table')
      .getByRole('row')
      .filter({ has: page.getByRole('cell') });
    this.cancelGrowler = page.getByText('Successfully Updated');
    this.fromDate = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'From Date' })
      .getByRole('textbox', { name: 'yyyy-mm-dd' });
    this.toDate = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'To Date' })
      .getByRole('textbox', { name: 'yyyy-mm-dd' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async goTo(): Promise<void> {
    await this.page.goto('/web/index.php/leave/viewMyLeaveList');
  }

  async leaveStatus(comment: string): Promise<string> {
    return this.rowFor(comment).innerText();
  }

  async cancelLeave(comment: string): Promise<void> {
    await this.rowFor(comment).getByRole('button', { name: 'Cancel' }).click();
    await this.cancelGrowler.waitFor();
  }

  async filterByDates(from: string, to: string): Promise<void> {
    await this.fromDate.fill(from);
    await this.fromDate.blur();
    await this.toDate.fill(to);
    await this.searchButton.click();
  }

  // The comment is unique per run, so it picks out exactly one row.
  private rowFor(comment: string): Locator {
    return this.leaveRows.filter({ hasText: comment });
  }
}
