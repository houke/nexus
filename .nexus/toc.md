# Feature Index

> **Master tracking document for all features in this project.**
>
> Each feature has its own folder in `.nexus/features/<feature-slug>/` containing all related documents (plan, execution, review, notes).

## Features

| Feature           | Status | Files | Agents | Last Edited |
| ----------------- | ------ | ----- | ------ | ----------- |
| [agentlytics-vscode-analysis](features/agentlytics-vscode-analysis/) | draft | [plan](features/agentlytics-vscode-analysis/plan.md) | @nexus, @architect, @security-agent, @software-developer, @qa-engineer, @tech-lead | 2026-03-14 (v1.4) |
| [nexus-workflows-skill](features/nexus-workflows-skill/) | draft | [plan](features/nexus-workflows-skill/plan.md) | @architect | 2026-03-26 |

<!--
USAGE:

When adding a new feature, add a row to the table above:

| [feature-name](features/<slug>/) | draft | [plan](features/<slug>/plan.md) | @architect, @dev | YYYY-MM-DD |

STATUS VALUES:
- `draft` - Plan created, work not started
- `in-progress` - Currently being implemented
- `review` - Implementation complete, under review
- `complete` - Reviewed and finished
- `on-hold` - Paused, not actively worked on
- `archived` - No longer relevant

FILES column: Comma-separated list of documents that exist for this feature
- plan, execution, review, summary, notes/*

AGENTS column: List all agents who contributed using @mentions
- @architect, @software-developer, @qa-engineer, etc.

LAST EDITED: Date of most recent change to any document in the feature folder
-->

## Quick Links

- **Templates**: [plugins/nexus/skills/nexus-workflows/templates/](../../plugins/nexus/skills/nexus-workflows/templates/) - Document templates for new features
- **Memory**: [.nexus/memory/](memory/) - Agent preference files
- **Workflows**: [plugins/nexus/skills/nexus-workflows/workflows/](../../plugins/nexus/skills/nexus-workflows/workflows/) - Workflow prompts

## Status Legend

| Status        | Icon | Meaning                                    |
| ------------- | ---- | ------------------------------------------ |
| `draft`       | 📝   | Plan created, implementation not started   |
| `in-progress` | 🔄   | Actively being implemented                 |
| `review`      | 🔍   | Implementation complete, under code review |
| `complete`    | ✅   | Reviewed, tested, and finished             |
| `on-hold`     | ⏸️   | Temporarily paused                         |
| `archived`    | 📦   | No longer active/relevant                  |

## Adding a New Feature

1. Create folder: `.nexus/features/<feature-slug>/`
2. Copy template from `plugins/nexus/skills/nexus-workflows/templates/plan.template.md` into `.nexus/features/<slug>/plan.md`
3. Add row to table above
4. Fill out the plan document
5. Use `nexus-execution` prompt to begin implementation

## Workflow Quick Reference

```
Planning    → Creates features/<slug>/plan.md (status: draft)
Execution   → Creates features/<slug>/execution.md (status: in-progress)
Review      → Creates features/<slug>/review.md (status: complete)
Summary     → Updates features/<slug>/summary.md (any status)
Sync        → Reconciles this toc.md with actual work done
```
