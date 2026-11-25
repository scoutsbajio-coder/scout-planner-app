import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      // El usuario decide cuándo aplicar una versión nueva (evita perder lo que está capturando).
      registerType: 'prompt',
      // El registro lo hace el componente PwaUpdatePrompt con useRegisterSW.
      injectRegister: false,
      // Mismo nombre que usaba la versión anterior, para que las instalaciones existentes se actualicen.
      filename: 'service-worker.js',
      manifestFilename: 'manifest.webmanifest',
      includeAssets: ['icons/*', 'insignias/*'],
      manifest: {
        id: './',
        name: 'Scout Planner',
        short_name: 'Scout Planner',
        description: 'Tu bitácora, siempre contigo',
        lang: 'es-MX',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#070A08',
        theme_color: '#070A08',
        categories: ['productivity', 'education'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
        shortcuts: [
          { name: 'Calendario', url: './calendario', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Campamentos', url: './campamentos', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Adelanto de Tropa', url: './adelanto', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // Precachea TODO el build (JS y CSS con hash incluidos) para que funcione sin conexión desde la primera visita.
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,webmanifest}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
