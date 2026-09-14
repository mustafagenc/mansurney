import type { MDXComponents } from 'mdx/types';
import { Figure } from '@/components/mdx/Figure';

const components: MDXComponents = {
  h2: (p) => <h2 className="mt-12 mb-4 text-2xl md:text-3xl" {...p} />,
  h3: (p) => <h3 className="mt-8 mb-3 text-xl" {...p} />,
  p: (p) => <p className="my-4" {...p} />,
  ul: (p) => <ul className="my-4 list-disc space-y-2 ps-6" {...p} />,
  ol: (p) => <ol className="my-4 list-decimal space-y-2 ps-6" {...p} />,
  blockquote: (p) => <blockquote className="my-8 border-s-4 border-altin ps-6 font-display text-xl italic text-yesil" {...p} />,
  a: (p) => <a className="text-yesil underline decoration-altin underline-offset-4" {...p} />,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
