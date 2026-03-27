# Feature Lifecycle

> Part of the `nexus-workflows` skill. Detailed reference for feature status management.

## Status Lifecycle

Every feature flows through these states:

```
draft → in-progress → review → complete
```

### State Diagram

```
  ┌─────────┐
  │  draft   │  Created by /plan workflow
  └────┬─────┘
       │ /execute starts
       ▼
  ┌─────────────┐
  │ in-progress  │  Active implementation
  └────┬─────────┘
       │ /review starts
       ▼
  ┌─────────┐
  │  review  │  Under code review
  └────┬─────┘
       │ Review approved
       ▼
  ┌──────────┐
  │ complete  │  Done and approved
  └──────────┘
```

### Additional States

```
  ┌─────────┐
  │ on-hold  │  Paused (set manually)
  └─────────┘

  ┌──────────┐
  │ archived  │  No longer relevant (set manually)
  └──────────┘
```

## Status Definitions

| Status        | Meaning                        | Set By     | Next State    |
| ------------- | ------------------------------ | ---------- | ------------- |
| `draft`       | Planned but not started        | `/plan`    | `in-progress` |
| `in-progress` | Currently being implemented    | `/execute` | `review`      |
| `review`      | Implementation done, reviewing | `/review`  | `complete`    |
| `complete`    | Reviewed and finished          | `/review`  | —             |
| `on-hold`     | Paused                         | Manual     | Any           |
| `archived`    | No longer relevant             | Manual     | —             |

## Feature Folder Structure

Each feature has its own folder in `.nexus/features/`:

```
.nexus/features/<feature-slug>/
├── plan.md        # Created by /plan — What we're building and why
├── execution.md   # Created by /execute — Implementation tracking
├── review.md      # Created by /review — Code review findings
├── summary.md     # Created by /summary — Status snapshot (optional)
└── notes/         # Supporting materials, research, sketches
```

### Naming Convention

Use kebab-case for feature slugs:

- `user-authentication`
- `snake-game`
- `data-sync-engine`

## Master TOC

The file `.nexus/toc.md` is the **single source of truth** for all features.

**Always update toc.md** when creating or modifying feature documents.

| Feature   | Status   | Files                   | Agents           | Last Edited |
|-----------|----------|-------------------------|------------------|-------------|
| user-auth | complete | plan, execution, review | @architect, @dev | 2026-01-26  |

## Status Transitions

### draft → in-progress

Triggered when the `/execute` workflow starts:

1. Plan frontmatter `status` field is updated to `in-progress`
2. `execution.md` is created in the feature folder
3. `toc.md` is updated with new status and files

### in-progress → review

Triggered when the `/review` workflow starts:

1. Plan frontmatter `status` field is updated to `review`
2. `review.md` is created in the feature folder
3. `toc.md` is updated

### review → complete

Triggered when the `/review` workflow completes successfully:

1. Plan frontmatter `status` field is updated to `complete`
2. `review.md` is finalized with sign-offs
3. `toc.md` is updated with final status

### Manual Transitions

To manually update a feature's status, edit the plan's frontmatter:

```yaml
---
title: Feature Name
date: 2026-01-25
status: 'in-progress' # draft | in-progress | review | complete | on-hold | archived
---
```

And update `toc.md` to match.

## Handling Drift

When work happens outside formal workflows, feature status can drift out of sync. Use the `/sync` workflow to reconcile documentation with actual work done. See `docs/workflow-guide.md` for details.
