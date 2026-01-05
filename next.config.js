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

    // Better error handling for chunk loading
    if (!isServer) {
      config.output = {
        ...config.output,
        // Ensure proper chunk loading
        chunkLoadingGlobal: 'webpackChunk',
      }
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
            // Framework chunk (React, Next, etc.)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // MUI and Emotion
            mui: {
              name: 'mui',
              test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
              chunks: 'all',
              priority: 30,
              enforce: true,
            },
            // Other vendors
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 20,
            },
          },
        },
      }
    }

    return config
  },
}

module.exports = withBundleAnalyzer(config)
