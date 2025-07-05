import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // This ensures the build outputs to 'out' directory
  distDir: 'out'
}

export default nextConfig