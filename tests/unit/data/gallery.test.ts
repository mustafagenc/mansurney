import { expect, test } from 'vitest';
import { gallery, galleryCategories } from '@/data/gallery';
import { routing } from '@/i18n/routing';

test('her görselin her dilde anlamlı alt metni var', () => {
  for (const item of gallery) for (const l of routing.locales) expect(item.alt[l].trim().length, `${item.id}/${l}`).toBeGreaterThan(5);
});
test('id’ler benzersiz, kategoriler geçerli', () => {
  expect(new Set(gallery.map((g) => g.id)).size).toBe(gallery.length);
  for (const g of gallery) expect(galleryCategories).toContain(g.category);
});
