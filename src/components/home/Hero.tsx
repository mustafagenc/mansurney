import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import heroImage from '@/assets/images/hero/reeds-28.jpg';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

export async function Hero() {
  const t = await getTranslations();
  return (
    <section id="hero" className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-murekkep">
      {/* Next.js 16 deprecated `priority` in favor of `preload` (see
          node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md,
          "#preload" / "#priority"). Neither `preload` nor legacy `priority`
          sets the rendered `fetchpriority` attribute by themselves — that prop
          is passed straight through to the `<img>` (see
          node_modules/next/dist/shared/lib/get-img-props.js, `fetchPriority`
          is a raw pass-through, never derived from `priority`/`preload`). The
          docs' own guidance for this exact case ("the image is the LCP
          element … above the fold, typically the hero image") says: "In most
          cases, you should use `loading='eager'` or `fetchPriority='high'`
          instead of `preload`." We use both together here: `loading="eager"`
          disables native lazy-loading and `fetchPriority="high"` produces the
          `fetchpriority="high"` attribute the LCP test asserts. */}
      <Image
        src={heroImage}
        alt={t('Home.hero.imageAlt')}
        fill
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        sizes="100vw"
        className="-z-10 object-cover opacity-80"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-murekkep via-murekkep/50 to-transparent" />
      <Container className="pb-20 pt-40 text-kagit">
        <Eyebrow className="text-altin!">{t('Home.hero.eyebrow')}</Eyebrow>
        <h1 className="mt-3 text-5xl text-kagit md:text-7xl">{t('Home.hero.title')}</h1>
        <p className="mt-4 max-w-xl font-display text-xl italic text-kamis">{t('Home.hero.text')}</p>
        <p className="mt-2 max-w-xl text-kagit/90">{t('Home.hero.lead')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/siparis" variant="onDark">
            {t('Nav.order')}
          </Button>
          <Button href="/galeri" variant="secondary" className="text-kagit">
            {t('Home.hero.gallery')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
