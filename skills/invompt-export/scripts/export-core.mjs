#!/usr/bin/env node

import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { link, lstat, mkdir, open, realpath, rename, rm } from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import { Transform } from 'node:stream'
import { finished, pipeline } from 'node:stream/promises'

const MAX_BYTES = 25 * 1024 * 1024
const DEFAULT_TIMEOUT_MS = 15_000
const MIN_TIMEOUT_MS = 50
const MAX_TIMEOUT_MS = 60_000
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/
const TOKEN_REDACTION_PATTERN = /[A-Za-z0-9_-]{43}/g
let activeAbort
let activeTemporaryHandle
let activeTemporaryPath
let finalizationCommitted = false
let interruption

function exportError(message, code = 'EXPORT_FAILED') {
  return Object.assign(new Error(message), { code })
}

function fail(message, code = 'EXPORT_FAILED') {
  throw exportError(message, code)
}

function redact(value) {
  return String(value).replace(TOKEN_REDACTION_PATTERN, '[redacted-token]')
}

function timeoutMs() {
  const configured = Number(process.env.INVOMPT_EXPORT_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS)
  if (!Number.isFinite(configured) || configured < MIN_TIMEOUT_MS || configured > MAX_TIMEOUT_MS) {
    return DEFAULT_TIMEOUT_MS
  }
  return Math.trunc(configured)
}

function assertSafeRuntime() {
  if (process.stdin.isTTY) {
    fail('The trusted invoice URL requires a non-interactive stdin pipe.', 'UNSAFE_INPUT_CHANNEL')
  }
  if (process.env.NODE_DEBUG || process.env.NODE_OPTIONS) {
    fail('The PDF export runtime contains unsafe Node debugging options.', 'UNSAFE_ENVIRONMENT')
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    if (finalizationCommitted) return
    interruption = exportError('The PDF export was interrupted.', 'INTERRUPTED')
    interruption.exitCode = signal === 'SIGINT' ? 130 : 143
    process.stdin.destroy()
    activeAbort?.(interruption)
  })
}

function throwIfInterrupted() {
  if (interruption) throw interruption
}

function parseArgs(argv) {
  let destination
  let overwrite = false
  let json = false

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--destination' || arg === '-d') {
      if (destination !== undefined) fail('The destination was provided more than once.', 'INVALID_ARGUMENT')
      destination = argv[++index]
      if (!destination || destination.startsWith('-')) {
        fail('A destination path is required.', 'INVALID_DESTINATION')
      }
      if (containsUnsafeUnicode(destination)) {
        fail('The destination path contains unsafe characters.', 'INVALID_DESTINATION')
      }
    } else if (arg === '--overwrite') {
      if (overwrite) fail('The overwrite flag was provided more than once.', 'INVALID_ARGUMENT')
      overwrite = true
    } else if (arg === '--json') {
      if (json) fail('The JSON flag was provided more than once.', 'INVALID_ARGUMENT')
      json = true
    } else {
      fail('Unknown argument.', 'INVALID_ARGUMENT')
    }
  }

  return {
    destination: destination ?? path.join(process.cwd(), 'exports'),
    json,
    overwrite,
  }
}

function validateAllowedOrigin(raw) {
  if (typeof raw !== 'string' || !raw) {
    fail('The Invompt origin is invalid.', 'INVALID_ORIGIN')
  }
  let url
  try {
    url = new URL(raw)
  } catch {
    fail('The Invompt origin is invalid.', 'INVALID_ORIGIN')
  }
  if (
    (url.protocol !== 'http:' && url.protocol !== 'https:')
    || url.origin !== raw
    || url.username
    || url.password
    || url.search
    || url.hash
    || url.pathname !== '/'
  ) {
    fail('The Invompt origin is invalid.', 'INVALID_ORIGIN')
  }
  return url.origin
}

function validateUrl(raw, allowedOrigin) {
  const input = typeof raw === 'string' ? raw.trim() : ''
  if (!input) fail('The trusted invoice URL is missing.', 'INVALID_URL')

  let url
  try {
    url = new URL(input)
  } catch {
    fail('The trusted invoice URL is invalid.', 'INVALID_URL')
  }

  if (url.username || url.password || url.search || url.hash) {
    fail('The trusted invoice URL contains unsupported components.', 'INVALID_URL')
  }

  if (url.origin !== allowedOrigin) {
    fail('The trusted invoice URL does not match the configured Invompt origin.', 'INVALID_URL')
  }

  const route = /^\/preview\/([A-Za-z0-9_-]{43})\/pdf$/.exec(url.pathname)
  if (!route || !TOKEN_PATTERN.test(route[1])) {
    fail('The trusted invoice URL path is not canonical.', 'INVALID_URL')
  }

  const canonical = `${allowedOrigin}/preview/${route[1]}/pdf`
  if (input !== canonical || url.toString() !== canonical) {
    fail('The trusted invoice URL spelling is not canonical.', 'INVALID_URL')
  }

  return { token: route[1], url }
}

function containsUnsafeUnicode(value) {
  return /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(value)
}

function isWindowsReservedFilename(value) {
  const basename = value.replace(/\.+$/u, '').split('.', 1)[0]
  return /^(?:CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³])$/iu.test(basename)
}

function unquoteHeaderValue(value) {
  if (!value.startsWith('"') || !value.endsWith('"')) return value
  return value.slice(1, -1).replace(/\\(.)/g, '$1')
}

function filenameFromDisposition(header) {
  if (typeof header !== 'string' || !header.trim()) return 'invoice.pdf'

  let filename
  const extended = /(?:^|;)\s*filename\*\s*=\s*([^;]*)/i.exec(header)?.[1]?.trim()
  if (extended) {
    const candidate = unquoteHeaderValue(extended)
    const encoded = /^UTF-8''(.+)$/i.exec(candidate)?.[1]
    if (!encoded) fail('The server filename encoding is invalid.', 'INVALID_FILENAME')
    try {
      filename = decodeURIComponent(encoded)
    } catch {
      fail('The server filename encoding is invalid.', 'INVALID_FILENAME')
    }
  } else {
    const quoted = /(?:^|;)\s*filename\s*=\s*"((?:[^"\\]|\\.)*)"/i.exec(header)?.[1]
    const bare = /(?:^|;)\s*filename\s*=\s*([^;]*)/i.exec(header)?.[1]
    filename = quoted?.replace(/\\(.)/g, '$1') ?? bare?.trim()
  }

  if (!filename) return 'invoice.pdf'
  filename = filename.normalize('NFC')
  if (
    filename !== filename.trim()
    || filename === '.'
    || filename === '..'
    || filename.startsWith('.')
    || filename.endsWith('.')
    || containsUnsafeUnicode(filename)
    || isWindowsReservedFilename(filename)
    || /[<>:"/\\|?*]/.test(filename)
  ) {
    fail('The server filename is unsafe.', 'INVALID_FILENAME')
  }

  if (!filename.toLowerCase().endsWith('.pdf')) filename = `${filename}.pdf`
  if (Buffer.byteLength(filename, 'utf8') > 240) {
    fail('The server filename is too long.', 'INVALID_FILENAME')
  }
  return filename
}

async function assertSafeDirectory(directory, { create = false } = {}) {
  const absolute = path.resolve(directory)
  const root = path.parse(absolute).root
  const segments = path.relative(root, absolute).split(path.sep).filter(Boolean)
  let current = root

  for (const segment of segments) {
    current = path.join(current, segment)
    let info
    try {
      info = await lstat(current)
    } catch (error) {
      if (error?.code !== 'ENOENT' || !create) throw error
      try {
        await mkdir(current, { mode: 0o700 })
      } catch (mkdirError) {
        if (mkdirError?.code !== 'EEXIST') throw mkdirError
      }
      info = await lstat(current)
    }
    if (info.isSymbolicLink()) {
      const allowedDarwinAlias = process.platform === 'darwin'
        && new Map([
          ['/etc', '/private/etc'],
          ['/tmp', '/private/tmp'],
          ['/var', '/private/var'],
        ]).get(current) === await realpath(current)
      if (!allowedDarwinAlias) {
        fail('The destination contains an unsafe parent.', 'UNSAFE_DESTINATION')
      }
      continue
    }
    if (!info.isDirectory()) {
      fail('The destination contains an unsafe parent.', 'UNSAFE_DESTINATION')
    }
  }
  return absolute
}

async function inspectPath(filePath) {
  try {
    return await lstat(filePath)
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
}

function sameIdentity(info, identity) {
  return info?.isFile()
    && !info.isSymbolicLink()
    && info.dev === identity.dev
    && info.ino === identity.ino
    && info.size === identity.size
}

async function assertPrivateDirectory(directory, expectedIdentity) {
  const info = await lstat(directory)
  if (!info.isDirectory() || info.isSymbolicLink()) {
    fail('The destination directory is unsafe.', 'UNSAFE_DESTINATION')
  }
  if (typeof process.getuid === 'function' && info.uid !== process.getuid()) {
    fail('The destination directory is not owned by the current user.', 'UNSAFE_DESTINATION')
  }
  if ((info.mode & 0o022) !== 0) {
    fail('The destination directory is writable by other users.', 'UNSAFE_DESTINATION')
  }
  if (expectedIdentity && (info.dev !== expectedIdentity.dev || info.ino !== expectedIdentity.ino)) {
    fail('The destination directory changed during export.', 'UNSAFE_DESTINATION')
  }
  return { dev: info.dev, ino: info.ino }
}

async function resolveDestination(destination, token, overwrite) {
  const absolute = path.resolve(destination)
  if (absolute.includes(token)) {
    fail('The destination must not contain the capability token.', 'SENSITIVE_DESTINATION')
  }

  const existing = await inspectPath(absolute)
  if (existing?.isSymbolicLink()) fail('The destination is a symbolic link.', 'UNSAFE_DESTINATION')
  if (existing && !existing.isDirectory() && !existing.isFile()) {
    fail('The destination is not a regular file or directory.', 'UNSAFE_DESTINATION')
  }

  const directoryMode = existing?.isDirectory() || (!existing && !absolute.toLowerCase().endsWith('.pdf'))
  if (!directoryMode && !absolute.toLowerCase().endsWith('.pdf')) {
    fail('An explicit destination file must use a .pdf extension.', 'INVALID_DESTINATION')
  }
  if (!directoryMode && isWindowsReservedFilename(path.basename(absolute))) {
    fail('The destination filename is reserved.', 'INVALID_DESTINATION')
  }

  if (overwrite && directoryMode) {
    fail('Overwrite requires an explicit destination PDF file.', 'OVERWRITE_REQUIRES_FILE')
  }

  const directory = await assertSafeDirectory(directoryMode ? absolute : path.dirname(absolute), { create: true })
  const directoryIdentity = await assertPrivateDirectory(directory)
  return {
    directory,
    directoryIdentity,
    directoryMode,
    explicitFile: directoryMode ? undefined : absolute,
  }
}

async function resolveFinalPath(destination, serverFilename, token, overwrite) {
  const finalPath = destination.directoryMode
    ? path.join(destination.directory, serverFilename)
    : destination.explicitFile

  if (path.dirname(finalPath) !== destination.directory || finalPath.includes(token)) {
    fail('The resolved destination is unsafe.', 'UNSAFE_DESTINATION')
  }

  await assertSafeDirectory(destination.directory)
  await assertPrivateDirectory(destination.directory, destination.directoryIdentity)
  const existing = await inspectPath(finalPath)
  if (existing?.isSymbolicLink()) fail('The destination file is a symbolic link.', 'UNSAFE_DESTINATION')
  if (existing && !existing.isFile()) fail('The destination is not a regular file.', 'UNSAFE_DESTINATION')
  if (existing && !overwrite) fail('The destination file already exists.', 'COLLISION')
  return finalPath
}

function statusError(statusCode) {
  const known = new Map([
    [401, ['The PDF request was unauthorized.', 'UNAUTHORIZED']],
    [404, ['The invoice PDF was not found.', 'NOT_FOUND']],
    [410, ['The invoice link is expired or revoked.', 'LINK_GONE']],
    [429, ['The PDF request was rate limited.', 'RATE_LIMITED']],
    [500, ['The PDF service failed.', 'SERVER_ERROR']],
    [503, ['The PDF service is unavailable.', 'SERVER_UNAVAILABLE']],
  ])
  const [message, code] = known.get(statusCode)
    ?? [`The PDF request failed with status ${statusCode}.`, 'HTTP_STATUS']
  return exportError(message, code)
}

function normalizeTransportError(error) {
  if (error?.code === 'ERR_STREAM_PREMATURE_CLOSE' || error?.code === 'ECONNRESET') {
    return exportError('The PDF response was truncated.', 'TRUNCATED')
  }
  return error
}

async function flushDirectory(directory) {
  if (process.platform === 'win32') return
  const handle = await open(directory, 'r')
  try {
    await handle.sync()
  } finally {
    await handle.close()
  }
}

function download(url, temporaryPath, temporaryHandle) {
  const transport = url.protocol === 'https:' ? https : http
  return new Promise((resolve, reject) => {
    let output
    let request
    let response
    let settled = false

    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      activeAbort = undefined
      void (async () => {
        if (output) {
          output.destroy(error)
          await finished(output).catch(() => {})
        }
        if (error) reject(error)
        else resolve(value)
      })()
    }

    const abort = (error) => {
      request?.destroy(error)
      response?.destroy(error)
      output?.destroy(error)
      if (!request && !response && !output) finish(error)
    }

    const timer = setTimeout(() => {
      abort(exportError('The PDF request timed out.', 'TIMEOUT'))
    }, timeoutMs())
    timer.unref()
    activeAbort = abort

    const requestOptions = url.protocol === 'http:'
      ? { method: 'GET', headers: { Accept: 'application/pdf' }, agent: false, family: 4 }
      : { method: 'GET', headers: { Accept: 'application/pdf' }, agent: false }

    request = transport.request(url, requestOptions, (incoming) => {
      response = incoming
      void (async () => {
        if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
          throw statusError(response.statusCode ?? 0)
        }

        const contentType = String(response.headers['content-type'] ?? '')
          .split(';', 1)[0]
          .trim()
          .toLowerCase()
        if (contentType !== 'application/pdf') {
          fail('The server did not return a PDF.', 'INVALID_PDF')
        }

        const rawLength = response.headers['content-length']
        if (rawLength === undefined) {
          fail('The PDF response did not declare its length.', 'INVALID_PDF')
        }
        const expectedLength = Number(rawLength)
        if (
          !Number.isSafeInteger(expectedLength) || expectedLength < 0 || expectedLength > MAX_BYTES
        ) {
          fail('The PDF is too large or has an invalid length.', 'OVERSIZE')
        }

        const filename = filenameFromDisposition(response.headers['content-disposition'])
        output = createWriteStream(temporaryPath, {
          autoClose: false,
          fd: temporaryHandle.fd,
        })
        let bytes = 0
        let signature = Buffer.alloc(0)
        let tail = Buffer.alloc(0)
        const guard = new Transform({
          transform(chunk, _encoding, callback) {
            bytes += chunk.length
            if (bytes > MAX_BYTES) {
              callback(exportError('The PDF is too large.', 'OVERSIZE'))
              return
            }
            if (signature.length < 5) {
              signature = Buffer.concat([signature, chunk]).subarray(0, 5)
            }
            tail = Buffer.concat([tail, chunk]).subarray(-1024)
            callback(null, chunk)
          },
        })

        try {
          await pipeline(response, guard, output)
        } catch (error) {
          if (
            (bytes < expectedLength)
            || normalizeTransportError(error) !== error
          ) {
            fail('The PDF response was truncated.', 'TRUNCATED')
          }
          throw error
        }
        output = undefined
        throwIfInterrupted()
        if (bytes !== expectedLength) {
          fail('The PDF response was truncated.', 'TRUNCATED')
        }
        if (!signature.equals(Buffer.from('%PDF-'))) {
          fail('The response is not a valid PDF.', 'INVALID_PDF')
        }
        if (!/%%EOF\s*$/u.test(tail.toString('latin1'))) {
          fail('The response is not a complete PDF.', 'INVALID_PDF')
        }
        await temporaryHandle.sync()
        const identity = await temporaryHandle.stat()
        if (!identity.isFile() || identity.size !== bytes || identity.nlink !== 1) {
          fail('The temporary PDF failed filesystem validation.', 'FINALIZATION_FAILED')
        }
        throwIfInterrupted()
        finish(undefined, {
          bytes,
          filename,
          identity: { dev: identity.dev, ino: identity.ino, size: identity.size },
        })
      })().catch((error) => {
        response.destroy()
        output?.destroy(error)
        finish(error)
      })
    })

    request.once('error', (error) => finish(normalizeTransportError(error)))
    request.end()
  })
}

async function removeIfOwned(filePath, identity) {
  const info = await inspectPath(filePath)
  if (!info) return
  if (!sameIdentity(info, identity)) {
    fail('A task-owned path changed during cleanup.', 'CLEANUP_FAILED')
  }
  await rm(filePath)
}

async function finalize(temporaryPath, finalPath, overwrite, identity, directoryIdentity) {
  throwIfInterrupted()
  await assertPrivateDirectory(path.dirname(finalPath), directoryIdentity)
  const temporaryInfo = await lstat(temporaryPath)
  if (!sameIdentity(temporaryInfo, identity) || temporaryInfo.nlink !== 1) {
    fail('The temporary PDF changed before finalization.', 'FINALIZATION_FAILED')
  }

  if (overwrite) {
    const existing = await inspectPath(finalPath)
    if (existing?.isSymbolicLink() || (existing && !existing.isFile())) {
      fail('The destination changed before finalization.', 'UNSAFE_DESTINATION')
    }
    const backupPath = existing
      ? path.join(path.dirname(finalPath), `.invompt-export.backup.${process.pid}.${randomUUID()}.tmp`)
      : undefined
    let originalMoved = false
    let published = false
    let publishedDurably = false
    try {
      if (backupPath) {
        throwIfInterrupted()
        await rename(finalPath, backupPath)
        originalMoved = true
        throwIfInterrupted()
        await flushDirectory(path.dirname(finalPath))
        throwIfInterrupted()
      }
      throwIfInterrupted()
      await rename(temporaryPath, finalPath)
      published = true
      throwIfInterrupted()
      const finalInfo = await lstat(finalPath)
      if (!sameIdentity(finalInfo, identity)) {
        fail('The finalized PDF identity is invalid.', 'FINALIZATION_FAILED')
      }
      throwIfInterrupted()
      await flushDirectory(path.dirname(finalPath))
      throwIfInterrupted()
      publishedDurably = true
      finalizationCommitted = true
      if (backupPath) {
        await rm(backupPath)
        originalMoved = false
        await flushDirectory(path.dirname(finalPath))
      }
      return
    } catch (error) {
      if (publishedDurably) {
        throw exportError(
          'The PDF was finalized safely, but task-owned backup cleanup failed.',
          'CLEANUP_FAILED',
        )
      }
      let rollbackError
      try {
        if (published) await removeIfOwned(finalPath, identity)
        if (originalMoved && backupPath) await rename(backupPath, finalPath)
        await flushDirectory(path.dirname(finalPath))
      } catch (caught) {
        rollbackError = caught
      }
      if (rollbackError) {
        throw exportError('PDF finalization failed and rollback was incomplete.', 'ROLLBACK_FAILED')
      }
      throw error
    }
  }

  let published = false
  try {
    throwIfInterrupted()
    await link(temporaryPath, finalPath)
    published = true
    throwIfInterrupted()
    const finalInfo = await lstat(finalPath)
    if (!sameIdentity(finalInfo, identity)) {
      fail('The finalized PDF identity is invalid.', 'FINALIZATION_FAILED')
    }
    throwIfInterrupted()
    await rm(temporaryPath)
    throwIfInterrupted()
    await flushDirectory(path.dirname(finalPath))
    throwIfInterrupted()
    finalizationCommitted = true
  } catch (error) {
    if (error?.code === 'EEXIST') fail('The destination file already exists.', 'COLLISION')
    if (published) {
      try {
        await removeIfOwned(finalPath, identity)
        await flushDirectory(path.dirname(finalPath))
      } catch {
        throw exportError('PDF finalization failed and cleanup was incomplete.', 'ROLLBACK_FAILED')
      }
    }
    throw error
  }
}

async function readStdin() {
  let input = ''
  for await (const chunk of process.stdin) {
    throwIfInterrupted()
    input += chunk
    if (input.length > 16_384) fail('The trusted invoice URL is too long.', 'INVALID_URL')
  }
  throwIfInterrupted()
  return input.trim()
}

function report(args, filePath, bytes) {
  const payload = { path: path.resolve(filePath), bytes }
  if (args.json) process.stdout.write(`${JSON.stringify(payload)}\n`)
  else process.stdout.write(`Exported PDF: ${payload.path} (${bytes} bytes)\n`)
}

async function main(allowedOrigin) {
  assertSafeRuntime()
  const args = parseArgs(process.argv.slice(2))
  const origin = validateAllowedOrigin(allowedOrigin)
  const { token, url } = validateUrl(await readStdin(), origin)
  const destination = await resolveDestination(args.destination, token, args.overwrite)
  throwIfInterrupted()
  const temporaryPath = path.join(destination.directory, `.invompt-export.${process.pid}.${randomUUID()}.tmp`)
  activeTemporaryPath = temporaryPath
  throwIfInterrupted()
  const temporaryHandle = await open(temporaryPath, 'wx', 0o600)
  activeTemporaryHandle = temporaryHandle
  let finalized = false
  let operationError

  try {
    throwIfInterrupted()
    const result = await download(url, temporaryPath, temporaryHandle)
    const finalPath = await resolveFinalPath(destination, result.filename, token, args.overwrite)
    await finalize(
      temporaryPath,
      finalPath,
      args.overwrite,
      result.identity,
      destination.directoryIdentity,
    )
    if (!finalizationCommitted) {
      fail('The PDF finalization commit point was not reached.', 'FINALIZATION_FAILED')
    }
    finalized = true
    activeTemporaryPath = undefined

    const finalInfo = await lstat(finalPath)
    if (!sameIdentity(finalInfo, result.identity)) {
      fail('The finalized PDF failed filesystem validation.', 'FINALIZATION_FAILED')
    }
    report(args, finalPath, result.bytes)
  } catch (error) {
    operationError = error
    throw error
  } finally {
    activeAbort = undefined
    let cleanupError
    try {
      await activeTemporaryHandle?.close()
    } catch (error) {
      if (error?.code !== 'EBADF') cleanupError = error
    }
    activeTemporaryHandle = undefined
    if (!finalized && activeTemporaryPath) {
      try {
        await rm(activeTemporaryPath, { force: true })
      } catch (error) {
        cleanupError ??= error
      }
    }
    activeTemporaryPath = undefined
    if (cleanupError) {
      if (operationError) {
        throw exportError('Task-owned PDF cleanup failed after another export failure.', 'CLEANUP_FAILED')
      } else {
        throw exportError('Task-owned PDF cleanup failed.', 'CLEANUP_FAILED')
      }
    }
  }
}

export async function runExportCli({ allowedOrigin }) {
  try {
    await main(allowedOrigin)
  } catch (error) {
    const failureOverridesInterruption = error?.code === 'ROLLBACK_FAILED' || error?.code === 'CLEANUP_FAILED'
    const safeError = failureOverridesInterruption ? error : interruption ?? error
    process.stderr.write(
      `PDF export failed [${safeError?.code || 'EXPORT_FAILED'}]: ${redact(safeError?.message || 'PDF export failed.')}\n`,
    )
    process.exitCode = safeError?.exitCode ?? 1
  }
}
