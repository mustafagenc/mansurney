import 'server-only';
import { isDryRun } from './dry-run';

// Eksik anahtar veya ağ hatasında hata fırlatır; `handleSubmission` bunu
// yakalayıp `server` hatasına çevirir.
export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
  if (isDryRun()) return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error('TURNSTILE_SECRET_KEY tanımlı değil');
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!res.ok) return false;
  return ((await res.json()) as { success: boolean }).success;
}
