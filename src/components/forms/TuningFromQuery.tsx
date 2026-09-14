'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, type RefObject } from 'react';
import { isTuningKey } from '@/data/tunings';

// `?akort=` sorgu parametresini yalnızca istemcide okuyup akort seçimini önceden
// ayarlar. Kendi `<Suspense>` sınırı içinde render edilir; böylece
// `useSearchParams` yalnızca bu boş bileşeni istemciye bırakır, formun kendisi
// statik HTML'de (SSG) kalır.
export function TuningFromQuery({ selectRef }: { selectRef: RefObject<HTMLSelectElement | null> }) {
  const akort = useSearchParams().get('akort');
  useEffect(() => {
    if (selectRef.current && isTuningKey(akort)) selectRef.current.value = akort;
  }, [akort, selectRef]);
  return null;
}
