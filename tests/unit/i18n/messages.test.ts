import { expect, test } from 'vitest';
import ar from '../../../messages/ar.json';
import en from '../../../messages/en.json';
import tr from '../../../messages/tr.json';

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

test('en ve ar, tr ile aynı anahtarlara sahip', () => {
  const base = keys(tr).sort();
  expect(keys(en).sort()).toEqual(base);
  expect(keys(ar).sort()).toEqual(base);
});

test('boş çeviri yok', () => {
  for (const [name, m] of Object.entries({ tr, en, ar })) {
    const empty = keys(m).filter(
      (k) => k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], m) === '',
    );
    expect(empty, name).toEqual([]);
  }
});
