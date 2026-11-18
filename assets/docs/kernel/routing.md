# Routing

Route by task nature, not by brand name. Check the available models in the current tool before assigning one; never invent a model.

## Task classes

| Class | Typical work | Best fit |
|---|---|---|
| Extraction | Read, summarize, extract rules from many files | Lightweight model |
| Planning | Architecture, decomposition, trade-offs | Strong model |
| Execution | Implement a plan, mechanical edits, tests | Fast coding model |
| Review | Independent defect finding | Strong model or different agent |
| Verification | Run commands, compare output | Scripts and tools |
| Visual | Mockups, screenshots, UI judgement | Vision model or human |
| Deterministic | Migrations, formatting, slicing, rendering | Script or CLI |

## Rules

- Do not use a strong model for mechanical work.
- Do not use a lightweight model for architecture, security or migrations.
- Do not let the executor review itself.
- Use a different agent or model family for review when the decision is important.
- Record the chosen model and reason in the task contract.
- If the assigned model is unavailable, choose the closest tier and say so.

## Escalation

Escalate when:

- the task changes architecture or public contracts;
- the model cannot explain its plan or evidence;
- review finds a defect the executor cannot reproduce;
- the cost of a wrong decision is high.

De-escalate when the work is repetitive, well-specified and cheap to verify.
