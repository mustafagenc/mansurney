'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useId } from 'react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { legalSlug } from '@/lib/legal-slugs';

export function ConsentCheckbox({ invalid, defaultChecked }: { invalid: boolean; defaultChecked?: boolean }) {
  const t = useTranslations('Forms');
  const locale = useLocale() as Locale;
  const errId = `${useId()}-err`;
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          defaultChecked={defaultChecked}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errId : undefined}
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
      {invalid && (
        <p id={errId} className="mt-1 text-sm text-kor">
          {t('errors.consent')}
        </p>
      )}
    </div>
  );
}
