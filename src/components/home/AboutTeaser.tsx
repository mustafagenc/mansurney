import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import aboutImage from '@/assets/images/workshop/about.jpg';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import type { Locale } from '@/i18n/routing';
import { guideSlug } from '@/lib/content';

// Spec §4.2.3: 5/7 asimetrik — görsel (`aspect-[3/4]`, üzerinde `01` indeksi) ve
// metin sütunu. Grid sütun sırası satır içi yönü izlediği için RTL'de kendiliğinden aynalanır.
export async function AboutTeaser() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  return (
    <section className="py-20 md:py-28 lg:py-32">
      <Container className="reveal grid items-center gap-12 md:grid-cols-12 md:gap-10 lg:gap-16">
        <figure className="relative md:col-span-5">
          <div className="overflow-hidden rounded-kart bg-kagit-2">
            <Image
              src={aboutImage}
              alt={t('Workshop.aboutAlt')}
              placeholder="blur"
              sizes="(min-width:1280px) 460px, (min-width:768px) 40vw, 100vw"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <span aria-hidden="true" className="index-num absolute start-0 top-0 rounded-ee-kart bg-kagit px-4 py-3 text-2xl leading-none">
            01
          </span>
        </figure>
        <div className="md:col-span-7 lg:ps-6">
          <Eyebrow>{t('Home.about.eyebrow')}</Eyebrow>
          <h2 className="mt-5 max-w-[18ch] text-h2">{t('Home.about.title')}</h2>
          <p className="mt-6 max-w-[58ch] text-metin-soluk">{t('Home.about.text')}</p>
          <Button
            href={{ pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug('history', locale) } }}
            variant="link"
            className="mt-8 text-murekkep"
          >
            {t('Home.about.cta')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
