import { type Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import * as v from 'valibot'

const scopeResponseSchema = v.object({
  scopes: v.array(v.string())
})

export function registerScopeRoutes(app: Hono) {
  app.get(
    '/scope',
    describeRoute({
      tags: ['scope'],
      description: 'List available OAuth scopes.',
      responses: {
        200: {
          description: 'The available scopes.',
          content: {
            'application/json': {
              schema: resolver(scopeResponseSchema)
            }
          }
        }
      }
    }),
    (c) => c.json({ scopes: ['tenancy:read', 'scope:read'] })
  )
}
