import { getLocale, getTranslations } from 'next-intl/server';
import { GuideCard } from '@/components/guide/GuideCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Locale } from '@/i18n/routing';
import { getGuideList } from '@/lib/content';

export async function GuideGrid() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations('Guide');
  const guides = await getGuideList(locale);
  return (
    <section id="rehber" className="py-20">
      <Container>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((g) => (
            <GuideCard key={g.key} slug={g.slug} meta={g.meta} headingLevel="h3" />
          ))}
        </div>
      </Container>
    </section>
  );
}
