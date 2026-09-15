'use client';

import { Link, usePathname } from '@/i18n/navigation';
import type { NavItem } from './Header';

// `usePathname` (next-intl) iç rota şablonunu döndürür (ör. `/ney-rehberi/[slug]`);
// alt sayfalar da üst menü öğesini etkin gösterir.
export function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
}

export function NavLinks({ items, label, className = '' }: { items: NavItem[]; label: string; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-7">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={isActivePath(pathname, i.href) ? 'page' : undefined}
              className="relative block py-2 text-[0.9375rem] font-semibold text-murekkep transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:scale-x-0 after:bg-altin after:transition-transform after:duration-300 hover:text-yesil hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
