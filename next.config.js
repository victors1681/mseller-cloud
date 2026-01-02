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
    domains: ['cloud.mseller.app', 'storage.googleapis.com'],
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
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      '@iconify/react',
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(
        __dirname,
        './node_modules/apexcharts-clevision',
      ),
    }

    // Optimize for production
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // MUI chunk
            mui: {
              name: 'mui',
              test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Redux chunk
            redux: {
              name: 'redux',
              test: /[\\/]node_modules[\\/](@reduxjs|redux|react-redux)[\\/]/,
              chunks: 'all',
              priority: 30,
            },
          },
        },
      }
    }

    return config
  },
}

module.exports = withBundleAnalyzer(config)
