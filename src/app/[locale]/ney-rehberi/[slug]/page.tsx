import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { OrderCta } from '@/components/guide/OrderCta';
import { RelatedGuides } from '@/components/guide/RelatedGuides';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { Container } from '@/components/ui/Container';
import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { allGuideParams, getGuideList, guideKeyFromSlug, guideSlug, loadGuide } from '@/lib/content';
import { articleLd, breadcrumbLd, faqLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return allGuideParams()
    .filter((p) => p.locale === params.locale)
    .map(({ slug }) => ({ slug }));
}

async function resolve(params: PageProps<'/[locale]/ney-rehberi/[slug]'>['params']) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const key = guideKeyFromSlug(locale, slug);
  if (!key) notFound();
  return { locale, key, ...(await loadGuide(locale, key)) };
}

export async function generateMetadata({ params }: PageProps<'/[locale]/ney-rehberi/[slug]'>) {
  const { locale, key, meta } = await resolve(params);
  return pageMetadata({
    locale,
    title: meta.title,
    description: meta.description,
    image: meta.cover,
    hrefFor: (l) => ({ pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug(key, l) } }),
  });
}

export default async function GuidePage({ params }: PageProps<'/[locale]/ney-rehberi/[slug]'>) {
  const { locale, key, meta, Content, faq } = await resolve(params);
  setRequestLocale(locale);
  const t = await getTranslations();
  const format = await getFormatter();
  const others = (await getGuideList(locale)).filter((g) => g.key !== key);
  const path = getPathname({ locale, href: { pathname: '/ney-rehberi/[slug]', params: { slug: guideSlug(key, locale) } } });
  const hub = getPathname({ locale, href: '/ney-rehberi' });

  return (
    <>
      <JsonLd
        data={articleLd({
          title: meta.title,
          description: meta.description,
          path,
          image: meta.cover.src,
          updated: meta.updated,
          inLanguage: locale,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: t('Common.home'), path: getPathname({ locale, href: '/' }) },
          { name: t('Guide.eyebrow'), path: hub },
          { name: meta.title, path },
        ])}
      />
      {faq.length > 0 && <JsonLd data={faqLd(faq)} />}

      <PageHero
        title={meta.title}
        breadcrumbs={[
          { label: t('Common.home'), href: '/' },
          { label: t('Guide.eyebrow'), href: '/ney-rehberi' },
          { label: meta.title },
        ]}
        lead={meta.description}
        image={{ src: meta.cover, alt: meta.coverAlt }}
      >
        <p className="text-sm text-metin-soluk">
          {t('Guide.updated', { date: format.dateTime(new Date(meta.updated), { dateStyle: 'long' }) })}
        </p>
      </PageHero>

      <Container className="reveal grid gap-x-12 gap-y-16 py-16 md:py-20 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <Content />
          {faq.length > 0 && (
            <section className="relative mt-16 pt-16 before:absolute before:start-0 before:top-0 before:h-px before:w-10 before:bg-altin">
              <h2 className="text-h3">{t('Guide.faqTitle')}</h2>
              <div className="mt-8 border-t border-murekkep/10">
                {faq.map((f) => (
                  <details key={f.q} className="group border-b border-murekkep/10 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-murekkep marker:content-none [&::-webkit-details-marker]:hidden">
                      <span>{f.q}</span>
                      <span aria-hidden="true" className="relative size-6 flex-none text-2xl leading-none text-altin-metin">
                        <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-open:opacity-0">+</span>
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-open:opacity-100">−</span>
                      </span>
                    </summary>
                    <p className="mt-3 max-w-[65ch] text-metin-soluk">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>
        <aside className="lg:col-span-4">
          <div className="space-y-10 lg:sticky lg:top-28">
            <RelatedGuides items={others} title={t('Guide.related')} />
            <OrderCta />
          </div>
        </aside>
      </Container>
    </>
  );
}
