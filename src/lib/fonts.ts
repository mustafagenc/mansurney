import { Fraunces, Noto_Naskh_Arabic, Source_Sans_3 } from 'next/font/google';

const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' });
const sourceSans = Source_Sans_3({ subsets: ['latin', 'latin-ext'], weight: ['400', '600', '700'], variable: '--font-source-sans', display: 'swap' });
const notoNaskh = Noto_Naskh_Arabic({ subsets: ['arabic'], weight: ['400', '600'], variable: '--font-noto-naskh', display: 'swap' });

export const fontVariables = [fraunces.variable, sourceSans.variable, notoNaskh.variable].join(' ');
