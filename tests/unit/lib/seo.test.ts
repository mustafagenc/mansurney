import { expect, test } from 'vitest';
import { buildAlternates } from '@/lib/seo';

test('hreflang: her dil + x-default, canonical mevcut dil', () => {
  const alt = buildAlternates('en', () => '/iletisim');
  expect(alt?.canonical).toBe('/en/contact');
  expect(alt?.languages).toEqual({ tr: '/iletisim', en: '/en/contact', ar: '/ar/ittisal', 'x-default': '/iletisim' });
});
