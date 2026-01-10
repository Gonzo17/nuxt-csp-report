import { describe, it, expect } from 'vitest'
import { normalizeCspReport } from '../src/runtime/server/utils/normalizeCspReport'

describe('normalizeCspReport', () => {
  it('normalizes report-to violation', () => {
    const reportToPayload = [
      {
        age: 53710,
        url: 'https://canhas.report/csp-report-to',
        body: {
          sample: '',
          referrer: 'https://www.ecosia.org/',
          blockedURL: 'https://evil.com/image.png',
          statusCode: 200,
          disposition: 'enforce',
          documentURL: 'https://example.com',
          originalPolicy: 'default-src \'none\'; img-src \'self\'; report-to default',
          effectiveDirective: 'img-src',
        },
        type: 'csp-violation',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
      },
    ]

    const results = normalizeCspReport(reportToPayload)

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      documentURL: 'https://example.com',
      blockedURL: 'https://evil.com/image.png',
      directive: 'img-src',
      disposition: 'enforce',
    })
  })

  it('normalizes multiple report-to violations in array', () => {
    const reportToPayload = [
      {
        age: 6930,
        url: 'https://example.com',
        body: {
          sample: 'console.log("lo")',
          referrer: 'https://www.ecosia.org/',
          blockedURL: 'inline',
          lineNumber: 121,
          sourceFile: 'https://example.com',
          statusCode: 200,
          disposition: 'enforce',
          documentURL: 'https://example.com',
          columnNumber: 39,
          originalPolicy: 'default-src \'none\'; img-src \'self\'; report-to default',
          effectiveDirective: 'script-src-elem',
        },
        type: 'csp-violation',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
      },
      {
        age: 15201,
        url: 'https://example.com',
        body: {
          sample: '',
          referrer: 'https://www.ecosia.org/',
          blockedURL: 'https://evil.com/image.png',
          statusCode: 200,
          disposition: 'enforce',
          documentURL: 'https://example.com',
          originalPolicy: 'default-src \'none\'; img-src \'self\'; report-to default',
          effectiveDirective: 'img-src',
        },
        type: 'csp-violation',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
      },
    ]

    const results = normalizeCspReport(reportToPayload)

    expect(results).toHaveLength(2)
    expect(results[0]!).toMatchObject({
      directive: 'script-src-elem',
      documentURL: 'https://example.com',
      blockedURL: 'inline',
      disposition: 'enforce' })
    expect(results[1]!).toMatchObject({
      directive: 'img-src',
      documentURL: 'https://example.com',
      blockedURL: 'https://evil.com/image.png',
      disposition: 'enforce' })
  })

  it('keeps column number when provided', () => {
    const reportToPayload = [
      {
        age: 6930,
        url: 'https://example.com',
        body: {
          sample: 'console.log("lo")',
          referrer: 'https://www.ecosia.org/',
          blockedURL: 'inline',
          lineNumber: 121,
          columnNumber: 39,
          sourceFile: 'https://example.com',
          statusCode: 200,
          disposition: 'enforce',
          documentURL: 'https://example.com',
          originalPolicy: 'default-src \'none\'; img-src \'self\'; report-to default',
          effectiveDirective: 'script-src-elem',
        },
        type: 'csp-violation',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
      },
    ]

    const results = normalizeCspReport(reportToPayload)

    expect(results[0]).toMatchObject({
      line: 121,
      column: 39,
    })
  })

  it('skips invalid entries but keeps valid ones in report-to array', () => {
    const reportToPayload = [
      { invalid: true },
      {
        age: 15201,
        url: 'https://example.com',
        body: {
          sample: '',
          referrer: 'https://www.ecosia.org/',
          blockedURL: 'https://evil.com/image.png',
          statusCode: 200,
          disposition: 'enforce',
          documentURL: 'https://example.com',
          originalPolicy: 'default-src \'none\'; img-src \'self\'; report-to default',
          effectiveDirective: 'img-src',
        },
        type: 'csp-violation',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
      },
    ]

    const results = normalizeCspReport(reportToPayload)

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      directive: 'img-src',
      blockedURL: 'https://evil.com/image.png',
    })
  })

  it('normalizes report-uri violation', () => {
    const reportToPayload = {
      'csp-report': {
        'document-uri': 'https://example.com',
        'referrer': '',
        'violated-directive': 'img-src',
        'effective-directive': 'img-src',
        'original-policy': 'base-uri \'none\'; font-src \'self\' https: data:; form-action \'self\'; frame-ancestors \'self\'; img-src \'self\' data:; object-src \'none\'; script-src-attr \'none\'; style-src \'self\' https: \'unsafe-inline\'; script-src \'self\' https: \'unsafe-inline\' \'strict-dynamic\' \'nonce-f5DTfUXvU+t3dtlmvGBTjGxP\'; upgrade-insecure-requests; report-uri /custom/csp-report;',
        'disposition': 'enforce',
        'blocked-uri': 'https://evil.com/image.png',
        'line-number': 13,
        'source-file': 'https://example.com',
        'status-code': 200,
        'script-sample': '',
      },
    }

    const results = normalizeCspReport(reportToPayload)

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      documentURL: 'https://example.com',
      blockedURL: 'https://evil.com/image.png',
      directive: 'img-src',
      disposition: 'enforce',
    })
  })

  it('handles empty report and returns empty array', () => {
    const results = normalizeCspReport({})

    expect(results).toHaveLength(0)
  })

  it('handles null input and returns empty array', () => {
    const results = normalizeCspReport(null)

    expect(results).toHaveLength(0)
  })

  it('handles invalid CSP report format and returns empty array', () => {
    const results = normalizeCspReport('invalid string')

    expect(results).toHaveLength(0)
  })

  it('handles array without csp-violation type', () => {
    const reportToPayload = [
      { type: 'other-report', body: {} },
      { type: 'deprecation', body: {} },
      { type: 'intervention', body: {} },
    ]

    const results = normalizeCspReport(reportToPayload)

    expect(results).toHaveLength(0)
  })

  it('generates current timestamp for valid reports', () => {
    const before = Date.now()
    const report = {
      'csp-report': {
        'blocked-uri': 'https://evil.com/script.js',
        'disposition': 'enforce',
        'document-uri': 'https://example.com',
        'effective-directive': 'script-src',
        'violated-directive': 'script-src',
      },
    }
    const results = normalizeCspReport(report)
    const after = Date.now()

    expect(results[0]!.timestamp).toBeGreaterThanOrEqual(before)
    expect(results[0]!.timestamp).toBeLessThanOrEqual(after + 100)
  })

  it('generates independent timestamps for multiple reports', async () => {
    const report = {
      'csp-report': {
        'blocked-uri': 'https://evil.com/script.js',
        'disposition': 'enforce',
        'document-uri': 'https://example.com',
        'effective-directive': 'script-src',
        'violated-directive': 'script-src',
      },
    }
    const results1 = normalizeCspReport(report)
    await new Promise(resolve => setTimeout(resolve, 10))
    const results2 = normalizeCspReport(report)

    expect(results2[0]!.timestamp).toBeGreaterThanOrEqual(results1[0]!.timestamp)
  })
})
