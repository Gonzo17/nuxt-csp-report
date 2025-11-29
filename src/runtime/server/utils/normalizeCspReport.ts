import { z } from 'zod'
import type { NormalizedCspReport } from '~/src/runtime/types'

const reportToBodySchema = z.object({
  'document-uri': z.string().optional(),
  'documentURI': z.string().optional(),
  'blocked-uri': z.string().optional(),
  'blockedURI': z.string().optional(),
  'blockedUri': z.string().optional(),
  'effective-directive': z.string().optional(),
  'effectiveDirective': z.string().optional(),
  'violated-directive': z.string().optional(),
  'violatedDirective': z.string().optional(),
  'source-file': z.string().optional(),
  'sourceFile': z.string().optional(),
  'line-number': z.number().optional(),
  'lineNumber': z.number().optional(),
  'column-number': z.number().optional(),
  'columnNumber': z.number().optional(),
  'disposition': z.enum(['enforce', 'report']).optional(),
}).passthrough()

const reportToEntrySchema = z.object({
  type: z.string(),
  body: z.unknown().optional(),
}).passthrough()

function normalizeField(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value || undefined
  }
  return undefined
}

function normalizeNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return value
  }
  return undefined
}

function normalizeSingleReport(
  data: unknown,
): NormalizedCspReport {
  const ts = Date.now()
  const baseReport: NormalizedCspReport = {
    ts,
    raw: data,
  }

  if (!data || typeof data !== 'object') {
    return baseReport
  }

  try {
    const parsed = reportToBodySchema.parse(data)
    const dataObj = parsed as Record<string, unknown>

    return {
      ...baseReport,
      documentURL: normalizeField(dataObj['document-uri'] || dataObj['documentURI']),
      blockedURL: normalizeField(
        dataObj['blocked-uri'] || dataObj['blockedURI'] || dataObj['blockedUri'],
      ),
      directive: normalizeField(
        dataObj['effective-directive']
        || dataObj['effectiveDirective']
        || dataObj['violated-directive']
        || dataObj['violatedDirective'],
      ),
      sourceFile: normalizeField(dataObj['source-file'] || dataObj['sourceFile']),
      line: normalizeNumber(dataObj['line-number'] || dataObj['lineNumber']),
      column: normalizeNumber(dataObj['column-number'] || dataObj['columnNumber']),
      disposition: (dataObj['disposition'] as 'enforce' | 'report' | undefined) || undefined,
    }
  }
  catch {
    return baseReport
  }
}

export function normalizeCspReport(
  input: unknown,
): NormalizedCspReport[] {
  if (!input || typeof input !== 'object') {
    return []
  }

  if ('csp-report' in input) {
    return [normalizeSingleReport(input['csp-report'])]
  }

  if (Array.isArray(input)) {
    return input
      .filter((entry) => {
        try {
          const parsed = reportToEntrySchema.parse(entry)
          return parsed['type'] === 'csp-violation'
        }
        catch {
          return false
        }
      })
      .map((entry) => {
        const typedEntry = entry as Record<string, unknown>
        const body = typedEntry['body']
        return normalizeSingleReport(body)
      })
  }

  return []
}
