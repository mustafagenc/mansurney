import { expect, test } from '@playwright/test';
test('anasayfa 200 döner', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
});
