import { getLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { couplets } from '@/data/couplets';
import type { Locale } from '@/i18n/routing';

export async function CoupletBand() {
  const locale = (await getLocale()) as Locale;
  const c = couplets[0]!;
  return (
    <section className="bg-yesil py-10 text-center">
      <Container>
        <blockquote className="font-display text-2xl italic text-kagit md:text-3xl" lang={locale}>
          {c.lines[locale].map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
          <footer className="mt-3 text-sm not-italic text-altin">— {c.source}</footer>
        </blockquote>
      </Container>
    </section>
  );
}
