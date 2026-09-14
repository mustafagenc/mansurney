import type { MDXContent } from 'mdx/types';
import type { StaticImageData } from 'next/image';
import { z } from 'zod';
import { routing, type Locale } from '@/i18n/routing';

export const guideKeys = ['history', 'making', 'anatomy', 'care'] as const;
export type GuideKey = (typeof guideKeys)[number];

const slugs: Record<GuideKey, Record<Locale, string>> = {
  history: { tr: 'tarihce', en: 'history', ar: 'tarikh' },
  making: { tr: 'yapimi', en: 'making', ar: 'sinaa' },
  anatomy: { tr: 'bolumleri', en: 'anatomy', ar: 'ajza' },
  care: { tr: 'bakimi', en: 'care', ar: 'siyana' },
};

export const guideSlug = (key: GuideKey, locale: Locale) => slugs[key][locale];
export const guideKeyFromSlug = (locale: Locale, slug: string): GuideKey | null =>
  guideKeys.find((k) => slugs[k][locale] === slug) ?? null;

const image = z.custom<StaticImageData>((v) => typeof v === 'object' && v !== null && 'src' in v && 'width' in v);

const guideMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(70).max(160),
  cover: image,
  coverAlt: z.string().min(1),
  updated: z.iso.date(),
});
const faqSchema = z.array(z.object({ q: z.string().min(1), a: z.string().min(1) }));

export type GuideMeta = z.infer<typeof guideMetaSchema>;
export type Faq = z.infer<typeof faqSchema>[number];

export async function loadGuide(locale: Locale, key: GuideKey) {
  const mod = (await import(`../../content/${locale}/guide/${key}.mdx`)) as {
    default: MDXContent;
    metadata: unknown;
    faq?: unknown;
  };
  return { Content: mod.default, meta: guideMetaSchema.parse(mod.metadata), faq: faqSchema.parse(mod.faq ?? []) };
}

export async function getGuideList(locale: Locale) {
  return Promise.all(
    guideKeys.map(async (key) => ({ key, slug: guideSlug(key, locale), meta: (await loadGuide(locale, key)).meta })),
  );
}

export const allGuideParams = () =>
  routing.locales.flatMap((locale) => guideKeys.map((key) => ({ locale, slug: guideSlug(key, locale) })));
