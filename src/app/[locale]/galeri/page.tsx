import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/ui/Container';
import { gallery, galleryCategories } from '@/data/gallery';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/galeri'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Gallery' });
  return pageMetadata({ locale, title: t('eyebrow'), description: t('description'), hrefFor: () => '/galeri' });
}

export default async function GalleryPage({ params }: PageProps<'/[locale]/galeri'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const tGallery = await getTranslations('Gallery');

  return (
    <>
      <PageHero
        title={tGallery('title')}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: tGallery('title') }]}
      />
      <Container className="py-14">
        <p className="max-w-prose text-lg text-metin-soluk">{tGallery('description')}</p>
        {galleryCategories.map((c) => {
          const items = gallery
            .filter((g) => g.category === c)
            .map((g) => ({ id: g.id, src: g.image, alt: g.alt[locale] }));
          if (items.length === 0) return null;
          return (
            <section key={c} className="mt-12">
              <h2 className="mb-6 text-2xl">{tGallery(`categories.${c}`)}</h2>
              <GalleryGrid items={items} />
            </section>
          );
        })}
      </Container>
    </>
  );
}
