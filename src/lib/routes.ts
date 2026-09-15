import type { Locale } from '@/i18n/routing';
import { guideKeys, guideSlug } from '@/lib/content';
import { legalKeys, legalSlug } from '@/lib/legal-slugs';
import type { Href } from '@/lib/seo';

const staticPaths = ['/', '/ney-rehberi', '/akortlar', '/ney-cantasi', '/atolye', '/galeri', '/basinda-biz', '/siparis', '/iletisim'] as const;

export function allRoutes(): { key: string; hrefFor: (l: Locale) => Href }[] {
  return [
    ...staticPaths.map((p) => ({ key: p, hrefFor: () => p })),
    ...guideKeys.map((k) => ({
      key: `guide:${k}`,
      hrefFor: (l: Locale) => ({ pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug(k, l) } }) as const,
    })),
    ...legalKeys.map((k) => ({
      key: `legal:${k}`,
      hrefFor: (l: Locale) => ({ pathname: '/yasal/[slug]', params: { slug: legalSlug(k, l) } }) as const,
    })),
  ];
}
