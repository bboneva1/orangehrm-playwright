import { Locator, Page } from '@playwright/test';

export class ApplyLeavePage {
  private readonly page: Page;
  private readonly leaveTypeDropdown: Locator;
  private readonly fromDate: Locator;
  private readonly toDate: Locator;
  private readonly commentField: Locator;
  private readonly applyButton: Locator;
  private readonly successGrowler: Locator;

  constructor(page: Page) {
    this.page = page;
    // The labels are separate elements, not <label for>, so each field is found by scoping
    // to the .oxd-input-group that contains its label text.
    this.leaveTypeDropdown = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Leave Type' })
      .getByText('-- Select --');
    this.fromDate = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'From Date' })
      .getByRole('textbox', { name: 'yyyy-mm-dd' });
    this.toDate = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'To Date' })
      .getByRole('textbox', { name: 'yyyy-mm-dd' });
    this.commentField = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Comments' })
      .getByRole('textbox');
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.successGrowler = page.getByText('Successfully Saved');
  }

  async goTo(): Promise<void> {
    await this.page.goto('/web/index.php/leave/applyLeave');
  }

  async addLeave(type: string, startDate: string, endDate: string, comment: string): Promise<void> {
    await this.selectLeaveType(type);
    await this.fromDate.fill(startDate);
    // OrangeHRM copies From Date into To Date when From loses focus. Blur explicitly so that copy
    // finishes first; otherwise it lands mid-fill and To Date ends up with both dates glued together.
    await this.fromDate.blur();
    await this.toDate.fill(endDate);
    await this.commentField.fill(comment);
    await this.applyButton.click();
    await this.successGrowler.waitFor();
  }

  private async selectLeaveType(type: string): Promise<void> {
    // Custom dropdown, not <select>: open it, then click the option by its text.
    await this.leaveTypeDropdown.click();
    await this.page.getByRole('option', { name: type, exact: true }).click();
  }
}
