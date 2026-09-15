import Link from 'next/link';
import { fontVariables } from '@/lib/fonts';
import './globals.css';

// Yereldışı (locale dışı) yollar için son çare 404 — `[locale]/layout.tsx`
// devreye girmediğinden burada aynı tema (font, renk) doğrudan yüklenir.
export default function RootNotFound() {
  return (
    <html lang="tr" className={fontVariables}>
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-kagit px-6 text-center text-metin">
        <p className="font-display text-display text-altin-koyu">404</p>
        <Link href="/" className="link-underline font-semibold text-murekkep">
          mansurney.com
        </Link>
      </body>
    </html>
  );
}
