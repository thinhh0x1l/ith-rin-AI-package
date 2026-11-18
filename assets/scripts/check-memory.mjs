#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []
const ok = []

const rel = (p) => path.relative(root, p).split(path.sep).join('/')
const read = (p) => readFileSync(p, 'utf8')

// 1. AGENTS.md stays small enough to be read every session.
const agents = path.join(root, 'AGENTS.md')
if (!existsSync(agents)) {
  errors.push('AGENTS.md missing')
} else {
  const lines = read(agents).split(/\r?\n/).length
  if (lines > 100) errors.push(`AGENTS.md has ${lines} lines (max 100)`)
  else ok.push(`AGENTS.md ${lines} lines`)
}

// 2. JSON configs must parse.
for (const file of [
  'opencode.json',
  'templates/new-project/opencode.json',
  'templates/existing-project/opencode.json',
]) {
  const p = path.join(root, file)
  if (!existsSync(p)) continue
  try {
    JSON.parse(read(p))
    ok.push(`${file} JSON`)
  } catch (error) {
    errors.push(`${file}: ${error.message}`)
  }
}

// 3. Every skill has frontmatter, a matching name, and a useful description.
const skillsDir = path.join(root, '.opencode/skills')
if (existsSync(skillsDir)) {
  for (const name of readdirSync(skillsDir)) {
    const dir = path.join(skillsDir, name)
    if (!statSync(dir).isDirectory()) continue
    const file = path.join(dir, 'SKILL.md')
    if (!existsSync(file)) {
      errors.push(`missing ${rel(file)}`)
      continue
    }
    const text = read(file)
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!frontmatter) {
      errors.push(`${rel(file)}: missing frontmatter`)
      continue
    }
    const body = frontmatter[1]
    const skillName = body.match(/^name:\s*(.+)$/m)?.[1]?.trim()
    const description = body.match(/^description:\s*(.+)$/m)?.[1]?.trim()
    if (!skillName) errors.push(`${rel(file)}: missing name`)
    else if (skillName !== name) errors.push(`${rel(file)}: name "${skillName}" != folder "${name}"`)
    if (!description || description.length < 20) errors.push(`${rel(file)}: missing/short description`)
    else ok.push(`skill ${name}`)
  }
} else {
  warnings.push('.opencode/skills missing')
}

// 4. Local markdown links resolve from the repo root or the file's directory.
const docsDir = path.join(root, 'docs')
const linkTargets = [agents]
if (existsSync(docsDir)) {
  const collect = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name)
      if (entry.isDirectory()) collect(p)
      else if (entry.isFile() && entry.name.endsWith('.md')) linkTargets.push(p)
    }
  }
  collect(docsDir)
}
const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g
for (const file of linkTargets) {
  if (!existsSync(file)) continue
  const text = read(file)
  let match
  while ((match = linkPattern.exec(text))) {
    let target = match[1].trim()
    if (
      !target ||
      target.startsWith('#') ||
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('mailto:') ||
      target.includes('{{')
    ) {
      continue
    }
    target = target.split('#')[0].split('?')[0]
    if (!target) continue
    const candidates = [path.resolve(root, target), path.resolve(path.dirname(file), target)]
    if (!candidates.some(existsSync)) errors.push(`${rel(file)}: broken link ${match[1]}`)
  }
}
ok.push('markdown links')

// 5. No obvious secrets in text files.
const secretPattern = /(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/
const skipDirs = new Set(['.git', 'node_modules', '.idea', '.next', 'dist', 'build'])
const textFile = /\.(md|json|mjs|js|ts|yml|yaml|sh)$/
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (entry.isFile() && textFile.test(entry.name) && secretPattern.test(read(p))) {
      errors.push(`${rel(p)}: possible secret`)
    }
  }
}
walk(root)
ok.push('secret scan')

// 6. Unresolved placeholders are only allowed inside templates.
for (const file of linkTargets) {
  if (!existsSync(file)) continue
  if (/\{\{[^}]+\}\}/.test(read(file))) errors.push(`${rel(file)}: unresolved placeholder`)
}
ok.push('placeholders')

const forbiddenScript = path.join(root, 'scripts', 'check-forbidden-terms.mjs')
if (existsSync(forbiddenScript)) {
  const result = spawnSync(process.execPath, [forbiddenScript], { cwd: root, stdio: 'inherit' })
  if (result.status !== 0) errors.push('forbidden terms check failed')
}

const indexScript = path.join(root, 'scripts', 'check-index.mjs')
if (existsSync(indexScript)) {
  const result = spawnSync(process.execPath, [indexScript], { cwd: root, stdio: 'inherit' })
  if (result.status !== 0) errors.push('index check failed')
}

for (const line of ok) console.log(`ok   ${line}`)
for (const line of warnings) console.log(`warn ${line}`)
for (const line of errors) console.log(`err  ${line}`)

if (errors.length) {
  console.log(`\n${errors.length} error(s)`)
  process.exit(1)
}
console.log('\nall checks passed')
