import { Locator, Page } from '@playwright/test';

export class DashboardPage {
  private readonly page: Page;
  private readonly widgetTitles: Locator;
  private readonly loadingSpinners: Locator;

  constructor(page: Page) {
    this.page = page;
    // Widget titles and loading spinners have no role or accessible name,
    // so these use OrangeHRM's CSS classes (last resort, see CLAUDE.md).
    this.widgetTitles = page.locator('.orangehrm-dashboard-widget-name');
    this.loadingSpinners = page.locator('.oxd-loading-spinner');
  }

  async goTo(): Promise<void> {
    await this.page.goto('/web/index.php/dashboard/index');
  }

  // Widgets appear first, each with a spinner, then load their content one by one.
  // Loaded = widgets are on screen AND no spinner is left. Checking spinners alone isn't
  // enough: right after goTo() there are no widgets yet, so there are no spinners either
  async widgetLoaded(): Promise<boolean> {
    const widgets = await this.widgetTitles.count();
    const spinners = await this.loadingSpinners.count();
    return widgets > 0 && spinners === 0;
  }
}
