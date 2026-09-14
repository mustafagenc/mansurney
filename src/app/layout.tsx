import type { ReactNode } from 'react';

// next-intl pattern: the root layout is a pass-through with no <html>/<body>,
// so that src/app/not-found.tsx (which renders its own <html>) is valid while
// src/app/[locale]/layout.tsx owns the real <html>/<body> per-locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
