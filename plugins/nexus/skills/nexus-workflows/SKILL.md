---
name: nexus-workflows
description: >
  Nexus workflow orchestration system. Provides planning, execution, review, sync,
  summary, hotfix, and init workflows. Invoke via slash commands (/plan, /execute,
  /review, /sync, /summary, /hotfix, /init) or natural language triggers.
  Use when users want to plan features, execute plans, review code, sync docs,
  check project status, apply hotfixes, or initialize new repos.
  Keywords: plan, build, implement, review, audit, sync, status, summary, hotfix,
  bug fix, init, initialize, scaffold, execute, code, develop, ship, progress,
  reconcile, checkpoint, workflow, orchestrate, delegate, feature lifecycle.
---

# Nexus Workflows

Unified workflow orchestration for the Nexus multi-agent system.

## Slash Commands

| Command    | Workflow  | Template Used          | Output Location                            |
|------------|-----------|------------------------|--------------------------------------------|
| `/plan`    | Planning  | plan.template.md       | .nexus/features/<slug>/plan.md             |
| `/execute` | Execution | execution.template.md  | .nexus/features/<slug>/execution.md        |
| `/review`  | Review    | review.template.md     | .nexus/features/<slug>/review.md           |
| `/sync`    | Sync      | —                      | Updates existing feature docs              |
| `/summary` | Summary   | summary.template.md    | .nexus/features/<slug>/summary.md          |
| `/hotfix`  | Hotfix    | hotfix.template.md     | .nexus/features/_hotfixes/<date>-<slug>.md |
| `/init`    | Init      | —                      | .nexus/, AGENTS.md, .gitignore scaffolding |

Also accepts long-form: `/nexus-workflows plan`, `/nexus-workflows execute`, etc.

## Keyword Routing

When users use natural language, match against these keyword groups to auto-select
the appropriate workflow:

### Planning Workflow
**Triggers**: plan, planning, "plan this", "plan the", design, scope, requirements,
"what should we build", specify, spec, "acceptance criteria", PRD, "user stories"
**Action**: Load `workflows/planning.md` and execute

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
**Triggers**: "/checkpoint save", "/checkpoint resume", "/checkpoint status"
**Action**: Handled within the active execution workflow (see `workflows/execution.md`)

## Workflow Execution Protocol

When a workflow is triggered (by slash command or keyword match):

1. **Load workflow definition** from `workflows/<name>.md`
2. **Load corresponding template** from `templates/<name>.template.md` (if applicable)
3. **Delegate to subagents** per the workflow's orchestration instructions
4. **Write output** to the appropriate `.nexus/features/` location
5. **Update toc.md** after any document creation or modification
6. **Satisfaction check** — invoke `askQuestion` (see below)

## Post-Workflow Satisfaction Check

**REQUIRED** after EVERY workflow completes:

```javascript
ask_questions({
  questions: [{
    header: "Satisfied?",
    question: "The [workflow-name] workflow is complete. Are you happy with the result? (Select 'Other' for feedback)",
    allowFreeformInput: true,
    options: [
      { label: "Yes, looks good!" },
      { label: "Run another workflow" }
    ]
  }]
})
```

If user selects "Run another workflow", present the workflow menu:

```javascript
ask_questions({
  questions: [{
    header: "Next Workflow",
    question: "Which workflow would you like to run next?",
    options: [
      { label: "/plan — Plan a new feature" },
      { label: "/execute — Execute a plan" },
      { label: "/review — Review implementation" },
      { label: "/sync — Sync documentation" },
      { label: "/summary — Project status" },
      { label: "/hotfix — Quick bug fix" }
    ]
  }]
})
```

## Feature Lifecycle Reference

```
draft → in-progress → review → complete
```

| Status        | Set By     | Meaning                     |
|---------------|------------|-----------------------------|
| `draft`       | /plan      | Planned but not started     |
| `in-progress` | /execute   | Currently being implemented |
| `review`      | /review    | Under code review           |
| `complete`    | /review    | Reviewed and finished       |
| `on-hold`     | Manual     | Paused                      |
| `archived`    | Manual     | No longer relevant          |

### Feature Folder Structure

```
.nexus/features/<feature-slug>/
├── plan.md        # Created by /plan
├── execution.md   # Created by /execute
├── review.md      # Created by /review
├── summary.md     # Created by /summary (optional)
└── notes/         # Supporting materials
```

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
