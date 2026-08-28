import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const base = mode === 'pages' ? '/My-First-Map/' : '/'

  return {
    base,
    plugins: [
      react(),
      VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['map-pin.svg', 'north-point.pmtiles'],
      manifest: {
        name: '我的第一張地圖',
        short_name: '第一張地圖',
        description: '為小朋友而設的北角社區探索地圖',
        theme_color: '#fffaf1',
        background_color: '#fffaf1',
        display: 'standalone',
        scope: base,
        start_url: base,
        icons: [
          {
            src: `${base}map-pin.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      }),
    ],
  }
})
