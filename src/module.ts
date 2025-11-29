import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'
import type { NormalizedCspReport } from './runtime/server/utils/normalizeCspReport'
import type { BuiltinDriverOptions } from 'unstorage'

import { defu } from 'defu'

export interface NuxtCspReportModuleOptions {
  endpoint: string
  console: 'summary' | 'full' | false
  storageDriver?: {
    [driverName in keyof BuiltinDriverOptions]: {
      name: driverName
      options?: BuiltinDriverOptions[driverName] }
  }[keyof BuiltinDriverOptions]
}

export type { NormalizedCspReport }

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
