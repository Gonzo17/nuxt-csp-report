import { defineEventHandler } from 'h3'
import { useStorage } from 'nitropack/runtime'
import type { NormalizedCspReport } from '../../../../../src/types/report'

export default defineEventHandler(async () => {
  const storage = useStorage<NormalizedCspReport>('csp-report-storage')
  await storage.clear()
})
