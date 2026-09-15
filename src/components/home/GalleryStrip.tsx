import { getLocale, getTranslations } from 'next-intl/server';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { gallery } from '@/data/gallery';
import type { Locale } from '@/i18n/routing';

// Mozaik 5 görselle tam dikdörtgen olur (ilk görsel 2×2 + dört küçük, mobilde ve
// masaüstünde). İlk görsel büyük hücreye uygun, kompozisyonu güçlü bir kare seçildi.
const stripIds = ['workshop-19', 'playing-ney-seated', 'workshop-17', 'drilling-finger-holes', 'ney-rows-closeup'];

export async function GalleryStrip() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const items = stripIds
    .map((id) => gallery.find((g) => g.id === id))
    .filter((g) => g !== undefined)
    .map((g) => ({ id: g.id, src: g.image, alt: g.alt[locale] }));
  return (
    <section className="py-20 md:py-28 lg:py-32">
      <Container className="reveal">
        <SectionHeading
          eyebrow={t('Gallery.eyebrow')}
          title={t('Gallery.title')}
          description={t('Gallery.description')}
          action={
            <Button href="/galeri" variant="link" className="text-murekkep">
              {t('Home.gallery.cta')}
            </Button>
          }
        />
        <GalleryGrid items={items} layout="mosaic" />
      </Container>
    </section>
  );
}
