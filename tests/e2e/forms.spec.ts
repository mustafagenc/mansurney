import { expect, test } from '@playwright/test';

test('akort sorgu parametresiyle ön seçilir', async ({ page }) => {
  await page.goto('/siparis?akort=sah');
  await expect(page.getByLabel('Akort')).toHaveValue('sah');
});

test('geçersiz akort parametresi yok sayılır', async ({ page }) => {
  await page.goto('/siparis?akort=<script>');
  await expect(page.getByLabel('Akort')).toHaveValue('');
});

test('sipariş formu gönderilir', async ({ page }) => {
  await page.goto('/siparis');
  await page.getByLabel('Adınız Soyadınız').fill('Test Kullanıcı');
  await page.getByLabel('Telefon').fill('0532 000 00 00');
  await page.getByLabel('Akort').selectOption('kiz');
  await page.getByRole('checkbox', { name: /Aydınlatma Metni/ }).check();
  await page.getByRole('button', { name: 'Sipariş talebi gönder' }).click();
  await expect(page.getByRole('status')).toContainText('Talebiniz bize ulaştı');
});

test('sunucu doğrulama hatası erişilebilir biçimde gösterilir', async ({ page }) => {
  await page.goto('/siparis');
  await page.getByLabel('Adınız Soyadınız').fill('Test');
  await page.getByLabel('Telefon').fill('12'); // HTML doğrulamasını geçer (pattern yok), sunucu reddeder
  await page.getByRole('checkbox', { name: /Aydınlatma Metni/ }).check();
  await page.getByRole('button', { name: 'Sipariş talebi gönder' }).click();
  await expect(page.getByLabel('Telefon')).toHaveAttribute('aria-invalid', 'true');
});

test('ingilizce iletişim formu', async ({ page }) => {
  await page.goto('/en/contact');
  await page.getByLabel('Full name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  await page.getByLabel('Message').fill('I would like to order a Kız ney.');
  await page.getByRole('checkbox', { name: /Privacy Notice/ }).check();
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status')).toContainText('received');
});

test('KVKK linki doğru dildeki yasal sayfaya gider', async ({ page }) => {
  await page.goto('/ar/talab');
  await expect(page.locator('form a[href*="qanuni"]')).toHaveAttribute('href', '/ar/qanuni/ishaar-al-khususiya');
});
