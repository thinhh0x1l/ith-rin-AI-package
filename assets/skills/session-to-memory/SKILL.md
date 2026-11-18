---
name: session-to-memory
description: Use when a session produced reusable knowledge that should persist — after complex research, architecture analysis, debugging, or a decision — and the user wants to capture it as project docs, a reusable skill, or an AGENTS.md rule. Classifies evidence into docs/ (detailed memory), .opencode/skills/ (procedural memory), and AGENTS.md (always-on rules); enforces skill gates and verification.
---

# Session to Memory

## Scope

Use after a session produced reusable knowledge: architecture analysis, debugging, a decision, a workflow. Turn it into the right durable artifact instead of leaving it in chat.

## Classify first

| Destination | Use for | Keep |
|---|---|---|
| `AGENTS.md` | Always-on rule that must shape every session | Short, imperative; total file <= ~100 lines |
| `docs/*.md` | Detailed knowledge, synthesis, decisions, source maps | Full detail, links, dates |
| `.opencode/skills/<name>/SKILL.md` | Repeatable procedure with a trigger | Workflow + boundaries + verification |
| `docs/sessions/YYYY-MM-DD-<topic>.md` | One-off handoff or decision record | Context, files, next steps |

## Skill gate

Create a skill only if all pass:

- Triggerability: a concrete future request activates it.
- Repeatability: the work will recur.
- Knowledge delta: it teaches non-obvious procedure or a hard-won boundary.
- Coherence: one trigger family, one target, one outcome.
- Verifiability: success is externally observable.
- Stability: the method survives routine version changes.
- Boundary clarity: exclusions and stopping conditions are stated.

If any gate fails, use docs or a session record instead.

## Workflow

```text
[1] Inventory: decisions, failed assumptions, commands, evidence, open questions
[2] Classify: AGENTS rule / docs / skill / session record
[3] Write the smallest artifact that preserves the reusable part
[4] Link it from AGENTS.md or the relevant docs index
[5] Verify: links resolve, commands are real, no secrets, triggers are explicit
```

## Rules

- Do not copy the whole session into a skill; keep only the executable method.
- Do not put long procedures in `AGENTS.md`.
- Do not create a skill for a one-off or for knowledge that is already in docs.
- Ask before publishing, deleting, or rewriting user content.
- No secrets, tokens, or personal paths.

## Verification

- [ ] Destination matches the classification table.
- [ ] Skill description contains concrete trigger words.
- [ ] Every command/path is real.
- [ ] `AGENTS.md` still under ~100 lines.
- [ ] New docs are linked from an index.
