'use client';

import { useState } from 'react';
import type { FormState } from '@/lib/forms/schemas';

// Her yeni action sonucunda artan bir sayı döndürür. Alanları saran `key` olarak
// kullanılır: React 19 action sonrası formu sıfırladığında alanlar yeniden
// bağlanır ve `state.values`'tan gelen yeni `defaultValue`/`defaultChecked`
// değerleriyle doğar (`<select>`'in `defaultValue` güncellemesini yok saymasını da aşar).
export function useSubmissionKey(state: FormState): number {
  const [tracked, setTracked] = useState({ state, key: 0 });
  if (tracked.state !== state) {
    const next = { state, key: tracked.key + 1 };
    setTracked(next);
    return next.key;
  }
  return tracked.key;
}
