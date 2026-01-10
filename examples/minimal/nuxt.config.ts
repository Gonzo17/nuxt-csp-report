import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['nuxt-csp-report', 'nuxt-security'],
  cspReport: {
    console: 'summary',
    storage: {
      driver: { name: 'fs', options: { base: './storage' } },
      keyPrefix: 'demo-csp-report',
    },
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'report-uri': '/api/csp-report',
        // Allow StackBlitz preview iframe
        'frame-ancestors': [
          '\'self\'',
          'stackblitz.com',
          '*.stackblitz.com',
          '*.stackblitz.io',
          'webcontainer.io',
          '*.webcontainer.io',
          'local-credentialless.webcontainer.io',
          '*.local-credentialless.webcontainer.io',
        ],
      },
      // Allow cross-origin resource and embedder for stackblitz demo
      crossOriginResourcePolicy: 'cross-origin',
      crossOriginEmbedderPolicy: 'require-corp',
    },
  },
})
