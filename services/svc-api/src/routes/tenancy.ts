import { type Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import * as v from 'valibot'

const tenancyResponseSchema = v.object({
  id: v.string(),
  name: v.string()
})

export function registerTenancyRoutes(app: Hono) {
  app.get(
    '/tenancy/current',
    describeRoute({
      tags: ['tenancy'],
      description: 'Get the current tenancy.',
      responses: {
        200: {
          description: 'The current tenancy.',
          content: {
            'application/json': {
              schema: resolver(tenancyResponseSchema)
            }
          }
        }
      }
    }),
    (c) => c.json({ id: 'tenancy_123', name: 'Demo Tenancy' })
  )
}
