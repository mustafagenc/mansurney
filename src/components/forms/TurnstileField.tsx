'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { useLocale } from 'next-intl';

export function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = useLocale();
  // dry-run/geliştirme: site anahtarı yoksa widget render edilmez; sunucu tarafı
  // FORMS_DRY_RUN olmadan token'sız isteği zaten reddeder.
  if (!siteKey) return null;
  return <Turnstile siteKey={siteKey} options={{ language: locale, theme: 'light', size: 'flexible' }} />;
}
