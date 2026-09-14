import type { z } from 'zod';
import type { Mail, Mailer } from './mailer';
import type { FormState } from './schemas';

export async function handleSubmission<S extends z.ZodType>(args: {
  formData: FormData;
  schema: S;
  verify: (token: string | null) => Promise<boolean>;
  mailer: Mailer;
  toMail: (data: z.infer<S>) => Mail;
}): Promise<FormState> {
  const raw = Object.fromEntries(args.formData.entries());

  // Bot honeypot'u doldurduysa başarılı görün ama hiçbir şey yapma.
  if (typeof raw.website === 'string' && raw.website !== '') return { status: 'success' };

  const parsed = args.schema.safeParse(raw);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
    return { status: 'error', error: 'validation', fields };
  }

  const token = typeof raw['cf-turnstile-response'] === 'string' ? raw['cf-turnstile-response'] : null;
  if (!(await args.verify(token))) return { status: 'error', error: 'captcha' };

  try {
    await args.mailer.send(args.toMail(parsed.data));
  } catch (err) {
    console.error('[forms] e-posta gönderilemedi', err);
    return { status: 'error', error: 'server' };
  }
  return { status: 'success' };
}
