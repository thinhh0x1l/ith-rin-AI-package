import { appendFile, cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = path.resolve(__dirname, '..')
const ASSETS = path.join(PKG_ROOT, 'assets')
const DATE = new Date().toISOString().slice(0, 10)

const DOC_FILES = [
  'README.md',
  'hub-bootstrap.md',
  'ai-work-management.md',
  'context-management.md',
  'model-selection.md',
  'projects.md',
  'credits.md',
]

const SKILLS = [
  'using-hub',
  'ingest-repo-rules',
  'ai-architecture-and-task-routing',
  'session-to-memory',
]

const SCRIPTS = [
  'task-workspace.mjs',
  'task-start.mjs',
  'task-done.mjs',
  'review-package.mjs',
  'check-memory.mjs',
  'check-forbidden-terms.mjs',
  'check-index.mjs',
]

const NOTE = `> **Nguồn:** package \`ith-rin-ai\` (${DATE}). Các đường dẫn \`../core\`, \`../SKILL\`, \`templates/\` tính từ ith-rin AI gốc, không phải dự án này.\n\n`

function destName(file) {
  return file === 'README.md' ? 'hub-system.md' : file
}

export function transformDoc(text) {
  return text
    .replaceAll('docs/README.md', 'docs/ai-memory/hub-system.md')
    .replaceAll('docs/hub-bootstrap.md', 'docs/ai-memory/hub-bootstrap.md')
    .replaceAll('docs/ai-work-management.md', 'docs/ai-memory/ai-work-management.md')
    .replaceAll('docs/context-management.md', 'docs/ai-memory/context-management.md')
    .replaceAll('docs/model-selection.md', 'docs/ai-memory/model-selection.md')
    .replaceAll('docs/projects.md', 'docs/ai-memory/projects.md')
    .replaceAll('docs/credits.md', 'docs/ai-memory/credits.md')
}

async function exists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function isEmptyDir(p) {
  return (await readdir(p)).length === 0
}

async function writeText(dest, text) {
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, text, 'utf8')
}

async function copyText(src, dest, replacements) {
  let text = await readFile(src, 'utf8')
  for (const [key, value] of Object.entries(replacements)) {
    text = text.split(key).join(value)
  }
  await writeText(dest, text)
}

async function copyHubDocs(target) {
  const destDir = path.join(target, 'docs', 'ai-memory')
  await mkdir(destDir, { recursive: true })
  for (const file of DOC_FILES) {
    const src = path.join(ASSETS, 'docs', file)
    if (!(await exists(src))) {
      console.warn(`warn: missing ${file}`)
      continue
    }
    let text = transformDoc(await readFile(src, 'utf8'))
    if (!text.startsWith('> **Nguồn:**')) text = NOTE + text
    await writeFile(path.join(destDir, destName(file)), text, 'utf8')
  }
}

async function copySkills(target, force) {
  const destRoot = path.join(target, '.opencode', 'skills')
  await mkdir(destRoot, { recursive: true })
  const warnings = []
  for (const skill of SKILLS) {
    const src = path.join(ASSETS, 'skills', skill)
    const dest = path.join(destRoot, skill)
    if (!(await exists(src))) {
      warnings.push(`missing skill ${skill}`)
      continue
    }
    if ((await exists(dest)) && !force) {
      warnings.push(`skip existing skill ${skill}`)
      continue
    }
    await cp(src, dest, { recursive: true, force: true })
    const skillFile = path.join(dest, 'SKILL.md')
    if (await exists(skillFile)) {
      const text = transformDoc(await readFile(skillFile, 'utf8'))
      await writeFile(skillFile, text, 'utf8')
    }
  }
  return warnings
}

async function copyScripts(target, force) {
  const destDir = path.join(target, 'scripts')
  await mkdir(destDir, { recursive: true })
  const warnings = []
  for (const file of SCRIPTS) {
    const src = path.join(ASSETS, 'scripts', file)
    const dest = path.join(destDir, file)
    if (!(await exists(src))) {
      warnings.push(`missing script ${file}`)
      continue
    }
    if ((await exists(dest)) && !force) {
      warnings.push(`skip existing script ${file}`)
      continue
    }
    await cp(src, dest, { force: true })
  }
  return warnings
}

async function copyTemplateNew(target, opts) {
  const templateRoot = path.join(ASSETS, 'templates', 'new-project')
  const replacements = {
    '{{PROJECT_NAME}}': opts.name || path.basename(target),
    '{{PROJECT_DESCRIPTION}}': opts.description || 'TODO: mô tả dự án.',
    '{{DATE}}': DATE,
    '{{HUB_PATH}}': 'ith-rin-ai',
    '{{INSTALL_CMD}}': opts.install || 'TODO',
    '{{DEV_CMD}}': opts.dev || 'TODO',
    '{{BUILD_CMD}}': opts.build || 'TODO',
    '{{TEST_CMD}}': opts.test || 'TODO',
    '{{LINT_CMD}}': opts.lint || 'TODO',
    '{{TYPECHECK_CMD}}': opts.typecheck || 'TODO',
  }
  for (const file of [
    'AGENTS.md',
    'opencode.json',
    'docs/ai-memory/README.md',
    'docs/ai-memory/architecture.md',
    'docs/sessions/README.md',
  ]) {
    await copyText(path.join(templateRoot, file), path.join(target, file), replacements)
  }
}

async function mergeConfig(target) {
  const file = path.join(target, 'opencode.json')
  let cfg = { $schema: 'https://opencode.ai/config.json' }
  if (await exists(file)) {
    const text = await readFile(file, 'utf8')
    try {
      cfg = JSON.parse(text)
    } catch (error) {
      throw new Error(`opencode.json không hợp lệ: ${error.message}`)
    }
  }
  cfg.instructions ??= []
  if (!cfg.instructions.includes('docs/ai-memory/hub-bootstrap.md')) {
    cfg.instructions.push('docs/ai-memory/hub-bootstrap.md')
  }
  cfg.skills ??= {}
  cfg.skills.paths ??= []
  if (!cfg.skills.paths.includes('.opencode/skills')) {
    cfg.skills.paths.push('.opencode/skills')
  }
  cfg.references ??= {}
  if (!cfg.references.local) {
    cfg.references.local = {
      path: 'local',
      description: 'Local-only context: sources, AI management notes. Never commit or publish.',
    }
  }
  await writeFile(file, JSON.stringify(cfg, null, 2) + '\n', 'utf8')
}

async function ensureLocal(target) {
  const local = path.join(target, 'local')
  await mkdir(path.join(local, 'sources'), { recursive: true })
  await mkdir(path.join(local, 'ai-management'), { recursive: true })
  await mkdir(path.join(local, 'context'), { recursive: true })

  if (!(await exists(path.join(local, 'README.md')))) {
    await writeText(
      path.join(local, 'README.md'),
      '# Local-only context\n\nFolder này không commit, không push, không đưa vào package.\n\n- `sources/` — nguồn học, case study, repo tham khảo.\n- `ai-management/` — phân tích cách quản lý AI, pattern cá nhân.\n- `context/` — context đích danh cho task/dự án, không publish.\n',
    )
  }
  if (!(await exists(path.join(local, 'sources', 'README.md')))) {
    await writeText(
      path.join(local, 'sources', 'README.md'),
      '# Sources\n\nNguồn học và case study. Không commit.\n\nGiữ link nguồn gốc khi trích dẫn; không copy nguyên văn vào docs public/package.\n',
    )
  }
  if (!(await exists(path.join(local, 'forbidden-terms.md')))) {
    await writeText(
      path.join(local, 'forbidden-terms.md'),
      '# Forbidden terms\n\nThêm các từ không muốn public. Mỗi dòng một từ.\n\n- <term>\n\nCác từ này chỉ được xuất hiện trong `local/`.\n',
    )
  }
  if (!(await exists(path.join(local, 'forbidden-terms.json')))) {
    await writeText(
      path.join(local, 'forbidden-terms.json'),
      JSON.stringify({ terms: [], caseInsensitive: true, allowPaths: ['local/'] }, null, 2) + '\n',
    )
  }
  if (!(await exists(path.join(local, 'INDEX.md')))) {
    await writeText(
      path.join(local, 'INDEX.md'),
      '# Local index\n\n- `sources/` — nguồn học, case study.\n- `ai-management/` — phân tích cá nhân.\n- `context/` — context đích danh.\n- `forbidden-terms.md` — từ cấm public.\n- `forbidden-terms.json` — danh sách machine-readable cho check.\n',
    )
  }

  const gitignore = path.join(target, '.gitignore')
  let text = ''
  if (await exists(gitignore)) text = await readFile(gitignore, 'utf8')
  if (!/^local\/$/m.test(text)) {
    await writeText(gitignore, text + (text && !text.endsWith('\n') ? '\n' : '') + 'local/\n')
  }
}

async function createHubSection(target) {
  const src = path.join(ASSETS, 'templates', 'existing-project', 'AGENTS.hub-section.md')
  const text = transformDoc(await readFile(src, 'utf8'))
  await writeText(path.join(target, 'docs', 'ai-memory', 'HUB_SECTION.md'), text)
  return text
}

async function appendAgents(target, section) {
  const agents = path.join(target, 'AGENTS.md')
  if (!(await exists(agents))) {
    console.warn('warn: AGENTS.md not found; paste docs/ai-memory/HUB_SECTION.md manually')
    return
  }
  const text = await readFile(agents, 'utf8')
  if (text.includes('## Kế thừa từ hub')) {
    console.warn('warn: AGENTS.md already has "Kế thừa từ hub"')
    return
  }
  await appendFile(agents, `\n\n${section.trim()}\n`, 'utf8')
  console.log('appended: AGENTS.md')
}

async function ensureInitTarget(target, force) {
  if (await exists(target)) {
    if (!(await isEmptyDir(target)) && !force) {
      throw new Error(`target not empty: ${target}\nUse --force to write into it.`)
    }
  } else {
    await mkdir(target, { recursive: true })
  }
}

async function ensureExistingTarget(target) {
  if (!(await exists(target))) {
    throw new Error(`target not found: ${target}`)
  }
}

async function init(target, opts) {
  await ensureInitTarget(target, opts.force)
  await ensureLocal(target)
  await copyTemplateNew(target, opts)
  await copyHubDocs(target)
  const skillWarnings = await copySkills(target, true)
  const scriptWarnings = await copyScripts(target, true)
  await mergeConfig(target)
  console.log(`created: ${target}`)
  for (const warning of [...skillWarnings, ...scriptWarnings]) console.warn(`warn: ${warning}`)
  console.log('next: fill AGENTS.md commands/structure and docs/ai-memory/architecture.md')
  console.log('then: node scripts/check-memory.mjs')
}

async function retrofit(target, opts) {
  await ensureExistingTarget(target)
  await ensureLocal(target)
  await copyHubDocs(target)
  const skillWarnings = await copySkills(target, Boolean(opts.force))
  const scriptWarnings = await copyScripts(target, Boolean(opts.force))
  await mergeConfig(target)
  const section = await createHubSection(target)
  if (opts['append-agents']) await appendAgents(target, section)
  console.log(`retrofitted: ${target}`)
  for (const warning of [...skillWarnings, ...scriptWarnings]) console.warn(`warn: ${warning}`)
  console.log('next: paste docs/ai-memory/HUB_SECTION.md into AGENTS.md if not appended')
  console.log('then: node scripts/check-memory.mjs')
}

async function sync(target, opts) {
  if (!opts.force) throw new Error('sync requires --force')
  await ensureExistingTarget(target)
  await ensureLocal(target)
  await copyHubDocs(target)
  const skillWarnings = await copySkills(target, true)
  const scriptWarnings = await copyScripts(target, true)
  await mergeConfig(target)
  console.log(`synced: ${target}`)
  for (const warning of [...skillWarnings, ...scriptWarnings]) console.warn(`warn: ${warning}`)
}

async function check(target) {
  await ensureExistingTarget(target)
  const script = path.join(target, 'scripts', 'check-memory.mjs')
  if (!(await exists(script))) {
    await copyScripts(target, false)
  }
  if (!(await exists(script))) throw new Error('missing scripts/check-memory.mjs')
  const result = spawnSync(process.execPath, [script], { cwd: target, stdio: 'inherit' })
  if (result.status !== 0) process.exitCode = result.status ?? 1
}

function parseArgs(argv) {
  const opts = {}
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) continue
    const [key, inline] = arg.slice(2).split('=')
    if (inline !== undefined) {
      opts[key] = inline
      continue
    }
    if (key === 'force' || key === 'append-agents') {
      opts[key] = true
      continue
    }
    const value = argv[i + 1]
    if (!value || value.startsWith('--')) {
      opts[key] = true
      continue
    }
    opts[key] = value
    i++
  }
  return opts
}

function usage() {
  console.log(`ith-rin — ith-rin AI management system for OpenCode

Usage:
  ith-rin init <dir> [options]       create a new project
  ith-rin retrofit <dir> [options]   add ith-rin AI memory to an existing project
  ith-rin check <dir>                run scripts/check-memory.mjs in the project
  ith-rin sync <dir> --force         update docs/skills/scripts from this package

Options:
  --name <name>          project name (init)
  --description <text>   one-line description (init)
  --install <cmd>        install command (init)
  --dev <cmd>            dev command (init)
  --build <cmd>          build command (init)
  --test <cmd>           test command (init)
  --lint <cmd>           lint command (init)
  --typecheck <cmd>      typecheck command (init)
  --force                allow non-empty target / overwrite existing files
  --append-agents        append the hub section to AGENTS.md (retrofit)

Example:
  npx github:thinhh0x1l/ith-rin-ai init ../my-app --name "My App" --test "pnpm test"
  npx github:thinhh0x1l/ith-rin-ai retrofit ../existing-app --append-agents
`)
}

export async function main(argv) {
  const command = argv[0]
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    usage()
    return
  }
  const target = argv[1] && !argv[1].startsWith('--') ? argv[1] : '.'
  const opts = parseArgs(argv)

  if (command === 'init') return init(target, opts)
  if (command === 'retrofit') return retrofit(target, opts)
  if (command === 'check') return check(target)
  if (command === 'sync') return sync(target, opts)
  throw new Error(`unknown command: ${command}`)
}
