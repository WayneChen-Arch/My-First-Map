import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['map-pin.svg'],
      manifest: {
        name: '我的第一張地圖',
        short_name: '第一張地圖',
        description: '為小朋友而設的北角社區探索地圖',
        theme_color: '#fffaf1',
        background_color: '#fffaf1',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/map-pin.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tiles\.openfreemap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'north-point-map-tiles',
              expiration: { maxEntries: 260, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
