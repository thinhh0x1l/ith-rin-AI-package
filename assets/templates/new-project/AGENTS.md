# AGENTS.md — {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Start

- Read `docs/ai-memory/README.md` for inherited memory.
- Full system: `docs/ai-memory/system.md` or package `ith-rin-ai`.
- Read `docs/ai-memory/kernel/lifecycle.md` and `contracts.md` before planning.
- Project rules override hub rules.

## Commands

| Task | Command |
|---|---|
| Install | `{{INSTALL_CMD}}` |
| Dev | `{{DEV_CMD}}` |
| Build | `{{BUILD_CMD}}` |
| Test | `{{TEST_CMD}}` |
| Lint | `{{LINT_CMD}}` |
| Typecheck | `{{TYPECHECK_CMD}}` |

## Structure

- `src/` — application code.
- `docs/` — docs and AI memory.
- `docs/sessions/` — one-off handoff.
- `.opencode/skills/` — project skills.
- `local/` — local-only sources; never commit.

## Conventions

- Keep changes within the requested scope.
- Run lint/typecheck on changed files.
- Add tests for new behavior or bug fixes.
- Report the commands you ran and their results.

## Forbidden

- Do not commit or push unless asked.
- Do not commit secrets, tokens or `.env`.
- Do not invent commands, models or test results.
- Do not edit files outside the requested scope.

## Inheritance

- `docs/ai-memory/system.md` — system entry.
- `docs/ai-memory/kernel/` — abstract model.
- `docs/ai-memory/adapters/` — tool-specific details.
- `docs/ai-memory/playbooks/` — task procedures.
- `docs/ai-memory/credits.md` — attribution.
- Local sources: `local/sources/` (never commit).
- Hub reference: `{{HUB_PATH}}`.

## AI memory

- `AGENTS.md` (this file) — always-on rules; keep short.
- `docs/ai-memory/` — detailed memory.
- `.opencode/skills/` — on-demand procedures: start with `using-hub`; capture with `session-to-memory`.
- `scripts/` — task ledger: `task-workspace`, `task-start`, `task-done`, `review-package`.
- `docs/sessions/` — one-off records.

## Verify

- Run lint/typecheck on changed files.
- Run related tests.
- Check links after editing docs.
- Report the commands and their real output.
