/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blue-official-newt-770.mypinata.cloud',
        port: '',
        pathname: '**',
      },
    ],
  },
}