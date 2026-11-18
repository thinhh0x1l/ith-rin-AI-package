#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const root = process.cwd()
const [planArg, taskArg] = process.argv.slice(2)

if (!planArg || !taskArg) {
  console.error('usage: node scripts/task-start.mjs <plan.md> <N>')
  process.exit(1)
}

const planPath = path.resolve(root, planArg)
if (!existsSync(planPath)) {
  console.error(`plan not found: ${planPath}`)
  process.exit(1)
}

const text = readFileSync(planPath, 'utf8')
const lines = text.split(/\r?\n/)
const heading = `## Task ${taskArg}:`
const nextHeading = /^##\s+/

let start = -1
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith(heading)) {
    start = i
    break
  }
}
if (start === -1) {
  console.error(`task not found: "${heading}" in ${path.relative(root, planPath).split(path.sep).join('/')}`)
  process.exit(1)
}

let end = lines.length
for (let i = start + 1; i < lines.length; i++) {
  if (nextHeading.test(lines[i])) {
    end = i
    break
  }
}

const section = lines.slice(start, end).join('\n').trim()
const base = path.basename(planPath).replace(/\.md$/i, '')
const workspace = path.join(root, 'docs', 'tasks', base)
let sha = ''
try {
  sha = execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8' }).trim()
} catch {
  sha = '(no git)'
}
if (!sha.startsWith('(no git)')) {
  writeFileSync(path.join(workspace, `.base-${taskArg}`), sha + '\n', 'utf8')
}

console.log(section)
console.log()
console.log(`BASE: ${sha.slice(0, 7)}`)
console.log('next: write the failing test, watch it fail, implement, then:')
console.log(`node scripts/task-done.mjs ${planArg} ${taskArg} -- <verify command>`)
