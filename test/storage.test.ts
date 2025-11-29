import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('[nuxt-csp-report] with storage', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/storage', import.meta.url)),
  })

  afterEach(async () => {
    // Clear storage between tests
    await $fetch('/api/clear')
  })

  it('calls csp report endpoint with empty body', async () => {
    expect(await $fetch('/api/reports')).toStrictEqual({
      keys: [],
      items: [],
    })

    const response = await $fetch('/custom/csp-report', { method: 'POST', body: {} })
    expect(response).toStrictEqual({
      ok: true,
    })

    expect(await $fetch('/api/reports')).toStrictEqual({
      keys: [],
      items: [],
    })
  })

  it('calls csp report endpoint with valid csp report', async () => {
    expect(await $fetch('/api/reports')).toStrictEqual({
      keys: [],
      items: [],
    })

    const cspReport = { 'csp-report': { 'document-uri': 'http://localhost:3000/', 'referrer': '', 'violated-directive': 'img-src', 'effective-directive': 'img-src', 'original-policy': 'base-uri \'none\'; font-src \'self\' https: data:; form-action \'self\'; frame-ancestors \'self\'; img-src \'self\' data:; object-src \'none\'; script-src-attr \'none\'; style-src \'self\' https: \'unsafe-inline\'; script-src \'self\' https: \'unsafe-inline\' \'strict-dynamic\' \'nonce-UkSxYctV6Dnr92rrBYJOI32S\'; upgrade-insecure-requests; report-uri /custom/csp-report;', 'disposition': 'enforce', 'blocked-uri': 'https://picsum.photos/200', 'line-number': 10, 'source-file': 'http://localhost:3000/', 'status-code': 200, 'script-sample': '' } }

    const response = await $fetch('/custom/csp-report', { method: 'POST', body: cspReport })
    expect(response).toStrictEqual({
      ok: true,
    })

    expect(await $fetch('/api/reports')).toEqual({
      keys: [expect.stringMatching(/^csp:\d+:[\w-]{8}-[\w-]{4}-[\w-]{4}-[\w-]{4}-[\w-]{12}$/)],
      items: [expect.objectContaining({
        ts: expect.any(Number),
        documentURL: 'http://localhost:3000/',
        blockedURL: 'https://picsum.photos/200',
        directive: 'img-src',
        sourceFile: 'http://localhost:3000/',
        line: 10,
        disposition: 'enforce',
        raw: cspReport['csp-report'],
      })],
    })
  })

  it('calls csp report endpoint with invalid csp report', async () => {
    expect(await $fetch('/api/reports')).toStrictEqual({
      keys: [],
      items: [],
    })

    const invalidCspReport = { 'csp-rep': { 'uri': 'http://localhost:3000/', 'violated-directive': 'img-src' } }

    const response = await $fetch('/custom/csp-report', { method: 'POST', body: invalidCspReport })
    expect(response).toStrictEqual({
      ok: true,
    })

    expect(await $fetch('/api/reports')).toStrictEqual({
      keys: [],
      items: [],
    })
  })
})
