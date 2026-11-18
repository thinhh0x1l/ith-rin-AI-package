#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const listFile = path.join(root, 'local', 'forbidden-terms.json')

if (!existsSync(listFile)) {
  console.warn('warn: local/forbidden-terms.json not found; skipping forbidden-term check')
  process.exit(0)
}

let config
try {
  config = JSON.parse(readFileSync(listFile, 'utf8'))
} catch (error) {
  console.error(`error: invalid local/forbidden-terms.json: ${error.message}`)
  process.exit(1)
}

const terms = (config.terms ?? []).filter((term) => typeof term === 'string' && term.trim())
if (terms.length === 0) {
  console.log('forbidden terms: none configured')
  process.exit(0)
}

const allowPaths = (config.allowPaths ?? ['local/']).map((p) => p.replaceAll('\\', '/'))
const caseInsensitive = config.caseInsensitive !== false
const lowered = terms.map((term) => (caseInsensitive ? term.toLowerCase() : term))
const skipDirs = new Set(['.git', 'node_modules', '.idea', '.next', 'dist', 'build'])
const textFile = /\.(md|json|mjs|js|ts|tsx|jsx|yml|yaml|sh)$/
const findings = []

function isAllowed(rel) {
  return allowPaths.some((prefix) => rel === prefix.slice(0, -1) || rel.startsWith(prefix))
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue
    const abs = path.join(dir, entry.name)
    const rel = path.relative(root, abs).split(path.sep).join('/')
    if (isAllowed(rel)) continue
    if (entry.isDirectory()) {
      walk(abs)
    } else if (entry.isFile() && textFile.test(entry.name)) {
      const lines = readFileSync(abs, 'utf8').split(/\r?\n/)
      for (let i = 0; i < lines.length; i++) {
        const line = caseInsensitive ? lines[i].toLowerCase() : lines[i]
        for (const term of lowered) {
          if (line.includes(term)) findings.push(`${rel}:${i + 1}: ${lines[i].trim()}`)
        }
      }
    }
  }
}

walk(root)

if (findings.length) {
  console.log(`forbidden terms found outside ${allowPaths.join(', ')}:`)
  for (const finding of findings) console.log(`err  ${finding}`)
  console.log(`\n${findings.length} finding(s)`)
  process.exit(1)
}

console.log(`forbidden terms: clean (${terms.length} configured)`)
