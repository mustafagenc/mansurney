import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';
import { getTranslations } from 'next-intl/server';
import heroImage from '@/assets/images/hero/reeds-28.jpg';
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
  // Next.js metadata merging is shallow and per-key: a segment that defines
  // its own `openGraph` object fully replaces — rather than deep-merges with
  // — an ancestor segment's `openGraph` (see "Merging" /
  // "Overwriting fields" in generate-metadata.md). Since every page here
  // returns its own `openGraph` via this helper, none of them actually
  // inherit `[locale]/opengraph-image.jpg`'s image (only the sibling
  // `[locale]/page.tsx` home route would, being resolved at that same
  // segment) — so every call must set its own `images`, falling back to the
  // hero photo when the page has no cover of its own.
  const image = args.image ?? heroImage;
  return {
    // `[locale]/layout.tsx`'in `title.template`'i (`%s — Mansur Ney`) site adını
    // ekler; burada tekrar eklenirse başlık "X — Mansur Ney — Mansur Ney" olur.
    title: args.title,
    description: args.description,
    alternates,
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      locale: { tr: 'tr_TR', en: 'en_US', ar: 'ar_AR' }[args.locale],
      url: alternates?.canonical as string,
      title: args.title,
      description: args.description,
      images: [{ url: image.src, width: image.width, height: image.height }],
    },
  };
}
