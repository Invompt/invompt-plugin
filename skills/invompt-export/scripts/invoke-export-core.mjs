#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const MAX_INPUT_BYTES = 32 * 1024
const SAFE_ENVIRONMENT_KEYS = [
  'COMSPEC',
  'INVOMPT_EXPORT_TIMEOUT_MS',
  'PATH',
  'SSL_CERT_DIR',
  'SSL_CERT_FILE',
  'SystemRoot',
  'TEMP',
  'TMP',
  'TMPDIR',
]
let activeChild
let interruptedSignal

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    interruptedSignal = signal
    if (activeChild) activeChild.kill(signal)
    else process.stdin.destroy()
  })
}

function fail(message) {
  process.stderr.write(`PDF export launcher failed: ${message}\n`)
  process.exitCode = 1
}

function validateInvocation(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('The structured invocation is invalid.')
  }
  const keys = Object.keys(value).sort()
  const allowed = ['destination', 'overwrite', 'url']
  if (keys.some((key) => !allowed.includes(key))) {
    throw new Error('The structured invocation contains unknown fields.')
  }
  if (typeof value.destination !== 'string' || value.destination.length === 0) {
    throw new Error('A destination path is required.')
  }
  if (typeof value.url !== 'string' || value.url.length === 0) {
    throw new Error('The trusted invoice URL is required.')
  }
  if (value.overwrite !== undefined && typeof value.overwrite !== 'boolean') {
    throw new Error('The overwrite field must be boolean.')
  }
  return {
    destination: value.destination,
    overwrite: value.overwrite === true,
    url: value.url,
  }
}

async function readInvocation() {
  if (process.stdin.isTTY) throw new Error('A non-interactive stdin pipe is required.')
  let input = Buffer.alloc(0)
  for await (const chunk of process.stdin) {
    input = Buffer.concat([input, chunk])
    if (input.length > MAX_INPUT_BYTES) throw new Error('The structured invocation is too large.')
  }
  return validateInvocation(JSON.parse(input.toString('utf8')))
}

export async function runExportLauncher({ scriptUrl }) {
  if (process.argv.length !== 2) throw new Error('The launcher accepts no command arguments.')
  if (process.env.NODE_DEBUG || process.env.NODE_OPTIONS) {
    throw new Error('Unsafe Node debugging options must be removed before invocation.')
  }

  const invocation = await readInvocation()
  if (interruptedSignal) {
    process.exitCode = interruptedSignal === 'SIGINT' ? 130 : 143
    return
  }
  const scriptPath = fileURLToPath(scriptUrl)
  const args = [
    scriptPath,
    '--destination',
    invocation.destination,
    '--json',
  ]
  if (invocation.overwrite) args.push('--overwrite')

  const env = Object.fromEntries(
    SAFE_ENVIRONMENT_KEYS
      .filter((key) => process.env[key] !== undefined)
      .map((key) => [key, process.env[key]]),
  )
  delete env.NODE_DEBUG
  delete env.NODE_OPTIONS

  const child = spawn(process.execPath, args, {
    env,
    shell: false,
    stdio: ['pipe', 'inherit', 'inherit'],
  })
  activeChild = child
  child.stdin.on('error', () => {})
  child.stdin.end(invocation.url)

  const code = await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('close', (status, signal) => {
      if (signal === 'SIGINT') resolve(130)
      else if (signal === 'SIGTERM') resolve(143)
      else if (signal) reject(new Error('The downloader was interrupted.'))
      else resolve(status ?? 1)
    })
  })
  activeChild = undefined
  process.exitCode = code
}

export async function launchExport({ scriptUrl }) {
  try {
    await runExportLauncher({ scriptUrl })
  } catch (error) {
    fail(error?.message || 'The structured invocation failed.')
  }
}
