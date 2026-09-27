import { Page, Locator } from '@playwright/test';

export class EmployeeListPage {
  private readonly page: Page;
  private readonly addButton: Locator;
  private readonly employeeNameSearchField: Locator;
  private readonly searchButton: Locator;
  private readonly employeeRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: 'Add' });
    //the input has no label, both autocomplete fields share
    //the same placeholder, so the locator scopes to the labelled group first.
    this.employeeNameSearchField = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Name' })
      .getByRole('textbox');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.employeeRows = page
      .getByRole('table')
      .getByRole('row')
      .filter({ has: page.getByRole('cell') });
  }

  async goTo(): Promise<void> {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
  }

  async openAddEmployeeForm(): Promise<void> {
    await this.addButton.click();
  }

  //OrangeHRM accepts free text here, so the autocomplete
  //suggestion isn't needed (checked manually).
  async searchByName(name: string): Promise<void> {
    await this.employeeNameSearchField.fill(name);
    await this.searchButton.click();
  }

  //Returns the full text of each result row (first and last name are separate cells).
  //Doesn't wait for the search to finish: the spec should wrap it in expect.poll().
  async employeeNames(): Promise<string[]> {
    return this.employeeRows.allInnerTexts();
  }
}
