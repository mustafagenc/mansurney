import { getTranslations, setRequestLocale } from 'next-intl/server';
import { OrderForm } from '@/components/forms/OrderForm';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';
import { business, telUrl, whatsappUrl } from '@/config/business';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/siparis'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Order' });
  return pageMetadata({ locale, title: t('title'), description: t('description'), hrefFor: () => '/siparis' });
}

export default async function OrderPage({ params }: PageProps<'/[locale]/siparis'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const why = ['reed', 'craft', 'tunings', 'packing'] as const;

  return (
    <>
      <PageHero
        title={t('Order.title')}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: t('Order.title') }]}
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_340px]">
        <div className="rounded-kart bg-white p-6 shadow-kart md:p-10">
          <ReedDivider className="mb-6 max-w-[220px]" />
          <h2 className="text-3xl">{t('Order.heading')}</h2>
          <p className="mt-3">{t('Order.intro')}</p>
          {/* `akort` sorgu parametresi yalnızca `OrderForm` içindeki küçük bir istemci
              bileşeninde, kendi `<Suspense>` sınırında okunur — form statik HTML'de kalır. */}
          <OrderForm />
        </div>
        <aside className="h-fit rounded-kart bg-yesil p-6 text-kagit">
          <h2 className="border-b border-altin pb-2 text-lg text-white">{t('Order.whyTitle')}</h2>
          <ul className="mt-4 space-y-3 text-kamis">
            {why.map((k) => (
              <li key={k}>
                <span aria-hidden="true">✓</span> {t(`Order.why.${k}`)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-kamis">{t('Order.shipping')}</p>
          <Button href={whatsappUrl(t('Order.whatsappText'))} className="mt-6 w-full justify-center">
            {t('Common.whatsapp')}
          </Button>
          <a href={telUrl()} dir="ltr" className="mt-3 block text-center text-kagit">
            {business.phoneDisplay}
          </a>
        </aside>
      </Container>
    </>
  );
}
