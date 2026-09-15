import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { business, telUrl, whatsappUrl } from '@/config/business';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getGuideList } from '@/lib/content';
import { legalSlug } from '@/lib/legal-slugs';

const heading = 'mb-5 font-body text-eyebrow uppercase text-altin rtl:text-sm rtl:tracking-normal';
const link = 'link-underline transition-colors duration-200 hover:text-kagit';

// Spec §4.1: mürekkep zemin, büyük italik beyit satırı, 12 sütun grid
// (marka 4 · rehber 2 · hızlı bağlantılar 2 · iletişim 4), hairline'lar, yasal bağlantılar.
export async function Footer() {
  const t = await getTranslations();
  const social = Object.entries(business.social).filter((e): e is [string, string] => e[1] !== null);
  const locale = (await getLocale()) as Locale;
  const guides = await getGuideList(locale);
  const coupletLines = t('Footer.couplet').split(' / ');
  return (
    <footer className="bg-murekkep text-kagit/75">
      <Container>
        <div className="border-b border-kagit/15 py-16 md:py-24">
          <ReedDivider className="mb-8 justify-start" />
          <p className="max-w-5xl font-display text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.15] italic text-kamis">
            {coupletLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className="grid gap-12 py-14 text-[0.9375rem] md:grid-cols-2 md:py-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/images/brand/amblem.svg" alt="" width={40} height={40} />
              <span className="leading-none">
                <span className="block font-display text-[1.375rem] text-kagit">{t('Meta.siteName')}</span>
                <span className="mt-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-kamis rtl:text-xs rtl:tracking-normal">
                  {t('Meta.tagline')}
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-[40ch] leading-relaxed">{t('Footer.about')}</p>
            {social.length > 0 && (
              <ul className="mt-6 flex gap-5">
                {social.map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener" className={`capitalize ${link}`}>
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className={heading}>{t('Footer.guideLinks')}</h2>
            <ul className="space-y-3">
              {guides.map((g) => (
                <li key={g.key}>
                  <Link href={{ pathname: '/ney-rehberi/[slug]', params: { slug: g.slug } }} className={link}>
                    {g.meta.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className={heading}>{t('Footer.quickLinks')}</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/siparis" className={link}>
                  {t('Nav.order')}
                </Link>
              </li>
              <li>
                <Link href="/akortlar" className={link}>
                  {t('Nav.tunings')}
                </Link>
              </li>
              <li>
                <Link href="/atolye" className={link}>
                  {t('Nav.workshop')}
                </Link>
              </li>
              <li>
                <Link href="/galeri" className={link}>
                  {t('Nav.gallery')}
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className={link}>
                  {t('Nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <address className="not-italic lg:col-span-4">
            <h2 className={heading}>{t('Footer.contactTitle')}</h2>
            <p className="leading-relaxed">
              {business.address.street}, {business.address.locality} / {business.address.region}
            </p>
            <p className="mt-5">
              <a href={telUrl()} dir="ltr" className={`font-display text-2xl text-kagit ${link}`}>
                {business.phoneDisplay}
              </a>
            </p>
            <p className="mt-3">
              <a href={`mailto:${business.email}`} dir="ltr" className={link}>
                {business.email}
              </a>
            </p>
            <p className="mt-3">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-kagit"
              >
                <WhatsAppIcon />
                <span className="link-underline">{t('Common.whatsapp')}</span>
              </a>
            </p>
          </address>
        </div>

        <div className="flex flex-col gap-4 border-t border-kagit/15 py-8 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
          <span>{t('Footer.rights', { year: new Date().getFullYear() })}</span>
          <ul aria-label={t('Footer.legal')} className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href={{ pathname: '/yasal/[slug]', params: { slug: legalSlug('kvkk', locale) } }} className={link}>
                {t('Footer.privacyNotice')}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: '/yasal/[slug]', params: { slug: legalSlug('privacy', locale) } }} className={link}>
                {t('Footer.privacyPolicy')}
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
