import type { ReactNode } from 'react';
import { vi } from 'vitest';

// Only `Link` is mocked (it needs a Next.js router context we don't have in
// jsdom); every other export — notably `getPathname`, used by `buildAlternates`
// in src/lib/seo.ts — is the real next-intl implementation, which is a pure
// function of locale/href and works fine outside a request context.
vi.mock('@/i18n/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/i18n/navigation')>()),
  Link: (p: { href: string; children: ReactNode; className?: string }) => (
    <a href={p.href} className={p.className}>
      {p.children}
    </a>
  ),
}));
