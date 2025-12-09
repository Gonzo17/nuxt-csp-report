export default defineNuxtConfig({
  modules: ['../src/module', 'nuxt-security'],
  devtools: { enabled: true },
  cspReport: {
    console: 'full',
    endpoint: '/custom/csp-report',
    // reportingEndpointsHeader: true,
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
        // 'report-to': 'csp-endpoint',
        // CSP header to allow images in the playground
        // 'img-src': ['\'self\'', 'data:', 'https://picsum.photos', 'https://*.picsum.photos'],
      },
    },
  },
})
// 'report-to' only works with https, so it's not used in the playground,
//  but it's recommended to use both 'report-uri' and 'report-to' in production
