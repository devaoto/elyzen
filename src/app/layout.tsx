import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import TopProgressBar from '@/components/TopProgressBar';
import NavBar from '@/components/NavBar';
import { Source_Sans_3 } from 'next/font/google';
import { Providers } from './providers';

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Elyzen',
  description: 'Not just another anime streaming site.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
      </head>
      <body
        className={
          'h-full scrollbar scrollbar-track-sky-300 scrollbar-thumb-sky-700 ' +
          sourceSans.className
        }
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <NavBar />
            <main>{children}</main>
          </Providers>
        </ThemeProvider>
        <TopProgressBar />
      </body>
    </html>
  );
}
