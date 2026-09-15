import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import aboutImage from '@/assets/images/workshop/about.jpg';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ReedDivider } from '@/components/ui/ReedDivider';
import type { Locale } from '@/i18n/routing';
import { guideSlug } from '@/lib/content';

// İki sütun: görsel solda, metin sağda — CSS grid sütun sırası satır içi
// yön (inline direction) izlediği için `dir="rtl"`te tarayıcı otomatik
// aynalar; ek bir RTL sınıfı gerekmez.
export async function AboutTeaser() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  return (
    <section className="py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <Image
          src={aboutImage}
          alt={t('Workshop.aboutAlt')}
          placeholder="blur"
          sizes="(min-width:768px) 50vw, 100vw"
          className="rounded-kart"
        />
        <div>
          <ReedDivider className="mb-6 max-w-[220px]" />
          <Eyebrow>{t('Home.about.eyebrow')}</Eyebrow>
          <h2 className="mt-2 text-3xl md:text-4xl">{t('Home.about.title')}</h2>
          <p className="mt-4 text-metin-soluk">{t('Home.about.text')}</p>
          <Button
            href={{ pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug('history', locale) } }}
            variant="primary"
            className="mt-6"
          >
            {t('Home.about.cta')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
