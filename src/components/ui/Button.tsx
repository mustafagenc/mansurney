import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

const variants = {
  gold: 'bg-altin text-murekkep hover:bg-altin-koyu hover:text-white',
  green: 'bg-yesil text-kagit hover:bg-yesil-acik hover:text-white',
  outline: 'border-[1.5px] border-current text-kagit hover:bg-altin hover:border-altin hover:text-murekkep',
} as const;

type Common = { variant?: keyof typeof variants; children: ReactNode; className?: string };
// `string & {}` yalnızca literal birleşimi (route otomatik tamamlaması) korurken
// harici bir URL gibi rastgele string'lerin de (ör. `whatsappUrl()`) kabul
// edilmesini sağlayan bilinen bir TypeScript deyimidir — düz `string` eklemek
// dahili rota tiplerinin otomatik tamamlamasını kaybettirir.
type AsLink = Common & { href: ComponentProps<typeof Link>['href'] | (string & {}) };
type AsButton = Common & Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: undefined };

export function Button(props: AsLink | AsButton) {
  const { variant = 'gold', className = '', children } = props;
  const cls = `inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.95rem] font-semibold transition hover:-translate-y-0.5 ${variants[variant]} ${className}`;
  if (props.href !== undefined) {
    // Harici bağlantılar (ör. WhatsApp) `next-intl` `Link`'in yönlendirme
    // mantığından geçmemeli; yeni sekmede düz bir `<a>` olarak açılır.
    if (typeof props.href === 'string' && props.href.startsWith('http')) {
      return (
        <a href={props.href} target="_blank" rel="noopener" className={cls}>
          {children}
        </a>
      );
    }
    // Harici olmayan bir `href`, dahili rota tipiyle eşleşir; yukarıdaki `http`
    // kontrolü bunu çalışma zamanında doğrular ama tip sistemine yansımaz —
    // bu dönüşüm o daralmayı ifade eder.
    return (
      <Link href={props.href as ComponentProps<typeof Link>['href']} className={cls}>
        {children}
      </Link>
    );
  }
  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props;
  return <button className={cls} {...rest}>{children}</button>;
}
