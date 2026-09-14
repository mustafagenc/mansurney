import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GuideCard } from '@/components/guide/GuideCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { Locale } from '@/i18n/routing';
import { getGuideList } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/ney-rehberi'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Guide' });
  return pageMetadata({ locale, title: t('eyebrow'), description: t('description'), hrefFor: () => '/ney-rehberi' });
}

export default async function GuideHub({ params }: PageProps<'/[locale]/ney-rehberi'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('Guide');
  const guides = await getGuideList(locale);
  return (
    <Container className="py-16">
      <SectionHeading as="h1" eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((g) => (
          <GuideCard key={g.key} slug={g.slug} meta={g.meta} />
        ))}
      </div>
    </Container>
  );
}
