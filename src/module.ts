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
  },
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.cspReport = {
      endpoint: moduleOptions.endpoint,
      console: moduleOptions.console,
      storage: moduleOptions.storage,
    }

    addServerHandler({
      route: moduleOptions.endpoint,
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/csp-report.post'),
    })

    nuxt.hook('nitro:config', (config) => {
      const storageDriver = config.runtimeConfig?.cspReport?.storage?.driver
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
