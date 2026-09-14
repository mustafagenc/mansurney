import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';
import { MobileNav } from './MobileNav';
import { TopBar } from './TopBar';

export type NavItem = { href: Exclude<AppPathname, `${string}[slug]`>; label: string };

export async function Header() {
  const t = await getTranslations();
  const items: NavItem[] = [
    { href: '/', label: t('Nav.home') },
    { href: '/ney-rehberi', label: t('Nav.guide') },
    { href: '/akortlar', label: t('Nav.tunings') },
    { href: '/ney-cantasi', label: t('Nav.case') },
    { href: '/atolye', label: t('Nav.workshop') },
    { href: '/galeri', label: t('Nav.gallery') },
    { href: '/iletisim', label: t('Nav.contact') },
  ];
  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:bg-altin focus:px-4 focus:py-2"
      >
        {t('Common.skipToContent')}
      </a>
      <TopBar />
      <header className="sticky top-0 z-40 bg-yesil text-kagit shadow-kart">
        <Container className="flex items-center justify-between gap-6 py-3">
          <Link href="/" className="flex items-center gap-3 text-kagit">
            <Image src="/images/brand/amblem.svg" alt="" width={40} height={40} />
            <span className="leading-tight">
              <b className="block font-display text-xl">{t('Meta.siteName')}</b>
              <small className="text-xs uppercase tracking-[0.2em] text-kamis rtl:tracking-normal">{t('Meta.tagline')}</small>
            </span>
          </Link>
          <nav className="hidden lg:block" aria-label={t('Nav.home')}>
            <ul className="flex items-center gap-6 text-sm font-semibold uppercase tracking-wide rtl:normal-case">
              {items.slice(1).map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-kagit hover:text-altin">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Button href="/siparis" variant="gold" className="hidden sm:inline-flex">
              {t('Nav.order')}
            </Button>
            <MobileNav items={[...items, { href: '/siparis', label: t('Nav.order') }]} />
          </div>
        </Container>
      </header>
    </>
  );
}
