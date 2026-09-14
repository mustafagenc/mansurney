import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { GuideMeta } from '@/lib/content';

export async function GuideCard({ slug, meta }: { slug: string; meta: GuideMeta }) {
  const t = await getTranslations('Common');
  const href = { pathname: '/ney-rehberi/[slug]', params: { slug } } as const;
  return (
    <article className="overflow-hidden rounded-kart bg-white shadow-kart">
      <Link href={href}>
        <Image
          src={meta.cover}
          alt={meta.coverAlt}
          placeholder="blur"
          sizes="(min-width:1024px) 280px, (min-width:640px) 50vw, 100vw"
          className="aspect-[4/3] object-cover"
        />
      </Link>
      <div className="p-5">
        <h2 className="text-xl">
          <Link href={href} className="text-murekkep hover:text-altin-koyu">
            {meta.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm text-metin-soluk">{meta.description}</p>
        <Link href={href} className="mt-3 inline-block text-sm font-semibold">
          {t('readMore')} <span aria-hidden className="inline-block rtl:rotate-180">→</span>
        </Link>
      </div>
    </article>
  );
}
