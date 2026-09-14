import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { expect, test } from 'vitest';

const ROOT = 'src/assets/images';
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));

test('optimize görsel klasörü boş değil', () => expect(walk(ROOT).length).toBeGreaterThan(0));

test.each(walk(ROOT).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)))('%s ≤ 450 KB ve ≤ 2400 px', async (file) => {
  expect(statSync(file).size).toBeLessThanOrEqual(450 * 1024);
  const { width = 0 } = await sharp(file).metadata();
  expect(width).toBeLessThanOrEqual(2400);
});
