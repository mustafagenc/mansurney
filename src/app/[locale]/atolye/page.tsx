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
      <PageHero
        title={meta.title}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: meta.title }]}
        lead={meta.description}
      />
      <Container className="reveal py-16 md:py-20">
        <Image
          src={aboutImage}
          alt={t('Workshop.aboutAlt')}
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          sizes="(min-width:1280px) 1184px, 100vw"
          className="aspect-[16/9] w-full rounded-kart object-cover"
        />
        {/* İki sütunlu metin (spec §4.3): tek akan MDX metni CSS `columns` ile
            ikiye bölünür; `prose-editorial`in okuma genişliği burada kaldırılır. */}
        <div className="mt-12 md:columns-2 md:gap-14 lg:gap-16 [&>.prose-editorial]:max-w-none">
          <Content />
        </div>
        <div className="mt-14 md:ms-auto md:w-10/12">
          <Image
            src={interiorImage}
            alt={t('Workshop.interiorAlt')}
            placeholder="blur"
            sizes="(min-width:768px) 66vw, 100vw"
            className="aspect-[3/2] w-full rounded-kart object-cover"
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
