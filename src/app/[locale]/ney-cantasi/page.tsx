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
      <PageHero
        title={meta.title}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: meta.title }]}
        lead={meta.description}
      />
      <Container className="reveal grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Content />
          <Button href="/iletisim" variant="primary" className="mt-10">
            {t('Nav.contact')}
          </Button>
        </div>
        <div className="lg:col-span-5">
          <h2 className="text-h3">{t('Case.models')}</h2>
          <ul className="mt-6 border-t border-murekkep/10">
            {caseModels.map((m) => (
              <li key={m.key} className="flex items-center gap-5 border-b border-murekkep/10 py-6">
                {m.image && (
                  <Image
                    src={m.image}
                    alt=""
                    placeholder="blur"
                    sizes="80px"
                    className="size-20 flex-none rounded-kart object-cover"
                  />
                )}
                <div>
                  <p className="font-display text-lg text-murekkep">
                    {m.capacity === 'set' ? t('Case.set') : t('Case.capacity', { count: m.capacity })} ·{' '}
                    {t(`Case.${m.material}`)}
                  </p>
                  {m.dimensionsCm && (
                    <p className="mt-1 text-sm text-metin-soluk" dir="ltr">
                      {m.dimensionsCm.join(' × ')} cm
                    </p>
                  )}
                  <p className="mt-1 text-sm text-metin-soluk">{t('Case.askPrice')}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
