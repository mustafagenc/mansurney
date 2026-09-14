import { describe, expect, test, vi } from 'vitest';
import { orderSchema } from '@/lib/forms/schemas';
import { handleSubmission } from '@/lib/forms/submit';

const fd = (o: Record<string, string>) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
const valid = { name: 'Ali Veli', phone: '05325930436', email: '', tuning: 'kiz', quantity: '1', note: '', consent: 'on', website: '', 'cf-turnstile-response': 'tok' };

function setup(overrides: { verify?: boolean; sendError?: boolean } = {}) {
  const mailer = { send: vi.fn(async () => { if (overrides.sendError) throw new Error('down'); }) };
  const verify = vi.fn(async () => overrides.verify ?? true);
  const run = (data: Record<string, string>) =>
    handleSubmission({ formData: fd(data), schema: orderSchema, verify, mailer, toMail: (d) => ({ subject: d.name, text: 'x' }) });
  return { mailer, verify, run };
}

describe('handleSubmission', () => {
  test('geçerli form → e-posta gönderilir, success', async () => {
    const { run, mailer, verify } = setup();
    expect(await run(valid)).toEqual({ status: 'success' });
    expect(verify).toHaveBeenCalledWith('tok');
    expect(mailer.send).toHaveBeenCalledOnce();
  });

  test('honeypot dolu → sessizce success, e-posta yok, captcha çağrılmaz', async () => {
    const { run, mailer, verify } = setup();
    expect(await run({ ...valid, website: 'http://spam' })).toEqual({ status: 'success' });
    expect(mailer.send).not.toHaveBeenCalled();
    expect(verify).not.toHaveBeenCalled();
  });

  test('doğrulama hatası → hatalı alan adları döner', async () => {
    const { run, mailer } = setup();
    const res = await run({ ...valid, phone: 'abc', consent: '' });
    expect(res.status).toBe('error');
    expect(res.error).toBe('validation');
    expect(res.fields).toEqual(expect.arrayContaining(['phone', 'consent']));
    expect(mailer.send).not.toHaveBeenCalled();
  });

  test('turnstile başarısız → captcha hatası', async () => {
    const { run, mailer } = setup({ verify: false });
    expect(await run(valid)).toEqual({ status: 'error', error: 'captcha' });
    expect(mailer.send).not.toHaveBeenCalled();
  });

  test('e-posta servisi hata verirse server hatası', async () => {
    const { run } = setup({ sendError: true });
    expect(await run(valid)).toEqual({ status: 'error', error: 'server' });
  });
});
