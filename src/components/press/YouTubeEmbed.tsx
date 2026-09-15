'use client';

import Image, { type StaticImageData } from 'next/image';
import { useState } from 'react';

type Props = {
  videoId: string;
  /** iframe başlığı ve oynat düğmesi için erişilebilir ad. */
  title: string;
  playLabel: string;
  poster?: StaticImageData;
};

// Tıklanana kadar YouTube'dan hiçbir şey yüklenmez (hız + gizlilik); tıklanınca
// çerezsiz youtube-nocookie oynatıcısı otomatik başlar.
export function YouTubeEmbed({ videoId, title, playLabel, poster }: Props) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-kart bg-murekkep"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`${playLabel}: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-kart bg-murekkep text-kagit"
    >
      {poster && (
        <Image
          src={poster}
          alt=""
          placeholder="blur"
          sizes="(min-width:1024px) 480px, 100vw"
          className="size-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-kagit/60 bg-murekkep/60 backdrop-blur-sm transition-colors duration-300 group-hover:border-altin group-hover:text-altin">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ms-1 size-6 fill-current">
            <path d="M8 5.5v13l10.5-6.5z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
