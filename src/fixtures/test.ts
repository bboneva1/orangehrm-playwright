import { test as base, type Page } from '@playwright/test';

type Fixtures = {
  authPage: Page;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await page.goto('/web/index.php/dashboard/index');
    await use(page);
  },
});

export { expect } from '@playwright/test';
