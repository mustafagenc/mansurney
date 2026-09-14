'use client';

import { useTranslations } from 'next-intl';
import { Fragment, useActionState } from 'react';
import { submitContact } from '@/app/[locale]/iletisim/actions';
import { Button } from '@/components/ui/Button';
import { initialFormState } from '@/lib/forms/schemas';
import { ConsentCheckbox } from './ConsentCheckbox';
import { Field } from './Field';
import { FormStatus } from './FormStatus';
import { TurnstileField } from './TurnstileField';
import { useSubmissionKey } from './useSubmissionKey';

export function ContactForm() {
  const t = useTranslations();
  const [state, action, pending] = useActionState(submitContact, initialFormState);
  const submissionKey = useSubmissionKey(state);
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
          <Field label={t('Forms.email')} required error={err('email')}>
            <input name="email" type="email" autoComplete="email" dir="ltr" defaultValue={v.email} />
          </Field>
          <Field label={t('Forms.phone')} error={err('phone')}>
            <input name="phone" type="tel" autoComplete="tel" dir="ltr" defaultValue={v.phone} />
          </Field>
          <Field label={t('Forms.subject')} error={err('subject')}>
            <input name="subject" autoComplete="off" defaultValue={v.subject} />
          </Field>
        </div>
        <Field label={t('Forms.message')} required error={err('message')}>
          <textarea name="message" rows={6} defaultValue={v.message} />
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
      <TurnstileField state={state} />
      <FormStatus state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? t('Forms.sending') : t('Contact.submit')}
      </Button>
    </form>
  );
}
