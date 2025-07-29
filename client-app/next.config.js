/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  sassOptions: {
    includePaths: ['./src/styles'],
  },
}

module.exports = nextConfig
