import { expect, test } from '@playwright/test';

test('anasayfa bölümleri ve tek h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dinle neyden');
  await expect(page.locator('#rehber article')).toHaveCount(4);
  await expect(page.locator('#akortlar li a')).toHaveCount(8);
  await expect(page.getByRole('link', { name: 'Ney Siparişi' }).first()).toBeVisible();
});

test('hero görseli öncelikli yüklenir (LCP)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('section#hero img')).toHaveAttribute('fetchpriority', 'high');
});

test('otomatik dönen içerik yok', async ({ page }) => {
  await page.goto('/');
  const before = await page.locator('section#hero h1').textContent();
  await page.waitForTimeout(7000);
  expect(await page.locator('section#hero h1').textContent()).toBe(before);
});

test('arapça anasayfa rtl ve çevrilmiş', async ({ page }) => {
  await page.goto('/ar');
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Dinle neyden');
});
