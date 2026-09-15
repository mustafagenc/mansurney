import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import type { getGuideList } from '@/lib/content';

export type GuideListItem = Awaited<ReturnType<typeof getGuideList>>[number];

type Props = {
  items: GuideListItem[];
  /** Anasayfada bölüm H2'sinin altında `h3`; rehber hub'ında sayfa H1'inin altında `h2`. */
  headingLevel?: 'h2' | 'h3';
  /** İlk öğenin indeksi (varsayılan 1) — listeyi bölerek göstermek için. */
  start?: number;
  className?: string;
};

// Numaralı editoryal liste (spec §4.2.4, §4.3): gölgesiz, masaüstünde 2×2 grid;
// her öğe `aspect-[3/2]` görsel, hairline üstünde `0X` indeks, başlık, açıklama ve
// metin linki. Semantik numara `<ol>`'dan gelir; görünen indeks dekoratiftir.
export async function GuideList({ items, headingLevel: Heading = 'h3', start = 1, className = '' }: Props) {
  const t = await getTranslations('Common');
  return (
    <ol start={start} className={`grid gap-x-10 gap-y-14 md:grid-cols-2 md:gap-y-20 lg:gap-x-16 ${className}`}>
      {items.map((g, i) => {
        const href = { pathname: '/ney-rehberi/[slug]', params: { slug: g.slug } } as const;
        return (
          <li key={g.key}>
            <article className="group flex h-full flex-col">
              {/* Görsel bağlantısı başlık bağlantısını tekrarlar; sekme sırasından ve
                  erişilebilirlik ağacından çıkarılır. */}
              <Link href={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-kart bg-kagit-2">
                <Image
                  src={g.meta.cover}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width:1280px) 560px, (min-width:768px) 50vw, 100vw"
                  className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </Link>
              <div className="mt-6 flex flex-1 gap-5 border-t border-murekkep/10 pt-5 md:gap-6">
                <span aria-hidden="true" className="index-num pt-1 text-lg leading-none md:text-xl">
                  {String(start + i).padStart(2, '0')}
                </span>
                <div className="flex flex-1 flex-col items-start">
                  <Heading className="text-h3">
                    <Link href={href} className="text-murekkep transition-colors duration-200 hover:text-altin-metin">
                      {g.meta.title}
                    </Link>
                  </Heading>
                  <p className="mt-3 max-w-[52ch] text-metin-soluk">{g.meta.description}</p>
                  <Button href={href} variant="link" className="mt-auto pt-5 text-murekkep">
                    {t('readMore')}
                  </Button>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
