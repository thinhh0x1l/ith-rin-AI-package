# Projects

Registry of projects under management. Do not store code, specs, prompts or UI implementation here; link to the project's own files.

| Project | Path | AGENTS.md | opencode.json | Status | Last audit |
|---|---|---|---|---|---|
| _template_ | `D:\path\to\project` | `AGENTS.md` | `opencode.json` | active | YYYY-MM-DD |

## Add a project

1. New project: use `ith-rin init` or `templates/new-project/`.
2. Existing project: use `ith-rin retrofit` or `templates/existing-project/`.
3. Add a row to the table.
4. On audit, update `Last audit` and record notes in `docs/sessions/`.

## Keep out

- Code, specs, prompts, UI implementation.
- Secrets, tokens, `.env`.
- Details that only one project needs; keep them in that project's `docs/`.
