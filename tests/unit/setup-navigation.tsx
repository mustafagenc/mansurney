import type { ReactNode } from 'react';
import { vi } from 'vitest';

vi.mock('@/i18n/navigation', () => ({
  Link: (p: { href: string; children: ReactNode; className?: string }) => (
    <a href={p.href} className={p.className}>
      {p.children}
    </a>
  ),
}));
