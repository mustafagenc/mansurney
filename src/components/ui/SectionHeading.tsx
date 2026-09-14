import { Eyebrow } from './Eyebrow';
import { ReedDivider } from './ReedDivider';

type Props = { eyebrow: string; title: string; description?: string; align?: 'center' | 'start'; as?: 'h1' | 'h2' };

export function SectionHeading({ eyebrow, title, description, align = 'center', as: H = 'h2' }: Props) {
  return (
    <header className={align === 'center' ? 'mx-auto mb-10 max-w-2xl text-center' : 'mb-8'}>
      <ReedDivider className={align === 'center' ? 'mx-auto mb-6 max-w-[220px]' : 'mb-6 max-w-[220px]'} />
      <Eyebrow>{eyebrow}</Eyebrow>
      <H className="mt-2 text-3xl md:text-4xl">{title}</H>
      {description && <p className="mt-3 text-metin-soluk">{description}</p>}
    </header>
  );
}
