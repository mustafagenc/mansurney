'use client';

import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const labels: Record<Locale, string> = { tr: 'Türkçe', en: 'English', ar: 'العربية' };

const tones = {
  light: 'border-murekkep/25 text-murekkep hover:border-murekkep',
  dark: 'border-kagit/30 text-kagit hover:border-kagit',
} as const;

export function LanguageSwitcher({ tone = 'light', className = '' }: { tone?: keyof typeof tones; className?: string }) {
  const t = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{t('language')}</span>
      <select
        className={`cursor-pointer appearance-none rounded-none border-0 border-b bg-transparent py-1.5 pe-6 ps-0 text-[0.875rem] font-semibold transition-colors disabled:opacity-60 ${tones[tone]}`}
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
      <svg
        aria-hidden="true"
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        className={`pointer-events-none absolute end-0.5 ${tone === 'dark' ? 'text-kagit' : 'text-murekkep'}`}
      >
        <path d="M1 1l4 4 4-4" />
      </svg>
    </label>
  );
}
