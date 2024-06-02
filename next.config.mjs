/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErros: true
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

export default nextConfig;
