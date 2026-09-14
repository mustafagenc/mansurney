import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const MARKERS = ['ÇEVİRİ-TASLAK', 'HUKUK-ONAYI-BEKLİYOR'];

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

export async function findLaunchBlockers(root: string): Promise<string[]> {
  const blockers: string[] = [];
  for await (const file of walk(join(root, 'content'))) {
    const text = await readFile(file, 'utf8');
    for (const marker of MARKERS) {
      if (text.includes(marker)) blockers.push(`${marker}: ${relative(root, file)}`);
    }
  }
  return blockers;
}

// Robust "is this module the entry point" check (works with tsx under `"type": "module"`
// on macOS paths, including ones with spaces or non-ASCII characters, unlike a naive
// `file://${process.argv[1]}` string concatenation).
const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const root = process.cwd();
  const blockers = await findLaunchBlockers(root);

  const { business } = await import('../src/config/business');
  if (business.geo === null) {
    blockers.push('business.geo boş (harita ve LocalBusiness geo eksik)');
  }
  if (Object.values(business.social).every((value) => value === null)) {
    console.warn('uyarı: hiç sosyal hesap tanımlı değil');
  }
  if (!business.master.consent) {
    console.warn('uyarı: usta adı onayı (master.consent) henüz alınmadı');
  }

  if (blockers.length) {
    console.error('Yayın engelleri:\n- ' + blockers.join('\n- '));
    process.exit(1);
  }
  console.log('✔ Yayın öncesi kontrol temiz');
}
