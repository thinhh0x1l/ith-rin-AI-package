#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const indexFile = path.join(root, 'INDEX.md')

if (!existsSync(indexFile)) {
  console.warn('warn: INDEX.md not found; skipping index check')
  process.exit(0)
}

const text = readFileSync(indexFile, 'utf8')

const required = [
  'AGENTS.md',
  'docs/README.md',
  'docs/hub-bootstrap.md',
  'docs/ai-work-management.md',
  'docs/context-management.md',
  'docs/model-selection.md',
  'docs/projects.md',
  'docs/credits.md',
  'docs/sessions/README.md',
  '.opencode/skills/using-hub/SKILL.md',
  '.opencode/skills/ingest-repo-rules/SKILL.md',
  '.opencode/skills/ai-architecture-and-task-routing/SKILL.md',
  '.opencode/skills/session-to-memory/SKILL.md',
  '.opencode/skills/bootstrap-project/SKILL.md',
  'scripts/task-workspace.mjs',
  'scripts/task-start.mjs',
  'scripts/task-done.mjs',
  'scripts/review-package.mjs',
  'scripts/check-memory.mjs',
  'scripts/check-forbidden-terms.mjs',
  'scripts/check-index.mjs',
  'templates/new-project/AGENTS.md',
  'templates/new-project/README.md',
  'templates/new-project/opencode.json',
  'templates/new-project/docs/ai-memory/README.md',
  'templates/new-project/docs/ai-memory/architecture.md',
  'templates/new-project/docs/sessions/README.md',
  'templates/existing-project/AGENTS.hub-section.md',
  'templates/existing-project/README.md',
  'templates/existing-project/opencode.json',
  'opencode.json',
  '.github/workflows/check-memory.yml',
  '.githooks/pre-commit',
]

const missing = required.filter((entry) => !text.includes(entry))
if (missing.length) {
  console.log('index missing entries:')
  for (const entry of missing) console.log(`err  ${entry}`)
  console.log(`\n${missing.length} missing`)
  process.exit(1)
}

const localDir = path.join(root, 'local')
if (existsSync(localDir) && !existsSync(path.join(localDir, 'INDEX.md'))) {
  console.warn('warn: local/ exists but local/INDEX.md is missing')
}

console.log(`index: ${required.length} public entries present`)
