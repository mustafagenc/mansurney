import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  /** Başlık satırının sonunda (masaüstünde sağda) gösterilen öğe — genellikle `Button variant="link"`. */
  action?: ReactNode;
  align?: 'start' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
};

// `align="start"` (varsayılan): 12 sütunlu grid'de başa hizalı Eyebrow + başlık (7),
// sonda açıklama ve/veya action (5); mobilde alt alta.
export function SectionHeading({ eyebrow, title, description, action, align = 'start', as: H = 'h2', className = '' }: Props) {
  const heading = (
    <>
      {eyebrow && <Eyebrow align={align}>{eyebrow}</Eyebrow>}
      <H className={`${eyebrow ? 'mt-5' : ''} ${H === 'h1' ? 'text-h1' : 'text-h2'}`}>{title}</H>
    </>
  );

  if (align === 'center') {
    return (
      <header className={`mx-auto mb-12 max-w-3xl text-center md:mb-16 ${className}`}>
        {heading}
        {description && <p className="mx-auto mt-5 max-w-[60ch] text-metin-soluk">{description}</p>}
        {action && <div className="mt-6">{action}</div>}
      </header>
    );
  }

  const hasAside = Boolean(description || action);
  return (
    <header className={`mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end md:gap-8 ${className}`}>
      <div className={hasAside ? 'md:col-span-7' : 'md:col-span-12'}>{heading}</div>
      {hasAside && (
        <div className="flex flex-col items-start gap-5 md:col-span-5 md:items-end md:text-end">
          {description && <p className="max-w-[48ch] text-metin-soluk">{description}</p>}
          {action}
        </div>
      )}
    </header>
  );
}
