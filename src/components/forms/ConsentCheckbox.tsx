'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { legalSlug } from '@/lib/legal-slugs';

export function ConsentCheckbox({ invalid }: { invalid: boolean }) {
  const t = useTranslations('Forms');
  const locale = useLocale() as Locale;
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={invalid || undefined}
          className="mt-1 size-4 accent-yesil"
        />
        <span>
          {t.rich('consent', {
            link: (chunks) => (
              <Link
                href={{ pathname: '/yasal/[slug]', params: { slug: legalSlug('kvkk', locale) } }}
                target="_blank"
                className="underline decoration-altin"
              >
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      {invalid && <p className="mt-1 text-sm text-kor">{t('errors.consent')}</p>}
    </div>
  );
}
