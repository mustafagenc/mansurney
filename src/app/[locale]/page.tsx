import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AboutTeaser } from '@/components/home/AboutTeaser';
import { CoupletBand } from '@/components/home/CoupletBand';
import { GalleryStrip } from '@/components/home/GalleryStrip';
import { GuideGrid } from '@/components/home/GuideGrid';
import { Hero } from '@/components/home/Hero';
import { OrderBand } from '@/components/home/OrderBand';
import { TuningsTeaser } from '@/components/home/TuningsTeaser';
import { JsonLd } from '@/components/JsonLd';
import type { Locale } from '@/i18n/routing';
import { localBusinessLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale });
  const meta = await pageMetadata({
    locale,
    title: t('Home.metaTitle'),
    description: t('Meta.defaultDescription'),
    hrefFor: () => '/',
  });
  return { ...meta, title: { absolute: `${t('Meta.siteName')} — ${t('Home.metaTitle')}` } };
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return (
    <>
      <JsonLd data={localBusinessLd(locale, t('defaultDescription'))} />
      <Hero />
      <CoupletBand />
      <AboutTeaser />
      <GuideGrid />
      <TuningsTeaser />
      <GalleryStrip />
      <OrderBand />
    </>
  );
}
