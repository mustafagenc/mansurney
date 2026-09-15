import Script from 'next/script';

// `next/script` + `afterInteractive`: Next.js'in Google Analytics için önerdiği yöntem
// (bkz. https://nextjs.org/docs/messages/next-script-for-ga) — betik ana iş parçacığını
// bloklamadan, sayfa etkileşimli hale geldikten hemen sonra yüklenir.
//
// Yalnızca ölçüm kimliği tanımlıysa VE Vercel Production ortamındaysa render edilir;
// yerel geliştirme ve Preview dağıtımlarının trafiği istatistikleri kirletmesin.
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id || process.env.VERCEL_ENV !== 'production') return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
