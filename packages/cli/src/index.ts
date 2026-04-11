#!/usr/bin/env node

import { createClient } from '@shush/api-client'

function parseBaseUrl(
  args: string[]
): { ok: true; baseUrl: string; rest: string[] } | { ok: false; error: string } {
  const baseUrlFromEnv = process.env.SHUSH_API_BASE_URL
  const baseUrlDefault = baseUrlFromEnv ?? 'http://127.0.0.1:3000'

  const idx = args.findIndex((arg) => arg === '--base-url')
  if (idx === -1) return { ok: true, baseUrl: baseUrlDefault, rest: args }

  const value = args[idx + 1]
  if (!value) {
    return { ok: false, error: 'Missing value for --base-url' }
  }

  return {
    ok: true,
    baseUrl: value,
    rest: [...args.slice(0, idx), ...args.slice(idx + 2)]
  }
}

function printHelp() {
  process.stdout.write(
    [
      'Usage:',
      '  shush [--base-url <url>] <command>',
      '',
      'Commands:',
      '  auth login <username> <password>',
      '  tenancy current',
      '  scope list',
      ''
    ].join('\n')
  )
}

function formatUnknownError(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

function exitWithError(message: string): never {
  process.stderr.write(`${message}\n`)
  process.exit(1)
}

function requireData<T>(res: { data?: T; error?: unknown; response?: Response }): T {
  if (res.data !== undefined) return res.data

  const status = res.response?.status
  const statusText = res.response?.statusText
  const suffix = status ? ` (status ${status}${statusText ? ` ${statusText}` : ''})` : ''
  const err = res.error ? `: ${formatUnknownError(res.error)}` : ''
  exitWithError(`Request failed${suffix}${err}`)
}

async function main() {
  const parsed = parseBaseUrl(process.argv.slice(2))
  if (!parsed.ok) {
    process.stderr.write(`${parsed.error}\n\n`)
    printHelp()
    process.exit(1)
  }

  const api = createClient({ baseUrl: parsed.baseUrl })
  const [group, command, ...commandArgs] = parsed.rest

  if (!group) {
    printHelp()
    process.exit(1)
  }

  if (group === 'auth' && command === 'login') {
    const [username, password] = commandArgs
    if (!username || !password) {
      process.stderr.write('Usage: shush auth login <username> <password>\n\n')
      printHelp()
      process.exit(1)
    }

    const res = await api.auth.login({
      username,
      password
    })

    const data = requireData(res)
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`)
    process.exit(0)
  }

  if (group === 'tenancy' && command === 'current') {
    const res = await api.tenancy.current()
    const data = requireData(res)
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`)
    process.exit(0)
  }

  if (group === 'scope' && command === 'list') {
    const res = await api.scope.list()
    const data = requireData(res)
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`)
    process.exit(0)
  }

  printHelp()
  process.exit(1)
}

try {
  await main()
} catch (error) {
  exitWithError(formatUnknownError(error))
}
