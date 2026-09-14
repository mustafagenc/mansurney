'use client';

import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const labels: Record<Locale, string> = { tr: 'Türkçe', en: 'English', ar: 'العربية' };

export function LanguageSwitcher() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">{t('language')}</span>
      <select
        className="rounded-full border border-white/20 bg-transparent px-3 py-1"
        value={locale}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          const alt = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${next}"]`);
          if (alt) {
            // hreflang href'leri `NEXT_PUBLIC_SITE_URL` (canlı alan adı) üzerinde mutlaktır;
            // yalnızca yolu kullanarak mevcut host'ta (ör. Vercel preview) kalınır.
            const url = new URL(alt.href);
            window.location.assign(url.pathname + window.location.search + window.location.hash);
            return;
          }
          startTransition(() =>
            // @ts-expect-error -- params mevcut rotayla eşleşir (next-intl önerilen kalıp)
            router.replace({ pathname, params }, { locale: next }),
          );
        }}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l} className="text-murekkep">
            {labels[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
