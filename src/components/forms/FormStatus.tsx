'use client';

import { useTranslations } from 'next-intl';
import type { FormState } from '@/lib/forms/schemas';

// Spec §4.4: hairline çerçeve + mantıksal başlangıç kenarında 3px renk çizgisi.
// Genişlikler (`border-y`/`border-e`/`border-s-*`) ve renkler ayrı fiziksel/mantıksal
// kenar özellikleri olduğundan çakışmaz (bkz. mdx-components.tsx `border-s` deseni).
const frame = 'border-y border-e border-s-[3px] border-y-murekkep/10 border-e-murekkep/10 bg-kagit-2 p-4';

export function FormStatus({ state }: { state: FormState }) {
  const t = useTranslations('Forms');
  return (
    <div role="status" aria-live="polite" className="min-h-6">
      {state.status === 'success' && <p className={`${frame} border-s-yesil text-yesil`}>{t('success')}</p>}
      {state.status === 'error' && state.error && (
        <p className={`${frame} border-s-kor text-kor`}>{t(`errors.${state.error}`)}</p>
      )}
    </div>
  );
}
