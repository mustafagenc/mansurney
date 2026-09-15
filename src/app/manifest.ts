import type { MetadataRoute } from 'next';

// Hafif PWA (yalnızca "ana ekrana ekle" — service worker/çevrimdışı önbellek yok).
// Site tek dilde tanıtılır (marka adı zaten TR/EN/AR'da aynı); `start_url` kök adrese
// gider, next-intl orada ziyaretçinin diline göre yönlendirme yapar.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mansur Ney — Neyzen Atölyesi',
    short_name: 'Mansur Ney',
    description: 'Hatay’da Asi kamışından el yapımı ney atölyesi.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1e6',
    theme_color: '#10201b',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
