import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { whatsappUrl } from '@/config/business';

// Spec §4.2.7: kagit zeminde büyük hairline çerçeveli alan (paspartu gibi çift çizgi);
// solda büyük H2 + açıklama, sağda birincil sipariş + ikincil WhatsApp butonu.
export async function OrderBand() {
  const t = await getTranslations();
  return (
    <section className="pb-20 md:pb-28 lg:pb-32">
      <Container className="reveal">
        <div className="border border-murekkep/15 p-2 sm:p-3">
          <div className="grid gap-10 border border-altin/40 px-6 py-14 sm:px-10 md:grid-cols-12 md:items-end md:gap-12 md:px-14 md:py-20 lg:px-20 lg:py-24">
            <div className="md:col-span-7">
              <h2 className="max-w-[18ch] text-h2">{t('Home.order.title')}</h2>
              <p className="mt-6 max-w-[52ch] text-metin-soluk">{t('Home.order.text')}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <Button href="/siparis">{t('Nav.order')}</Button>
              <Button href={whatsappUrl(t('Order.whatsappText'))} variant="secondary" className="text-murekkep">
                {t('Common.whatsapp')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
