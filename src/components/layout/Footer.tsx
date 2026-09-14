import { getLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';
import { business, telUrl, whatsappUrl } from '@/config/business';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getGuideList } from '@/lib/content';
import { legalSlug } from '@/lib/legal-slugs';

export async function Footer() {
  const t = await getTranslations();
  const social = Object.entries(business.social).filter((e): e is [string, string] => e[1] !== null);
  const locale = (await getLocale()) as Locale;
  const guides = await getGuideList(locale);
  return (
    <footer className="bg-murekkep pt-16 text-kamis">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-kagit">{t('Meta.siteName')}</p>
            <p className="mt-3 font-display italic text-altin">{t('Footer.couplet')}</p>
            <p className="mt-3 text-sm">{t('Footer.about')}</p>
            {social.length > 0 && (
              <ul className="mt-4 flex gap-3">
                {social.map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener" className="capitalize">
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="mb-4 text-base text-kagit">{t('Footer.quickLinks')}</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/siparis">{t('Nav.order')}</Link>
              </li>
              <li>
                <Link href="/akortlar">{t('Nav.tunings')}</Link>
              </li>
              <li>
                <Link href="/atolye">{t('Nav.workshop')}</Link>
              </li>
              <li>
                <Link href="/galeri">{t('Nav.gallery')}</Link>
              </li>
              <li>
                <Link href="/iletisim">{t('Nav.contact')}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-base text-kagit">{t('Footer.guideLinks')}</h2>
            <ul className="space-y-2 text-sm">
              {guides.map((g) => (
                <li key={g.key}>
                  <Link href={{ pathname: '/ney-rehberi/[slug]', params: { slug: g.slug } }}>{g.meta.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <address className="not-italic">
            <h2 className="mb-4 text-base text-kagit">{t('Footer.contactTitle')}</h2>
            <p className="text-sm">
              {business.address.street}, {business.address.locality} / {business.address.region}
            </p>
            <p className="mt-2 text-sm">
              <a href={telUrl()} dir="ltr">
                {business.phoneDisplay}
              </a>
            </p>
            <p className="mt-2 text-sm">
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </p>
            <p className="mt-2 text-sm">
              <a href={whatsappUrl()} target="_blank" rel="noopener">
                {t('Common.whatsapp')}
              </a>
            </p>
          </address>
        </div>
        <ReedDivider className="my-10" />
        <div className="flex flex-wrap justify-between gap-4 pb-8 text-xs">
          <span>{t('Footer.rights', { year: new Date().getFullYear() })}</span>
          <span className="flex gap-4">
            <Link href={{ pathname: '/yasal/[slug]', params: { slug: legalSlug('kvkk', locale) } }}>
              {t('Footer.privacyNotice')}
            </Link>
            <Link href={{ pathname: '/yasal/[slug]', params: { slug: legalSlug('privacy', locale) } }}>
              {t('Footer.privacyPolicy')}
            </Link>
          </span>
        </div>
      </Container>
    </footer>
  );
}
