import type { MDXContent } from 'mdx/types';
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';
import { legalKeyFromSlug, legalKeys, legalSlug, type LegalKey } from './legal-slugs';

export { legalKeyFromSlug, legalKeys, legalSlug };
export type { LegalKey };

const metaSchema = z.object({ title: z.string().min(1), updated: z.iso.date() });

export async function loadLegal(locale: Locale, key: LegalKey) {
  const mod = (await import(`../../content/${locale}/legal/${key}.mdx`)) as { default: MDXContent; metadata: unknown };
  return { Content: mod.default, meta: metaSchema.parse(mod.metadata) };
}
