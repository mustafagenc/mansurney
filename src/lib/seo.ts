import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

// Derived from `getPathname`'s own parameter type (rather than `Link`'s `href`
// prop) because next-intl 4's `Link` and `getPathname` types diverge slightly
// on the `{ pathname; query }` object-literal shape (`query`'s `null` variant
// in `UrlObject` vs. next-intl's stricter `QueryParams`) — using the type
// `getPathname` actually accepts avoids that mismatch while every value we
// pass here (route literals, `{ pathname, params }` objects) is equally valid
// as a `Link` href.
export type Href = Parameters<typeof getPathname>[0]['href'];

export function buildAlternates(locale: Locale, hrefFor: (l: Locale) => Href): Metadata['alternates'] {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, getPathname({ locale: l, href: hrefFor(l) })]),
  ) as Record<Locale, string>;
  return { canonical: languages[locale], languages: { ...languages, 'x-default': languages[routing.defaultLocale] } };
}

export async function pageMetadata(args: {
  locale: Locale;
  title: string;
  description: string;
  hrefFor: (l: Locale) => Href;
  image?: StaticImageData;
}): Promise<Metadata> {
  const t = await getTranslations({ locale: args.locale, namespace: 'Meta' });
  const alternates = buildAlternates(args.locale, args.hrefFor);
  return {
    title: `${args.title} — ${t('siteName')}`,
    description: args.description,
    alternates,
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      locale: { tr: 'tr_TR', en: 'en_US', ar: 'ar_AR' }[args.locale],
      url: alternates?.canonical as string,
      title: args.title,
      description: args.description,
      images: args.image ? [{ url: args.image.src, width: args.image.width, height: args.image.height }] : undefined,
    },
  };
}
