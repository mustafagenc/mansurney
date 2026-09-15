import { useTranslations } from 'next-intl';
import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

export type Crumb = { label: string; href?: ComponentProps<typeof Link>['href'] };

export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  const t = useTranslations('Common');
  return (
    <nav aria-label={t('breadcrumb')} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] leading-snug text-metin-soluk">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-metin-soluk/60">
                /
              </span>
            )}
            {c.href ? (
              <Link href={c.href} className="link-underline transition-colors hover:text-murekkep">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-murekkep">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
