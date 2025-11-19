/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    turbo: {
      resolveAlias: {
        'next-auth': 'next-auth/edge'
      }
    }
  },
  reactStrictMode: true,
};

export default nextConfig;
