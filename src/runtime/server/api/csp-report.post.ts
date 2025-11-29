import { useRuntimeConfig, useStorage, readBody, defineEventHandler } from '#imports'
import { normalizeCspReport } from '../utils/normalizeCspReport'
import { formatCspLog } from '../utils/formatCspLog'
import type { NormalizedCspReport } from '../../../types/report'

const runtimeConfig = useRuntimeConfig()
const storage = runtimeConfig.cspReport?.storage ? useStorage<NormalizedCspReport>('csp-report-storage') : null

export default defineEventHandler(async (event) => {
  try {
    const config = runtimeConfig.cspReport
    const body = await readBody(event).catch(() => null)

    const reports = normalizeCspReport(body)

    for (const report of reports) {
      switch (config?.console) {
        case 'summary':
          console.info('[nuxt-csp-report]', formatCspLog(report))
          break
        case 'full':
          console.info('[nuxt-csp-report]', report)
          break
      }
      if (storage) {
        const id = globalThis.crypto.randomUUID()
        const timestamp = Date.now()
        const key = `csp:${timestamp}:${id}`
        await storage.setItem(key, report)
      }
    }

    return { ok: true }
  }
  catch (err) {
    console.error('[nuxt-csp-report]', err)
    return { ok: true }
  }
})
