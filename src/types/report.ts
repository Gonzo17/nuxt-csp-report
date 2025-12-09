import type { ReportUriFormat, ReportToFormat, ReportToEntryFormat } from '../runtime/server/utils/normalizeCspReport'

export type { ReportUriFormat, ReportToFormat, ReportToEntryFormat }
export interface NormalizedCspReport {
  timestamp: number
  documentURL: string
  blockedURL: string
  directive: string
  sourceFile?: string
  line?: number
  column?: number
  disposition: 'enforce' | 'report'
  raw: ReportToEntryFormat | ReportUriFormat
}
