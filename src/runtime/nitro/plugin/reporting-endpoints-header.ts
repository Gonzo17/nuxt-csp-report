import { defineNitroPlugin } from 'nitropack/runtime'
import { useRuntimeConfig } from '#imports'
import { setResponseHeader, getRequestHost, getRequestProtocol } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  const cspReportConfig = useRuntimeConfig().cspReport
  if (!cspReportConfig?.reportingEndpointsHeader) {
    return
  }

  nitroApp.hooks.hook('render:response', (response, { event }) => {
    const protocol = getRequestProtocol(event, { xForwardedProto: true })
    const host = getRequestHost(event, { xForwardedHost: true })
    const endpoint = `${protocol}://${host}${cspReportConfig.endpoint}`
    setResponseHeader(event, 'Reporting-Endpoints', `csp-endpoint="${endpoint}"`)
  })
})
