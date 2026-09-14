import { expect, test } from 'vitest';
import { business, telUrl, whatsappUrl } from '@/config/business';

test('telefon E.164 formatında', () => expect(business.phone).toMatch(/^\+90\d{10}$/));
test('tel linki', () => expect(telUrl()).toBe('tel:+905325930436'));
test('whatsapp linki metni kodlar', () =>
  expect(whatsappUrl('Kız ney')).toBe('https://wa.me/905325930436?text=K%C4%B1z%20ney'));
test('sosyal linkler ya null ya da gerçek profil URL’si', () => {
  for (const url of Object.values(business.social)) {
    if (url === null) continue;
    expect(new URL(url).pathname.length).toBeGreaterThan(1); // mevcut sitedeki "facebook.com/" hatası tekrarlanmasın
  }
});
