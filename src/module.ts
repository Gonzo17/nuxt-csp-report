import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import type { NuxtCspReportModuleOptions } from './types/module'
import { CSP_REPORT_STORAGE } from './types/report'

export default defineNuxtModule<NuxtCspReportModuleOptions>({
  meta: {
    name: 'nuxt-csp-report',
    configKey: 'cspReport',
  },
  defaults: {
    endpoint: '/api/csp-report',
    console: 'summary',
  },
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.cspReport = {
      endpoint: moduleOptions.endpoint,
      console: moduleOptions.console,
      storageDriver: moduleOptions.storageDriver,
    }

    addServerHandler({
      route: moduleOptions.endpoint,
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/csp-report.post'),
    })

    nuxt.hook('nitro:config', (config) => {
      if (!moduleOptions.storageDriver) return

      const { name, options = {} } = moduleOptions.storageDriver
      config.storage = defu(
        {
          [CSP_REPORT_STORAGE]: {
            driver: name,
            ...options,
          },
        },
        config.storage,
      )
    })
  },
})
