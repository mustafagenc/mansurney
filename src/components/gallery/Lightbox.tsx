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
      className="m-auto max-h-[92dvh] max-w-[92vw] bg-transparent p-0 backdrop:bg-murekkep/90"
    >
      <figure className="relative">
        <Image src={item.src} alt={item.alt} sizes="92vw" className="max-h-[85dvh] w-auto object-contain" />
        <figcaption className="mt-2 text-center text-kamis">
          {item.alt} · {i + 1}/{items.length}
        </figcaption>
      </figure>
      <button type="button" onClick={() => go(-1)} aria-label={t('prev')} className="absolute start-2 top-1/2 text-5xl text-kagit">
        ‹
      </button>
      <button type="button" onClick={() => go(1)} aria-label={t('next')} className="absolute end-2 top-1/2 text-5xl text-kagit">
        ›
      </button>
      <button type="button" onClick={onClose} aria-label={t('close')} autoFocus className="absolute end-2 top-2 text-4xl text-kagit">
        ×
      </button>
    </dialog>
  );
}
