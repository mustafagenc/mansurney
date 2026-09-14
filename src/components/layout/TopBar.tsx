import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { business, telUrl, whatsappUrl } from '@/config/business';
import { LanguageSwitcher } from './LanguageSwitcher';

export async function TopBar() {
  const t = await getTranslations('Common');
  return (
    <div className="bg-murekkep text-sm text-kamis">
      <Container className="flex flex-wrap items-center justify-between gap-2 py-2">
        <ul className="flex flex-wrap gap-4">
          <li>
            <a href={telUrl()} dir="ltr">
              {business.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener">
              {t('whatsapp')}
            </a>
          </li>
        </ul>
        <LanguageSwitcher />
      </Container>
    </div>
  );
}
