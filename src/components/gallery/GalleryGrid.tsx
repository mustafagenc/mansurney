'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Lightbox, type LightboxItem } from './Lightbox';

export function GalleryGrid({ items }: { items: LightboxItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((it, i) => (
          <li key={it.id}>
            <button
              type="button"
              className="block w-full overflow-hidden rounded-kart"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setIndex(i);
              }}
            >
              <Image
                src={it.src}
                alt={it.alt}
                placeholder="blur"
                sizes="(min-width:768px) 25vw, 50vw"
                className="aspect-square object-cover transition hover:scale-105"
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
