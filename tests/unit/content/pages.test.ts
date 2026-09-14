import { expect, test } from 'vitest';
import { routing } from '@/i18n/routing';
import { loadPage } from '@/lib/pages';

test.each(
  routing.locales.flatMap((l) => (['case', 'workshop'] as const).map((k) => [l, k] as const)),
)('%s/%s yüklenir', async (locale, key) => {
  const { meta } = await loadPage(locale, key);
  expect(meta.title.length).toBeGreaterThan(0);
  expect(meta.description.length).toBeGreaterThanOrEqual(70);
});
