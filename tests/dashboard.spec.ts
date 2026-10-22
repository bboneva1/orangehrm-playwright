import { test, expect } from '@fixtures/test';

test('dashboard shows the sidebar', async ({ dashboardPage }) => {
  await expect.poll(() => dashboardPage.sidebarVisible()).toBe(true);
});
