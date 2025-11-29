export interface NormalizedCspReport {
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
