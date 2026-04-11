import { serve } from '@hono/node-server'

import { createApp } from './app.js'

const port = process.env.PORT ? Number(process.env.PORT) : 3000

serve({
  fetch: createApp().fetch,
  port
})

console.log(`svc-api listening on http://127.0.0.1:${port}`)
