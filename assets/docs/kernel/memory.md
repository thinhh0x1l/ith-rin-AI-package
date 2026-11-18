# Memory

Memory is a layered system, not one long prompt. Keep the always-on layer small; load detail on demand; persist decisions as artifacts.

## Layers

| Layer | Contents | Loaded |
|---|---|---|
| Always-on | `AGENTS.md`, bootstrap rules | Every session |
| On-demand | docs, playbooks, skills, references | When the task matches |
| Runtime | task contract, context brief, plan, diff, test output | During the task |
| Durable | specs, decisions, ledgers, reviews, sessions | When revisited |
| Local-only | source notes, sensitive context | Only when explicitly needed |

## What goes where

| Knowledge | Destination |
|---|---|
| Rule that must shape every task | `AGENTS.md` |
| Detailed method or decision | `docs/` |
| Repeatable procedure | `.opencode/skills/<name>/SKILL.md` |
| One-off handoff or decision | `docs/sessions/` |
| Source-specific or sensitive context | `local/` (never public) |

## Lifecycle

1. **Capture** during or after a session.
2. **Classify** into rule, doc, skill, session or local.
3. **Promote** only reusable, generic knowledge into public docs.
4. **Prune** stale or unused material.
5. **Index** every public file in `INDEX.md`.

## Rules

- Do not copy the whole session into a skill.
- Do not duplicate the same rule in several files.
- Do not put long procedures in `AGENTS.md`.
- Do not let local context leak into public docs or packages.
- Prefer links and references over repeated prose.
