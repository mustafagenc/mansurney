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

test('http ile başlayan href harici bağlantı olarak render edilir', () => {
  render(<Button href="https://wa.me/905325930436">WhatsApp</Button>);
  const link = screen.getByRole('link', { name: 'WhatsApp' });
  expect(link.getAttribute('href')).toBe('https://wa.me/905325930436');
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.getAttribute('rel')).toBe('noopener');
});
