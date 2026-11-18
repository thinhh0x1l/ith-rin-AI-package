# AI Memory

This project inherits the ith-rin AI system. Read this file first, then the kernel and playbooks.

## Layers

- `AGENTS.md` — always-on rules; keep short.
- `docs/ai-memory/` — detailed memory.
- `.opencode/skills/` — on-demand procedures.
- `local/` — local-only sources; never commit.
- `docs/sessions/` — one-off records.

## Read order

1. `system.md` — system entry.
2. `kernel/bootstrap.md` — session start.
3. `kernel/lifecycle.md` — intake to land.
4. `kernel/contracts.md` — artifacts and gates.
5. `kernel/routing.md` — task-to-model/tool mapping.
6. `kernel/memory.md` — what to remember and where.
7. `kernel/governance.md` — checks and change control.
8. `playbooks/` — feature, bug, review, migration.
9. `adapters/` — OpenCode, CLI/scripts, project profile.
10. `credits.md` — attribution.

## Task lifecycle

```text
Intake → Context → Plan → Execute → Review → Verify → Land
```

## Roles

| Role | Model/agent | Permission |
|---|---|---|
| Context Collector | lightweight | read-only |
| Planner | strong | read-only |
| Executor | fast coding | write |
| Reviewer | strong/independent | read-only |
| Verifier | scripts + human | commands/read |
| Orchestrator | human | full |

## Update

After a session with reusable knowledge, use `session-to-memory` to classify it into docs, a skill or an `AGENTS.md` rule. Do not put long procedures in `AGENTS.md`.

## Project notes

- Add project-specific decisions to `architecture.md` or `docs/`.
