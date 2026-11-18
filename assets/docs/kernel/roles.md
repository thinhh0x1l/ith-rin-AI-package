# Roles

The operating model has six roles. One agent may play several roles only when the separation rule allows it.

| Role | Responsibility | Input | Output | Permission |
|---|---|---|---|---|
| Orchestrator | Owns the goal, scope, budget and final decision | User request | Task contract, approvals | Full |
| Context Collector | Finds and compresses relevant context | Task contract | Context brief | Read-only |
| Planner | Decomposes work, identifies risks, defines acceptance | Context brief | Plan + task list | Read-only |
| Executor | Implements the plan and reports evidence | Plan + context | Changes + execution report | Write |
| Reviewer | Finds defects independently | Plan + diff | Findings + verdict | Read-only |
| Verifier | Runs tests, checks and visual proof | Changes | Evidence | Read-only + commands |

## Separation rules

- The executor never reviews its own work.
- The planner never writes production code.
- The reviewer never fixes during review; fixes are a separate pass.
- The verifier reports what it observed, not what it expected.
- The orchestrator is a human unless the user explicitly delegates a bounded decision.

## Role selection

- Small, clear task: Orchestrator + Executor + Verifier.
- Feature: all six roles.
- Bug: Orchestrator + Context Collector + Executor + Verifier; Reviewer for risky fixes.
- Research or architecture: Orchestrator + Context Collector + Planner + Reviewer.
