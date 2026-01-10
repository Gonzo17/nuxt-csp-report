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
}).loose()

const _reportToSchema = reportToEntrySchema.array()

export type ReportToEntryFormat = z.infer<typeof reportToEntrySchema>
export type ReportToFormat = z.infer<typeof _reportToSchema>

export function normalizeCspReport(
  input: unknown,
): NormalizedCspReport[] {
  if (!input) return []

  // Handle legacy report-uri payloads
  if (typeof input === 'object' && input !== null && 'csp-report' in input) {
    const parsed = reportUriSchema.safeParse(input)
    if (!parsed.success) return []

    const report = parsed.data['csp-report']
    return [{
      raw: parsed.data,
      timestamp: Date.now(),
      documentURL: report['document-uri'],
      blockedURL: report['blocked-uri'],
      directive: report['violated-directive'],
      sourceFile: report['source-file'],
      line: report['line-number'],
      disposition: report['disposition'],
    }]
  }

  // Handle modern report-to batches; tolerate partially invalid items
  if (Array.isArray(input)) {
    const reports: NormalizedCspReport[] = []

    for (const entry of input) {
      const parsed = reportToEntrySchema.safeParse(entry)
      if (!parsed.success) continue
      if (parsed.data.type !== 'csp-violation') continue

      const { body } = parsed.data
      reports.push({
        raw: parsed.data,
        timestamp: Date.now(),
        documentURL: body.documentURL,
        blockedURL: body.blockedURL,
        directive: body.effectiveDirective,
        sourceFile: body.sourceFile,
        line: body.lineNumber,
        column: body.columnNumber,
        disposition: body.disposition,
      })
    }

    return reports
  }

  return []
}
