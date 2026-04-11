#!/usr/bin/env node

import { createClient } from '@shush/api-client'

function parseBaseUrl(args: string[]): { baseUrl: string; rest: string[] } {
  const baseUrlFromEnv = process.env.SHUSH_API_BASE_URL
  const baseUrlDefault = baseUrlFromEnv ?? 'http://127.0.0.1:3000'

  const idx = args.findIndex((arg) => arg === '--base-url')
  if (idx === -1) return { baseUrl: baseUrlDefault, rest: args }

  const value = args[idx + 1]
  if (!value) {
    throw new Error('Missing value for --base-url')
  }

  return {
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

const { baseUrl, rest } = parseBaseUrl(process.argv.slice(2))
const api = createClient({ baseUrl })

const [group, command, ...commandArgs] = rest

if (!group) {
  printHelp()
  process.exit(1)
}

if (group === 'auth' && command === 'login') {
  const [username, password] = commandArgs
  if (!username || !password) {
    throw new Error('Usage: shush auth login <username> <password>')
  }

  const res = await api.auth.login({
    username,
    password
  })

  process.stdout.write(`${JSON.stringify(res.data, null, 2)}\n`)
  process.exit(0)
}

if (group === 'tenancy' && command === 'current') {
  const res = await api.tenancy.current()
  process.stdout.write(`${JSON.stringify(res.data, null, 2)}\n`)
  process.exit(0)
}

if (group === 'scope' && command === 'list') {
  const res = await api.scope.list()
  process.stdout.write(`${JSON.stringify(res.data, null, 2)}\n`)
  process.exit(0)
}

printHelp()
process.exit(1)
