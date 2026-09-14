'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { submitOrder } from '@/app/[locale]/siparis/actions';
import { Button } from '@/components/ui/Button';
import { isTuningKey, tunings } from '@/data/tunings';
import { initialFormState } from '@/lib/forms/schemas';
import { ConsentCheckbox } from './ConsentCheckbox';
import { Field } from './Field';
import { FormStatus } from './FormStatus';
import { TurnstileField } from './TurnstileField';

// `searchParams`'ı burada, sayfa bileşeni yerine okuyoruz: böylece sayfa statik
// (SSG) kalır — `akort` sorgu parametresi yalnızca istemcide, `<Suspense>` ile
// sarılmış bu bileşende değerlendirilir.
export function OrderForm() {
  const t = useTranslations();
  const akort = useSearchParams().get('akort');
  const defaultTuning = isTuningKey(akort) ? akort : '';
  const [state, action, pending] = useActionState(submitOrder, initialFormState);
  const err = (f: string) => (state.fields?.includes(f) ? t(`Forms.errors.${f}`) : undefined);

  if (state.status === 'success') return <FormStatus state={state} />;

  return (
    <form action={action} className="mt-6 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('Forms.name')} required error={err('name')}>
          <input name="name" autoComplete="name" />
        </Field>
        <Field label={t('Forms.phone')} required error={err('phone')}>
          <input name="phone" type="tel" autoComplete="tel" dir="ltr" />
        </Field>
        <Field label={t('Forms.email')} error={err('email')}>
          <input name="email" type="email" autoComplete="email" dir="ltr" />
        </Field>
        <Field label={t('Order.tuning')} error={err('tuning')}>
          <select name="tuning" defaultValue={defaultTuning}>
            <option value="">{t('Order.tuningUnsure')}</option>
            {tunings.map((tu) => (
              <option key={tu.key} value={tu.key}>
                {tu.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="max-w-40">
        <Field label={t('Order.quantity')} error={err('quantity')}>
          <input name="quantity" type="number" min={1} max={50} defaultValue={1} />
        </Field>
      </div>
      <Field label={t('Order.note')} error={err('note')}>
        <textarea name="note" rows={4} placeholder={t('Order.notePlaceholder')} />
      </Field>
      {/* Honeypot: yalnızca botlar doldurur; görsel olarak sayfa dışına taşınır ve
          `aria-hidden`/`tabIndex=-1` ile ekran okuyuculardan ve klavye gezintisinden gizlenir. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -start-[9999px] size-px opacity-0"
      />
      <ConsentCheckbox invalid={Boolean(state.fields?.includes('consent'))} />
      <TurnstileField />
      <FormStatus state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? t('Forms.sending') : t('Order.submit')}
      </Button>
    </form>
  );
}
