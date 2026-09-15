'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Lightbox, type LightboxItem } from './Lightbox';

type Props = {
  items: LightboxItem[];
  /**
   * `grid` (varsayılan): eşit kare hücreler (galeri sayfası).
   * `mosaic`: asimetrik mozaik — ilk görsel 2×2 büyük, diğerleri küçük kare. 5 görselle
   * hem 2 hem 4 sütunda tam dikdörtgen oluşur.
   */
  layout?: 'grid' | 'mosaic';
};

export function GalleryGrid({ items, layout = 'grid' }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const mosaic = layout === 'mosaic';
  return (
    <>
      <ul className={mosaic ? 'grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3' : 'grid grid-cols-2 gap-3 md:grid-cols-4'}>
        {items.map((it, i) => (
          <li key={it.id} className={mosaic ? 'first:col-span-2 first:row-span-2' : undefined}>
            <button
              type="button"
              className={mosaic ? 'group block size-full overflow-hidden rounded-kart bg-kagit-2' : 'block w-full overflow-hidden rounded-kart'}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setIndex(i);
              }}
            >
              <Image
                src={it.src}
                alt={it.alt}
                placeholder="blur"
                sizes={
                  mosaic
                    ? i === 0
                      ? '(min-width:1280px) 590px, (min-width:768px) 50vw, 100vw'
                      : '(min-width:1280px) 290px, (min-width:768px) 25vw, 50vw'
                    : '(min-width:768px) 25vw, 50vw'
                }
                className={
                  mosaic
                    ? 'aspect-square size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                    : 'aspect-square object-cover transition hover:scale-105'
                }
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        items={items}
        index={index}
        onIndex={setIndex}
        onClose={() => {
          setIndex(null);
          opener.current?.focus();
        }}
      />
    </>
  );
}
