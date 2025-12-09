# Nuxt CSP Report

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for collecting, normalizing, and persisting Content Security Policy (CSP) reports.

[✨&nbsp;Release Notes](/CHANGELOG.md)

## What is CSP and CSP reports?

The CSP is a HTTP response header that allows you to control which resources a document is allowed to load. For example setting `Content-Security-Policy: script-src example.com;` will prevent any script tag from loading a source that is not from `example.com`. Any violation will be logged in the console of the browser. Additionally, a reporting endpoint can be set in the CSP header where the browser will send the CSP report to.

Once you decide to secure your website with CSP, you most likely want to analyze on production if your CSP headers are configured properly. That can be tricky the more external resources are loaded. Especially dynamically loaded scripts, e.g. depending on your country or your consent, are not always the same for every user. That's where the CSP reports are helpful, because they show the real CSP violations that users experience in their browsers.

## Features

- 📋 Registers a POST endpoint for CSP reports
- 📡 Adds the `Reporting-Endpoints` header to your responses for `report-to` support
- 🔄 Supports both legacy `report-uri` and `report-to` format reports
- ✅ Validates and normalizes reports with Zod
- 💾 Persists reports via unstorage
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

## Usage

The module is ready to go with the defaults.
In most use cases simple logs are sufficient. If you want to analyze CSP reports, you can use the `storage` option to persist the reports in a KV store. 

### nuxt-security

The Content Security Policy is set through specific headers. You can handle that yourself with Nuxt/Nitro, but I highly recommend using [nuxt-security](https://github.com/Baroshem/nuxt-security). 
Here is a minimal example of how to use the two moduls in combination:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-security', 'nuxt-csp-report'],
  security: {
    headers: {
      contentSecurityPolicy: {
        'report-uri': '/api/csp-report',
        // your CSP headers
      },
    },
  },
})
```

### Advanced: Access reports

Depending on your use case you might want to access the CSP reports. You can do that with `useStorage`:

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

## Options

### endpoint
* Type: `string`
* Default: `/api/csp-report`
* Description: Optional. Path for the CSP report endpoint.

### reportingEndpointsHeader 
* Type: `boolean`
* Default: `false`
* Description: Optional. Adds the `Reporting-Endpoints` header to your HTML responses, using `'csp-endpoint'` as the key and `endpoint` from the configuration as the value. This header is needed if you want to use `report-to csp-endpoint` in your CSP configuration.

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

### storage.keyPrefix 
* Type: `string`
* Default: `csp-report`
* Description: Optional. Key prefix for the stored reports.


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
