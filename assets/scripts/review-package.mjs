#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = process.cwd()
const argv = process.argv.slice(2)
const [planArg] = argv

if (!planArg) {
  console.error('usage: node scripts/review-package.mjs <plan.md> [--base <sha>] [--head <sha>]')
  process.exit(1)
}

const rel = (p) => path.relative(root, p).split(path.sep).join('/')
const planPath = path.resolve(root, planArg)
if (!existsSync(planPath)) {
  console.error(`plan not found: ${planPath}`)
  process.exit(1)
}

const baseName = path.basename(planPath).replace(/\.md$/i, '')
const workspace = path.join(root, 'docs', 'tasks', baseName)
const ledger = path.join(workspace, 'progress.md')

function findBase() {
  const baseIdx = argv.indexOf('--base')
  if (baseIdx !== -1 && argv[baseIdx + 1]) return argv[baseIdx + 1]
  const baseFile = path.join(workspace, '.base-1')
  if (existsSync(baseFile)) return readFileSync(baseFile, 'utf8').trim()
  try {
    return execSync('git merge-base main HEAD', { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

const headIdx = argv.indexOf('--head')
const base = findBase()
let head = ''
if (headIdx !== -1 && argv[headIdx + 1]) head = argv[headIdx + 1]
if (!head) {
  try {
    head = execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    head = ''
  }
}

if (!base || !head) {
  console.error('cannot resolve base/head. Use --base <sha> (e.g. first task BASE).')
  process.exit(1)
}

const planText = readFileSync(planPath, 'utf8')
const reviewFocus = planText.match(/## Review Focus[\s\S]*$/)?.[0]?.trim() ?? '(no Review Focus section)'

let ledgerText = ''
if (existsSync(ledger)) ledgerText = readFileSync(ledger, 'utf8')
const rulings = ledgerText.split(/\r?\n/).filter((l) => l.includes('Ruling:'))

const run = (cmd) => {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}
const diffStat = run(`git diff ${base}..${head} --stat`)
const diffNames = run(`git diff ${base}..${head} --name-only`)
const commits = run(`git log --oneline ${base}..${head}`)

const out = [
  `# Review package — ${baseName}`,
  ``,
  `Plan: ${rel(planPath)}`,
  `Range: ${base.slice(0, 7)}..${head.slice(0, 7)}`,
  ``,
  `## Files changed`,
  '```',
  diffNames || '(none)',
  '```',
  ``,
  `## Diffstat`,
  '```',
  diffStat || '(none)',
  '```',
  ``,
  `## Commits`,
  '```',
  commits || '(none)',
  '```',
  ``,
  `## Ledger rulings`,
  rulings.length ? rulings.map((l) => `- ${l}`).join('\n') : '(none)',
  ``,
  `## Review Focus (from plan)`,
  reviewFocus,
  ``,
  `## Instructions`,
  'Dispatch a fresh reviewer (different agent/model, read-only). Regrade findings by what the user gets. Critical/Important enter ONE fix pass (TDD); Minor goes to deferred list; unledgered deviations are secret decisions.',
  '',
].join('\n')

mkdirSync(workspace, { recursive: true })
const date = new Date().toISOString().slice(0, 10)
const pkgFile = path.join(workspace, `review-${date}.md`)
writeFileSync(pkgFile, out, 'utf8')

console.log(out)
console.log(`\nsaved: ${rel(pkgFile)}`)
console.log(`diff to read: git diff ${base.slice(0, 7)}..${head.slice(0, 7)}`)
