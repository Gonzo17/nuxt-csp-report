import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import type { NuxtCspReportModuleOptions } from './types/module'

export * from './types/module'
export * from './types/report'

export default defineNuxtModule<NuxtCspReportModuleOptions>({
  meta: {
    name: 'nuxt-csp-report',
    configKey: 'cspReport',
  },
  defaults: {
    endpoint: '/api/csp-report',
    console: 'summary',
    reportingEndpointsHeader: false,
  },
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.cspReport = {
      endpoint: moduleOptions.endpoint,
      reportingEndpointsHeader: moduleOptions.reportingEndpointsHeader,
      console: moduleOptions.console,
      storage: moduleOptions.storage
        ? {
            keyPrefix: moduleOptions.storage.keyPrefix || 'csp-report',
            driver: moduleOptions.storage.driver,
          }
        : undefined,
    }

    addServerHandler({
      route: moduleOptions.endpoint,
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/csp-report.post'),
    })

    nuxt.hook('nitro:config', (config) => {
      const cspReportConfig = nuxt.options.runtimeConfig.cspReport
      if (!cspReportConfig) return

      if (cspReportConfig.reportingEndpointsHeader) {
        config.plugins = config.plugins || []
        config.plugins.push(resolver.resolve('./runtime/nitro/plugin/reporting-endpoints-header'))
      }

      const storageDriver = cspReportConfig.storage?.driver
      if (!storageDriver) return

      const { name, options = {} } = storageDriver
      config.storage = defu(
        {
          'csp-report-storage': {
            driver: name,
            ...options,
          },
        },
        config.storage,
      )
    })
  },
})
