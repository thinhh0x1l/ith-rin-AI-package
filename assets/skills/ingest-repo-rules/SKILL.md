---
name: ingest-repo-rules
description: Use when the user asks to read, extract, merge, or standardize AI instruction files from another repository (AGENTS.md, CLAUDE.md, SKILL.md, README.md, .cursorrules) into this hub or a project AGENTS.md. Covers inventory, extraction of build/test/lint commands, directory structure, code conventions, forbidden actions, and release/deploy rules, then merge and verify.
---

# Ingest Repo Rules

## Scope

Use to absorb AI instruction files from another repository into this hub or a target project's `AGENTS.md`. Sources: `AGENTS.md`, `CLAUDE.md`, `README.md`, `SKILL.md`, `.cursorrules`, `docs/*` rule files.

Do not edit the source repo. Do not read the entire repo when the question only needs the rule layer.

## Workflow

```text
[1] Inventory
      -> list candidate files; read root first, then app/package-level files
[2] Extract
      -> 5 buckets: build/test/lint, directory structure, code conventions, forbidden actions, release/deploy
[3] Merge
      -> dedupe; project-specific rule wins; keep target AGENTS.md <= ~100 lines
[4] Verify
      -> run one small task or check each command; shorten ambiguous rules
```

## Extraction checklist

| Bucket | Capture |
|---|---|
| Commands | exact install/build/test/lint/typecheck commands and working directory |
| Structure | entrypoints, apps/packages, where rules and docs live |
| Conventions | naming, validation, response shape, error handling, test style |
| Forbidden | destructive commands, files not to touch, secrets, force-push, schema changes |
| Release/deploy | branch/tag flow, migration order, rollback, environment gates |

Record `path:line` for every important rule.

## Output

- For this hub: write/update `local/sources/repo-map.md` (local-only) or public `docs/` if the content is generic; add a link from `AGENTS.md` only for public docs.
- For a project: write `AGENTS.md` at the project root; put long detail in `docs/` and link it.
- Keep always-on rules short; move prose and history to docs.

## Rules

- Never invent commands or model names. Mark uncertain items as "verify".
- Never copy secrets, tokens, or machine-specific paths.
- Do not merge conflicting rules silently: note the conflict and the winner.
- Prefer the source repo's most authoritative file (`AGENTS.md` > `README.md` > old spec).

## Verification

- [ ] Every command was seen in the source or run successfully.
- [ ] Every link resolves.
- [ ] Target `AGENTS.md` is under ~100 lines.
- [ ] No secrets or personal paths.
