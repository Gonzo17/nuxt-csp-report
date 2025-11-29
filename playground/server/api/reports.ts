import { defineEventHandler } from 'h3'
import { useStorage } from 'nitropack/runtime'
import { CSP_REPORT_STORAGE, type NormalizedCspReport } from '../../../src/types/report'

export default defineEventHandler(async () => {
  const storage = useStorage<NormalizedCspReport>(CSP_REPORT_STORAGE)
  const keys = await storage.getKeys()
  const items = await Promise.all(keys.map(key => storage.getItem(key)))

  return {
    keys,
    items,
  }
})
