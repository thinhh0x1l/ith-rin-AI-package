# Adapter: CLI and scripts

The `ith-rin` CLI and the ledger scripts are one implementation of the kernel. Replace them without changing the kernel.

## CLI

```bash
npx github:thinhh0x1l/ith-rin-AI-package init <dir> [options]
npx github:thinhh0x1l/ith-rin-AI-package retrofit <dir> [--append-agents]
npx github:thinhh0x1l/ith-rin-AI-package check <dir>
npx github:thinhh0x1l/ith-rin-AI-package sync <dir> --force
```

The CLI writes `AGENTS.md`, `docs/ai-memory/`, `.opencode/skills/`, `scripts/`, `local/` and `opencode.json`.

## Ledger scripts

```bash
node scripts/task-workspace.mjs <plan.md>          # create docs/tasks/<plan>/progress.md
node scripts/task-start.mjs <plan.md> <N>          # print task brief + BASE
node scripts/task-done.mjs <plan.md> <N> -- <cmd>  # run verify; write ledger only on pass
node scripts/review-package.mjs <plan.md>          # package diff, commits, rulings, review focus
node scripts/check-memory.mjs                      # full memory check
node scripts/check-forbidden-terms.mjs             # public sensitive-term check
node scripts/check-index.mjs                       # index completeness
```

## Plan format

```md
# Plan: <name>

## Task 1: <name>
Goal:
Files:
Acceptance:
Verify:
Expected:

## Review Focus
- <what tests do not cover>
```

The scripts find tasks by the `## Task <N>:` heading. The ledger is `docs/tasks/<plan>/progress.md`.

## Rules

- `task-done` writes `complete` only when the verify command exits zero.
- Record deviations as `Ruling: <decision> — <why> — <cost if wrong>`.
- Run one fresh review after the last task, then one fix pass.
- Keep the scripts deterministic; do not call a model inside them.
