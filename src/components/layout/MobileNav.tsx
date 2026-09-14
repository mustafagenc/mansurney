'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import type { NavItem } from './Header';

export function MobileNav({ items }: { items: NavItem[] }) {
  const t = useTranslations('Common');
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className="text-2xl lg:hidden"
        aria-label={t('openMenu')}
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        ☰
      </button>
      <dialog
        ref={ref}
        className="ms-auto h-dvh max-h-none w-80 max-w-[85vw] bg-yesil p-6 text-kagit backdrop:bg-murekkep/60"
      >
        <button type="button" className="mb-6 text-3xl" aria-label={t('closeMenu')} onClick={() => ref.current?.close()}>
          ×
        </button>
        <nav aria-label={t('mainNav')}>
          <ul className="space-y-4 text-lg">
            {items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} onClick={() => ref.current?.close()}>
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </dialog>
    </>
  );
}
