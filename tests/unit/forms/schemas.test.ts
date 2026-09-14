import { describe, expect, test } from 'vitest';
import { contactSchema, orderSchema } from '@/lib/forms/schemas';

const order = { name: 'Ali Veli', phone: '0532 593 04 36', email: '', tuning: 'kiz', quantity: '2', note: '', consent: 'on', website: '' };

describe('orderSchema', () => {
  test('geçerli sipariş', () => expect(orderSchema.safeParse(order).success).toBe(true));
  test('adet sayıya çevrilir', () => expect(orderSchema.parse(order).quantity).toBe(2));
  test('akort boş olabilir (danışacağım)', () => expect(orderSchema.safeParse({ ...order, tuning: '' }).success).toBe(true));
  test('geçersiz akort reddedilir', () => expect(orderSchema.safeParse({ ...order, tuning: 'Kız' }).success).toBe(false));
  test('KVKK onayı zorunlu', () => expect(orderSchema.safeParse({ ...order, consent: undefined }).success).toBe(false));
  test('uluslararası telefon kabul', () => expect(orderSchema.safeParse({ ...order, phone: '+49 151 2345 6789' }).success).toBe(true));
  test('harf içeren telefon red', () => expect(orderSchema.safeParse({ ...order, phone: 'abc' }).success).toBe(false));
  test('adet 1–50', () => expect(orderSchema.safeParse({ ...order, quantity: '0' }).success).toBe(false));
  test('ad içinde CR/LF (başlık enjeksiyonu) reddedilir', () =>
    expect(orderSchema.safeParse({ ...order, name: 'Ali\r\nBcc: x@y.z' }).success).toBe(false));
});

describe('contactSchema', () => {
  const contact = { name: 'Ali', email: 'ali@example.com', phone: '', subject: '', message: 'Merhaba, bilgi almak istiyorum.', consent: 'on', website: '' };
  test('geçerli', () => expect(contactSchema.safeParse(contact).success).toBe(true));
  test('e-posta zorunlu', () => expect(contactSchema.safeParse({ ...contact, email: '' }).success).toBe(false));
  test('mesaj en az 10 karakter', () => expect(contactSchema.safeParse({ ...contact, message: 'kısa' }).success).toBe(false));
  test('konu içinde CR/LF (başlık enjeksiyonu) reddedilir', () =>
    expect(contactSchema.safeParse({ ...contact, subject: 'Merhaba\nBcc: x@y.z' }).success).toBe(false));
  test('mesajda satır sonu kabul edilir (çok satırlı alan)', () =>
    expect(contactSchema.safeParse({ ...contact, message: 'Merhaba,\nbilgi almak istiyorum.' }).success).toBe(true));
});
