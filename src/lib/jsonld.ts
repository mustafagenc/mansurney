import type { Article, BreadcrumbList, DayOfWeek, FAQPage, MusicStore, WithContext } from 'schema-dts';
import heroImage from '@/assets/images/hero/reeds-28.jpg';
import { business } from '@/config/business';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Faq } from './content';

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.vercel.app';
const abs = (path: string) => new URL(path, site).toString();

const dayNames: Record<(typeof business.openingHours)[number]['days'][number], DayOfWeek> = {
  Mo: 'https://schema.org/Monday',
  Tu: 'https://schema.org/Tuesday',
  We: 'https://schema.org/Wednesday',
  Th: 'https://schema.org/Thursday',
  Fr: 'https://schema.org/Friday',
  Sa: 'https://schema.org/Saturday',
  Su: 'https://schema.org/Sunday',
};

export const breadcrumbLd = (items: { name: string; path: string }[]): WithContext<BreadcrumbList> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});

export const articleLd = (a: {
  title: string;
  description: string;
  path: string;
  image: string;
  updated: string;
  inLanguage: string;
}): WithContext<Article> => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.title,
  description: a.description,
  image: abs(a.image),
  dateModified: a.updated,
  inLanguage: a.inLanguage,
  mainEntityOfPage: abs(a.path),
  publisher: { '@type': 'Organization', name: 'Mansur Ney', url: site },
});

export const faqLd = (faq: Faq[]): WithContext<FAQPage> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const localBusinessLd = (locale: Locale, description: string): WithContext<MusicStore> => ({
  '@context': 'https://schema.org',
  '@type': 'MusicStore',
  '@id': `${site}/#business`,
  name: business.name,
  description,
  // schema-dts's `MusicStore` (a `LocalBusiness`) has no `inLanguage`
  // property — that's a `CreativeWork` field, not one `LocalBusinessBase`
  // exposes — so the page's locale is expressed instead through `url`,
  // pointing at this locale's homepage rather than the bare site root.
  url: abs(getPathname({ locale, href: '/' })),
  telephone: business.phone,
  email: business.email,
  foundingDate: String(business.foundingYear),
  // `[locale]/opengraph-image.jpg` is a route-segment file convention, not a
  // real asset served at `/opengraph-image.jpg` on the site root, so the hero
  // photo's own resolved (hashed, absolute) URL is used instead.
  image: abs(heroImage.src),
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.locality,
    addressRegion: business.address.region,
    ...(business.address.postalCode ? { postalCode: business.address.postalCode } : {}),
    addressCountry: business.address.country,
  },
  ...(business.geo ? { geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng } } : {}),
  openingHoursSpecification: business.openingHours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days.map((d) => dayNames[d]),
    opens: h.opens,
    closes: h.closes,
  })),
  ...sameAs(),
});

function sameAs(): { sameAs?: string[] } {
  const urls = Object.values(business.social).filter((u): u is string => u !== null);
  return urls.length > 0 ? { sameAs: urls } : {};
}
