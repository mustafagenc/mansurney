'use client';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';
import type { FormState } from '@/lib/forms/schemas';

export function TurnstileField({ state }: { state: FormState }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = useLocale();
  const ref = useRef<TurnstileInstance>(null);

  // Token sunucuda doğrulandığında (captcha reddi veya sonrasındaki e-posta hatası)
  // tek kullanımlık olduğundan tüketilmiştir; yeni deneme için widget sıfırlanır.
  // Doğrulama (validation) hatasında token henüz kullanılmadığı için korunur.
  useEffect(() => {
    if (state.error === 'captcha' || state.error === 'server') ref.current?.reset();
  }, [state]);

  // dry-run/geliştirme: site anahtarı yoksa widget render edilmez; sunucu tarafı
  // FORMS_DRY_RUN olmadan token'sız isteği zaten reddeder.
  if (!siteKey) return null;
  return <Turnstile ref={ref} siteKey={siteKey} options={{ language: locale, theme: 'light', size: 'flexible' }} />;
}
