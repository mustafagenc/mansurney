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
      />
      <Container className="py-14">
        <p className="max-w-prose text-lg">{t('Tunings.intro')}</p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tunings.map((tu) => (
            <li key={tu.key} id={tu.key} className="flex flex-col rounded-kart bg-white p-6 shadow-kart">
              <h2 className="text-2xl" lang="tr">
                {tu.name}
              </h2>
              <p className="mt-2 text-sm text-metin-soluk">
                {t('Tunings.length')}: {tu.lengthCm ? `${tu.lengthCm} cm` : t('Tunings.lengthUnknown')}
              </p>
              {tu.audio && (
                <audio controls preload="none" className="mt-4 w-full" aria-label={`${t('Tunings.listen')} — ${tu.name}`}>
                  <source src={tu.audio} type="audio/mpeg" />
                </audio>
              )}
              <Button href={{ pathname: '/siparis', query: { akort: tu.key } }} variant="green" className="mt-auto self-start pt-3">
                {t('Tunings.orderThis', { name: tu.name })}
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
