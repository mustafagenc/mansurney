import { expect, test } from 'vitest';
import { isTuningKey, tuningKeys, tunings } from '@/data/tunings';

test('mevcut sipariş formundaki 8 akort, aynı sırayla', () => {
  expect(tunings.map((t) => t.name)).toEqual([
    'Bolâhenk',
    'Süpürde',
    'Mansur',
    'Kız',
    'Müstahsen',
    'Şah',
    'Davud',
    'Bolâhenk Nısfiye',
  ]);
  expect(tunings.map((t) => t.key)).toEqual([...tuningKeys]);
});

test('teknik bilgi ya ustadan gelmiş gerçek değer ya da null (uydurma yok)', () => {
  for (const t of tunings) expect(t.lengthCm === null || (t.lengthCm > 20 && t.lengthCm < 130)).toBe(true);
});

test('isTuningKey', () => {
  expect(isTuningKey('kiz')).toBe(true);
  expect(isTuningKey('Kız')).toBe(false);
});
