import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { caseModels } from '@/data/case-models';
import type { Locale } from '@/i18n/routing';
import { loadPage } from '@/lib/pages';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/ney-cantasi'>) {
  const locale = (await params).locale as Locale;
  const { meta } = await loadPage(locale, 'case');
  return pageMetadata({ locale, title: meta.title, description: meta.description, hrefFor: () => '/ney-cantasi' });
}

export default async function CasePage({ params }: PageProps<'/[locale]/ney-cantasi'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { Content, meta } = await loadPage(locale, 'case');
  return (
    <>
      <PageHero title={meta.title} breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: meta.title }]} />
      <Container className="py-14">
        <div className="max-w-prose text-lg">
          <Content />
        </div>
        <h2 className="mt-12 text-2xl">{t('Case.models')}</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {caseModels.map((m) => (
            <li key={m.key} className="rounded-kart bg-white p-6 shadow-kart">
              {m.image && (
                <Image
                  src={m.image}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width:640px) 50vw, 100vw"
                  className="mb-4 rounded-kart"
                />
              )}
              <p className="font-display text-xl">
                {m.capacity === 'set' ? t('Case.set') : t('Case.capacity', { count: m.capacity })} ·{' '}
                {t(`Case.${m.material}`)}
              </p>
              {m.dimensionsCm && (
                <p className="mt-1 text-sm text-metin-soluk" dir="ltr">
                  {m.dimensionsCm.join(' × ')} cm
                </p>
              )}
              <p className="mt-2 text-sm">{t('Case.askPrice')}</p>
            </li>
          ))}
        </ul>
        <Button href="/iletisim" variant="primary" className="mt-10">
          {t('Nav.contact')}
        </Button>
      </Container>
    </>
  );
}
