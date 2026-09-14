import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import aboutImage from '@/assets/images/workshop/about.jpg';
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
    image: aboutImage,
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
      <PageHero title={meta.title} breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: meta.title }]} />
      <Container className="py-14">
        <Image
          src={aboutImage}
          alt={t('Workshop.aboutAlt')}
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width:1024px) 760px, 100vw"
          className="rounded-kart"
        />
        <div className="mt-8 max-w-prose text-lg">
          <Content />
        </div>
        <Image
          src={interiorImage}
          alt={t('Workshop.interiorAlt')}
          placeholder="blur"
          sizes="(min-width:1024px) 760px, 100vw"
          className="mt-8 rounded-kart"
        />
        {business.master.consent && (
          <p className="mt-8 text-lg">
            {t('Workshop.master')}: {business.master.name}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/galeri" variant="green">
            {t('Nav.gallery')}
          </Button>
          <Button href="/siparis">{t('Guide.orderCtaButton')}</Button>
        </div>
      </Container>
    </>
  );
}
