import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { tunings } from '@/data/tunings';
import { Link } from '@/i18n/navigation';

// Spec §4.2.5: murekkep koyu bölüm; solda Eyebrow + H2 + giriş, sağda 8 akort iki
// sütunlu numaralı liste (her biri `/akortlar#key`), altında metin linki.
// Akort adları Türkçe özel adlardır: `lang="tr"` korunur.
export async function TuningsTeaser() {
  const t = await getTranslations();
  return (
    <section id="akortlar" className="bg-murekkep py-20 text-kagit/75 md:py-28 lg:py-32">
      <Container className="reveal grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow className="text-altin">{t('Home.tunings.eyebrow')}</Eyebrow>
          <h2 className="mt-5 max-w-[16ch] text-h2 text-kagit">{t('Home.tunings.title')}</h2>
          <p className="mt-6 max-w-[48ch]">{t('Tunings.intro')}</p>
        </div>
        <div className="lg:col-span-7">
          <ol className="grid border-t border-kagit/15 sm:grid-cols-2 sm:gap-x-10">
            {tunings.map((tu, i) => (
              <li key={tu.key} className="border-b border-kagit/15">
                <Link
                  href={{ pathname: '/akortlar', hash: tu.key }}
                  lang="tr"
                  className="group flex items-baseline gap-5 py-5 font-display text-2xl text-kagit transition-colors duration-200 hover:text-altin md:text-[1.875rem]"
                >
                  <span aria-hidden="true" className="index-num w-6 shrink-0 text-sm text-kamis">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">{tu.name}</span>
                  <span
                    aria-hidden="true"
                    className="text-base text-kagit/40 transition duration-200 group-hover:translate-x-1 group-hover:text-altin rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <Button href="/akortlar" variant="link" className="mt-10 text-altin">
            {t('Home.tunings.cta')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
