import { test, expect } from '@fixtures/test';

test('dashboard shows the sidebar', async ({ authPage }) => {
  await expect(authPage.getByRole('navigation', { name: 'Sidepanel' })).toBeVisible();
});
