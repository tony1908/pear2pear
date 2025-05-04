/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    forceSwcTransforms: false,
  },
  async redirects() {
    return [
      {
        source: '/markets/:id*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};