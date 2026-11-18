#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = process.cwd()
const [planArg] = process.argv.slice(2)

if (!planArg) {
  console.error('usage: node scripts/task-workspace.mjs <plan.md>')
  process.exit(1)
}

const planPath = path.resolve(root, planArg)
if (!existsSync(planPath)) {
  console.error(`plan not found: ${planPath}`)
  process.exit(1)
}

const base = path.basename(planPath).replace(/\.md$/i, '')
const workspace = path.join(root, 'docs', 'tasks', base)
const ledger = path.join(workspace, 'progress.md')

mkdirSync(workspace, { recursive: true })
if (!existsSync(ledger)) {
  const relPlan = path.relative(root, planPath).split(path.sep).join('/')
  writeFileSync(ledger, `# Ledger — plan: ${relPlan}\n\n`, 'utf8')
}

const rel = (p) => path.relative(root, p).split(path.sep).join('/')
let sha = ''
try {
  sha = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim()
} catch {
  sha = '(no git)'
}

console.log(`workspace: ${rel(workspace)}`)
console.log(`ledger:    ${rel(ledger)}`)
console.log(`plan:      ${rel(planPath)}`)
console.log(`BASE:      ${sha}`)
console.log('next: node scripts/task-start.mjs <plan.md> 1')
