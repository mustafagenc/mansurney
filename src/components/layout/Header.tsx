import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { whatsappUrl } from '@/config/business';
import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { NavLinks } from './NavLinks';

export type NavItem = { href: Exclude<AppPathname, `${string}[slug]`>; label: string };

// Spec §4.1: tek satır yapışkan header — yarı saydam kağıt + bulanıklık, alt hairline.
// Masaüstü menü `xl`'den itibaren (7 bağlantı + dil + buton daha dar ekrana sığmaz);
// altında tam ekran `MobileNav`.
export async function Header() {
  const t = await getTranslations();
  const items: NavItem[] = [
    { href: '/', label: t('Nav.home') },
    { href: '/ney-rehberi', label: t('Nav.guide') },
    { href: '/akortlar', label: t('Nav.tunings') },
    { href: '/galeri', label: t('Nav.gallery') },
    { href: '/basinda-biz', label: t('Nav.press') },
    { href: '/iletisim', label: t('Nav.contact') },
  ];
  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:bg-altin focus:px-4 focus:py-2 focus:text-murekkep"
      >
        {t('Common.skipToContent')}
      </a>
      <header className="sticky top-0 z-40 border-b border-murekkep/10 bg-kagit/85 backdrop-blur-md">
        <Container className="flex h-18 items-center justify-between gap-6 lg:h-20">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image src="/images/brand/amblem.svg" alt="" width={40} height={40} />
            <span className="leading-none">
              <span className="block font-display text-[1.375rem] text-murekkep">{t('Meta.siteName')}</span>
              <span className="mt-1.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-altin-metin rtl:text-xs rtl:tracking-normal">
                {t('Meta.tagline')}
              </span>
            </span>
          </Link>
          <NavLinks items={items.slice(1)} label={t('Common.mainNav')} className="hidden xl:block" />
          <div className="flex items-center gap-5">
            {/* Görünürlük kapsayıcıda: bileşenlerin kendi `inline-flex` sınıfı `hidden`'ı ezmesin. */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener"
                aria-label={t('Common.whatsapp')}
                title={t('Common.whatsapp')}
                className="flex items-center justify-center rounded-[2px] border border-murekkep/30 px-3.5 py-3.5 text-murekkep transition-colors duration-200 hover:border-murekkep hover:bg-murekkep/5"
              >
                <WhatsAppIcon className="size-[1.125em]" />
              </a>
              <Button href="/siparis">{t('Nav.order')}</Button>
            </div>
            <MobileNav items={[...items, { href: '/siparis', label: t('Nav.order') }]} className="-me-2.5 xl:hidden" />
          </div>
        </Container>
      </header>
    </>
  );
}
