import type { NormalizedCspReport } from '../../../types/report'

export function formatCspLog(report: NormalizedCspReport) {
  const parts = []

  if (report.directive) parts.push(`directive=${report.directive}`)
  if (report.documentURL) parts.push(`document=${report.documentURL}`)
  if (report.blockedURL) parts.push(`blocked=${report.blockedURL}`)

  return parts.join(' | ')
}
