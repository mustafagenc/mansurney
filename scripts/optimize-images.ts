import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import sharp from 'sharp';
import { clientPhotos } from './client-photos';

const SRC = 'assets-src';
const OUT = 'src/assets/images';
const MAX_BYTES = 450 * 1024;

async function* walk(dir: string): AsyncGenerator<string> {
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function optimize(source: string, target: string) {
  await mkdir(dirname(target), { recursive: true });
  if (extname(source).toLowerCase() === '.svg') {
    await copyFile(source, target);
    console.log('✔', target);
    return;
  }
  const maxWidth = target.replace(/\\/g, '/').includes('/hero/') ? 2400 : 1600;
  await sharp(source).rotate().resize({ width: maxWidth, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(target);

  const { size } = await stat(target);
  if (size > MAX_BYTES) {
    // 450 KB üstü kalan dosyalar için kaliteyi düşürerek yeniden dene (Adım 8)
    await sharp(source).rotate().resize({ width: maxWidth, withoutEnlargement: true }).jpeg({ quality: 70, mozjpeg: true }).toFile(target);
    console.log('✔', target, '(quality 70 — 450 KB üstü nedeniyle)');
  } else {
    console.log('✔', target);
  }
}

// 1) Canlı siteden çekilen görseller (assets-src/**)
if (existsSync(SRC)) {
  for await (const file of walk(SRC)) {
    const rel = relative(SRC, file);
    const target = join(OUT, rel).replace(/\.(jpe?g|png)$/i, '.jpg');
    await optimize(file, target);
  }
} else {
  console.warn(`⚠ ${SRC} bulunamadı — önce "pnpm images:recover" çalıştırın.`);
}

// 2) Sahibin eklediği gerçek atölye fotoğrafları (assets/**, yerinde okunur — R9/R26)
for (const { from, out } of clientPhotos) {
  const target = join(OUT, out);
  await optimize(from, target);
}
