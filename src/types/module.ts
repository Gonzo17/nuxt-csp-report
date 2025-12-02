import type { BuiltinDriverOptions } from 'unstorage'

export interface NuxtCspReportModuleOptions {
  endpoint: string
  console: 'summary' | 'full' | false
  storage?: {
    keyPrefix?: string
    driver: {
      [driverName in keyof BuiltinDriverOptions]: {
        name: driverName
        options?: BuiltinDriverOptions[driverName] }
    }[keyof BuiltinDriverOptions]
  }
}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    cspReport?: NuxtCspReportModuleOptions
  }
}
