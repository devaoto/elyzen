import withPWAInit from '@ducanh2912/next-pwa';
import { withHydrationOverlay } from '@builder.io/react-hydration-overlay/next';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 's4.anilist.co',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'artworks.thetvdb.com',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'media.kitsu.io',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'img1.ak.crunchyroll.com',
        port: '',
        pathname: '/**',
        protocol: 'https',
      },
    ],
  },
};

const combinedConfig = withPWA(
  withHydrationOverlay({ appRootSelector: 'main' })(nextConfig)
);

export default combinedConfig;
