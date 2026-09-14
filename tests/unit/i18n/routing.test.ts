import { describe, expect, test } from 'vitest';
import { isRtl, routing } from '@/i18n/routing';

describe('routing', () => {
  test('her pathname her dil için tanımlı', () => {
    for (const [key, value] of Object.entries(routing.pathnames)) {
      if (typeof value === 'string') continue; // '/' gibi ortak yollar
      expect(Object.keys(value).sort(), key).toEqual([...routing.locales].sort());
    }
  });

  test('bir dil içinde iki rota aynı dış yolu kullanamaz', () => {
    for (const locale of routing.locales) {
      const paths = Object.values(routing.pathnames).map((v) => (typeof v === 'string' ? v : v[locale]));
      expect(new Set(paths).size, locale).toBe(paths.length);
    }
  });

  test('yalnızca ar sağdan sola', () => {
    expect(routing.locales.filter(isRtl)).toEqual(['ar']);
  });
});
