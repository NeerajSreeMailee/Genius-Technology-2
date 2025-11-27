/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Enforce ESLint checks during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enforce TypeScript checks during builds
  },
  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/webp'], // Remove AVIF for faster processing
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: false, // Security improvement
    
    // Whitelist only necessary domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Add other specific domains as needed
    ],
    
    // Optimize loading
    loader: 'default',
  },
  // Enable React strict mode for development only
  reactStrictMode: process.env.NODE_ENV === 'development',
  // Enable compression for better performance
  compress: true,
  // Optimize fonts for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Add this:
    turbotrace: {
      logLevel: 'error'
    }
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
      // Show more detailed build information
      config.stats = 'normal';
      
      // Optimize build performance
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        flagIncludedChunks: true,
        sideEffects: true,
        // Enable more aggressive optimizations
        usedExports: true,
        concatenateModules: true,
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