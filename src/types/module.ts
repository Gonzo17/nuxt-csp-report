import type { BuiltinDriverOptions } from 'unstorage'

export interface NuxtCspReportModuleOptions {
  endpoint: string
  console: 'summary' | 'full' | false
  storageDriver?: {
    [driverName in keyof BuiltinDriverOptions]: {
      name: driverName
      options?: BuiltinDriverOptions[driverName] }
  }[keyof BuiltinDriverOptions]
}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    cspReport?: NuxtCspReportModuleOptions
  }
}
