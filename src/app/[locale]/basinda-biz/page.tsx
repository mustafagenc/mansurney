import Image from 'next/image';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { YouTubeEmbed } from '@/components/press/YouTubeEmbed';
import { Container } from '@/components/ui/Container';
import { sortedPress } from '@/data/press';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/basinda-biz'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Press' });
  return pageMetadata({ locale, title: t('title'), description: t('description'), hrefFor: () => '/basinda-biz' });
}

export default async function PressPage({ params }: PageProps<'/[locale]/basinda-biz'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const format = await getFormatter();
  const items = sortedPress();

  return (
    <>
      <PageHero
        title={t('Press.title')}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: t('Press.title') }]}
        lead={t('Press.description')}
      />
      <Container className="py-16 md:py-20">
        {items.length === 0 ? (
          <p className="max-w-[60ch] border-s-2 border-altin/60 ps-5 text-lg text-metin-soluk">{t('Press.empty')}</p>
        ) : (
          <ol className="list-none divide-y divide-murekkep/10">
            {items.map((item) => {
              const title = item.title[locale];
              return (
                <li key={item.id} className="reveal grid gap-8 py-10 md:grid-cols-12 md:gap-12 md:py-14">
                  {item.media && (
                    <div className="md:col-span-5">
                      {item.media.type === 'image' ? (
                        <Image
                          src={item.media.image}
                          alt={item.media.alt[locale]}
                          placeholder="blur"
                          sizes="(min-width:768px) 40vw, 100vw"
                          className="aspect-3/2 w-full rounded-kart object-cover"
                        />
                      ) : (
                        <YouTubeEmbed
                          videoId={item.media.videoId}
                          title={title}
                          playLabel={t('Press.playVideo')}
                          poster={item.media.poster}
                        />
                      )}
                    </div>
                  )}
                  <div className={item.media ? 'md:col-span-7' : 'md:col-span-8'}>
                    <p className="text-eyebrow uppercase text-altin-metin rtl:tracking-normal">
                      <time dateTime={item.date}>{format.dateTime(new Date(item.date), { dateStyle: 'long' })}</time>
                      <span aria-hidden="true" className="mx-2">
                        ·
                      </span>
                      <span>{item.outlet}</span>
                    </p>
                    <h2 className="mt-4 text-h3 md:text-[2rem]">{title}</h2>
                    {item.description && (
                      <p className="mt-4 max-w-[60ch] text-metin-soluk">{item.description[locale]}</p>
                    )}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-murekkep rtl:tracking-normal"
                    >
                      <span className="link-underline">{t('Press.readMore')}</span>
                      <span aria-hidden="true" className="rtl:rotate-180">
                        →
                      </span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Container>
    </>
  );
}
