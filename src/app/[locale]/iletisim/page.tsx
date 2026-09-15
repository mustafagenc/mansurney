import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/forms/ContactForm';
import { JsonLd } from '@/components/JsonLd';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { business, socialHandle, telUrl, whatsappUrl } from '@/config/business';
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
        lead={t('Contact.description')}
      />
      {/* 7/5 asimetrik yerleşim (spec §4.4): sol form, sağ yapışkan bilgi paneli. */}
      <Container className="grid gap-x-12 gap-y-14 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-h3 md:text-[2rem]">{t('Contact.heading')}</h2>
          <ContactForm />
        </div>
        <aside className="h-fit border border-murekkep/10 bg-kagit-2 p-8 lg:sticky lg:top-28 lg:col-span-5">
          <h2 className="text-h3">{t('Contact.infoTitle')}</h2>
          <address className="mt-6 text-sm not-italic text-metin-soluk">
            <p>
              {business.address.street}, {business.address.locality} / {business.address.region}
            </p>
          </address>
          <div className="mt-6 space-y-3 border-t border-murekkep/10 pt-6 text-sm">
            <a href={telUrl()} dir="ltr" className="link-underline block w-fit text-murekkep">
              {business.phoneDisplay}
            </a>
            <a href={`mailto:${business.email}`} dir="ltr" className="link-underline block w-fit text-murekkep">
              {business.email}
            </a>
            {business.social.instagram && (
              <a
                href={business.social.instagram}
                target="_blank"
                rel="noopener"
                dir="ltr"
                className="flex w-fit items-center gap-2 text-murekkep"
              >
                <InstagramIcon />
                <span className="link-underline">{socialHandle(business.social.instagram)}</span>
              </a>
            )}
          </div>
          <div className="mt-8 border-t border-murekkep/10 pt-6">
            <h3 className="text-xs font-semibold text-metin-soluk">{t('Contact.hours')}</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {business.openingHours.map((h) => {
                const firstDay = h.days[0] ?? 'Mo';
                const lastDay = h.days[h.days.length - 1] ?? firstDay;
                return (
                  <li key={`${h.days.join('')}-${h.opens}`} className="flex justify-between gap-4">
                    <span>{h.days.length > 1 ? `${dayName(firstDay)}–${dayName(lastDay)}` : dayName(firstDay)}</span>
                    <span dir="ltr">
                      {h.opens}–{h.closes}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button href={whatsappUrl()} className="w-full">
              <WhatsAppIcon />
              {t('Common.whatsapp')}
            </Button>
            <a href={mapUrl} target="_blank" rel="noopener" className="link-underline text-murekkep">
              {t('Contact.map')}
            </a>
          </div>
        </aside>
      </Container>
    </>
  );
}
