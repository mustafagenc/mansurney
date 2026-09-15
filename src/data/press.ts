import type { StaticImageData } from 'next/image';
import type { Locale } from '@/i18n/routing';

/** Haberin görseli: fotoğraf ya da YouTube videosu. */
export type PressMedia =
  | { type: 'image'; image: StaticImageData; alt: Record<Locale, string> }
  | {
      type: 'youtube';
      /** YouTube video ID'si — `https://www.youtube.com/watch?v=<ID>` adresindeki `<ID>`. */
      videoId: string;
      /** İsteğe bağlı kapak görseli; yoksa sade bir oynat kartı gösterilir. */
      poster?: StaticImageData;
    };

export type PressItem = {
  /** Benzersiz kısa ad (ör. `hatay-gazetesi-2024-ney-atolyesi`). */
  id: string;
  /** Yayın tarihi, `YYYY-MM-DD`. Liste yeniden eskiye sıralanır. */
  date: string;
  /** Yayın organının adı (ör. "Hatay Gazetesi"). Çevrilmez. */
  outlet: string;
  title: Record<Locale, string>;
  /** İsteğe bağlı kısa açıklama. */
  description?: Record<Locale, string>;
  media?: PressMedia;
  /** Haberin orijinal bağlantısı. */
  url: string;
};

/*
 * Yeni haber eklemek için bu diziye bir kayıt ekleyin. Fotoğrafı `src/assets/images/press/`
 * altına koyup yukarıda `import` edin. Örnek:
 *
 * import haberFoto from '@/assets/images/press/hatay-gazetesi-2024.jpg';
 *
 * {
 *   id: 'hatay-gazetesi-2024',
 *   date: '2024-05-12',
 *   outlet: 'Hatay Gazetesi',
 *   title: { tr: '…', en: '…', ar: '…' },
 *   description: { tr: '…', en: '…', ar: '…' },
 *   media: { type: 'image', image: haberFoto, alt: { tr: '…', en: '…', ar: '…' } },
 *   // ya da: media: { type: 'youtube', videoId: 'dQw4w9WgXcQ' },
 *   url: 'https://…',
 * },
 */
export const press: PressItem[] = [];

export const sortedPress = () => [...press].sort((a, b) => b.date.localeCompare(a.date));
