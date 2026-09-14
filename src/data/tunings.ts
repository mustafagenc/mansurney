export const tuningKeys = [
  'bolahenk',
  'supurde',
  'mansur',
  'kiz',
  'mustahsen',
  'sah',
  'davud',
  'bolahenkNisfiye',
] as const;
export type TuningKey = (typeof tuningKeys)[number];

export type Tuning = { key: TuningKey; name: string; lengthCm: number | null; audio: string | null };

const names: Record<TuningKey, string> = {
  bolahenk: 'Bolâhenk',
  supurde: 'Süpürde',
  mansur: 'Mansur',
  kiz: 'Kız',
  mustahsen: 'Müstahsen',
  sah: 'Şah',
  davud: 'Davud',
  bolahenkNisfiye: 'Bolâhenk Nısfiye',
};

// Boy ve ses kaydı Görev 0’da ustadan gelir; gelene kadar null (sayfa "ustaya danışın" gösterir).
// Sıra mevcut sipariş formundaki sıradır; usta perde yüksekliğine göre sıralanmasını isterse burada değiştirilir.
export const tunings: Tuning[] = tuningKeys.map((key) => ({ key, name: names[key], lengthCm: null, audio: null }));

export const isTuningKey = (v: unknown): v is TuningKey =>
  typeof v === 'string' && (tuningKeys as readonly string[]).includes(v);
