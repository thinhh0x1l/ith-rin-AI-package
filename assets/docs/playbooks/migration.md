# Playbook: migration

Migrations are deterministic work. Use scripts, staged changes and evidence.

## Principles

- Separate **expand** (add compatible structures) from **contract** (remove old structures).
- Old and new code must coexist during a rolling deploy.
- Every migration is reversible or has a documented rollback.
- Back up before destructive changes.

## Staged pattern

| Change | Release 1 | Release 2 | Release 3 |
|---|---|---|---|
| Add nullable column | Add column | Backfill | — |
| Add NOT NULL | Add nullable + dual write | Backfill | Set NOT NULL |
| Rename column | Add new + dual write | Backfill + switch reads | Drop old |
| Drop column | Stop reading/writing | Drop column | — |
| Change type | Add new + dual write | Backfill + switch | Drop old |

## Workflow

1. Write the migration and the rollback.
2. Test against a disposable database.
3. Run the project's migration lint.
4. Apply to staging; verify reads and writes.
5. Deploy during a controlled window.
6. Remove the old path in a later release.

## Checklist

- [ ] Compatible with the previous release
- [ ] Rollback documented
- [ ] Tested on a disposable database
- [ ] Lint passes
- [ ] Backup exists before destructive steps
- [ ] Evidence recorded
