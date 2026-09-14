'use server';

import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getMailer } from '@/lib/forms/mailer';
import { contactSchema, type FormState } from '@/lib/forms/schemas';
import { handleSubmission } from '@/lib/forms/submit';
import { contactMail } from '@/lib/forms/templates';
import { verifyTurnstile } from '@/lib/forms/turnstile';

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  const ip = h.get('cf-connecting-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const locale = (await getLocale()) as Locale;
  return handleSubmission({
    formData,
    schema: contactSchema,
    verify: (token) => verifyTurnstile(token, ip),
    mailer: getMailer(),
    toMail: (data) => contactMail(data, locale),
  });
}
