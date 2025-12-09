import type { NormalizedCspReport } from '../../../types/report'

export function formatCspLog(report: NormalizedCspReport) {
  const parts = []

  if (report.directive) parts.push(`directive=${report.directive}`)
  if (report.documentURL) parts.push(`document=${report.documentURL}`)
  if (report.blockedURL) parts.push(`blocked=${report.blockedURL}`)
  if (report.sourceFile) {
    const loc = [report.sourceFile, report.line, report.column]
      .filter(v => v != null)
      .join(':')
    parts.push(`source=${loc}`)
  }
  if (report.disposition) parts.push(`mode=${report.disposition}`)

  return parts.join(' | ')
}
