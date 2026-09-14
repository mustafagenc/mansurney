import { Breadcrumbs, type Crumb } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/Container';

export function PageHero({ title, breadcrumbs }: { title: string; breadcrumbs: Crumb[] }) {
  return (
    <section className="bg-yesil py-12 text-kagit">
      <Container>
        <h1 className="text-4xl text-kagit md:text-5xl">{title}</h1>
        <div className="mt-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </Container>
    </section>
  );
}
