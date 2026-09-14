import { expect, test } from '@playwright/test';

test('akortlar: 8 kart, sipariş linki akordu taşır', async ({ page }) => {
  await page.goto('/akortlar');
  await expect(page.locator('main li[id]')).toHaveCount(8);
  await expect(page.getByRole('link', { name: 'Kız ney siparişi' })).toHaveAttribute('href', '/siparis?akort=kiz');
});

test('ingilizce akort sayfası yerelleştirilmiş sipariş yoluna gider', async ({ page }) => {
  await page.goto('/en/tunings');
  await expect(page.locator('main li#sah a')).toHaveAttribute('href', '/en/order?akort=sah');
});

test('ney çantası ve atölye 200, usta adı onaysız görünmez', async ({ page }) => {
  expect((await page.goto('/ney-cantasi'))?.status()).toBe(200);
  expect((await page.goto('/ar/al-warsha'))?.status()).toBe(200);
  await page.goto('/atolye');
  await expect(page.getByText('Alper Yıldırım')).toHaveCount(0);
});
