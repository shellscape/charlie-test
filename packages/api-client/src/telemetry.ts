import {
  context,
  propagation,
  SpanKind,
  SpanStatusCode,
  trace,
  type Span
} from '@opentelemetry/api'

import type { Client, ResolvedRequestOptions } from './gen/client/index.js'

export type TelemetryOptions = {
  enabled: boolean
  tracerName?: string
}

export function attachOpenTelemetryInterceptors(client: Client, options: TelemetryOptions) {
  const tracer = trace.getTracer(options.tracerName ?? '@shush/api-client')
  const spansByRequest = new WeakMap<Request, Span>()

  client.interceptors.request.use((request: Request, requestOptions: ResolvedRequestOptions) => {
    const accept = request.headers.get('accept')
    if (accept?.includes('text/event-stream')) {
      return request
    }

    const url = new URL(request.url)
    const method = requestOptions.method ?? request.method
    const spanName = `${method} ${url.pathname}`
    const span = tracer.startSpan(spanName, {
      kind: SpanKind.CLIENT,
      attributes: {
        'http.method': method,
        'url.full': request.url,
        'server.address': url.hostname
      }
    })

    const ctx = trace.setSpan(context.active(), span)
    const headers = new Headers(request.headers)
    propagation.inject(ctx, headers)

    const nextRequest = new Request(request, {
      headers
    })

    spansByRequest.set(nextRequest, span)

    return nextRequest
  })

  client.interceptors.response.use((response: Response, request: Request) => {
    const span = spansByRequest.get(request)

    if (span) {
      span.setAttribute('http.status_code', response.status)
      span.setStatus({
        code: response.status >= 400 ? SpanStatusCode.ERROR : SpanStatusCode.OK
      })
      span.end()
      spansByRequest.delete(request)
    }

    return response
  })

  client.interceptors.error.use((error: unknown, _response: Response | undefined, request: Request) => {
    const span = spansByRequest.get(request)

    if (span) {
      const exception = error instanceof Error ? error : { message: String(error), raw: error }
      span.recordException(exception)
      span.setStatus({ code: SpanStatusCode.ERROR })
      span.end()
      spansByRequest.delete(request)
    }

    return error
  })
}
