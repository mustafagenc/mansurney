import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

export type Crumb = { label: string; href?: ComponentProps<typeof Link>['href'] };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-kamis">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="rtl:rotate-180">
                ›
              </span>
            )}
            {c.href ? (
              <Link href={c.href} className="text-kamis hover:text-altin">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
