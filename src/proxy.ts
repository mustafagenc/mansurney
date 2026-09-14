import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

// Nokta içeren yollar (eski *.php URL'leri dahil) proxy'ye girmez; onları next.config redirects karşılar.
export const config = { matcher: '/((?!api|_next|_vercel|.*\\..*).*)' };
