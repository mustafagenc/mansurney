'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { InstagramIcon } from '@/components/ui/InstagramIcon';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { business, socialHandle, telUrl, whatsappUrl } from '@/config/business';
import { Link, usePathname } from '@/i18n/navigation';
import type { NavItem } from './Header';
import { LanguageSwitcher } from './LanguageSwitcher';
import { isActivePath } from './NavLinks';

export function MobileNav({ items, className = '' }: { items: NavItem[]; className?: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  return (
    <>
      <button
        type="button"
        className={`inline-flex size-11 items-center justify-center text-murekkep ${className}`}
        aria-label={t('Common.openMenu')}
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        <svg aria-hidden="true" width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 8h20M3 13h20M3 18h13" />
        </svg>
      </button>
      {/* `showModal` iletişim kutusunu üst katmana (top layer) taşır; header'ın
          `backdrop-blur` kapsayıcısından etkilenmeden tam ekran açılır. */}
      <dialog
        ref={ref}
        aria-label={t('Common.mainNav')}
        className="m-0 h-dvh max-h-none w-full max-w-none overscroll-contain bg-murekkep p-0 text-kagit backdrop:bg-murekkep"
      >
        <div className="flex min-h-full flex-col px-5 pb-10 pt-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-xl text-kagit">{t('Meta.siteName')}</span>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center text-kagit"
              aria-label={t('Common.closeMenu')}
              onClick={close}
            >
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>
          <nav aria-label={t('Common.mainNav')} className="mt-8 flex-1">
            <ul className="border-t border-kagit/15">
              {items.map((i, idx) => (
                <li key={i.href} className="border-b border-kagit/15">
                  <Link
                    href={i.href}
                    onClick={close}
                    aria-current={isActivePath(pathname, i.href) ? 'page' : undefined}
                    className="flex items-baseline gap-4 py-3.5 font-display text-[1.875rem] leading-tight text-kagit transition-colors hover:text-altin aria-[current=page]:text-altin sm:text-4xl"
                  >
                    <span aria-hidden="true" className="index-num w-6 shrink-0 text-sm text-kamis">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 text-sm">
            <div className="space-y-2">
              <p>
                <a href={telUrl()} dir="ltr" className="link-underline text-lg text-kagit">
                  {business.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 text-kamis hover:text-kagit"
                >
                  <WhatsAppIcon />
                  <span className="link-underline">{t('Common.whatsapp')}</span>
                </a>
              </p>
              {business.social.instagram && (
                <p>
                  <a
                    href={business.social.instagram}
                    target="_blank"
                    rel="noopener"
                    dir="ltr"
                    className="inline-flex items-center gap-2 text-kamis hover:text-kagit"
                  >
                    <InstagramIcon />
                    <span className="link-underline">{socialHandle(business.social.instagram)}</span>
                  </a>
                </p>
              )}
            </div>
            <LanguageSwitcher tone="dark" />
          </div>
        </div>
      </dialog>
    </>
  );
}
