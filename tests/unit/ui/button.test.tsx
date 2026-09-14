import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { Button } from '@/components/ui/Button';

test('href verilince link, verilmezse button render eder', () => {
  render(
    <>
      <Button href="/siparis">Sipariş</Button>
      <Button type="submit">Gönder</Button>
    </>,
  );
  expect(screen.getByRole('link', { name: 'Sipariş' }).getAttribute('href')).toBe('/siparis');
  expect(screen.getByRole('button', { name: 'Gönder' })).toBeTruthy();
});
