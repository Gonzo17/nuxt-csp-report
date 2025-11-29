import { defineEventHandler } from 'h3'
import type { NormalizedCspReport } from '~/src/module'
import { useStorage } from 'nitropack/runtime'

export default defineEventHandler(async () => {
  const storage = useStorage<NormalizedCspReport>('csp-report-storage')
  const keys = await storage.getKeys()
  const items = await Promise.all(keys.map(key => storage.getItem(key)))

  return {
    keys,
    items,
  }
})
