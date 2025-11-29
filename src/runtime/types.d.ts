import type { NuxtCspReportModuleOptions } from '../module'

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    cspReport?: NuxtCspReportModuleOptions
  }
}

export { }
