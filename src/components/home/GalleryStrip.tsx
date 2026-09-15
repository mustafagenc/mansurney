import { getLocale, getTranslations } from 'next-intl/server';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { gallery } from '@/data/gallery';
import type { Locale } from '@/i18n/routing';

export async function GalleryStrip() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const items = gallery.slice(0, 8).map((g) => ({ id: g.id, src: g.image, alt: g.alt[locale] }));
  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow={t('Gallery.eyebrow')} title={t('Gallery.title')} />
        <GalleryGrid items={items} />
        <div className="mt-10 text-center">
          <Button href="/galeri" variant="primary">
            {t('Home.gallery.cta')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
