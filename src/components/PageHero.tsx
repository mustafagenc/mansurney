import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/Container';

type Props = {
  title: string;
  breadcrumbs: Crumb[];
  /** Başlığın altındaki kısa giriş cümlesi. */
  lead?: string;
  /** Giriş cümlesinin altında ek içerik (ör. güncelleme tarihi). */
  children?: ReactNode;
  /** Varsa başlığın altında container genişliğinde 16:9 görsel (LCP — eager yüklenir). */
  image?: { src: StaticImageData; alt: string };
};

// İç sayfa başlığı (spec §4.1): kağıt zemin, küçük breadcrumbs, büyük başa hizalı H1, alt hairline.
export function PageHero({ title, breadcrumbs, lead, children, image }: Props) {
  return (
    <section className="border-b border-murekkep/10 bg-kagit">
      <Container className="pb-10 pt-8 md:pb-14 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-8 max-w-4xl text-h1 md:mt-10">{title}</h1>
        {lead && <p className="mt-5 max-w-[60ch] text-lg text-metin-soluk md:mt-6">{lead}</p>}
        {children && <div className="mt-6 md:mt-8">{children}</div>}
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            loading="eager"
            fetchPriority="high"
            placeholder="blur"
            sizes="(min-width: 1280px) 1184px, 100vw"
            className="mt-10 aspect-video w-full rounded-kart object-cover md:mt-14"
          />
        )}
      </Container>
    </section>
  );
}
