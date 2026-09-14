import { describe, expect, test } from 'vitest';
import { orderMail } from '@/lib/forms/templates';
import type { OrderInput } from '@/lib/forms/schemas';

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
});
