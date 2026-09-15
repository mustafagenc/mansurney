import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  const t = useTranslations();
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p aria-hidden="true" className="text-display text-altin-koyu">
        404
      </p>
      <h1 className="mt-4 text-h2">{t('NotFound.title')}</h1>
      <p className="mx-auto mt-4 max-w-md text-metin-soluk">{t('NotFound.text')}</p>
      <Button href="/" variant="primary" className="mt-10">
        {t('Common.backHome')}
      </Button>
    </Container>
  );
}
