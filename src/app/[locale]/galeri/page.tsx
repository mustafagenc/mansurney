import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
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
        lead={tGallery('description')}
      />
      <Container className="py-16 md:py-20">
        {galleryCategories.map((c) => {
          const items = gallery
            .filter((g) => g.category === c)
            .map((g) => ({ id: g.id, src: g.image, alt: g.alt[locale] }));
          if (items.length === 0) return null;
          return (
            <section key={c} className="reveal mt-16 first:mt-0 md:mt-20">
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-murekkep/10 pb-5">
                <div>
                  <Eyebrow>{tGallery('eyebrow')}</Eyebrow>
                  <h2 className="mt-3 text-h2">{tGallery(`categories.${c}`)}</h2>
                </div>
                <p className="text-eyebrow uppercase text-metin-soluk">{tGallery('imageCount', { count: items.length })}</p>
              </div>
              <div className="mt-10">
                <GalleryGrid items={items} />
              </div>
            </section>
          );
        })}
      </Container>
    </>
  );
}
