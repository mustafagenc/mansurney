import Image, { type StaticImageData } from 'next/image';

// Okuma genişliğini (65ch) geniş ekranda iki yana aşan (breakout) görsel; altyazı
// metin sütunu hizasında kalır.
export function Figure({ src, alt, caption }: { src: StaticImageData; alt: string; caption?: string }) {
  return (
    <figure className="my-12 md:my-14 lg:-mx-8 2xl:-mx-16">
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes="(min-width: 1536px) 860px, (min-width: 1024px) 780px, 100vw"
        className="w-full rounded-kart"
      />
      {caption && (
        <figcaption className="mt-3 flex gap-3 text-sm leading-relaxed text-metin-soluk before:mt-[0.7em] before:h-px before:w-6 before:shrink-0 before:bg-altin/60 lg:px-8 2xl:px-16">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
