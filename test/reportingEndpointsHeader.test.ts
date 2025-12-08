import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch, useTestContext } from '@nuxt/test-utils'
import { joinURL } from 'ufo'

describe('[nuxt-csp-report] with reportingEndpointsHeader', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/reportingEndpointsHeader', import.meta.url)),
  })

  it('html page returns with Reporting-Endpoints header', async () => {
    const { headers } = await fetch('/')
    const context = useTestContext()
    expect(headers.has('reporting-endpoints')).toBeTruthy()
    const endpoint = joinURL(context.url!, context.nuxt!.options.cspReport.endpoint)
    expect(headers.get('reporting-endpoints')).toMatch(`csp-endpoint="${endpoint}"`)
  })
})
