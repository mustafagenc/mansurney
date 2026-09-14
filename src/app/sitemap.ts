import type { MetadataRoute } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { allRoutes } from '@/lib/routes';

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().flatMap((route) => {
    const languages = Object.fromEntries(
      routing.locales.map((l) => [l, site + getPathname({ locale: l, href: route.hrefFor(l) })]),
    );
    return routing.locales.map((l) => ({
      url: languages[l]!,
      changeFrequency: 'monthly' as const,
      priority: route.key === '/' ? 1 : route.key === '/siparis' ? 0.9 : 0.7,
      alternates: { languages },
    }));
  });
}
