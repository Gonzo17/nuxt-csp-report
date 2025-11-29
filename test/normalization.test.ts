import { describe, it, expect } from 'vitest'
import { normalizeCspReport } from '../src/runtime/server/utils/normalizeCspReport'

describe('normalizeCspReport', () => {
  describe('Chrome/Edge legacy CSP format', () => {
    it('normalizes chrome inline script violation', () => {
      const chromeReport = {
        'csp-report': {
          'document-uri': 'https://example.com/page',
          'violated-directive': 'script-src',
          'effective-directive': 'script-src',
          'original-policy': 'script-src \'self\'; object-src \'none\'',
          'blocked-uri': '',
          'source-file': 'https://example.com/page',
          'line-number': 42,
          'column-number': 10,
          'status-code': 200,
          'disposition': 'enforce',
        },
      }

      const results = normalizeCspReport(chromeReport)

      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com/page',
        directive: 'script-src',
        line: 42,
        column: 10,
        disposition: 'enforce',
      })
      expect(results[0]!.raw).toBeDefined()
    })

    it('normalizes chrome external resource violation', () => {
      const chromeReport = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'font-src',
          'effective-directive': 'font-src',
          'original-policy': 'default-src \'self\'',
          'blocked-uri': 'https://fonts.googleapis.com/css',
          'source-file': 'https://example.com',
          'line-number': 0,
          'column-number': 0,
          'status-code': 200,
        },
      }

      const results = normalizeCspReport(chromeReport)

      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com',
        blockedURL: 'https://fonts.googleapis.com/css',
        directive: 'font-src',
      })
    })

    it('normalizes chrome img-src violation with nonce', () => {
      const chromeReport = {
        'csp-report': {
          'document-uri': 'https://example.com/products',
          'violated-directive': 'img-src',
          'effective-directive': 'img-src',
          'original-policy': 'img-src \'self\' data:',
          'blocked-uri': 'https://evil.com/tracker.gif',
          'disposition': 'report',
        },
      }

      const results = normalizeCspReport(chromeReport)

      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com/products',
        blockedURL: 'https://evil.com/tracker.gif',
        directive: 'img-src',
        disposition: 'report',
      })
    })
  })

  describe('Firefox legacy CSP format', () => {
    it('normalizes firefox inline script violation', () => {
      const firefoxReport = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'script-src \'none\'',
          'effective-directive': 'script-src',
          'original-policy': 'script-src \'none\'',
          'blocked-uri': 'inline',
          'source-file': 'https://example.com',
          'line-number': 5,
          'column-number': 1,
          'status-code': 200,
        },
      }

      const results = normalizeCspReport(firefoxReport)

      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com',
        blockedURL: 'inline',
        line: 5,
        column: 1,
      })
    })

    it('normalizes firefox data: URI violation', () => {
      const firefoxReport = {
        'csp-report': {
          'document-uri': 'https://example.com/app',
          'violated-directive': 'script-src',
          'effective-directive': 'script-src',
          'original-policy': 'script-src \'self\'',
          'blocked-uri': 'data:text/javascript,alert(1)',
          'disposition': 'enforce',
        },
      }

      const results = normalizeCspReport(firefoxReport)

      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com/app',
        blockedURL: 'data:text/javascript,alert(1)',
      })
    })
  })

  describe('Safari/WebKit legacy CSP format', () => {
    it('normalizes safari style violation', () => {
      const safariReport = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'style-src',
          'effective-directive': 'style-src',
          'original-policy': 'style-src \'self\'',
          'blocked-uri': 'https://cdn.example.com/malicious.css',
          'source-file': 'https://example.com',
          'line-number': 123,
          'status-code': 200,
        },
      }

      const results = normalizeCspReport(safariReport)

      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com',
        blockedURL: 'https://cdn.example.com/malicious.css',
        directive: 'style-src',
        line: 123,
      })
    })

    it('normalizes safari worker-src violation', () => {
      const safariReport = {
        'csp-report': {
          'document-uri': 'https://app.example.com',
          'violated-directive': 'worker-src',
          'effective-directive': 'worker-src',
          'original-policy': 'worker-src \'self\'',
          'blocked-uri': 'blob:https://app.example.com/12345',
        },
      }

      const results = normalizeCspReport(safariReport)

      expect(results[0]).toMatchObject({
        documentURL: 'https://app.example.com',
        directive: 'worker-src',
      })
    })
  })

  describe('Report-To format (Chromium)', () => {
    it('normalizes report-to script-src violation', () => {
      const reportToPayload = [
        {
          type: 'csp-violation',
          body: {
            documentURI: 'https://example.com',
            violatedDirective: 'script-src',
            effectiveDirective: 'script-src',
            originalPolicy: 'script-src \'self\'',
            blockedURI: 'https://evil.com/malicious.js',
            sourceFile: 'https://example.com',
            lineNumber: 50,
            columnNumber: 5,
            statusCode: 200,
            disposition: 'enforce',
          },
        },
      ]

      const results = normalizeCspReport(reportToPayload)

      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com',
        blockedURL: 'https://evil.com/malicious.js',
        directive: 'script-src',
        line: 50,
        column: 5,
        disposition: 'enforce',
      })
    })

    it('normalizes multiple report-to violations in array', () => {
      const reportToPayload = [
        {
          type: 'csp-violation',
          body: {
            documentURI: 'https://example.com',
            violatedDirective: 'script-src',
            blockedURI: 'https://evil.com/1.js',
          },
        },
        {
          type: 'csp-violation',
          body: {
            documentURI: 'https://example.com',
            violatedDirective: 'img-src',
            blockedURI: 'https://evil.com/tracker.png',
          },
        },
        {
          type: 'other-report-type',
          body: {
            someData: 'should-be-ignored',
          },
        },
      ]

      const results = normalizeCspReport(reportToPayload)

      expect(results).toHaveLength(2)
      expect(results[0]!.directive).toBe('script-src')
      expect(results[1]!.directive).toBe('img-src')
    })

    it('normalizes report-to with kebab-case fields', () => {
      const reportToPayload = [
        {
          type: 'csp-violation',
          body: {
            'document-uri': 'https://example.com',
            'violated-directive': 'connect-src',
            'effective-directive': 'connect-src',
            'blocked-uri': 'https://tracker.example.com/api',
            'source-file': 'https://example.com/app.js',
            'line-number': 100,
            'column-number': 15,
            'disposition': 'report',
          },
        },
      ]

      const results = normalizeCspReport(reportToPayload)

      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com',
        directive: 'connect-src',
        blockedURL: 'https://tracker.example.com/api',
        disposition: 'report',
      })
    })
  })

  describe('Mixed format handling', () => {
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

    it('handles mixed browser field name conventions', () => {
      const mixedReport = {
        'csp-report': {
          'documentURI': 'https://example.com',
          'violated-directive': 'script-src',
          'effectiveDirective': 'script-src',
          'blocked-uri': 'https://evil.com/script.js',
          'blockedUri': 'https://other.com/alt.js',
          'lineNumber': 42,
          'source-file': 'https://example.com/main.js',
          'column-number': 20,
          'columnNumber': 25,
        },
      }

      const results = normalizeCspReport(mixedReport)

      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com',
        directive: 'script-src',
        blockedURL: 'https://evil.com/script.js',
        line: 42,
        column: 20,
      })
    })
  })

  describe('Real-world scenarios', () => {
    it('handles chrome preload/prefetch violation', () => {
      const report = {
        'csp-report': {
          'document-uri': 'https://app.example.com/settings',
          'violated-directive': 'connect-src',
          'effective-directive': 'connect-src',
          'original-policy': 'connect-src \'self\' https://api.example.com',
          'blocked-uri': 'https://analytics.google.com/collect',
          'source-file': 'https://app.example.com/settings',
          'line-number': 0,
          'column-number': 0,
          'status-code': 200,
          'disposition': 'enforce',
        },
      }

      const results = normalizeCspReport(report)

      expect(results[0]).toMatchObject({
        documentURL: 'https://app.example.com/settings',
        blockedURL: 'https://analytics.google.com/collect',
        directive: 'connect-src',
        disposition: 'enforce',
      })
      expect(results[0]!.ts).toBeGreaterThan(0)
    })

    it('handles frame-ancestors violation', () => {
      const report = {
        'csp-report': {
          'document-uri': 'https://secure.example.com',
          'violated-directive': 'frame-ancestors',
          'effective-directive': 'frame-ancestors',
          'original-policy': 'frame-ancestors \'self\'',
          'blocked-uri': 'https://evil.com',
          'disposition': 'enforce',
        },
      }

      const results = normalizeCspReport(report)

      expect(results[0]!.directive).toBe('frame-ancestors')
    })

    it('handles base-uri violation', () => {
      const report = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'base-uri',
          'effective-directive': 'base-uri',
          'original-policy': 'base-uri \'self\'',
          'blocked-uri': 'https://attacker.com/evil/',
        },
      }

      const results = normalizeCspReport(report)

      expect(results[0]!.directive).toBe('base-uri')
    })

    it('handles form-action violation', () => {
      const report = {
        'csp-report': {
          'document-uri': 'https://bank.example.com/login',
          'violated-directive': 'form-action',
          'effective-directive': 'form-action',
          'original-policy': 'form-action \'self\'',
          'blocked-uri': 'https://phishing.com/steal',
          'source-file': 'https://bank.example.com/login',
          'line-number': 234,
        },
      }

      const results = normalizeCspReport(report)

      expect(results[0]).toMatchObject({
        directive: 'form-action',
        line: 234,
      })
    })

    it('handles report with object URI (blob, filesystem)', () => {
      const report = {
        'csp-report': {
          'document-uri': 'https://app.example.com',
          'violated-directive': 'worker-src',
          'effective-directive': 'worker-src',
          'blocked-uri': 'blob:https://app.example.com/abc123def456',
        },
      }

      const results = normalizeCspReport(report)

      expect(results[0]!.blockedURL).toContain('blob:')
    })

    it('handles report with JSON with extra fields (browser variations)', () => {
      const report = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'script-src',
          'effective-directive': 'script-src',
          'blocked-uri': 'https://evil.com/script.js',
          'source-file': 'https://example.com/main.js',
          'line-number': 10,
          'column-number': 5,
          'status-code': 200,
          'original-policy': 'script-src \'self\'',
          'disposition': 'enforce',
          'script-sample': 'console.log("XSS")',
          'initial-policy': 'default-src \'self\'',
          'x-custom-field': 'some-value',
          'user-agent-metadata': 'some-metadata',
        },
      }

      const results = normalizeCspReport(report)

      expect(results[0]).toMatchObject({
        documentURL: 'https://example.com',
        blockedURL: 'https://evil.com/script.js',
        directive: 'script-src',
      })
      expect(results[0]!.raw).toHaveProperty('script-sample')
    })
  })

  describe('Timestamp behavior', () => {
    it('generates current timestamp for valid reports', () => {
      const before = Date.now()
      const report = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'script-src',
        },
      }
      const results = normalizeCspReport(report)
      const after = Date.now()

      expect(results[0]!.ts).toBeGreaterThanOrEqual(before)
      expect(results[0]!.ts).toBeLessThanOrEqual(after + 100)
    })

    it('generates independent timestamps for multiple reports', async () => {
      const report1 = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'script-src',
        },
      }
      const results1 = normalizeCspReport(report1)
      await new Promise(resolve => setTimeout(resolve, 10))
      const report2 = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'img-src',
        },
      }
      const results2 = normalizeCspReport(report2)

      expect(results2[0]!.ts).toBeGreaterThanOrEqual(results1[0]!.ts)
    })
  })

  describe('Complex directive names', () => {
    it('handles directive with fallback (effective-directive)', () => {
      const report = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'script-src-elem',
          'effective-directive': 'script-src',
        },
      }

      const results = normalizeCspReport(report)

      expect(results[0]!.directive).toBe('script-src')
    })

    it('handles unknown directive gracefully', () => {
      const report = {
        'csp-report': {
          'document-uri': 'https://example.com',
          'violated-directive': 'some-future-directive',
          'effective-directive': 'some-future-directive',
        },
      }

      const results = normalizeCspReport(report)

      expect(results[0]!.directive).toBe('some-future-directive')
    })
  })
})
