/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

const config = {
  trailingSlash: true,
  reactStrictMode: false, //fix issue with the wysiwyg editor
  images: {
    domains: [
      'cloud.mseller.app',
      'storage.googleapis.com',
      'fastly.picsum.photos',
      '127.0.0.1',
    ],
  },
  // Production optimizations
  swcMinify: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        './node_modules/apexcharts-clevision',
      ),
    }

    // Optimize for production - only apply to production builds
    if (!isServer && process.env.NODE_ENV === 'production') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Framework chunk (React, Next, etc.)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              // Don't enforce - let Next.js handle it
              enforce: false,
            },
            // MUI and Emotion
            mui: {
              name: 'mui',
              test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
              chunks: 'all',
              priority: 30,
              enforce: false,
            },
            // Large libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                )?.[1]
                return `npm.${packageName?.replace('@', '')}`
              },
              priority: 20,
              minChunks: 1,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }

    return config
  },
}

module.exports = withBundleAnalyzer(config)
