import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { whatsappUrl } from '@/config/business';

export async function OrderBand() {
  const t = await getTranslations();
  return (
    <section className="bg-yesil py-20 text-center text-kagit">
      <Container>
        <h2 className="text-3xl text-kagit md:text-4xl">{t('Home.order.title')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-kamis">{t('Home.order.text')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/siparis">{t('Nav.order')}</Button>
          <Button href={whatsappUrl(t('Order.whatsappText'))} variant="outline">
            {t('Common.whatsapp')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
