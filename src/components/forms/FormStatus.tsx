'use client';

import { useTranslations } from 'next-intl';
import type { FormState } from '@/lib/forms/schemas';

export function FormStatus({ state }: { state: FormState }) {
  const t = useTranslations('Forms');
  return (
    <div role="status" aria-live="polite" className="min-h-6">
      {state.status === 'success' && <p className="rounded-lg bg-yesil/10 p-4 text-yesil">{t('success')}</p>}
      {state.status === 'error' && state.error && (
        <p className="rounded-lg bg-kor/10 p-4 text-kor">{t(`errors.${state.error}`)}</p>
      )}
    </div>
  );
}
