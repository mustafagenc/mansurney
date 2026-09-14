import type { Locale } from '@/i18n/routing';

export type Couplet = { id: string; lines: Record<Locale, string[]>; source: string };

// Yalnızca mevcut sitede yayında olan iki beyit (analiz §7); arşivdeki diğer
// beyitler müşteri tercihiyle eklenir, Mesnevî tercümesinin kaynağı
// netleşmeden eklenmez.
export const couplets: Couplet[] = [
  {
    id: 'mesnevi-1',
    source: 'Mevlânâ, Mesnevî',
    lines: {
      tr: ['Dinle, bu ney nasıl şikâyet ediyor;', 'ayrılıkları nasıl anlatıyor.'],
      en: ['Listen to the ney, how it complains,', 'telling the tale of separations.'],
      ar: ['اسمع الناي كيف يشكو،', 'وكيف يحكي حكاية الفراق.'],
    },
  },
  {
    id: 'la-edri',
    source: 'Lâ-edrî',
    lines: {
      tr: ['Bir çemenden yaratıp Hazret-i Mevlâ nây’ı,', 'Halka bildirmek için Hazret-i Mevlânâ’yı.'],
      en: ['Having created the ney from a meadow, God', 'made Rumi known to the world through it.'],
      ar: ['خلق الله الناي من مرج', 'ليُعرّف الناس بمولانا.'],
    },
  },
];
