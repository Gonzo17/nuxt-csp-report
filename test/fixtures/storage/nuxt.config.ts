import NuxtCspReportModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    NuxtCspReportModule,
  ],
  nitro: {
    storage: {
      'csp-report-storage': {
        driver: 'memory',
      },
    },
  },
  cspReport: {
    endpoint: '/custom/csp-report',
    storageDriver: { name: 'fs', options: { base: './.data/test/csp-reports' } },
  },
})
