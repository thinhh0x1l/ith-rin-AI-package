# Adapter: OpenCode

This adapter maps the kernel to OpenCode.

## Config

`opencode.json` should contain:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["docs/kernel/bootstrap.md"],
  "skills": { "paths": [".opencode/skills"] },
  "references": {
    "local": {
      "path": "local",
      "description": "Local-only context. Never commit or publish."
    }
  }
}
```

## Model routing

Use exact model IDs from `/models`; do not invent names.

```json
{
  "agent": {
    "build": { "model": "<provider>/<fast-model-id>" },
    "plan":  { "model": "<provider>/<strong-model-id>" }
  }
}
```

Suggested workflow:

1. Build mode with a fast model: read sources and produce a context brief.
2. Plan mode with a strong model: produce a plan with `## Task N:` sections.
3. Build mode with the fast model: execute the plan and run verification.

For larger work, split into a context command, a plan command and a write command, or use subagents with separate permissions.

## Skills

- `using-hub` routes each task.
- `ingest-repo-rules` absorbs another repository's rule files.
- `ai-architecture-and-task-routing` handles AI architecture questions.
- `session-to-memory` captures reusable knowledge.
- `bootstrap-project` creates or retrofits a project.

Project skills take precedence over hub skills when names collide.

## Restart

OpenCode loads config, skills and instructions at startup. After changing them, quit and reopen. Use `opencode --continue` in the project root to keep the session history.

## Verification

Ask the agent to list skills, then ask it to read `AGENTS.md` and name the rules it will follow. If the answer is vague, shorten or clarify the bootstrap.
