'use server';

import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { getMailer } from '@/lib/forms/mailer';
import { orderSchema, type FormState } from '@/lib/forms/schemas';
import { handleSubmission } from '@/lib/forms/submit';
import { orderMail } from '@/lib/forms/templates';
import { verifyTurnstile } from '@/lib/forms/turnstile';

export async function submitOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  // Vercel `x-real-ip`'yi kendisi yazar (istemci taklit edemez); ardından ilk
  // `x-forwarded-for` girdisi, en son Cloudflare proxy'si varsa `cf-connecting-ip`.
  const ip =
    h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? h.get('cf-connecting-ip') ?? null;
  const locale = (await getLocale()) as Locale;
  return handleSubmission({
    formData,
    schema: orderSchema,
    verify: (token) => verifyTurnstile(token, ip),
    // `getMailer()` ortam değişkenlerini okumaz/atmaz; Resend istemcisi ilk
    // `send` çağrısında, `handleSubmission`'ın `try` bloğu içinde kurulur.
    mailer: getMailer(),
    toMail: (data) => orderMail(data, locale),
  });
}
