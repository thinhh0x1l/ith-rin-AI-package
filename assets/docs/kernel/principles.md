# Principles

The hub is a tool-agnostic operating model for AI-assisted work. These principles are stable; implementations belong in `adapters/`.

## Core principles

1. **One task, one output, one verification.** A task without an observable output and a way to verify it is not a task.
2. **Separate roles.** The planner does not execute; the executor does not approve its own work; the reviewer is independent.
3. **Hand off artifacts, not chat memory.** Every stage leaves a file: brief, plan, execution report, review, evidence.
4. **Match model strength to decision weight.** Strong models for planning, architecture and review; lightweight models for extraction and mechanical work.
5. **Evidence before claims.** Run the command, read the output, then report. "Should pass" is not evidence.
6. **Small always-on context, detailed on demand.** Keep `AGENTS.md` short; put detail in docs, skills and references.
7. **Deterministic work goes to tools.** Scripts, tests, migrations and renderers beat a model guessing.
8. **Destructive work needs approval.** Dry-run, review, explicit confirmation, then execute.
9. **The human owns the goal, budget and final decision.** AI proposes and executes within those bounds.
10. **Sensitive context stays local.** Source-specific notes never enter public docs or packages.
11. **Progressive disclosure.** Read the smallest file that answers the question; open references only when needed.
12. **Remove friction with evidence.** If a rule is ignored, shorten it, clarify it, or automate the check.
