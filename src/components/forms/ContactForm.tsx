'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { submitContact } from '@/app/[locale]/iletisim/actions';
import { Button } from '@/components/ui/Button';
import { initialFormState } from '@/lib/forms/schemas';
import { ConsentCheckbox } from './ConsentCheckbox';
import { Field } from './Field';
import { FormStatus } from './FormStatus';
import { TurnstileField } from './TurnstileField';

export function ContactForm() {
  const t = useTranslations();
  const [state, action, pending] = useActionState(submitContact, initialFormState);
  const err = (f: string) => (state.fields?.includes(f) ? t(`Forms.errors.${f}`) : undefined);

  if (state.status === 'success') return <FormStatus state={state} />;

  return (
    <form action={action} className="mt-6 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('Forms.name')} required error={err('name')}>
          <input name="name" autoComplete="name" />
        </Field>
        <Field label={t('Forms.email')} required error={err('email')}>
          <input name="email" type="email" autoComplete="email" dir="ltr" />
        </Field>
        <Field label={t('Forms.phone')} error={err('phone')}>
          <input name="phone" type="tel" autoComplete="tel" dir="ltr" />
        </Field>
        <Field label={t('Forms.subject')} error={err('subject')}>
          <input name="subject" autoComplete="off" />
        </Field>
      </div>
      <Field label={t('Forms.message')} required error={err('message')}>
        <textarea name="message" rows={6} />
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
        {pending ? t('Forms.sending') : t('Contact.submit')}
      </Button>
    </form>
  );
}
