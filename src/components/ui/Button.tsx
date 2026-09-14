import type { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';

const variants = {
  gold: 'bg-altin text-murekkep hover:bg-altin-koyu hover:text-white',
  green: 'bg-yesil text-kagit hover:bg-yesil-acik hover:text-white',
  outline: 'border-[1.5px] border-current text-kagit hover:bg-altin hover:border-altin hover:text-murekkep',
} as const;

type Common = { variant?: keyof typeof variants; children: ReactNode; className?: string };
type AsLink = Common & { href: ComponentProps<typeof Link>['href'] };
type AsButton = Common & Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: undefined };

export function Button(props: AsLink | AsButton) {
  const { variant = 'gold', className = '', children } = props;
  const cls = `inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-semibold transition hover:-translate-y-0.5 ${variants[variant]} ${className}`;
  if (props.href !== undefined) return <Link href={props.href} className={cls}>{children}</Link>;
  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props;
  return <button className={cls} {...rest}>{children}</button>;
}
