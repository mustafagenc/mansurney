import 'server-only';

export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  if (process.env.FORMS_DRY_RUN === '1') return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error('TURNSTILE_SECRET_KEY tanımlı değil');
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!res.ok) return false;
  return ((await res.json()) as { success: boolean }).success;
}
