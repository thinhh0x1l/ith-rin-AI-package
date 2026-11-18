# Adapter: project profile

A project profile maps the kernel to one repository. It belongs in that repository's `AGENTS.md` and `docs/ai-memory/`, not in the hub.

## Profile fields

| Field | Example |
|---|---|
| Name | Project display name |
| Stack | Framework, language, database |
| Commands | install, dev, build, test, lint, typecheck |
| Structure | entrypoints, apps, packages, docs |
| Conventions | naming, validation, response shape, tests |
| Constraints | files not to touch, migration rules, release gates |
| Model routing | which model tier for which feature |
| Sensitive terms | local-only list |
| Local sources | `local/sources/` |

## Creating a profile

1. Run `ith-rin init` for a new project or `ith-rin retrofit` for an existing one.
2. Fill the commands and structure in `AGENTS.md`.
3. Fill `docs/ai-memory/architecture.md`.
4. Add project-specific skills under `.opencode/skills/`.
5. Put sensitive sources in `local/`, not in `docs/`.
6. Run `node scripts/check-memory.mjs`.

## Overrides

Project rules override hub rules. When they conflict, record the conflict and the reason in the project's `docs/`.

## Minimal AGENTS.md

```md
# AGENTS.md — <project>

## Commands
- install:
- dev:
- build:
- test:
- lint:

## Structure
- ...

## Conventions
- ...

## Forbidden
- ...

## Verify
- ...
```

Keep it under about 100 lines. Link to `docs/` for detail.
