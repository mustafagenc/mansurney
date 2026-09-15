import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/forms/ContactForm';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';
import { business, telUrl, whatsappUrl } from '@/config/business';
import type { Locale } from '@/i18n/routing';
import { localBusinessLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: PageProps<'/[locale]/iletisim'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return pageMetadata({ locale, title: t('title'), description: t('description'), hrefFor: () => '/iletisim' });
}

// 2024-01-01 bir Pazartesi'dir; gün kodundan (`Mo`…`Su`) o haftanın tarihine
// gidip `getFormatter().dateTime`'a bırakarak sayfanın diline göre gün adı elde edilir.
const dayOffset: Record<string, number> = { Mo: 0, Tu: 1, We: 2, Th: 3, Fr: 4, Sa: 5, Su: 6 };

export default async function ContactPage({ params }: PageProps<'/[locale]/iletisim'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const format = await getFormatter();
  const dayName = (day: string) => format.dateTime(new Date(2024, 0, 1 + (dayOffset[day] ?? 0)), { weekday: 'long' });
  const mapQuery = business.geo
    ? `${business.geo.lat},${business.geo.lng}`
    : `${business.address.street}, ${business.address.locality}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <>
      <JsonLd data={localBusinessLd(locale, t('Meta.defaultDescription'))} />
      <PageHero
        title={t('Contact.title')}
        breadcrumbs={[{ label: t('Common.home'), href: '/' }, { label: t('Contact.title') }]}
      />
      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_340px]">
        <div className="rounded-kart bg-white p-6 shadow-kart md:p-10">
          <ReedDivider className="mb-6 max-w-[220px]" />
          <h2 className="text-3xl">{t('Contact.heading')}</h2>
          <ContactForm />
        </div>
        <aside className="h-fit rounded-kart bg-yesil p-6 text-kagit">
          <h2 className="border-b border-altin pb-2 text-lg text-white">{t('Contact.infoTitle')}</h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-kamis">
            <p>
              {business.address.street}, {business.address.locality} / {business.address.region}
            </p>
            <p>
              <a href={telUrl()} dir="ltr" className="text-kagit">
                {business.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${business.email}`} className="text-kagit" dir="ltr">
                {business.email}
              </a>
            </p>
          </address>
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-white">{t('Contact.hours')}</h3>
            <ul className="mt-2 space-y-1 text-sm text-kamis">
              {business.openingHours.map((h) => {
                const firstDay = h.days[0] ?? 'Mo';
                const lastDay = h.days[h.days.length - 1] ?? firstDay;
                return (
                  <li key={`${h.days.join('')}-${h.opens}`}>
                    {h.days.length > 1 ? `${dayName(firstDay)}–${dayName(lastDay)}` : dayName(firstDay)}{' '}
                    <span dir="ltr">
                      {h.opens}–{h.closes}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <Button href={whatsappUrl()} variant="onDark" className="mt-6 w-full">
            {t('Common.whatsapp')}
          </Button>
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener"
            className="mt-3 block text-center text-kagit underline decoration-altin"
          >
            {t('Contact.map')}
          </a>
        </aside>
      </Container>
    </>
  );
}
