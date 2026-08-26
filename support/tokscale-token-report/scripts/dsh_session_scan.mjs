#!/usr/bin/env node
/**
 * DSH session usage scanner for the tokscale-token-report skill.
 *
 * Walks a DSH sessions root (`$DSH_HOME/sessions` layout), decodes the
 * append-only `session.jsonl(.zstd)` artifacts, and emits one compact NDJSON
 * record per session to stdout. The Python caller applies the fork/resume-safe
 * seed boundary and aggregates; this helper owns only Zstandard decoding and
 * event extraction, so it can stay a small, verifiable bridge.
 *
 * Output contract (one JSON object per line, UTF-8, to stdout):
 *   {"kind":"session","id":...,"seedLength":n|null,"hasParent":bool,
 *    "origin":"subagent"|null,"firstEndSeedSeq":n|null,
 *    "usage":[{"seq":n,"time":ms,"provider":...,"model":...,
 *              "input":n,"output":n,"cacheRead":n,"cacheWrite":n,"reasoning":n},...]}
 *   {"kind":"meta","files":n,"sessions":n,"usageRecords":n,"tornSkipped":n,
 *    "errors":[{"path":...,"message":...},...]}
 *
 * Exit codes: 0 success; 1 fatal scan error; 2 missing/not-a-directory root;
 *             3 unsupported Node (no zlib zstd, requires Node >= 22.5).
 *
 * Decoding mirrors dsh-session-persistence-jsonl: concatenated, checksummed
 * Zstandard frames; a structurally incomplete final frame is a torn tail and
 * is recovered with a finishFlush prefix decode when possible. Packed chunk
 * rows (text-chunks / reasoning-chunks / tool-call-chunks) carry no usage,
 * boundary, or route metadata, so they are skipped without expansion.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { zstdDecompressSync } from 'node:zlib'

const ZSTD_MAGIC = 0xFD2FB528
const CHUNK_ROW_TYPES = new Set(['text-chunks', 'reasoning-chunks', 'tool-call-chunks'])
const SESSION_FILENAMES = new Set(['session.jsonl', 'session.jsonl.zstd'])

/** @param {number[] | undefined} argv */
function parseArgs(argv) {
  let root = null
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root') root = argv[i + 1] ?? null
  }
  return { root }
}

/** @param {number | null | undefined} value */
function safeCount(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null
}

/**
 * Locate complete Zstandard frames without decompressing their blocks.
 * @param {Buffer} buf
 * @returns {{frames: {start:number,end:number}[], tornStart?: number}}
 */
function scanZstdFrames(buf) {
  const frames = []
  let offset = 0
  while (offset < buf.length) {
    const start = offset
    if (buf.length - offset < 4) return { frames, tornStart: start }
    if (buf.readUInt32LE(offset) !== ZSTD_MAGIC) {
      throw new Error(`invalid Zstandard frame magic at byte ${offset}`)
    }
    offset += 4
    if (offset === buf.length) return { frames, tornStart: start }
    const descriptor = buf.readUInt8(offset)
    offset += 1
    if ((descriptor & 0x18) !== 0) {
      throw new Error(`reserved frame-header bit at byte ${offset - 1}`)
    }
    const contentSizeFlag = descriptor >>> 6
    const singleSegment = (descriptor & 0x20) !== 0
    const checksum = (descriptor & 0x04) !== 0
    const dictionaryFlag = descriptor & 0x03
    const dictionaryBytes = dictionaryFlag === 3 ? 4 : dictionaryFlag
    const contentSizeBytes = contentSizeFlag === 0
      ? (singleSegment ? 1 : 0)
      : 1 << contentSizeFlag
    const remainingHeaderBytes = (singleSegment ? 0 : 1) + dictionaryBytes + contentSizeBytes
    if (buf.length - offset < remainingHeaderBytes) return { frames, tornStart: start }
    offset += remainingHeaderBytes
    for (;;) {
      if (buf.length - offset < 3) return { frames, tornStart: start }
      const blockHeader = buf.readUIntLE(offset, 3)
      offset += 3
      const lastBlock = (blockHeader & 1) !== 0
      const blockType = (blockHeader >>> 1) & 0x03
      const blockSize = blockHeader >>> 3
      if (blockType === 0x03) {
        throw new Error(`reserved block type at byte ${offset - 3}`)
      }
      const payloadBytes = blockType === 0x01 ? 1 : blockSize
      if (buf.length - offset < payloadBytes) return { frames, tornStart: start }
      offset += payloadBytes
      if (lastBlock) break
    }
    if (checksum) {
      if (buf.length - offset < 4) return { frames, tornStart: start }
      offset += 4
    }
    frames.push({ start, end: offset })
  }
  return { frames }
}

/**
 * @param {Buffer} buf
 * @returns {{ plain: string[], tornSkipped: boolean }}
 */
function decodeFrames(buf) {
  const { frames, tornStart } = scanZstdFrames(buf)
  const plain = frames.map(({ start, end }) => zstdDecompressSync(buf.subarray(start, end)).toString('utf8'))
  let tornSkipped = false
  if (tornStart !== undefined && tornStart < buf.length) {
    try {
      plain.push(zstdDecompressSync(buf.subarray(tornStart), { finishFlush: true }).toString('utf8'))
    } catch {
      tornSkipped = true
    }
  }
  return { plain, tornSkipped }
}

/** @param {string} root */
function walkSessionFiles(root) {
  const found = []
  const stack = [root]
  while (stack.length > 0) {
    const dir = stack.pop()
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) stack.push(full)
      else if (SESSION_FILENAMES.has(entry.name)) found.push(full)
    }
  }
  return found
}

/**
 * Extract header, first seed boundary, route state, and usage events from one
 * session's full plaintext JSONL.
 * @param {string} text
 * @returns {{header: object|null, firstEndSeedSeq: number|null, usage: object[]}}
 */
function processPlaintext(text) {
  const lines = text.split('\n')
  let header = null
  let firstEndSeedSeq = null
  const usage = []
  let provider = null
  let model = null
  for (const raw of lines) {
    if (raw === '') continue
    let obj
    try {
      obj = JSON.parse(raw)
    } catch {
      continue
    }
    const type = obj.type
    if (header === null) {
      if (type === 'session') {
        header = {
          id: typeof obj.id === 'string' ? obj.id : null,
          seedLength: safeCount(obj.seedLength),
          hasParent: obj.parentSession !== undefined || obj.origin === 'subagent',
          origin: obj.origin === 'subagent' ? 'subagent' : null,
          createdAt: safeCount(obj.createdAt),
        }
      }
      continue
    }
    if (CHUNK_ROW_TYPES.has(type)) continue
    if (type === 'session/end-seed') {
      if (firstEndSeedSeq === null) firstEndSeedSeq = safeCount(obj.seq)
      continue
    }
    if (type === 'request/context') {
      const data = obj.data ?? {}
      if (typeof data.provider === 'string') provider = data.provider
      if (typeof data.model === 'string') model = data.model
      continue
    }
    if (type === 'assistant/message') {
      const data = obj.data ?? {}
      const u = data.usage
      if (u !== null && typeof u === 'object') {
        usage.push({
          seq: safeCount(obj.seq),
          time: safeCount(obj.time),
          provider: provider ?? 'unknown',
          model: model ?? 'unknown',
          input: safeCount(u.inputTokens),
          output: safeCount(u.outputTokens),
          cacheRead: safeCount(u.cacheReadTokens),
          cacheWrite: safeCount(u.cacheWriteTokens),
          reasoning: safeCount(u.reasoningTokens),
        })
      }
    }
  }
  return { header, firstEndSeedSeq, usage }
}

/** @returns {number} */
function main() {
  const [major, minor] = process.versions.node.split('.').map(Number)
  if (
    typeof zstdDecompressSync !== 'function'
    || !Number.isInteger(major) || !Number.isInteger(minor)
    || major < 22 || (major === 22 && minor < 5)
  ) {
    console.error(
      `dsh_session_scan: requires Node >= 22.5 with node:zlib Zstandard support (running ${process.versions.node}).`,
    )
    return 3
  }
  const { root } = parseArgs(process.argv.slice(2))
  if (root === null) {
    console.error('dsh_session_scan: --root <sessions-directory> is required.')
    return 2
  }
  let entries
  try {
    entries = readdirSync(root, { withFileTypes: true })
  } catch {
    console.error(`dsh_session_scan: sessions root is not a readable directory: ${root}`)
    return 2
  }
  const files = walkSessionFiles(root)
  const errors = []
  let sessions = 0
  let usageRecords = 0
  let tornSkipped = 0
  for (const file of files) {
    let buf
    try {
      buf = readFileSync(file)
    } catch (error) {
      errors.push({ path: file, message: error instanceof Error ? error.message : String(error) })
      continue
    }
    try {
      const { plain, tornSkipped: torn } = file.endsWith('.zstd') ? decodeFrames(buf) : { plain: [buf.toString('utf8')], tornSkipped: false }
      tornSkipped += torn ? 1 : 0
      const { header, firstEndSeedSeq, usage } = processPlaintext(plain.join('\n'))
      if (header === null) {
        errors.push({ path: file, message: 'first line is not a session header record' })
        continue
      }
      usageRecords += usage.length
      sessions += 1
      process.stdout.write(`${JSON.stringify({
        kind: 'session',
        id: header.id,
        seedLength: header.seedLength,
        hasParent: header.hasParent,
        origin: header.origin,
        firstEndSeedSeq,
        usage,
      })}\n`)
    } catch (error) {
      errors.push({ path: file, message: error instanceof Error ? error.message : String(error) })
    }
  }
  process.stdout.write(`${JSON.stringify({
    kind: 'meta',
    root,
    files: files.length,
    sessions,
    usageRecords,
    tornSkipped,
    errors,
  })}\n`)
  // Per-file failures are reported in meta.errors and are not fatal: the scan
  // itself completed, and the caller decides how to surface partial coverage.
  return 0
}

process.exitCode = main()
