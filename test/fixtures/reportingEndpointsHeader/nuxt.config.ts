import NuxtCspReportModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    NuxtCspReportModule,
  ],
  cspReport: {
    reportingEndpointsHeader: true,
    endpoint: '/custom/csp-report',
  },
})
