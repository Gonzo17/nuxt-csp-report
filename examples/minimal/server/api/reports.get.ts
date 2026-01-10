import type { NormalizedCspReport } from 'nuxt-csp-report'

export default defineEventHandler(async () => {
  const storage = useStorage<NormalizedCspReport>('csp-report-storage')
  const keys = await storage.getKeys()
  const items = await Promise.all(keys.map(key => storage.getItem(key)))

  return items.filter(Boolean).reverse()
})
