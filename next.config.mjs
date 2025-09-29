/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Aggressive optimization
    loader: 'default',
  },
  // Enable React strict mode for better performance
  reactStrictMode: true,
  // Enable compression for better performance
  compress: true,
  // Optimize fonts for better performance
  experimental: {
    optimizeCss: true,
    webVitalsAttribution: ['FCP', 'LCP', 'CLS', 'FID', 'TTFB'],
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Reduce bundle size by replacing moment.js with dayjs if used
    config.resolve.alias.moment = 'dayjs'
    
    // Only include necessary locales for dayjs if used
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // Optimize for faster builds
    if (!dev) {
      // Reduce info logging
      config.stats = 'errors-only';
      
      // Optimize build performance
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        flagIncludedChunks: true,
        sideEffects: true,
      };
    }
    
    return config
  },
  // Enable faster page builds
  modularizeImports: {
    '@radix-ui/react-*': {
      transform: '@radix-ui/react-*/{{member}}',
      preventFullImport: true,
    },
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
      skipDefaultConversion: true,
    },
  },
  // Removed swcMinify as it's not recognized
}

export default nextConfig