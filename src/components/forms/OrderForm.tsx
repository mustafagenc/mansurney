'use client';

import { useTranslations } from 'next-intl';
import { Fragment, Suspense, useActionState, useRef } from 'react';
import { submitOrder } from '@/app/[locale]/siparis/actions';
import { Button } from '@/components/ui/Button';
import { tunings } from '@/data/tunings';
import { initialFormState } from '@/lib/forms/schemas';
import { ConsentCheckbox } from './ConsentCheckbox';
import { Field } from './Field';
import { FormStatus } from './FormStatus';
import { TuningFromQuery } from './TuningFromQuery';
import { TurnstileField } from './TurnstileField';
import { useSubmissionKey } from './useSubmissionKey';

export function OrderForm() {
  const t = useTranslations();
  const [state, action, pending] = useActionState(submitOrder, initialFormState);
  const submissionKey = useSubmissionKey(state);
  const tuningRef = useRef<HTMLSelectElement>(null);
  const err = (f: string) => (state.fields?.includes(f) ? t(`Forms.errors.${f}`) : undefined);
  const v = state.values ?? {};

  if (state.status === 'success') return <FormStatus state={state} />;

  return (
    <form action={action} className="mt-6 space-y-5">
      {/* Hata dönüşünde alanlar gönderilen değerlerle yeniden bağlanır (bkz. useSubmissionKey). */}
      <Fragment key={submissionKey}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('Forms.name')} required error={err('name')}>
            <input name="name" autoComplete="name" defaultValue={v.name} />
          </Field>
          <Field label={t('Forms.phone')} required error={err('phone')}>
            <input name="phone" type="tel" autoComplete="tel" dir="ltr" defaultValue={v.phone} />
          </Field>
          <Field label={t('Forms.email')} error={err('email')}>
            <input name="email" type="email" autoComplete="email" dir="ltr" defaultValue={v.email} />
          </Field>
          <Field label={t('Order.tuning')} error={err('tuning')}>
            <select name="tuning" ref={tuningRef} defaultValue={v.tuning ?? ''}>
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
            <input name="quantity" type="number" min={1} max={50} defaultValue={v.quantity ?? 1} />
          </Field>
        </div>
        <Field label={t('Order.note')} error={err('note')}>
          <textarea name="note" rows={4} placeholder={t('Order.notePlaceholder')} defaultValue={v.note} />
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
        <ConsentCheckbox invalid={Boolean(state.fields?.includes('consent'))} defaultChecked={v.consent === 'on'} />
      </Fragment>
      {/* `?akort=` yalnızca istemcide, kendi Suspense sınırında okunur; form statik HTML'de kalır. */}
      <Suspense fallback={null}>
        <TuningFromQuery selectRef={tuningRef} />
      </Suspense>
      <TurnstileField state={state} />
      <FormStatus state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? t('Forms.sending') : t('Order.submit')}
      </Button>
    </form>
  );
}
