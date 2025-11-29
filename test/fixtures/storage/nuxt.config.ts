import NuxtCspReportModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    NuxtCspReportModule,
  ],
  cspReport: {
    endpoint: '/custom/csp-report',
    storage: {
      driver: {
        name: 'fs', options: { base: './.data/test/csp-reports' } },
    },
  },
})
