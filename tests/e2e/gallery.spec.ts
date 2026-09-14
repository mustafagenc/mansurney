import { expect, test } from '@playwright/test';

test('lightbox klavye ile gezilir ve odak geri döner', async ({ page }) => {
  await page.goto('/galeri');
  const first = page.locator('main ul button').first();
  await first.click();
  const dialog = page.getByRole('dialog', { name: 'Görsel görüntüleyici' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('figcaption')).toContainText('1/');
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('figcaption')).toContainText('2/');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
});

test('arapçada sağ ok önceki görsele gider', async ({ page }) => {
  await page.goto('/ar/maarad');
  await page.locator('main ul button').nth(1).click();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog').locator('figcaption')).toContainText('1/');
});
