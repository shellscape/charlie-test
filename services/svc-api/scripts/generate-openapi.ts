import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createApp } from '../src/app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = createApp()
const res = await app.fetch(new Request('http://localhost/openapi.json'))

if (!res.ok) {
  throw new Error(`Failed to generate OpenAPI spec: ${res.status} ${res.statusText}`)
}

const body = await res.text()
const outPath = path.resolve(__dirname, '..', '..', 'openapi.json')
await writeFile(outPath, `${body}\n`, 'utf8')
