import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: '../../services/svc-api/openapi.json',
  output: {
    path: 'src/gen',
    importFileExtension: '.js'
  },
  client: '@hey-api/client-fetch'
})
