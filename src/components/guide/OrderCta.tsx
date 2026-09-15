import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';

export async function OrderCta() {
  const t = await getTranslations('Guide');
  return (
    <div className="rounded-kart bg-yesil p-6 text-kagit">
      <h2 className="border-b border-altin pb-2 text-lg text-white">{t('orderCtaTitle')}</h2>
      <p className="mt-3 text-sm text-kamis">{t('orderCtaText')}</p>
      <Button href="/siparis" variant="onDark" className="mt-4">
        {t('orderCtaButton')}
      </Button>
    </div>
  );
}
