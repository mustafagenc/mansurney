import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/ui/Container';
import type { Locale } from '@/i18n/routing';
import { legalKeyFromSlug, legalKeys, legalSlug, loadLegal, type LegalKey } from '@/lib/legal';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  return legalKeys.map((key) => ({ slug: legalSlug(key, locale) }));
}

async function resolve(params: PageProps<'/[locale]/yasal/[slug]'>['params']) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const key = legalKeyFromSlug(locale, slug);
  if (!key) notFound();
  return { locale, key, ...(await loadLegal(locale, key)) };
}

const descriptionKey: Record<LegalKey, 'kvkkDescription' | 'privacyDescription'> = {
  kvkk: 'kvkkDescription',
  privacy: 'privacyDescription',
};

export async function generateMetadata({ params }: PageProps<'/[locale]/yasal/[slug]'>) {
  const { locale, key, meta } = await resolve(params);
  const t = await getTranslations({ locale, namespace: 'Legal' });
  const metadata = await pageMetadata({
    locale,
    title: meta.title,
    description: t(descriptionKey[key]),
    hrefFor: (l) => ({ pathname: '/yasal/[slug]', params: { slug: legalSlug(key, l) } }),
  });
  return { ...metadata, robots: { index: true, follow: true } };
}

export default async function LegalPage({ params }: PageProps<'/[locale]/yasal/[slug]'>) {
  const { locale, meta, Content } = await resolve(params);
  setRequestLocale(locale);
  const t = await getTranslations();
  const format = await getFormatter();

  return (
    <>
      <PageHero
        title={meta.title}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: meta.title }]}
      >
        <p className="text-sm text-metin-soluk">
          {t('Legal.updated', { date: format.dateTime(new Date(meta.updated), { dateStyle: 'long' }) })}
        </p>
      </PageHero>
      {/* Yasal metinlerde Phase 1 drop cap kapatılır (bkz. `.no-dropcap`, globals.css sonu). */}
      <Container className="no-dropcap py-14 md:py-20">
        <article>
          <Content />
        </article>
      </Container>
    </>
  );
}
