import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('mobil menü açılır, kapanır', async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto('/');
  await page.getByRole('button', { name: 'Menüyü aç' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('dil seçici aynı sayfanın İngilizcesine gider', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Dil').selectOption('en');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('bilinmeyen sayfa yerelleştirilmiş 404 döner', async ({ page }) => {
  const res = await page.goto('/en/olmayan-sayfa');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

for (const path of ['/', '/en', '/ar']) {
  test(`${path} axe ciddi ihlal yok`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
  });
}
