# Governance

Governance keeps the system honest when context, people and tools change.

## Checks

| Check | Purpose |
|---|---|
| `check-memory` | AGENTS length, JSON, skill frontmatter, links, secrets, placeholders |
| `check-forbidden-terms` | Prevent sensitive terms from leaving `local/` |
| `check-index` | Ensure the public index lists every required file |

Run them before commit. CI runs the public checks; local-only checks run when the local list exists.

## Rules

- Never commit secrets, tokens, credentials or `.env` files.
- Sensitive terms live only in `local/`; public files use generic descriptions.
- Do not commit or push unless explicitly asked.
- Do not rewrite published history without explicit approval.
- Keep `local/` out of git.
- Every public file has an owner purpose and an index entry.

## Change control

- Small change: one commit, focused diff.
- Behavior change: tests and docs in the same change.
- Destructive change: backup, dry-run, approval, then execute.
- Architecture change: decision record and review.

## Evidence

A completion claim needs evidence produced in the current session: command, output, screenshot or measurement. A previous run or a subagent report is not enough.
