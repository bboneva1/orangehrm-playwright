import { Locator, Page } from '@playwright/test';

export class MyLeavePage {
  private readonly page: Page;
  private readonly leaveRows: Locator;
  private readonly cancelGrowler: Locator;

  constructor(page: Page) {
    this.page = page;
    this.leaveRows = page
      .getByRole('table')
      .getByRole('row')
      .filter({ has: page.getByRole('cell') });
    this.cancelGrowler = page.getByText('Successfully Updated');
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

  // The comment is unique per run, so it picks out exactly one row.
  private rowFor(comment: string): Locator {
    return this.leaveRows.filter({ hasText: comment });
  }
}
