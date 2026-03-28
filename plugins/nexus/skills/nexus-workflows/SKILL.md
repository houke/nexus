---
name: nexus-workflows
description: >
  Nexus workflow orchestration system. Provides planning, execution, review, sync,
  summary, hotfix, and init workflows. Invoke via slash commands
  (/nexus-workflows plan, /nexus-workflows execute, /nexus-workflows review,
  /nexus-workflows sync, /nexus-workflows summary, /nexus-workflows hotfix,
  /nexus-workflows init) or natural language triggers.
  Use when users want to plan features, execute plans, review code, sync docs,
  check project status, apply hotfixes, or initialize new repos.
  Keywords: plan, build, implement, review, audit, sync, status, summary, hotfix,
  bug fix, init, initialize, scaffold, execute, code, develop, ship, progress,
  reconcile, checkpoint, workflow, orchestrate, delegate, feature lifecycle.
---

# Nexus Workflows

Unified workflow orchestration for the Nexus multi-agent system.

## Slash Commands

| Command                    | Workflow  | Template Used         | Output Location                                                                   |
| -------------------------- | --------- | --------------------- | --------------------------------------------------------------------------------- |
| `/nexus-workflows plan`    | Planning  | plan.template.md      | .nexus/features/<slug>/plan.md                                                    |
| `/nexus-workflows execute` | Execution | execution.template.md | .nexus/features/<slug>/execution.md                                               |
| `/nexus-workflows review`  | Review    | review.template.md    | .nexus/features/<slug>/review.md                                                  |
| `/nexus-workflows sync`    | Sync      | —                     | Updates existing feature docs                                                     |
| `/nexus-workflows summary` | Summary   | summary.template.md   | .nexus/features/<slug>/summary.md                                                 |
| `/nexus-workflows hotfix`  | Hotfix    | hotfix.template.md    | .nexus/features/\_hotfixes/<date>-<slug>.md                                       |
| `/nexus-workflows init`    | Init      | —                     | .nexus/, AGENTS.md, .gitignore scaffolding, features/.gitkeep, agent memory files |

`/nexus-workflows init` ensures `.nexus/features/.gitkeep`, `.nexus/memory/<agent>.memory.md`, `.nexus/toc.md`, `.nexus/tmp/`, and `AGENTS.md` exist.

## Keyword Routing

When users use natural language, match against these keyword groups to auto-select
the appropriate workflow:

### Planning Workflow

**Triggers**: plan, planning, "plan this", "plan the", design, scope, requirements,
"what should we build", specify, spec, "acceptance criteria", PRD, "user stories"
**Action**: Load `workflows/plan.md` and execute

### Execution Workflow

**Triggers**: execute, build, implement, code, develop, "start building",
"start coding", "implement the plan", ship, create, construct
**Action**: Load `workflows/execution.md` and execute

### Review Workflow

**Triggers**: review, audit, check, inspect, "code review", examine, verify,
"quality check", "look at the code", critique
**Action**: Load `workflows/review.md` and execute

### Sync Workflow

**Triggers**: sync, synchronize, reconcile, "update docs", "catch up",
"out of date", "docs are stale", "update documentation", drift
**Action**: Load `workflows/sync.md` and execute

### Summary Workflow

**Triggers**: summary, status, "where are we", progress, overview,
"what's done", "project status", "how far along", snapshot
**Action**: Load `workflows/summary.md` and execute

### Hotfix Workflow

**Triggers**: hotfix, "quick fix", "bug fix", patch, "small fix",
"fix this bug", "urgent fix", "production bug"
**Action**: Load `workflows/hotfix.md` and execute

### Init Workflow

**Triggers**: init, initialize, setup, "set up nexus", bootstrap,
scaffold, "new project", onboard
**Action**: Load `workflows/init.md` and execute

### Checkpoint Commands

**Triggers**: "/nexus-workflows checkpoint save", "/nexus-workflows checkpoint resume", "/nexus-workflows checkpoint status"
**Action**: Handled within the active execution workflow (see `workflows/execution.md`)

## Workflow Execution Protocol

When a workflow is triggered (by slash command or keyword match):

> **Naming convention**: `<name>` is the sub-command from the slash command.
> For example, `/nexus-workflows plan` → `workflows/plan.md` → `templates/plan.template.md`.
> All workflow and template files use this consistent naming.

> **Mandatory scaffold preflight (except init):** Before loading any workflow other than `/nexus-workflows init`, check for both `.nexus/` and `AGENTS.md`. If either is missing, run `/nexus-workflows init` first, then resume the originally requested workflow.

1. **Load workflow definition** from `workflows/<name>.md`
2. **Load corresponding template** from `templates/<name>.template.md` (if applicable)
3. **Delegate to subagents** per the workflow's orchestration instructions
4. **Write output** to the appropriate `.nexus/features/` location
5. **Update toc.md** after any document creation or modification
6. **Satisfaction check** — invoke `askQuestion` (see below)

## Parallelization Policy

Default to **parallel execution** for independent tasks in both `/nexus-workflows execute` and `/nexus-workflows review`.

Use this scheduling model:

1. Build a dependency graph from work items.
2. Run independent items in parallel waves.
3. Enforce hard dependency gates between waves.
4. Run one consolidated verification gate after each wave (instead of after every tiny task).

Parallelization rules:

- Parallelize tasks only when they do not edit the same files or depend on unfinished outputs.
- Cap active subagent lanes to a practical concurrency limit (`2-4` lanes recommended).
- Reserve sequential execution for dependency-critical paths (schema -> service -> UI integration, etc.).
- If conflicts appear, pause affected lanes, resolve conflicts, and continue from the next valid wave.

For review workflow specifically:

- Run domain reviews in parallel first (security, qa, ux, perf, accessibility, etc.).
- Batch and deduplicate findings.
- Execute fix wave in parallel by ownership area.
- Keep final global test/lint/typecheck gate sequential and mandatory.

## Post-Workflow Satisfaction Check

**REQUIRED** after EVERY workflow completes:

```javascript
ask_questions({
  questions: [
    {
      header: 'Satisfied?',
      question:
        "The [workflow-name] workflow is complete. Are you happy with the result? (Select 'Other' for feedback)",
      allowFreeformInput: true,
      options: [
        { label: 'Yes, looks good!' },
        { label: 'Run another workflow' },
      ],
    },
  ],
});
```

If user selects "Run another workflow", present the workflow menu:

```javascript
ask_questions({
  questions: [
    {
      header: 'Next Workflow',
      question: 'Which workflow would you like to run next?',
      options: [
        { label: '/nexus-workflows plan — Plan a new feature' },
        { label: '/nexus-workflows execute — Execute a plan' },
        { label: '/nexus-workflows review — Review implementation' },
        { label: '/nexus-workflows sync — Sync documentation' },
        { label: '/nexus-workflows summary — Project status' },
        { label: '/nexus-workflows hotfix — Quick bug fix' },
      ],
    },
  ],
});
```

## Feature Lifecycle Reference

```
draft → in-progress → review → complete
```

| Status        | Set By                   | Meaning                     |
| ------------- | ------------------------ | --------------------------- |
| `draft`       | /nexus-workflows plan    | Planned but not started     |
| `in-progress` | /nexus-workflows execute | Currently being implemented |
| `review`      | /nexus-workflows review  | Under code review           |
| `complete`    | /nexus-workflows review  | Reviewed and finished       |
| `on-hold`     | Manual                   | Paused                      |
| `archived`    | Manual                   | No longer relevant          |

### Feature Folder Structure

```
.nexus/features/<feature-slug>/
├── plan.md        # Created by /nexus-workflows plan
├── execution.md   # Created by /nexus-workflows execute
├── review.md      # Created by /nexus-workflows review
├── summary.md     # Created by /nexus-workflows summary (optional)
└── notes/         # Supporting materials
```

## Documentation Authorship Rule

> **The `business-analyst` and `product-manager` agents are the designated writers for all documentation artifacts** — regardless of platform.

This rule applies universally across all workflows:

| Platform / Artifact | Designated Author |
| ------------------- | ----------------- |
| Local markdown files (`.nexus/features/`, `docs/`, `README.md`) | `business-analyst` (primary), `product-manager` (secondary) |
| GitHub issues, PR descriptions, GitHub Wiki | `business-analyst` (primary), `product-manager` (secondary) |
| Confluence pages, Jira tickets, Atlassian docs | `business-analyst` (primary), `product-manager` (secondary) |
| BRD, FRD, PRD, functional specifications | `business-analyst` |
| User stories, acceptance criteria | `product-manager` (primary), `business-analyst` (supporting) |
| ADRs, decision logs | `business-analyst` (co-authored with `architect`) |
| Release notes, change logs, user guides | `business-analyst` |
| Process maps, gap analysis, feasibility reports | `business-analyst` |

**Protocol for other agents**: When an `architect`, `software-developer`, `qa-engineer`, or other technical agent has information that must be documented, they provide **structured notes** to the `business-analyst` or `product-manager`, who write the final artifact. Engineers write code; the BA writes about what it does and why.

The **only** exception is inline code comments and code-level documentation (JSDoc, type annotations) — those remain the responsibility of the implementing agent.

## Safety Rules

These rules apply to ALL workflows:

1. **NEVER** run interactive commands (use `-y` flags)
2. **NEVER** delete `.nexus/`, `.github/`, or `.vscode/`
3. **NEVER** use `git clean -fd` or `git reset --hard`
4. **ALWAYS** use `.nexus/tmp/` for temporary files
5. **ALWAYS** update `toc.md` after document creation
6. **ALWAYS** run verification: `${PM:-npm} run test && ${PM:-npm} run lint`

## Templates Quick Reference

Templates are in `templates/` within this skill directory. When a workflow needs
a template, read it from the co-located `templates/` directory:

Available templates:

- `templates/plan.template.md` — Feature planning document
- `templates/execution.template.md` — Execution log with checkpoints
- `templates/review.template.md` — Code review report
- `templates/summary.template.md` — Status snapshot
- `templates/hotfix.template.md` — Bug fix record

## Documentation

- `REFERENCE.md` — Quick command cheatsheet
- `docs/workflow-guide.md` — Detailed workflow guide
- `docs/feature-lifecycle.md` — Feature status deep dive
- `docs/checkpoint-system.md` — Save/resume for long sessions
