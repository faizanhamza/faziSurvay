# AGENTS.md

## AI Agent Policy

This repository follows the [Simple-AI-Workflow](https://github.com/FaziHamza/Simple-AI-Workflow) protocol for AI-assisted development.

## Session Protocol

1. **Before starting**: Read `ai/context.md` and `ai/next-steps.md`
2. **During work**: Commit incrementally with descriptive messages
3. **After completing**: Update `ai/progress.md` and `ai/next-steps.md`
4. **End of session**: Create a checkpoint in `ai/daily-checkpoints/`

## Constraints

- Do not push directly to `main` without human review
- Always work on a feature branch for non-trivial changes
- Keep commits atomic and descriptive
- Do not modify files outside the scope of the current task
- Never expose secrets, tokens, or credentials in commits

## Tracking Files

| File | Purpose |
|------|---------|
| `ai/context.md` | Repository purpose and key structure |
| `ai/progress.md` | Session progress log |
| `ai/next-steps.md` | Pending tasks and resume point |
| `ai/daily-checkpoints/` | Daily session summaries |

## Getting Started

Run **Bootstrap AI** from AgentBoard to create the `ai/` tracking folder structure.
