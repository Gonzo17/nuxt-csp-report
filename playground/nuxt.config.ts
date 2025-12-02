export default defineNuxtConfig({
  modules: ['../src/module', 'nuxt-security'],
  devtools: { enabled: true },
  cspReport: {
    console: 'full',
    endpoint: '/custom/csp-report',
    storage: {
      driver: {
        name: 'fs',
        options: { base: './.data/playground' },
      },
    },
  },
  security: {
    rateLimiter: false,
    headers: {
      contentSecurityPolicy: {
        'report-uri': '/custom/csp-report',
        // CSP header to allow images in the playground
        // 'img-src': ['\'self\'', 'data:', 'https://picsum.photos', 'https://*.picsum.photos'],
      },
    },
  },
})
