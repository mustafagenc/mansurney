import type { Locale } from '@/i18n/routing';

// Saf (server-only bağımlılığı yok) — istemci bileşenlerinden (ör. ConsentCheckbox)
// güvenle import edilebilir. MDX dinamik import'u içeren `loadLegal` ise yalnızca
// `legal.ts`'de tanımlıdır; onu bir istemci bileşeninden import etmek paketleyicinin
// tüm yasal MDX içeriğini istemci demetine dahil etmeye çalışmasına yol açar.
export const legalKeys = ['kvkk', 'privacy'] as const;
export type LegalKey = (typeof legalKeys)[number];

const slugs: Record<LegalKey, Record<Locale, string>> = {
  kvkk: { tr: 'kvkk-aydinlatma-metni', en: 'privacy-notice', ar: 'ishaar-al-khususiya' },
  privacy: { tr: 'gizlilik-politikasi', en: 'privacy-policy', ar: 'siyasat-al-khususiya' },
};

export const legalSlug = (key: LegalKey, locale: Locale) => slugs[key][locale];
export const legalKeyFromSlug = (locale: Locale, slug: string): LegalKey | null =>
  legalKeys.find((k) => slugs[k][locale] === slug) ?? null;
