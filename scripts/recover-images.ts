import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { imageSources } from './image-sources';

const OUT = 'assets-src';
const missing: string[] = [];

for (const { url, out } of imageSources) {
  const res = await fetch(url, { redirect: 'follow' });
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || !type.startsWith('image/')) {
    missing.push(`${res.status} ${type} ${url}`);
    continue;
  }
  const file = join(OUT, out);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log('✔', out);
  await new Promise((r) => setTimeout(r, 300)); // sunucuya nazik davran
}

if (missing.length) {
  console.warn('\nİndirilemeyenler (yeniden çekim listesine ekle):\n' + missing.join('\n'));
}
