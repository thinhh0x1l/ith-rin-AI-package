---
name: ai-architecture-and-task-routing
description: Use when the user asks how a repository manages AI (providers, runtimes, models, task queues, agent tools, cost, safety) or wants to classify which model/tool should do which work. Loads the optional local case study at local/sources/architecture-case-study.md and the target repo's AGENTS.md/specs; covers Pi text runtime, image/TTS adapters, per-feature model assignment, task queue, publish sync/async, and skill-vs-script boundaries.
---

# AI Architecture and Task Routing

## Scope

Use when the user asks how a repo manages AI or which model/tool should do which work. Start from the optional local case study if present; then narrow to the target repo.

## Read order

1. `local/sources/architecture-case-study.md` — optional local case study and drift list.
2. `local/sources/source-repos.md` — optional map of `core` and `SKILL`.
3. Target repo: `AGENTS.md` / `apps/*/AGENTS.md` first; only then the matching spec.
4. For current provider/model availability, check `/models` or the repo config; do not trust old spec names.

## Answer shape

| Layer | Question |
|---|---|
| Architecture | What are the layers (feature, runtime, provider, queue, storage)? |
| Model routing | Which feature uses which model/runtime? Is there a default + override? |
| Determinism | What is script/CLI, what is model, what needs human approval? |
| Safety | What are the contracts, gates, cost/telemetry, rollback? |

## Core rules to preserve

- Text → Pi `PiRuntimeAdapter`; image → `ImageRuntimeAdapter`; TTS → `TtsRuntimeAdapter`; do not collapse them into one model.
- Per-feature assignment (`writerModel`, `summaryModel`, `translationModel`, `translationReviewModel`, `insightsModel`, `tts.model`, `imageGeneration.model`) is config, not a request-time choice.
- Long generation goes through the task queue; publish chooses `sync`/`async`; auto-generation on content events is removed.
- Deterministic work (migration, tests, release, image slicing, chunking, renderers) belongs to scripts/CLI.
- Agent writes require dry-run + user approval; collab agent writes as a Loro peer (one turn = one undo row).

## Drift check

Before quoting an old spec, check the drift section of `local/sources/architecture-case-study.md` if it exists. Prefer `AGENTS.md` and newer specs. If two specs conflict, say so and identify the likely current one.

## Verification

- [ ] Every claim has a file path or a config source.
- [ ] Current vs historical is labeled.
- [ ] No invented model names; availability checked.
- [ ] The answer distinguishes model, runtime, script, and human approval.
