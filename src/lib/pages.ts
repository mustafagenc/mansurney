import type { MDXContent } from 'mdx/types';
import { z } from 'zod';
import type { Locale } from '@/i18n/routing';

const pageMetaSchema = z.object({ title: z.string().min(1), description: z.string().min(70).max(160) });
export type PageMeta = z.infer<typeof pageMetaSchema>;

export async function loadPage(locale: Locale, key: 'case' | 'workshop') {
  const mod = (await import(`../../content/${locale}/${key}.mdx`)) as { default: MDXContent; metadata: unknown };
  return { Content: mod.default, meta: pageMetaSchema.parse(mod.metadata) };
}
