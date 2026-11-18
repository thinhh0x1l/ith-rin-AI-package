#!/usr/bin/env node
import { appendFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { execSync, spawnSync } from 'node:child_process'

const root = process.cwd()
const argv = process.argv.slice(2)
const [planArg, taskArg] = argv

if (!planArg || !taskArg) {
  console.error('usage: node scripts/task-done.mjs <plan.md> <N> -- <verify command>')
  process.exit(1)
}

const sep = argv.indexOf('--')
const commandArgs = sep === -1 ? [] : argv.slice(sep + 1)
if (commandArgs.length === 0) {
  console.error('missing verify command after --')
  process.exit(1)
}
const command = commandArgs.join(' ')

const base = path.basename(path.resolve(root, planArg)).replace(/\.md$/i, '')
const workspace = path.join(root, 'docs', 'tasks', base)
const ledger = path.join(workspace, 'progress.md')
mkdirSync(workspace, { recursive: true })

const result = spawnSync(commandArgs[0], commandArgs.slice(1), {
  cwd: root,
  encoding: 'utf8',
})
const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
const passed = result.status === 0

const tail = output.split(/\r?\n/).slice(-30).join('\n')
console.log(tail)

if (!passed) {
  console.error(`\ntask ${taskArg} FAILED — command exited non-zero. Ledger not updated.`)
  process.exit(1)
}

let baseSha = ''
const baseFile = path.join(workspace, `.base-${taskArg}`)
if (existsSync(baseFile)) baseSha = readFileSync(baseFile, 'utf8').trim()

let headSha = ''
try {
  headSha = execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8' }).trim()
} catch {
  headSha = ''
}

const range = baseSha && headSha ? `${baseSha.slice(0, 7)}..${headSha.slice(0, 7)}` : '?..?'
const relPlan = path.relative(root, path.resolve(root, planArg)).split(path.sep).join('/')
const line = `Task ${taskArg}: complete (commits ${range}, tests: ${command} → pass)\n`
appendFileSync(ledger, line, 'utf8')

console.log(`\nledger: ${path.relative(root, ledger).split(path.sep).join('/')} ← ${line.trim()}`)
console.log(`plan: ${relPlan}`)
