import type { MDXComponents } from 'mdx/types';
import { Figure } from '@/components/mdx/Figure';

// Editoryal okuma düzeni (spec §4.1). `wrapper` tüm MDX içeriğini `.prose-editorial`
// ile sarar: okuma genişliği (65ch) ve TR/EN için ilk paragrafta drop cap
// (`globals.css`). Öğe stilleri aşağıda.
const components: MDXComponents = {
  wrapper: ({ children }) => <div className="prose-editorial">{children}</div>,
  h2: (p) => (
    <h2
      className="mt-16 mb-5 text-[1.75rem] leading-tight before:mb-6 before:block before:h-px before:w-10 before:bg-altin md:text-[2.125rem]"
      {...p}
    />
  ),
  h3: (p) => <h3 className="mt-10 mb-3 text-[1.375rem] leading-snug md:text-2xl" {...p} />,
  p: (p) => <p className="my-5" {...p} />,
  ul: (p) => <ul className="my-6 list-disc space-y-2 ps-6 marker:text-altin-metin" {...p} />,
  ol: (p) => <ol className="my-6 list-decimal space-y-2 ps-6 marker:text-altin-metin" {...p} />,
  blockquote: (p) => (
    <blockquote
      className="my-12 border-s border-altin ps-6 font-display text-[1.625rem] leading-snug italic text-murekkep md:ps-8 md:text-[2rem] [&>p]:my-0"
      {...p}
    />
  ),
  a: (p) => (
    <a
      className="text-murekkep underline decoration-altin decoration-1 underline-offset-[0.2em] transition-colors hover:text-yesil hover:decoration-2"
      {...p}
    />
  ),
  strong: (p) => <strong className="font-semibold text-murekkep" {...p} />,
  hr: (p) => <hr className="my-14 border-murekkep/10" {...p} />,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
