import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';

export default function NotFound() {
  const t = useTranslations();
  return (
    <Container className="py-24 text-center">
      <p className="font-display text-8xl text-altin">404</p>
      <ReedDivider className="mx-auto my-6 max-w-[200px]" />
      <h1 className="text-3xl">{t('NotFound.title')}</h1>
      <p className="mx-auto mt-3 max-w-md text-metin-soluk">{t('NotFound.text')}</p>
      <Button href="/" variant="green" className="mt-8">
        {t('Common.backHome')}
      </Button>
    </Container>
  );
}
