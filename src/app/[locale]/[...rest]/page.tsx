import { notFound } from 'next/navigation';

// Catch-all for unknown paths under a valid locale so that the localized
// `not-found.tsx` (not the root one) renders — otherwise `/en/unknown-page`
// has no matching route and Next falls back to the root 404 outside `[locale]`.
export default function CatchAll() {
  notFound();
}
