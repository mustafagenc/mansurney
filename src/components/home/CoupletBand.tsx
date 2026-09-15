import { getLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { ReedDivider } from '@/components/ui/ReedDivider';
import { couplets } from '@/data/couplets';
import type { Locale } from '@/i18n/routing';

// Spec §4.2.2: kagit-2 zeminde çok büyük Fraunces italik beyit, üstte/altta küçük
// kamış boğumu, altta küçük kaynak etiketi. Arapçada italik `:lang(ar) .italic`
// kuralıyla kapanır; satır yüksekliği Naskh için açılır.
export async function CoupletBand() {
  const locale = (await getLocale()) as Locale;
  const c = couplets[0]!;
  return (
    <section className="bg-kagit-2 py-20 md:py-28 lg:py-32">
      <Container className="reveal text-center">
        <ReedDivider className="justify-center" />
        <figure className="mx-auto mt-10 max-w-5xl md:mt-14">
          <blockquote
            lang={locale}
            className="font-display text-[clamp(1.875rem,4.6vw,4rem)] leading-[1.15] tracking-[-0.01em] text-balance italic text-murekkep [&:lang(ar)]:leading-[1.7] [&:lang(ar)]:tracking-normal"
          >
            {c.lines[locale].map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </blockquote>
          <figcaption lang="tr" className="mt-8 text-eyebrow uppercase text-altin-metin md:mt-10">
            {c.source}
          </figcaption>
        </figure>
        <ReedDivider className="mt-10 justify-center md:mt-14" />
      </Container>
    </section>
  );
}
