import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

// Spec §3.4: dikdörtgen, küçük büyük-harf etiket, hap yok.
// - primary: açık zeminde koyu mürekkep
// - onDark: koyu zeminde (murekkep/yesil) altın
// - secondary: çizgili, rengi ebeveynden alır (koyu zeminde `text-kagit` verin)
// - link: etiket + ok, alttan çizgi animasyonu
const base =
  'inline-flex items-center justify-center gap-2.5 text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.12em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 rtl:text-sm rtl:tracking-normal';
const box = 'rounded-[2px] px-6 py-3.5';

const variants = {
  primary: `${box} bg-murekkep text-kagit hover:bg-yesil`,
  onDark: `${box} bg-altin text-murekkep hover:bg-kamis`,
  // Hover tonu, ebeveyn rengine (currentColor) göre %10'luk bir sözde öğe katmanıdır;
  // `bg-current/10` color-mix desteklemeyen tarayıcıda tam `currentColor` zemine
  // düşüp etiketi görünmez yaptığı için kullanılmaz.
  secondary: `${box} relative isolate border border-current bg-transparent before:absolute before:inset-0 before:-z-10 before:bg-current before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-10`,
  link: 'group py-1',
} as const;

export type ButtonVariant = keyof typeof variants;

type Common = { variant?: ButtonVariant; children: ReactNode; className?: string };
// `string & {}` yalnızca literal birleşimi (route otomatik tamamlaması) korurken
// harici bir URL gibi rastgele string'lerin de (ör. `whatsappUrl()`) kabul
// edilmesini sağlayan bilinen bir TypeScript deyimidir — düz `string` eklemek
// dahili rota tiplerinin otomatik tamamlamasını kaybettirir.
type AsLink = Common & { href: ComponentProps<typeof Link>['href'] | (string & {}) };
type AsButton = Common & Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: undefined };

export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', className = '', children } = props;
  const cls = `${base} ${variants[variant]} ${className}`;
  const content =
    variant === 'link' ? (
      <>
        <span className="link-underline">{children}</span>
        <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
          →
        </span>
      </>
    ) : (
      children
    );
  if (props.href !== undefined) {
    // Harici bağlantılar (ör. WhatsApp) `next-intl` `Link`'in yönlendirme
    // mantığından geçmemeli; yeni sekmede düz bir `<a>` olarak açılır.
    if (typeof props.href === 'string' && props.href.startsWith('http')) {
      return (
        <a href={props.href} target="_blank" rel="noopener" className={cls}>
          {content}
        </a>
      );
    }
    // Harici olmayan bir `href`, dahili rota tipiyle eşleşir; yukarıdaki `http`
    // kontrolü bunu çalışma zamanında doğrular ama tip sistemine yansımaz —
    // bu dönüşüm o daralmayı ifade eder.
    return (
      <Link href={props.href as ComponentProps<typeof Link>['href']} className={cls}>
        {content}
      </Link>
    );
  }
  const { variant: _v, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}
