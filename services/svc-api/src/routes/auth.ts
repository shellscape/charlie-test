import { type Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import * as v from 'valibot'

const loginBodySchema = v.object({
  username: v.string(),
  password: v.string()
})

const loginResponseSchema = v.object({
  token: v.string()
})

export function registerAuthRoutes(app: Hono) {
  app.post(
    '/auth/login',
    describeRoute({
      tags: ['auth'],
      description: 'Exchange credentials for an access token.',
      responses: {
        200: {
          description: 'Login succeeded.',
          content: {
            'application/json': {
              schema: resolver(loginResponseSchema)
            }
          }
        }
      }
    }),
    validator('json', loginBodySchema),
    (c) => {
      const body = c.req.valid('json')
      return c.json({ token: `token:${body.username}` })
    }
  )
}
