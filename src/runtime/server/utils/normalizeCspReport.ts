import { z } from 'zod'
import type { NormalizedCspReport } from '../../../types/report'

const reportUriSchema = z.object({
  'csp-report': z.object({
    'blocked-uri': z.string(),
    'disposition': z.enum(['enforce', 'report']),
    'document-uri': z.string(),
    'effective-directive': z.string(),
    'line-number': z.number().optional(),
    'original-policy': z.string().optional(),
    'referrer': z.string().optional(),
    'script-sample': z.string().optional(),
    'source-file': z.string().optional(),
    'status-code': z.number().optional(),
    'violated-directive': z.string(),
  }),
}).passthrough()

export type ReportUriFormat = z.infer<typeof reportUriSchema>

const reportToEntrySchema = z.object({
  age: z.number(),
  body: z.object({
    blockedURL: z.string(),
    columnNumber: z.number().optional(),
    disposition: z.enum(['enforce', 'report']),
    documentURL: z.string(),
    effectiveDirective: z.string(),
    lineNumber: z.number().optional(),
    originalPolicy: z.string(),
    referrer: z.string().optional(),
    sample: z.string().optional(),
    sourceFile: z.string().optional(),
    statusCode: z.number(),
  }),
  type: z.string(),
  url: z.string(),
  user_agent: z.string(),
}).passthrough()

const reportToSchema = reportToEntrySchema.array()

export type ReportToEntryFormat = z.infer<typeof reportToEntrySchema>
export type ReportToFormat = z.infer<typeof reportToSchema>

export function normalizeCspReport(
  input: unknown,
): NormalizedCspReport[] {
  if (!input) {
    return []
  }

  try {
    if (typeof input === 'object' && 'csp-report' in input) {
      const parsed = reportUriSchema.parse(input)
      return [{ raw: parsed, timestamp: Date.now(),
        documentURL: parsed['csp-report']['document-uri'],
        blockedURL: parsed['csp-report']['blocked-uri'],
        directive: parsed['csp-report']['violated-directive'],
        sourceFile: parsed['csp-report']['source-file'],
        line: parsed['csp-report']['line-number'],
        disposition: parsed['csp-report']['disposition'],
      }]
    }

    if (Array.isArray(input)) {
      const parsed = reportToSchema.parse(input)
      return parsed.map((item) => {
        return {
          raw: item,
          timestamp: Date.now(),
          documentURL: item.body.documentURL,
          blockedURL: item.body.blockedURL,
          directive: item.body.effectiveDirective,
          sourceFile: item.body.sourceFile,
          line: item.body.lineNumber,
          disposition: item.body.disposition,
        } satisfies NormalizedCspReport
      })
    }
  }
  catch {
    // Ignore parsing errors
  }

  return []
}
