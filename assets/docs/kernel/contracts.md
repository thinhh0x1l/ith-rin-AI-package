# Contracts

A contract makes a handoff precise. Every stage produces one; the next stage consumes it without needing the chat history.

## Task contract

```md
# Task: <name>

Goal: <one or two sentences>
Why: <reason and constraints>
Context: <files, sources, decisions>
Constraints: <do not touch, must keep, budget>
Acceptance:
- [ ] <observable result>
Verify: <exact command or check>
Owner: <role/model/tool>
Open questions: <none or list>
```

## Context brief

```md
# Context brief

Goal:
Relevant files:
Existing behavior:
Constraints:
Decisions already made:
Open questions:
Sources: <path or URL>
```

Rules: every claim has a source; no "as discussed"; no full repository dump.

## Plan

```md
# Plan: <name>

## Task 1: <name>
Goal:
Files:
Interfaces: Produces / Consumes
Acceptance:
Verify: <command>
Expected: <result>

## Task 2: ...

## Review Focus
- <what tests do not cover>
```

Rules: each task ends green and committable; `Consumes` matches an earlier `Produces`.

## Execution report

```md
# Execution report

Changed: <files>
Ran: <command> → <result>
Not done: <items>
Risks: <items>
```

## Review

```md
# Review

Verdict: PASS / NEEDS CHANGES
Findings:
- [severity] file:line — issue — suggested fix
Checked:
- [ ] acceptance
- [ ] tests
- [ ] security
```

## Verification

```md
# Verification

Claim:
Where verified: <environment/build/commit>
Ran: <command> → <result>
Evidence: <path, screenshot, measurement, time>
Not verified: <items and why>
```

## Definition of ready

- Goal, constraints and acceptance are clear.
- Context is sufficient and sourced.
- A verification method exists.

## Definition of done

- Acceptance passes.
- Relevant tests, lint and type checks pass.
- Evidence exists and is fresh.
- No secrets or sensitive terms leaked.
- Docs or skills updated when behavior changed.
