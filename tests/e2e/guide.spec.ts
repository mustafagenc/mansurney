import { expect, test } from '@playwright/test';

test('rehber hub 4 yazıyı listeler', async ({ page }) => {
  await page.goto('/ney-rehberi');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bilgi & Makaleler');
  await expect(page.locator('main article')).toHaveCount(4);
});

test('detay sayfası: h1, hreflang, canonical, Article JSON-LD', async ({ page }) => {
  await page.goto('/ney-rehberi/tarihce');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Neyin Tarihçesi');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en\/ney-guide\/history$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/ney-rehberi\/tarihce$/);
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((s) => JSON.parse(s)['@type'] === 'Article')).toBe(true);
});

test('dil değişince slug da çevrilir', async ({ page }) => {
  await page.goto('/ney-rehberi/bakimi');
  await page.getByLabel('Dil').selectOption('ar');
  await expect(page).toHaveURL(/\/ar\/dalil-al-nay\/siyana$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('başka dilin slug’ı 404', async ({ page }) => {
  expect((await page.goto('/en/ney-guide/tarihce'))?.status()).toBe(404);
});

test('bakım sayfasında FAQPage JSON-LD', async ({ page }) => {
  await page.goto('/en/ney-guide/care');
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((s) => JSON.parse(s)['@type'] === 'FAQPage')).toBe(true);
});
