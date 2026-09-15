import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import exteriorImage from '@/assets/images/workshop/shop-exterior.jpg';
import interiorImage from '@/assets/images/workshop/shop-interior.jpg';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { business } from '@/config/business';
import type { Locale } from '@/i18n/routing';
import { loadPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/atolye'>) {
  const locale = (await params).locale as Locale;
  const { meta } = await loadPage(locale, 'workshop');
  return pageMetadata({
    locale,
    title: meta.title,
    description: meta.description,
    image: exteriorImage,
    hrefFor: () => '/atolye',
  });
}

export default async function WorkshopPage({ params }: PageProps<'/[locale]/atolye'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { Content, meta } = await loadPage(locale, 'workshop');
  return (
    <>
      <PageHero
        title={meta.title}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: meta.title }]}
        lead={meta.description}
      />
      <Container className="reveal py-16 md:py-20">
        {/* İki sütunlu metin (spec §4.3): MDX'teki başlık+paragraf çiftleri masaüstünde
            sütun öncelikli ızgaraya yerleşir; böylece iki başlık aynı satırda hizalanır. */}
        <div className="[&>.prose-editorial]:max-w-none md:[&>.prose-editorial]:grid md:[&>.prose-editorial]:grid-flow-col md:[&>.prose-editorial]:grid-cols-2 md:[&>.prose-editorial]:grid-rows-[auto_auto] md:[&>.prose-editorial]:gap-x-14 lg:[&>.prose-editorial]:gap-x-16 md:[&>.prose-editorial>h2]:mt-0">
          <Content />
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
          <Image
            src={exteriorImage}
            alt={t('Workshop.exteriorAlt')}
            placeholder="blur"
            sizes="(min-width:768px) 40vw, 100vw"
            className="aspect-4/5 w-full rounded-kart object-cover md:col-span-5"
          />
          <Image
            src={interiorImage}
            alt={t('Workshop.interiorAlt')}
            placeholder="blur"
            sizes="(min-width:768px) 58vw, 100vw"
            className="aspect-3/2 w-full rounded-kart object-cover md:col-span-7"
          />
        </div>
        {business.master.consent && (
          <p className="mt-10 text-sm text-metin-soluk">
            <span className="font-semibold text-murekkep">{t('Workshop.master')}:</span> {business.master.name}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/galeri" variant="secondary" className="text-murekkep">
            {t('Nav.gallery')}
          </Button>
          <Button href="/siparis" variant="primary">
            {t('Guide.orderCtaButton')}
          </Button>
        </div>
      </Container>
    </>
  );
}
