import { describe, expect, test } from 'vitest';
import { contactMail, orderMail } from '@/lib/forms/templates';
import type { ContactInput, OrderInput } from '@/lib/forms/schemas';

describe('orderMail', () => {
  const base: OrderInput = {
    name: 'Ali Veli',
    phone: '05325930436',
    email: '',
    tuning: '',
    quantity: 1,
    note: '',
    consent: 'on',
    website: '',
  };

  test('akort belirtilmemişse konu "Belirtilmedi (danışacak)" içerir', () => {
    const mail = orderMail(base, 'ar');
    expect(mail.subject).toContain('Belirtilmedi (danışacak)');
  });

  test('site dili gövdede doğru dille yer alır', () => {
    const mail = orderMail(base, 'ar');
    expect(mail.text).toContain('Site dili: Arapça');
  });

  test('e-posta boşsa replyTo undefined olur', () => {
    const mail = orderMail(base, 'ar');
    expect(mail.replyTo).toBeUndefined();
  });

  test('doğrulanmamış girişte bile konu CR/LF içermez (savunma katmanı)', () => {
    const mail = orderMail({ ...base, name: 'Ali\r\nBcc: x@y.z' }, 'tr');
    expect(mail.subject).not.toMatch(/[\r\n]/);
  });
});

describe('contactMail', () => {
  const base: ContactInput = {
    name: 'Ali',
    email: 'ali@example.com',
    phone: '',
    subject: '',
    message: 'Merhaba, bilgi almak istiyorum.',
    consent: 'on',
    website: '',
  };

  test('doğrulanmamış girişte bile konu CR/LF içermez (savunma katmanı)', () => {
    const mail = contactMail({ ...base, subject: 'Merhaba\nBcc: x@y.z' }, 'tr');
    expect(mail.subject).not.toMatch(/[\r\n]/);
  });
});
