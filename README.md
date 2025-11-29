# Nuxt CSP Report

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for collecting, normalizing, and persisting Content Security Policy (CSP) reports.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Features

- 📋 Register a POST endpoint for CSP reports
- 🔄 Support both legacy CSP and Report-To format reports
- ✅ Validate and normalize reports with Zod
- 💾 Persist reports via unstorage
- 📝 Full TypeScript support with proper type exports

## Quick Setup

Install the module to your Nuxt application:

```bash
npm install nuxt-csp-report
```

Add it to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-csp-report'],
  cspReport: {
    //  Module options
  },
})
```

## Options

### endpoint
* Type: `string`
* Default: `/api/csp-report`
* Description: Optional. Path for the CSP report endpoint.

### console 
* Type: `'summary' | 'full' | false`
* Default: `'summary'`
* Description: Optional. Log reports to console on server. `'full'` will print the `NormalizedCspReport` object.

### storage
* Type: See fields below.
* Description: Optional. Sets up a storage using `unstorage`, which is part of Nitro and Nuxt.

### storage.driver
* Type: `BuiltinDriverOptions`
* Description: Defines the driver from `unstorage`. You can use the same notation and drivers as in Nuxt:
  * https://nuxt.com/docs/4.x/directory-structure/server#server-storage
  * https://nitro.build/guide/storage
  * https://unstorage.unjs.io/drivers

## Usage

Once configured, the module registers a POST endpoint that accepts CSP reports in two formats:

### Legacy CSP Report Format

```json
{
  "csp-report": {
    "document-uri": "https://example.com",
    "blocked-uri": "https://evil.com",
    "violated-directive": "script-src",
    "effective-directive": "script-src",
    "original-policy": "script-src 'self'",
    "disposition": "enforce"
  }
}
```

### Report-To Format

```json
[
  {
    "type": "csp-violation",
    "body": {
      "documentURI": "https://example.com",
      "blockedURI": "https://evil.com",
      "violatedDirective": "script-src",
      "effectiveDirective": "script-src",
      "originalPolicy": "script-src 'self'",
      "disposition": "enforce"
    }
  }
]
```

The gathered data is normalized for logging and persisting:

### Normalized Report Type

```typescript
interface NormalizedCspReport {
  ts: number
  documentURL?: string
  blockedURL?: string
  directive?: string
  sourceFile?: string
  line?: number
  column?: number
  disposition?: 'enforce' | 'report'
  raw: unknown
}
```

If you persist the CSP reports with the `storage` option, you can also access the reports with `useStorage` yourself:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-csp-report'],
  cspReport: {
    storage: {
      driver: {
        name: 'redis',
        options: {
          // Your redis configuration
        } 
      }
    },
  },
})
```

```typescript
import  { type NormalizedCspReport } from 'nuxt-csp-report'

const storage = useStorage<NormalizedCspReport>('csp-report-storage')
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm run dev:prepare
  
  # Develop with the playground
  pnpm run dev
  
  # Build the playground
  pnpm run dev:build
  
  # Run ESLint
  pnpm run lint
  
  # Run Vitest
  pnpm run test
  pnpm run test:watch
  
  # Build the module
  pnpm run prepack
  
  # Release new version
  pnpm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-csp-report/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-csp-report

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-csp-report.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-csp-report

[license-src]: https://img.shields.io/npm/l/nuxt-csp-report.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-csp-report

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
