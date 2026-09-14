import type { StaticImageData } from 'next/image';

export type CaseModel = {
  key: 'aluminium-3' | 'aluminium-set' | 'wood-2' | 'wood-3' | 'wood-4';
  capacity: number | 'set';
  material: 'aluminium' | 'wood';
  dimensionsCm: [number, number, number] | null;
  image: StaticImageData | null;
};

// Mevcut sitedeki iki model. `case/cover.jpg` (Görev 5) belirli bir modeli
// açıkça göstermediği ve üzerinde Türkçe metin gömülü olduğu için (yerelleştirme
// sorunu) hiçbir modele atanmadı — `image: null` kalır. Ölçü ve ağırlık ustadan
// gelmediği için `dimensionsCm: null` (uydurma yok).
export const caseModels: CaseModel[] = [
  { key: 'aluminium-3', capacity: 3, material: 'aluminium', dimensionsCm: null, image: null },
  { key: 'aluminium-set', capacity: 'set', material: 'aluminium', dimensionsCm: null, image: null },
];
