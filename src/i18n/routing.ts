import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tr', 'en', 'ar'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
  // Accept-Language ile otomatik yönlendirme kapalı: URL = içerik dili (SEO ve paylaşım kararlılığı)
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/ney-rehberi': { tr: '/ney-rehberi', en: '/ney-guide', ar: '/dalil-al-nay' },
    '/ney-rehberi/[slug]': { tr: '/ney-rehberi/[slug]', en: '/ney-guide/[slug]', ar: '/dalil-al-nay/[slug]' },
    '/akortlar': { tr: '/akortlar', en: '/tunings', ar: '/al-dawzan' },
    '/ney-cantasi': { tr: '/ney-cantasi', en: '/ney-case', ar: '/haqibat-al-nay' },
    '/atolye': { tr: '/atolye', en: '/workshop', ar: '/al-warsha' },
    '/galeri': { tr: '/galeri', en: '/gallery', ar: '/maarad' },
    '/basinda-biz': { tr: '/basinda-biz', en: '/press', ar: '/al-sahafa' },
    '/siparis': { tr: '/siparis', en: '/order', ar: '/talab' },
    '/iletisim': { tr: '/iletisim', en: '/contact', ar: '/ittisal' },
    '/yasal/[slug]': { tr: '/yasal/[slug]', en: '/legal/[slug]', ar: '/qanuni/[slug]' },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
export const isRtl = (locale: Locale) => locale === 'ar';
