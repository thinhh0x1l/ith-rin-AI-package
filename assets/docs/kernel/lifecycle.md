# Lifecycle

Every non-trivial task follows the same pipeline. A small task may collapse stages, but it may not skip verification or role separation.

```text
Intake → Context → Plan → Execute → Review → Verify → Land
```

| Stage | Question | Output | Gate |
|---|---|---|---|
| Intake | What result is wanted, why, and what is out of scope? | Task contract | Goal, constraints and acceptance are explicit |
| Context | What must the executor know? | Context brief | Every claim has a path or source |
| Plan | What are the steps, risks and tests? | Plan with `## Task N:` sections | Each task has acceptance and verify |
| Execute | Does the change implement the plan? | Changes + execution report | Failing test seen before implementation |
| Review | What is wrong or missing? | Findings + verdict | Fresh context, not the author |
| Verify | What proves the claim? | Evidence | Command output, screenshot or measurement |
| Land | Is it safe to merge or publish? | Merge/PR/release decision | Human approval |

## Sizing

| Size | Characteristics | Lifecycle |
|---|---|---|
| Quick task | One obvious change, one verification | Intake + Execute + Verify |
| Small change | A few files, behavior change | Intake + Plan + Execute + Verify |
| Project | Multiple components, design decisions | Full lifecycle |

If a task grows beyond its size, stop and step up. Do not silently expand scope.

## Stage and apply

Separate **stage** (create or update a draft) from **apply** (merge, publish or deploy). The applying step requires explicit approval.

## Stop conditions

Stop and ask when:

- an operation is irreversible or destructive;
- the action is security-sensitive;
- a side effect leaves the working tree or branch (merge, push to a shared branch, publish);
- the plan is broken enough that every path is a guess.

Everything else in an approved plan runs without asking "should I continue?".
