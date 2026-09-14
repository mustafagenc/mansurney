export type ImageSource = { url: string; out: string };

const live = 'https://mansurney.com';

export const imageSources: ImageSource[] = [
  { url: `${live}/assets/img/amblem.svg`, out: 'brand/amblem.svg' },
  { url: `${live}/resimler/banner/28.jpg`, out: 'hero/reeds-28.jpg' },
  { url: `${live}/resimler/banner/27.jpg`, out: 'hero/reeds-27.jpg' },
  { url: `${live}/resimler/banner/26.jpg`, out: 'hero/reeds-26.jpg' },
  { url: `${live}/resimler/banner/23.jpg`, out: 'hero/reeds-23.jpg' },
  { url: `${live}/resimler/site/hakkinda.jpg`, out: 'workshop/about.jpg' },
  { url: `${live}/resimler/icerikler/10.jpg`, out: 'guide/history.jpg' },
  { url: `${live}/resimler/icerikler/11.jpg`, out: 'guide/making.jpg' },
  { url: `${live}/resimler/icerikler/12.jpg`, out: 'guide/anatomy.jpg' },
  { url: `${live}/resimler/icerikler/13.jpg`, out: 'guide/care.jpg' },
  { url: `${live}/resimler/icerikler/14.jpg`, out: 'case/cover.jpg' },
  ...[16, 17, 18, 19].map((n) => ({ url: `${live}/resimler/galeriresim/800/${n}.jpg`, out: `gallery/workshop-${n}.jpg` })),
];
