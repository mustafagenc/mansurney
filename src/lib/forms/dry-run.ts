import 'server-only';

let warned = false;

// `FORMS_DRY_RUN=1` yalnızca yerel/e2e testler içindir: e-posta gönderilmez ve
// Turnstile atlanır. Vercel Production'da bayrak yanlışlıkla tanımlansa bile
// yok sayılır — aksi halde formlar sessizce hiçbir yere gitmez ve bot koruması kapanır.
export function isDryRun(): boolean {
  if (process.env.FORMS_DRY_RUN !== '1') return false;
  if (process.env.VERCEL_ENV === 'production') {
    if (!warned) {
      console.error('[forms] FORMS_DRY_RUN production ortamında tanımlı; yok sayılıyor.');
      warned = true;
    }
    return false;
  }
  return true;
}
