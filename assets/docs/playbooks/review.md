# Playbook: review

## Prepare

- Use a fresh agent or model, not the executor.
- Provide the plan, the diff, the review focus and the ledger rulings.
- The reviewer is read-only.

## Review

- Check acceptance criteria first.
- Look for correctness, edge cases, security, data loss and missing tests.
- Cite `file:line` for every finding.
- Distinguish defect, risk and preference.

## Verdict

- `PASS`: no critical or important findings.
- `NEEDS CHANGES`: at least one critical or important finding.
- Minor findings are recorded but do not block.

## Fix pass

- Fix critical and important findings in one pass.
- Each fix starts with a failing test that reproduces the finding.
- Run the full suite after the pass.
- Do not dispatch a second review; verify the fixes with tests.

## Report

```md
# Review

Verdict:
Findings:
- [severity] file:line — issue — suggested fix
Checked:
- [ ] acceptance
- [ ] tests
- [ ] security
```
