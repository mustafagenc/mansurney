import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="tr">
      <body style={{ fontFamily: 'system-ui', textAlign: 'center', padding: '4rem' }}>
        <h1>404</h1>
        <p>
          <Link href="/">mansurney.com</Link>
        </p>
      </body>
    </html>
  );
}
