import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { tunings } from '@/data/tunings';
import { Link } from '@/i18n/navigation';

export async function TuningsTeaser() {
  const t = await getTranslations('Home.tunings');
  return (
    <section id="akortlar" className="bg-kagit-2 py-20">
      <Container className="text-center">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <ul className="flex flex-wrap justify-center gap-3">
          {tunings.map((tu) => (
            <li key={tu.key}>
              <Link
                href={{ pathname: '/akortlar', hash: tu.key }}
                lang="tr"
                className="inline-block rounded-full border border-altin px-5 py-2 font-display text-lg text-yesil hover:bg-altin hover:text-murekkep"
              >
                {tu.name}
              </Link>
            </li>
          ))}
        </ul>
        <Button href="/akortlar" variant="green" className="mt-10">
          {t('cta')}
        </Button>
      </Container>
    </section>
  );
}
