import { getTranslations, setRequestLocale } from 'next-intl/server';
import { OrderForm } from '@/components/forms/OrderForm';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
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
        lead={t('Order.intro')}
      />
      {/* 7/5 asimetrik yerleşim (spec §4.4): sol form, sağ yapışkan bilgi paneli. */}
      <Container className="grid gap-x-12 gap-y-14 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-h3 md:text-[2rem]">{t('Order.heading')}</h2>
          {/* `akort` sorgu parametresi yalnızca `OrderForm` içindeki küçük bir istemci
              bileşeninde, kendi `<Suspense>` sınırında okunur — form statik HTML'de kalır. */}
          <OrderForm />
        </div>
        <aside className="h-fit border border-murekkep/10 bg-kagit-2 p-8 lg:sticky lg:top-28 lg:col-span-5">
          <h2 className="text-h3">{t('Order.whyTitle')}</h2>
          <ol className="mt-6 list-none space-y-4">
            {why.map((k, i) => (
              <li key={k} className="flex gap-4">
                <span aria-hidden="true" className="index-num text-lg">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="pt-0.5">{t(`Order.why.${k}`)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t border-murekkep/10 pt-6 text-sm text-metin-soluk">{t('Order.shipping')}</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button href={whatsappUrl(t('Order.whatsappText'))} className="w-full">
              <WhatsAppIcon />
              {t('Common.whatsapp')}
            </Button>
            <a href={telUrl()} dir="ltr" className="link-underline text-murekkep">
              {business.phoneDisplay}
            </a>
          </div>
        </aside>
      </Container>
    </>
  );
}
