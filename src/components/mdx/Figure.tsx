import Image, { type StaticImageData } from 'next/image';

export function Figure({ src, alt, caption }: { src: StaticImageData; alt: string; caption?: string }) {
  return (
    <figure className="my-8">
      <Image src={src} alt={alt} placeholder="blur" sizes="(min-width: 1024px) 720px, 100vw" className="rounded-kart" />
      {caption && <figcaption className="mt-2 text-center text-sm text-metin-soluk">{caption}</figcaption>}
    </figure>
  );
}
