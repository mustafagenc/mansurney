import { expect, test } from '@playwright/test';

const cases = [
  { path: '/', lang: 'tr', dir: 'ltr' },
  { path: '/en', lang: 'en', dir: 'ltr' },
  { path: '/ar', lang: 'ar', dir: 'rtl' },
];

for (const c of cases) {
  test(`${c.path} → lang=${c.lang} dir=${c.dir}`, async ({ page }) => {
    await page.goto(c.path);
    await expect(page.locator('html')).toHaveAttribute('lang', c.lang);
    await expect(page.locator('html')).toHaveAttribute('dir', c.dir);
  });
}

test('/tr öneki varsayılan dilde kaldırılır', async ({ page }) => {
  await page.goto('/tr');
  await expect(page).toHaveURL(/\/$/);
});

test('Accept-Language ile yönlendirme yapılmaz', async ({ browser }) => {
  const ctx = await browser.newContext({ locale: 'ar-SA' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
  await ctx.close();
});
