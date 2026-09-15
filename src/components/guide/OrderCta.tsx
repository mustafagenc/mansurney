import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';

// Rehber detayında yapışkan kenar sütununda sade sipariş çağrısı (spec §4.3):
// koyu zemin yok, ince çerçeve.
export async function OrderCta() {
  const t = await getTranslations('Guide');
  return (
    <div className="border border-murekkep/15 p-6 md:p-8">
      <h2 className="text-h3">{t('orderCtaTitle')}</h2>
      <p className="mt-3 text-metin-soluk">{t('orderCtaText')}</p>
      <Button href="/siparis" variant="primary" className="mt-6 w-full">
        {t('orderCtaButton')}
      </Button>
    </div>
  );
}
