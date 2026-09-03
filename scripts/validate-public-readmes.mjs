#!/usr/bin/env node

/**
 * Dependency-free validator shipped with the public consumer projection.
 * It checks semantic README boundaries; it is intentionally not a release or
 * security boundary. The hub policy provides the richer preview workflow.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const SPANISH = /\b(?:este|esta|estos|estas|proyecto|producto|permite|crear|documentos?|cualquier|empresa|fácilmente|facilmente|instala(?:ción|r)?|instrucciones|factura(?:s)?|cotización|presupuesto|seguridad|recursos|licencia|navegador|solicitud|versión|guía)\b/iu
const INTERNAL = /(?:localhost|127\.0\.0\.1|\b(?:staging|preview|internal|candidate)\b|\/Users\/|supabase|\.claude(?:\/|\b)|\.codex(?:\/|\b)|\.kimi(?:\/|\b))/iu
const CREDENTIAL = /(?:authorization\s*[:=]|bearer\s+[a-z0-9._~+/=-]{8,}|\b(?:api[_ -]?key|access[_ -]?token|refresh[_ -]?token|client[_ -]?secret|password|cookie)\s*[:=])/iu
const OPERATIONAL = /(?:host matrix|canonical agent request|ordinary HTTP GET|fresh host session|candidate v\d|published tag|list_invoices|mcpServers|claude plugin|codex plugin|oauth handoff)/iu

function headings(contents) {
  return contents.split(/\r?\n/u).map((line) => line.match(/^\s*#{1,6}\s+(.+?)\s*#*$/u)?.[1] ?? line.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/iu)?.[1]).filter(Boolean).join('\n')
}

export function validatePublicReadme(contents, { repository = 'Invompt/invompt-plugin' } = {}) {
  const errors = []
  const headingText = headings(contents)
  const required = ['install', 'what you can do|capabilit|features', 'security', 'resources', 'license']
  for (const section of required) if (!new RegExp(section, 'iu').test(headingText)) errors.push(`Missing semantic README section: ${section}`)
  for (const link of ['https://invompt.com/install', 'https://github.com/Invompt/invompt-plugin']) if (!contents.includes(link)) errors.push(`Missing required README link: ${link}`)
  if (SPANISH.test(contents)) errors.push('Public README must contain English prose only.')
  if (INTERNAL.test(contents)) errors.push('README contains internal, staging, or local-runtime material.')
  if (CREDENTIAL.test(contents)) errors.push('README contains credential-shaped example text.')
  if (OPERATIONAL.test(contents)) errors.push('README contains an operational install prompt or host matrix; keep that contract in INSTALL.md.')
  if (contents.split(/\r?\n/u).length > 100) errors.push('README is too long for the public product profile (maximum 100 lines).')
  return { ok: errors.length === 0, repository, errors }
}

export function validateInventory(root) {
  const expected = ['.claude-plugin', '.codex-plugin', '.github', '.kimi-plugin', '.mcp.json', 'INSTALL.md', 'LICENSE', 'README.md', 'RELEASE-MANIFEST.json', 'SECURITY.md', 'SUPPORT.md', 'assets', 'kimi.plugin.json', 'scripts', 'skills']
  const actual = readdirSync(root).filter((entry) => entry !== '.git').sort()
  return JSON.stringify(actual) === JSON.stringify(expected.sort()) ? [] : [`Unexpected public package inventory. Expected ${expected.join(', ')}; found ${actual.join(', ')}.`]
}

function parseArgs(argv) {
  const options = { repository: 'Invompt/invompt-plugin', root: '.' }
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--repository' || argv[i] === '--repo') options.repository = argv[++i]
    else if (argv[i] === '--root') options.root = argv[++i]
    else if (argv[i] === '--path') options.path = argv[++i]
    else if (argv[i] === '--json') options.json = true
  }
  options.path ??= 'README.md'
  return options
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const options = parseArgs(process.argv.slice(2))
  try {
    const result = validatePublicReadme(readFileSync(resolve(options.root, options.path), 'utf8'), options)
    result.errors.push(...validateInventory(resolve(options.root)))
    result.ok = result.errors.length === 0
    process.stdout.write(options.json ? `${JSON.stringify(result, null, 2)}\n` : `${result.ok ? 'PASS' : 'FAIL'} ${options.repository}/${options.path}\n${result.errors.map((error) => `- ${error}`).join('\n')}${result.errors.length ? '\n' : ''}`)
    if (!result.ok) process.exitCode = 1
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  }
}
