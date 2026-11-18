---
name: using-hub
description: Use at the start of any task in a project managed by this hub - routes the work to the right stage (context, plan, execute, review, verify), points to the hub playbook and ledger scripts, and enforces evidence before claims.
---

# Using Hub — workflow

Before you read project files or write code, route the task to its stage and follow the hub playbook (`docs/README.md`, `docs/ai-work-management.md`).

## Route first

| Situation | Do |
|---|---|
| Requirement unclear | Load `brainstorming` if available; else ask one question per message per `docs/ai-work-management.md` §2 |
| Need context | Act as Context Collector (Flash): produce a context brief |
| Need a plan | Use Plan mode (Pro): produce a plan with `## Task N:` sections, `Verify` + `Expected:` |
| Execute an approved plan | Act as Executor: TDD per task; use the ledger scripts below |
| Bug / failing test / unexpected behavior | Load `systematic-debugging` if available; else root-cause before fix |
| About to say done | Load `verification-before-completion` if available; always show evidence |
| After the session | Load `session-to-memory` and capture reusable knowledge |

Plain questions and read-only checks need no skill. Human instructions override skills. A project's own skill for a step does that step.

## Ledger scripts

Hub ships scripts to keep a durable record that survives compaction:

```text
node scripts/task-workspace.mjs <plan.md>          # tạo workspace + ledger
node scripts/task-start.mjs <plan.md> <N>          # in brief task N + BASE
node scripts/task-done.mjs <plan.md> <N> -- <test> # chạy test, ghi ledger nếu pass
node scripts/review-package.mjs <plan.md>          # đóng gói cho review cuối
```

Rules:

- Never start a task without a `## Task N:` section with Goal / Files / Acceptance / Verify / Expected.
- Watch the failing test fail before implementing.
- Only `task-done` writes `complete` to the ledger, and only when the test command passed.
- Record every deviation as `Ruling: <decision> — <why> — <cost if wrong>` in the ledger.
- After the last task, run one fresh review (subagent/model khác), then one fix pass.

## Evidence before claims

Before saying anything is done, fixed, or passing — and before committing, pushing, or opening a PR — run the command that proves it in this session, read its full output, and state the result with that evidence. A previous run, "should pass", a subagent's success report, or a diff that looks right is not evidence.

## Context budget

- Read the project before asking; only ask what changes what gets built.
- Keep the always-on layer short (`AGENTS.md`); details live in `docs/`.
- Hand off with artifacts: context brief → plan → execution report → review → verification. Never "as discussed earlier".
