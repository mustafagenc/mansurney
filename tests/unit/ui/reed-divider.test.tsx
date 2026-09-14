import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ReedDivider } from '@/components/ui/ReedDivider';

test('dekoratif olarak ekran okuyuculardan gizlenir', () => {
  const { container } = render(<ReedDivider />);
  expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
});
