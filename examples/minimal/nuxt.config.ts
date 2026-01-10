import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['nuxt-csp-report', 'nuxt-security'],
  cspReport: {
    console: 'summary',
    storage: {
      driver: { name: 'fs', options: { base: './.tmp/csp-reports' } },
      keyPrefix: 'demo-csp-report',
    },
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'report-uri': '/api/csp-report',
      },
    },
  },
})
