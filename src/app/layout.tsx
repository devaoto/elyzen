import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import TopProgressBar from '@/components/TopProgressBar';
import NavBar from '@/components/NavBar';
import { Source_Sans_3 } from 'next/font/google';
import { Providers } from './providers';
import Footer from '@/components/Footer';
import Changelogs from '@/components/Changelogs';

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Elyzen',
  description: 'Not just another anime streaming site.',
  icons: {
    icon: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
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
            <Footer />
            <Changelogs />
          </Providers>
        </ThemeProvider>
        <TopProgressBar />
      </body>
    </html>
  );
}
