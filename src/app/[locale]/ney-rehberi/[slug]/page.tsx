import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { OrderCta } from '@/components/guide/OrderCta';
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
      />

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_320px]">
        <article>
          <Image src={meta.cover} alt={meta.coverAlt} priority placeholder="blur" sizes="(min-width:1024px) 760px, 100vw" className="rounded-kart" />
          <p className="mt-4 text-sm text-metin-soluk">{t('Guide.updated', { date: format.dateTime(new Date(meta.updated), { dateStyle: 'long' }) })}</p>
          <p className="mt-6 text-lg font-semibold text-yesil">{meta.description}</p>
          <div className="max-w-prose">
            <Content />
          </div>
          {faq.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-2xl">{t('Guide.faqTitle')}</h2>
              {faq.map((f) => (
                <details key={f.q} className="border-b border-yesil/15 py-4">
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="mt-2">{f.a}</p>
                </details>
              ))}
            </section>
          )}
        </article>
        <aside className="space-y-6">
          <nav aria-label={t('Guide.related')} className="rounded-kart bg-white p-6 shadow-kart">
            <h2 className="mb-4 text-lg">{t('Guide.related')}</h2>
            <ul className="space-y-3">
              {others.map((g) => (
                <li key={g.key}>
                  <a href={getPathname({ locale, href: { pathname: '/ney-rehberi/[slug]', params: { slug: g.slug } } })}>{g.meta.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <OrderCta />
        </aside>
      </Container>
    </>
  );
}
