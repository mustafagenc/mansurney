import { describe, expect, test } from 'vitest';
import { routing } from '@/i18n/routing';
import { getGuideList, guideKeyFromSlug, guideKeys, guideSlug, loadGuide } from '@/lib/content';

describe('rehber içeriği', () => {
  test.each(routing.locales.flatMap((l) => guideKeys.map((k) => [l, k] as const)))(
    '%s/%s yüklenir ve metadata geçerli',
    async (locale, key) => {
      const { meta, Content } = await loadGuide(locale, key);
      expect(typeof Content).toBe('function');
      expect(meta.description.length).toBeGreaterThanOrEqual(70);
      expect(meta.description.length).toBeLessThanOrEqual(160);
    },
  );

  test('slug ↔ key dönüşümü tutarlı ve dil içinde benzersiz', () => {
    for (const locale of routing.locales) {
      const slugs = guideKeys.map((k) => guideSlug(k, locale));
      expect(new Set(slugs).size).toBe(slugs.length);
      for (const k of guideKeys) expect(guideKeyFromSlug(locale, guideSlug(k, locale))).toBe(k);
    }
    expect(guideKeyFromSlug('en', 'tarihce')).toBeNull();
  });

  test('liste sabit sırada döner', async () => {
    expect((await getGuideList('tr')).map((g) => g.key)).toEqual(['history', 'making', 'anatomy', 'care']);
  });

  test('bakım rehberinde SSS var', async () => {
    for (const locale of routing.locales) expect((await loadGuide(locale, 'care')).faq.length).toBeGreaterThanOrEqual(2);
  });
});
