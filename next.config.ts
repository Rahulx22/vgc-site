import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vgc.psofttechnologies.in",
        pathname: "/storage/builder/**",
      },
    ],
    // Add image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'], // Use WebP format for better compression
    minimumCacheTTL: 300, // Cache images for 5 minutes (300 seconds)
  },
  // Add experimental features for better performance
  experimental: {
    optimizeCss: true, // Optimize CSS
    optimizePackageImports: [], // Optimize package imports
    // Enable React compiler for better performance
    reactCompiler: true,
  },
  // Configure caching headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate, s-maxage=300", // 5 minutes shared cache
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // 1 year for static assets
          },
        ],
      },
    ];
  },
  // Add webpack optimizations
  webpack: (config) => {
    // Reduce bundle size by ignoring unused modules
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            // Split vendor chunks more efficiently
            maxSize: 244000, // 244KB max size per chunk
          },
          // Create separate chunk for jQuery and Bootstrap
          jquery: {
            test: /[\\/]node_modules[\\/](jquery)[\\/]/,
            name: 'jquery',
            chunks: 'all',
            enforce: true,
          },
          bootstrap: {
            test: /[\\/]node_modules[\\/](bootstrap|popperjs)[\\/]/,
            name: 'bootstrap',
            chunks: 'all',
            enforce: true,
          },
        },
      },
      // Minimize and optimize
      minimize: true,
    };
    
    return config;
  },
  // Enable compression
  compress: true,
  // Enable powered by header removal
  poweredByHeader: false,
};

export default nextConfig;