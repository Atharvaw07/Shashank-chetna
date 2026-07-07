/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-1953a6673e864f3488c645252f75de98.r2.dev',
      },
    ],
  },
};

export default nextConfig;
