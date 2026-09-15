import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideList } from '@/components/guide/GuideList';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/ui/Container';
import type { Locale } from '@/i18n/routing';
import { getGuideList } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/ney-rehberi'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Guide' });
  return pageMetadata({ locale, title: t('eyebrow'), description: t('description'), hrefFor: () => '/ney-rehberi' });
}

export default async function GuideHub({ params }: PageProps<'/[locale]/ney-rehberi'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const guides = await getGuideList(locale);
  return (
    <>
      <PageHero
        title={t('Guide.title')}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: t('Guide.eyebrow') }]}
        lead={t('Guide.description')}
      />
      <Container className="reveal py-16 md:py-20">
        <GuideList items={guides} headingLevel="h2" />
      </Container>
    </>
  );
}
