# Playbook: feature

## Intake

- State the goal, why, constraints and acceptance.
- Ask only what changes the implementation.
- If the feature spans modules or architecture, step up to a written design.

## Context

- Read `AGENTS.md` and the relevant code first.
- Produce a context brief with files, existing behavior and decisions.
- Do not dump the repository into the prompt.

## Plan

- Split into tasks that each end green and committable.
- Each task has files, acceptance, verify and expected result.
- Identify risks and the tests that reduce them.

## Execute

- Write the failing test first; watch it fail for the expected reason.
- Implement the smallest change; run the task verify.
- Keep the ledger current.
- Do not stop between approved tasks to ask "should I continue?".

## Review

- Get one fresh review of the branch.
- Regrade findings by user impact.
- Fix critical and important findings in one pass; defer minors.

## Verify

- Run the task verify, the suite, lint and type checks.
- For UI, compare screenshots at the agreed viewports.
- Record what was verified and what was not.

## Land

- Squash by default; rebase, PR or keep only when requested.
- No merge commit unless the project explicitly requires one.
- Report rulings, deferred minors and evidence.
