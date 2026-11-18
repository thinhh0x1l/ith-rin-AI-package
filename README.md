# ith-rin AI

Installable AI management system for OpenCode. It ships:

- A CLI to **init** a new project or **retrofit** an existing one with ith-rin AI memory.
- An OpenCode **plugin** that registers the ith-rin skills and injects the bootstrap.
- Docs, skills, ledger scripts and templates used by both paths.

## CLI

No npm publish needed — install/run directly from GitHub:

```bash
npx github:thinhh0x1l/ith-rin-AI-package init ../my-app \
  --name "My App" \
  --description "My project" \
  --install "pnpm install" \
  --dev "pnpm dev" \
  --build "pnpm build" \
  --test "pnpm test" \
  --lint "pnpm lint" \
  --typecheck "pnpm typecheck"
```

Existing project:

```bash
npx github:thinhh0x1l/ith-rin-AI-package retrofit ../existing-app --append-agents
```

Other commands:

```bash
npx github:thinhh0x1l/ith-rin-AI-package check ../my-app
npx github:thinhh0x1l/ith-rin-AI-package sync ../my-app --force
```

Global install:

```bash
npm install -g github:thinhh0x1l/ith-rin-AI-package
ith-rin init ../my-app
```

## OpenCode plugin

OpenCode V1 (`plugin` key):

```json
{
  "plugin": ["ith-rin-ai@git+https://github.com/thinhh0x1l/ith-rin-AI-package.git"]
}
```

OpenCode V2 (`plugins` key):

```json
{
  "plugins": ["ith-rin-ai@git+https://github.com/thinhh0x1l/ith-rin-AI-package.git"]
}
```

Restart OpenCode. The plugin:

- adds this package's `assets/skills` to `skills.paths`;
- adds `assets/docs/hub-bootstrap.md` to `instructions`, so every session gets the routing/evidence rules.

The CLI and plugin can be used together: CLI writes project-local docs/skills/scripts; the plugin makes the ith-rin skills available without copying.

## What the CLI writes

| Path | Purpose |
|---|---|
| `AGENTS.md` | project rules + ith-rin inheritance (init only) |
| `opencode.json` | `instructions` + `skills.paths` (merged, not overwritten) |
| `docs/ai-memory/` | ith-rin docs, bootstrap, project architecture |
| `docs/sessions/` | one-off handoff/decision records |
| `.opencode/skills/` | `using-hub`, `ingest-repo-rules`, `ai-architecture-and-task-routing`, `session-to-memory` |
| `scripts/` | `task-workspace`, `task-start`, `task-done`, `review-package`, `check-memory` |

## Workflow

```text
Intake → Context → Plan → Execute → Review → Verify → Land
```

- `using-hub` routes each task.
- `task-workspace`/`task-start`/`task-done` keep a ledger in `docs/tasks/<plan>/progress.md`.
- `review-package` builds the final review package.
- `check-memory` validates AGENTS length, JSON, skill frontmatter, links, secrets, placeholders.

## Scope

The package manages **rules, memory, model routing and workflow** across projects. It does not contain project code, UI implementation or secrets.

## Credits

See `assets/docs/credits.md` for sources that informed the system. The ith-rin AI brand and operating structure are yours.

## License

`UNLICENSED` by default. Change `package.json` before publishing or redistributing.
