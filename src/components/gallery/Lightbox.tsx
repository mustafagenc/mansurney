'use client';

import Image, { type StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

export type LightboxItem = { id: string; src: StaticImageData; alt: string };

export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const t = useTranslations('Gallery');
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  if (items.length === 0) return null;
  const i = index ?? 0;
  const go = (delta: number) => onIndex((i + delta + items.length) % items.length);
  const item = items[i]!;

  return (
    <dialog
      ref={ref}
      aria-label={t('viewer')}
      onClose={onClose}
      onKeyDown={(e) => {
        const rtl = document.documentElement.dir === 'rtl';
        if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
        if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
      }}
      className="m-auto max-h-[92dvh] max-w-[92vw] bg-transparent p-0 backdrop:bg-murekkep/95"
    >
      <figure className="relative">
        <Image src={item.src} alt={item.alt} sizes="92vw" className="max-h-[85dvh] w-auto object-contain" />
        <figcaption className="mt-3 text-center text-sm text-kamis">
          {item.alt} · {i + 1}/{items.length}
        </figcaption>
      </figure>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={t('prev')}
        className="absolute start-2 top-1/2 -translate-y-1/2 text-kagit/80 transition-colors duration-200 hover:text-kagit"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="size-8 rtl:-scale-x-100">
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={t('next')}
        className="absolute end-2 top-1/2 -translate-y-1/2 text-kagit/80 transition-colors duration-200 hover:text-kagit"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="size-8 rtl:-scale-x-100">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label={t('close')}
        autoFocus
        className="absolute end-2 top-2 text-3xl font-light text-kagit/80 transition-colors duration-200 hover:text-kagit"
      >
        ×
      </button>
    </dialog>
  );
}
