import type { z } from 'zod';
import type { Mail, Mailer } from './mailer';
import type { FormState } from './schemas';

// Kullanıcıya geri döndürülmeyecek alanlar: honeypot, Turnstile token'ı ve
// Next.js'in ilerlemeli iyileştirme için eklediği `$ACTION_*` alanları.
const omitFromValues = (key: string) => key === 'website' || key === 'cf-turnstile-response' || key.startsWith('$');

function echoValues(raw: Record<string, FormDataEntryValue>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(raw)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && !omitFromValues(entry[0]))
      .map(([k, v]) => [k, v.slice(0, 5000)]),
  );
}

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

  const values = echoValues(raw);

  const parsed = args.schema.safeParse(raw);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
    return { status: 'error', error: 'validation', fields, values };
  }

  const token = typeof raw['cf-turnstile-response'] === 'string' ? raw['cf-turnstile-response'] : null;
  try {
    if (!(await args.verify(token))) return { status: 'error', error: 'captcha', values };
  } catch (err) {
    console.error('[forms] Turnstile doğrulaması yapılamadı', err instanceof Error ? err.message : err);
    return { status: 'error', error: 'server', values };
  }

  try {
    await args.mailer.send(args.toMail(parsed.data));
  } catch (err) {
    console.error('[forms] e-posta gönderilemedi', err instanceof Error ? err.message : err);
    return { status: 'error', error: 'server', values };
  }
  return { status: 'success' };
}
