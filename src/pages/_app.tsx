import type { AppProps } from 'next/app';
import Head from 'next/head';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen">
      <Head>
        {/* Use the site logo as the favicon (PNG works across modern browsers) */}
        <link rel="icon" href="/tradforge-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/tradforge-logo.png" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
