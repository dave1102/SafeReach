import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Overflow AI client build config.
// The PWA plugin pre-caches the app shell plus first-aid/hospital/contact
// data so the app stays usable with no signal — see src/services/api.js
// for how offline caching of API responses works alongside this.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Overflow AI - Emergency Assistant',
        short_name: 'Overflow AI',
        description: 'Instant emergency assistance, first aid guidance, and AI symptom help.',
        theme_color: '#1D4ED8',
        background_color: '#F8FAFC',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/first-aid'),
            handler: 'CacheFirst',
            options: { cacheName: 'first-aid-cache' }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/places'),
            handler: 'NetworkFirst',
            options: { cacheName: 'places-cache', networkTimeoutSeconds: 4 }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
