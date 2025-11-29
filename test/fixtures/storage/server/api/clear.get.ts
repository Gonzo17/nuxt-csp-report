import { defineEventHandler } from 'h3'
import type { NormalizedCspReport } from '~/src/module'
import { useStorage } from 'nitropack/runtime'

export default defineEventHandler(async () => {
  const storage = useStorage<NormalizedCspReport>('csp-report-storage')
  await storage.clear()
})
