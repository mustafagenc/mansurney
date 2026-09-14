import { expect, test } from 'vitest';
import { routing } from '@/i18n/routing';
import { legalKeyFromSlug, legalKeys, legalSlug, loadLegal } from '@/lib/legal';

test('slug eşlemesi tutarlı', () => {
  for (const l of routing.locales) for (const k of legalKeys) expect(legalKeyFromSlug(l, legalSlug(k, l))).toBe(k);
});
test.each(routing.locales.flatMap((l) => legalKeys.map((k) => [l, k] as const)))(
  '%s/%s yüklenir, güncelleme tarihi var',
  async (l, k) => {
    expect((await loadLegal(l, k)).meta.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  },
);
