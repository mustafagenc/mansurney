import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { tunings } from '@/data/tunings';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/akortlar'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Tunings' });
  return pageMetadata({ locale, title: t('eyebrow'), description: t('intro'), hrefFor: () => '/akortlar' });
}

export default async function TuningsPage({ params }: PageProps<'/[locale]/akortlar'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <PageHero
        title={t('Tunings.title')}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: t('Tunings.eyebrow') }]}
        lead={t('Tunings.intro')}
      />
      <Container className="reveal py-16 md:py-20">
        {/* Tablo benzeri hairline satırlar (spec §4.3): masaüstünde 12 sütun
            (indeks 1 | isim 3 | boy 3 | ses 3 | sipariş 2); mobilde alt alta. */}
        <ul className="border-t border-murekkep/10">
          {tunings.map((tu, i) => (
            <li
              key={tu.key}
              id={tu.key}
              className="grid gap-2 border-b border-murekkep/10 py-6 sm:grid-cols-12 sm:items-center sm:gap-4"
            >
              <span aria-hidden="true" className="index-num text-lg sm:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="text-h3 sm:col-span-3" lang="tr">
                {tu.name}
              </h2>
              <p className="text-sm text-metin-soluk sm:col-span-3">
                {t('Tunings.length')}: {tu.lengthCm ? `${tu.lengthCm} cm` : t('Tunings.lengthUnknown')}
              </p>
              <div className="sm:col-span-3">
                {tu.audio && (
                  <audio controls preload="none" className="w-full" aria-label={`${t('Tunings.listen')} — ${tu.name}`}>
                    <source src={tu.audio} type="audio/mpeg" />
                  </audio>
                )}
              </div>
              <div className="sm:col-span-2 sm:justify-self-end">
                <Button href={{ pathname: '/siparis', query: { akort: tu.key } }} variant="link">
                  {t('Tunings.orderThis', { name: tu.name })}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
