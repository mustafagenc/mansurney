import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { isRtl, routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { Analytics } from "@vercel/analytics/next";
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Statik: dile bağlı değil, bu yüzden `generateViewport` yerine düz `viewport` export'u
// (bkz. node_modules/next/dist/docs/.../generate-viewport.md).
export const viewport: Viewport = {
  themeColor: '#10201b',
};

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.vercel.app'),
    title: { default: `${t('siteName')} — ${t('tagline')}`, template: `%s — ${t('siteName')}` },
    description: t('defaultDescription'),
    // Hafif PWA: yalnızca "ana ekrana ekle" (bkz. src/app/manifest.ts) — service worker yok.
    manifest: '/manifest.webmanifest',
    appleWebApp: { title: t('siteName'), statusBarStyle: 'default' },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'} className={fontVariables} data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider>
          <Analytics />
          <GoogleAnalytics />
          <Header />
          <main id="icerik">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
