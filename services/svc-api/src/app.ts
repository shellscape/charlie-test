import { Hono } from 'hono'
import { openAPIRouteHandler } from 'hono-openapi'

import { registerAuthRoutes } from './routes/auth.js'
import { registerScopeRoutes } from './routes/scope.js'
import { registerTenancyRoutes } from './routes/tenancy.js'

export function createApp() {
  const app = new Hono()

  registerAuthRoutes(app)
  registerTenancyRoutes(app)
  registerScopeRoutes(app)

  app.get(
    '/openapi.json',
    openAPIRouteHandler(app, {
      documentation: {
        info: {
          title: 'Shush API',
          version: '0.1.0'
        },
        servers: [{ url: '/' }]
      }
    })
  )

  return app
}
