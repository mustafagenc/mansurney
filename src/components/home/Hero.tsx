import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import heroImage from '@/assets/images/hero/reeds-28.jpg';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

// Spec §4.2.1: 7/5 bölünme — solda dev başlık (vurgu kelimesi italik altın), italik
// beyit cümlesi, kısa açıklama ve iki buton; sağda dikey oranlı görsel + altyazı.
// Mobilde DOM sırası gereği metin önce, görsel sonra gelir.
export async function Hero() {
  const t = await getTranslations();
  return (
    <section id="hero" className="border-b border-murekkep/10">
      <Container className="grid gap-12 pb-16 pt-12 md:pb-20 md:pt-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <Eyebrow>{t('Home.hero.eyebrow')}</Eyebrow>
          {/* Vurgu kelimesi mesajdaki `<accent>` etiketiyle işaretlenir; büyük metin
              (≥48px) için altin-koyu kagit üzerinde ~3.5:1 ile AA büyük metin eşiğini geçer. */}
          <h1 className="mt-6 text-display md:mt-8">
            {t.rich('Home.hero.title', {
              accent: (chunks) => <em className="italic text-altin-koyu">{chunks}</em>,
            })}
          </h1>
          <p className="mt-6 max-w-[36ch] font-display text-xl leading-snug italic text-metin md:mt-8 md:text-2xl">
            {t('Home.hero.text')}
          </p>
          <p className="mt-5 max-w-[48ch] text-metin-soluk">{t('Home.hero.lead')}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/siparis">{t('Nav.order')}</Button>
            <Button href="/galeri" variant="secondary" className="text-murekkep">
              {t('Home.hero.gallery')}
            </Button>
          </div>
        </div>
        <figure className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-kart bg-kagit-2">
            {/* Next.js 16 `priority`'yi `preload` lehine kullanımdan kaldırdı; LCP görseli
                için belgeler (node_modules/next/dist/docs/01-app/03-api-reference/
                02-components/image.md, "#preload") `loading="eager"` ya da
                `fetchPriority="high"` önerir. `fetchPriority` `<img>`'e doğrudan geçer
                ve `fetchpriority="high"` özniteliğini üretir. */}
            <Image
              src={heroImage}
              alt={t('Home.hero.imageAlt')}
              fill
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              sizes="(min-width:1280px) 480px, (min-width:1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-4 flex items-center gap-3 text-sm text-metin-soluk">
            <span aria-hidden="true" className="h-px w-6 shrink-0 bg-altin" />
            {t('Home.hero.caption')}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
