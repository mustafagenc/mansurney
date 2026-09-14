import type { Article, BreadcrumbList, FAQPage, WithContext } from 'schema-dts';
import type { Faq } from './content';

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mansurney.com';
const abs = (path: string) => new URL(path, site).toString();

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
