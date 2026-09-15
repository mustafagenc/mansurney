import { Link } from '@/i18n/navigation';
import type { GuideListItem } from './GuideList';

type Props = {
  items: GuideListItem[];
  title: string;
  className?: string;
};

// Rehber detayında yapışkan kenar sütunu (spec §4.3): görselsiz, numaralı,
// hairline ayraçlı kompakt "diğer yazılar" listesi. `GuideList`in tam (görselli)
// halinin küçük bir varyantı.
export function RelatedGuides({ items, title, className = '' }: Props) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={title} className={className}>
      <h2 className="eyebrow">{title}</h2>
      <ol className="mt-6 border-t border-murekkep/10">
        {items.map((g, i) => {
          const href = { pathname: '/ney-rehberi/[slug]', params: { slug: g.slug } } as const;
          return (
            <li key={g.key} className="border-b border-murekkep/10">
              <Link href={href} className="group flex items-baseline gap-4 py-4">
                <span aria-hidden="true" className="index-num text-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="link-underline text-murekkep transition-colors duration-200 group-hover:text-altin-metin">
                  {g.meta.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
