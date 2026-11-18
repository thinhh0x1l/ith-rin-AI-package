# ith-rin AI — AI Management System

ith-rin AI is an operating model for AI-assisted work across projects. It is split into an abstract kernel, concrete adapters and task playbooks. Read this file first; open only what the task needs.

## Layers

| Layer | Path | Purpose |
|---|---|---|
| Rules | `AGENTS.md` | Always-on contract |
| Index | `INDEX.md` | Master index public/local |
| Kernel | `docs/kernel/` | Tool-agnostic model |
| Adapters | `docs/adapters/` | OpenCode, CLI/scripts, project profile |
| Playbooks | `docs/playbooks/` | Feature, bug, review, migration |
| Skills | `.opencode/skills/` | Procedures loaded on demand |
| Ledger | `scripts/` | Task state and evidence |
| Templates | `templates/` | Project bootstrap/retrofit |
| Registry | `docs/projects.md` | Projects under management |
| Local | `local/` | Private sources and context |

## Kernel

- `docs/kernel/principles.md` — rules that do not change with tools.
- `docs/kernel/roles.md` — who does what.
- `docs/kernel/lifecycle.md` — intake to land.
- `docs/kernel/contracts.md` — artifacts and quality gates.
- `docs/kernel/routing.md` — task-to-model/tool mapping.
- `docs/kernel/memory.md` — what to remember and where.
- `docs/kernel/governance.md` — checks, secrets and change control.
- `docs/kernel/bootstrap.md` — what to do at session start.

## Reading paths

**New agent (10 minutes):** `AGENTS.md` → `INDEX.md` → `docs/kernel/bootstrap.md` → `docs/kernel/lifecycle.md`.

**Working agent (30 minutes):** add `docs/kernel/contracts.md`, `docs/kernel/routing.md`, `docs/kernel/memory.md`.

**Implementation:** `docs/adapters/opencode.md` or `docs/adapters/cli-and-scripts.md`.

**Task procedure:** the matching file under `docs/playbooks/`.

**Private sources:** `local/INDEX.md` (never commit).

## Task lifecycle

```text
Intake → Context → Plan → Execute → Review → Verify → Land
```

Each stage has an input, an output and a gate. The detail is in `docs/kernel/lifecycle.md`.

## Project adoption

- New project: `ith-rin init` or `templates/new-project/`.
- Existing project: `ith-rin retrofit` or `templates/existing-project/`.
- Every project should have: a short `AGENTS.md`, `docs/ai-memory/`, `.opencode/skills/` and `opencode.json`.
- Project rules override hub rules. Sensitive sources stay in the project's `local/`.

## Quality checks

```bash
node scripts/check-memory.mjs
node scripts/check-forbidden-terms.mjs
node scripts/check-index.mjs
```

`check-memory` also runs the other two when their files exist. Run before commit; CI runs the public checks.

## Further reading

- `docs/adapters/opencode.md` — config, model routing, skills, restart.
- `docs/adapters/cli-and-scripts.md` — CLI and ledger.
- `docs/playbooks/feature.md`, `bug.md`, `review.md`, `migration.md`.
- `docs/projects.md` — project registry.
- `docs/credits.md` — attribution (generic).
