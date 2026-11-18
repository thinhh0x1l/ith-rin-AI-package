# Playbook: bug

## 1. Reproduce

- Capture the exact steps and the observed result.
- If it is visual, capture the broken screen before changing anything.
- If it is not reproducible, gather more data; do not guess.

## 2. Investigate

- Read the full error, stack trace and relevant logs.
- Check recent changes, dependencies and configuration.
- Instrument component boundaries when the system has several layers.
- Trace the bad value back to its source.

## 3. Hypothesize

- Write one hypothesis: "X is the cause because Y".
- Test the smallest possible change.
- If it fails, form a new hypothesis; do not stack fixes.

## 4. Fix

- Write a failing test that reproduces the bug.
- Fix the root cause, not the symptom.
- Run the test, then the full suite.
- Verify where the bug was seen.

## 5. Escalate

If three fixes fail, stop and question the architecture. A series of unrelated fixes is evidence of a wrong design, not a run of bad luck.

## Checklist

- [ ] Reproduction captured
- [ ] Root cause identified
- [ ] Failing test seen before the fix
- [ ] Fix is minimal
- [ ] Regression test passes
- [ ] Full suite and lint pass
- [ ] Evidence recorded
