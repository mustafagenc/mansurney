import { getLocale, getTranslations } from 'next-intl/server';
import { GuideList } from '@/components/guide/GuideList';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Locale } from '@/i18n/routing';
import { getGuideList } from '@/lib/content';

// Spec §4.2.4: başa hizalı başlık satırı + sağda "Tüm yazılar" linki; altında
// 4 yazılık numaralı editoryal liste (masaüstünde 2×2).
export async function GuideGrid() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const guides = await getGuideList(locale);
  return (
    <section id="rehber" className="border-t border-murekkep/10 py-20 md:py-28 lg:py-32">
      <Container className="reveal">
        <SectionHeading
          eyebrow={t('Guide.eyebrow')}
          title={t('Guide.title')}
          description={t('Guide.description')}
          action={
            <Button href="/ney-rehberi" variant="link" className="text-murekkep">
              {t('Home.guide.all')}
            </Button>
          }
        />
        <GuideList items={guides} headingLevel="h3" />
      </Container>
    </section>
  );
}
