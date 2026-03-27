---
title: 'nexus-workflows Skill — Consolidated Workflow System'
feature: 'nexus-workflows-skill'
date: '2026-03-26'
type: 'refactor'
agents:
  - '@architect'
status: 'draft'
---

# nexus-workflows Skill — Architectural Design

> **Purpose**: Consolidate all Nexus workflow content (7 prompt files, 3 docs, 6 templates) into a single `nexus-workflows` skill at `plugins/nexus/skills/nexus-workflows/`.

---

## 1. Problem Statement

Workflow-related content is spread across three locations:

| Location | Files | Purpose |
|----------|-------|---------|
| `.github/prompts/` | 7 `.prompt.md` files | Workflow orchestration logic |
| `.nexus/docs/` | 3 `.md` files | User guides and cheatsheets |
| `.nexus/templates/` | 6 `.md` files | Document scaffolds for features |

This creates discoverability problems, update fragmentation, and makes the skill system underutilized. A single skill provides one canonical location for all workflow knowledge.

---

## 2. Directory Structure

```
plugins/nexus/skills/nexus-workflows/
├── SKILL.md                        # Primary entry — keyword triggers, workflow definitions, slash commands
├── REFERENCE.md                    # Quick-reference cheatsheet (migrated from CHEATSHEET.md)
│
├── docs/
│   ├── workflow-guide.md           # Detailed workflow guide (migrated from .nexus/docs/workflow-guide.md)
│   ├── feature-lifecycle.md        # Feature status lifecycle deep dive
│   └── checkpoint-system.md        # Checkpoint save/resume documentation
│
├── templates/
│   ├── plan.template.md            # Plan template (migrated from .nexus/templates/)
│   ├── execution.template.md       # Execution log template
│   ├── review.template.md          # Review report template
│   ├── summary.template.md         # Summary template
│   └── hotfix.template.md          # Hotfix record template
│
└── workflows/
    ├── planning.md                 # Planning workflow definition (from nexus-planning.prompt.md)
    ├── execution.md                # Execution workflow definition (from nexus-execution.prompt.md)
    ├── review.md                   # Review workflow definition (from nexus-review.prompt.md)
    ├── sync.md                     # Sync workflow definition (from nexus-sync.prompt.md)
    ├── summary.md                  # Summary workflow definition (from nexus-summary.prompt.md)
    ├── hotfix.md                   # Hotfix workflow definition (from nexus-hotfix.prompt.md)
    └── init.md                     # Init workflow definition (from nexus-init.prompt.md)
```

### Rationale

- **SKILL.md** is the router — keyword matching, slash command dispatch, and high-level workflow descriptions live here. It does NOT contain the full workflow text (that would make it 2000+ lines).
- **workflows/** contains one file per workflow, migrated 1:1 from the prompt files but stripped of YAML frontmatter (since they are no longer standalone prompts).
- **templates/** contains the same templates that were in `.nexus/templates/`, unchanged in format.
- **docs/** contains the detailed guides, migrated from `.nexus/docs/`.
- **REFERENCE.md** is the quick cheatsheet (migrated from CHEATSHEET.md).

---

## 3. SKILL.md Structure

```markdown
---
name: nexus-workflows
description: >
  Nexus workflow orchestration system. Provides planning, execution, review, sync,
  summary, hotfix, and init workflows. Invoke via slash commands (/plan, /execute,
  /review, /sync, /summary, /hotfix, /init) or natural language triggers.
  Use when users want to plan features, execute plans, review code, sync docs,
  check project status, apply hotfixes, or initialize new repos.
---

# Nexus Workflows

Unified workflow orchestration for the Nexus multi-agent system.

## Slash Commands

| Command            | Workflow  | Template Used           | Output Location                           |
|--------------------|-----------|-------------------------|-------------------------------------------|
| `/plan`            | Planning  | plan.template.md        | .nexus/features/<slug>/plan.md            |
| `/execute`         | Execution | execution.template.md   | .nexus/features/<slug>/execution.md       |
| `/review`          | Review    | review.template.md      | .nexus/features/<slug>/review.md          |
| `/sync`            | Sync      | —                       | Updates existing feature docs             |
| `/summary`         | Summary   | summary.template.md     | .nexus/features/<slug>/summary.md         |
| `/hotfix`          | Hotfix    | hotfix.template.md      | .nexus/features/_hotfixes/<date>-<slug>.md|
| `/init`            | Init      | —                       | .nexusrc, .nexus/, .github/ scaffolding   |

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
3. **Read .nexusrc** for Nexus repository path (if applicable)
4. **Delegate to subagents** per the workflow's orchestration instructions
5. **Write output** to the appropriate `.nexus/features/` location
6. **Update toc.md** after any document creation or modification
7. **Satisfaction check** — invoke `askQuestion` (see below)

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

## Feature Folder Structure

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
a template, read it from:

```
<skill-dir>/templates/<name>.template.md
```

Available templates:
- `plan.template.md` — Feature planning document
- `execution.template.md` — Execution log with checkpoints
- `review.template.md` — Code review report
- `summary.template.md` — Status snapshot
- `hotfix.template.md` — Bug fix record

## Documentation

- `REFERENCE.md` — Quick command cheatsheet
- `docs/workflow-guide.md` — Detailed workflow guide
- `docs/feature-lifecycle.md` — Feature status deep dive
- `docs/checkpoint-system.md` — Save/resume for long sessions
```

---

## 4. Keyword Routing Table (Complete)

The SKILL.md `description` field and keyword sections enable VS Code's skill matching. The routing table below is the authoritative mapping:

| Keyword / Phrase | Workflow | Confidence |
|-----------------|----------|------------|
| `plan` | Planning | High |
| `planning` | Planning | High |
| `plan this feature` | Planning | High |
| `design the feature` | Planning | Medium |
| `scope` | Planning | Medium |
| `requirements` | Planning | Medium |
| `what should we build` | Planning | High |
| `PRD` | Planning | High |
| `user stories` | Planning | Medium |
| `acceptance criteria` | Planning | Medium |
| `execute` | Execution | High |
| `build` | Execution | High |
| `implement` | Execution | High |
| `code this` | Execution | High |
| `develop` | Execution | Medium |
| `start building` | Execution | High |
| `implement the plan` | Execution | High |
| `ship` | Execution | Medium |
| `review` | Review | High |
| `code review` | Review | High |
| `audit` | Review | Medium |
| `check the code` | Review | High |
| `inspect` | Review | Medium |
| `quality check` | Review | High |
| `sync` | Sync | High |
| `synchronize` | Sync | High |
| `reconcile` | Sync | High |
| `update docs` | Sync | High |
| `docs are stale` | Sync | High |
| `drift` | Sync | Medium |
| `summary` | Summary | High |
| `status` | Summary | High |
| `where are we` | Summary | High |
| `project status` | Summary | High |
| `progress` | Summary | Medium |
| `what's done` | Summary | High |
| `hotfix` | Hotfix | High |
| `quick fix` | Hotfix | High |
| `bug fix` | Hotfix | High |
| `patch` | Hotfix | Medium |
| `urgent fix` | Hotfix | High |
| `fix this bug` | Hotfix | High |
| `init` | Init | High |
| `initialize` | Init | High |
| `setup nexus` | Init | High |
| `bootstrap` | Init | High |
| `scaffold` | Init | Medium |
| `/checkpoint save` | Execution (checkpoint) | High |
| `/checkpoint resume` | Execution (checkpoint) | High |
| `/checkpoint status` | Execution (checkpoint) | High |

---

## 5. Integration Points

### 5.1 Plugin Manifest (`plugin.json`)

Add the new skill to [plugins/nexus/.github/plugin/plugin.json](../../plugins/nexus/.github/plugin/plugin.json):

```json
{
  "skills": [
    "../../skills/accessibility-audit",
    "../../skills/frontend-ui-polish",
    "../../skills/gamification-patterns",
    "../../skills/google-official-seo-guide",
    "../../skills/implementation-patterns",
    "../../skills/local-first-patterns",
    "../../skills/nexus-workflows",          // ← NEW
    "../../skills/requirements-engineering",
    "../../skills/security-audit",
    "../../skills/seo-aeo-best-practices",
    "../../skills/test-generation",
    "../../skills/user-flow-design",
    "../../skills/verify-code",
    "../../skills/webgpu-threejs-tsl"
  ]
}
```

### 5.2 Nexus Agent Update (`nexus.agent.md`)

Update the Nexus orchestrator agent to reference the skill. Add this section after the existing "Agent Memory System" section:

```markdown
## Workflow Skill

The `nexus-workflows` skill contains all workflow definitions, templates, and documentation.

**Before executing any workflow**, load the skill:
1. Read `nexus-workflows/SKILL.md` for routing and protocol
2. Read the specific `nexus-workflows/workflows/<name>.md` for full instructions
3. Read the template from `nexus-workflows/templates/<name>.template.md`

### Slash Command Handling

When the user types a slash command (`/plan`, `/execute`, `/review`, etc.), the
Nexus agent should:
1. Match the command against the SKILL.md routing table
2. Load the corresponding workflow definition
3. Execute the workflow's orchestration protocol
4. Run the post-workflow satisfaction check

### Natural Language Handling

When the user says something like "plan this feature" or "review the code":
1. Match keywords against the SKILL.md keyword routing table
2. If confidence is HIGH, proceed directly with the matched workflow
3. If confidence is MEDIUM, confirm with the user via `ask_questions`:
   ```javascript
   ask_questions({
     questions: [{
       header: "Confirm Workflow",
       question: "It sounds like you want to run the [workflow] workflow. Is that right?",
       options: [
         { label: "Yes, run [workflow]" },
         { label: "No, I meant something else" }
       ]
     }]
   })
   ```
```

### 5.3 AGENTS.md Update

Update the "Core Workflows" section in AGENTS.md to reference the new skill location instead of `.github/prompts/`:

```markdown
## Core Workflows

All workflows are defined in the `nexus-workflows` skill:
`plugins/nexus/skills/nexus-workflows/`

Invoke via slash commands: `/plan`, `/execute`, `/review`, `/sync`, `/summary`, `/hotfix`, `/init`
Or via natural language — the skill auto-matches keywords to workflows.
```

---

## 6. Workflow File Format (workflows/*.md)

Each workflow file in `workflows/` is a pure markdown document (no YAML frontmatter needed — the SKILL.md handles routing). The content is migrated 1:1 from the corresponding `.prompt.md` file with these changes:

| Change | Reason |
|--------|--------|
| Remove YAML frontmatter (`name`, `description`, `agent`, `model`, `tools`) | Routing is handled by SKILL.md; tool configuration is at the agent level |
| Remove `.nexusrc` reading boilerplate | Templates are now co-located in the skill at `templates/` |
| Update template paths from `$NEXUS_REPO_PATH/.nexus/templates/` to relative `templates/` | Co-location eliminates the need for external path resolution |
| Keep all orchestration logic, safety rules, and delegation patterns | These are the core value of the workflow |

### Example: `workflows/planning.md` header

```markdown
# Comprehensive Planning Session

> **ORCHESTRATOR ONLY**: This workflow is executed by the **@Nexus** agent.
> It delegates to specialized subagents and never writes code itself.

## Process

1. **Agent Discovery**: Scan available agents...
[... rest of planning workflow logic unchanged ...]
```

---

## 7. askQuestion Integration

The satisfaction check is integrated at two levels:

### 7.1 Global (in SKILL.md)

The "Post-Workflow Satisfaction Check" section in SKILL.md defines the standard pattern. Every workflow MUST invoke this after completion. The pattern:

```
Workflow completes → Write output → Update toc.md → askQuestion satisfaction check
```

The satisfaction check offers:
- **"Yes, looks good!"** — Workflow ends
- **"Run another workflow"** — Shows workflow menu for chaining
- **Freeform text** — User provides feedback, workflow iterates

### 7.2 Per-Workflow (in workflows/*.md)

Each workflow already contains its own satisfaction check (inherited from the prompt files). These are **retained** because they have workflow-specific context in the question text (e.g., "I have written the plan to .nexus/features/X/plan.md").

The per-workflow check fires first (with specific file paths), then the global SKILL.md pattern handles the "run another workflow" chaining if requested.

### Flow Diagram

```
User triggers workflow
        │
        ▼
  Load workflow definition
        │
        ▼
  Execute workflow (delegate to agents)
        │
        ▼
  Write output files
        │
        ▼
  Update toc.md
        │
        ▼
  Per-workflow askQuestion
  "Are you happy with .nexus/features/X/plan.md?"
        │
        ├── Yes → Global satisfaction check
        │         "Run another workflow?"
        │              ├── Yes → Show menu → Trigger next workflow
        │              └── No → Done
        └── Feedback → Iterate on current workflow
```

---

## 8. Migration Plan

### Phase 1: Create the Skill (Non-Breaking)

1. Create `plugins/nexus/skills/nexus-workflows/` directory structure
2. Create `SKILL.md` with routing table and protocol
3. Create `REFERENCE.md` from `.nexus/docs/CHEATSHEET.md`
4. Copy `docs/workflow-guide.md` from `.nexus/docs/workflow-guide.md`
5. Create `docs/feature-lifecycle.md` and `docs/checkpoint-system.md` (extracted content)
6. Copy all templates from `.nexus/templates/` to `templates/`
7. Migrate all 7 prompts to `workflows/` (with frontmatter removal + path updates)
8. Add to `plugin.json` skills array

### Phase 2: Update References (Non-Breaking)

9. Update `nexus.agent.md` to reference the workflow skill
10. Update `AGENTS.md` to point to new skill location
11. Update `.nexus/docs/README.md` to reference the skill as the canonical source

### Phase 3: Deprecate Originals (Breaking)

12. Add deprecation notices to each `.github/prompts/nexus-*.prompt.md`:
    ```markdown
    > ⚠️ DEPRECATED: This prompt has moved to the `nexus-workflows` skill.
    > Location: `plugins/nexus/skills/nexus-workflows/workflows/<name>.md`
    > This file is kept for backward compatibility and will be removed in v2.0.
    ```
13. Add deprecation notice to `.nexus/docs/` files pointing to skill
14. Add deprecation notice to `.nexus/templates/README.md` pointing to skill

### Phase 4: Cleanup (Major Version)

15. Remove deprecated `.github/prompts/nexus-*.prompt.md` files
16. Remove `.nexus/docs/` (except README.md which becomes a pointer)
17. Remove `.nexus/templates/` (except README.md which becomes a pointer)

### Migration Safety

- **Phases 1-2** are fully backward compatible — old prompts still work
- **Phase 3** adds deprecation warnings — nothing breaks
- **Phase 4** is the only breaking change — saved for a major version bump
- The `.nexus/features/`, `.nexus/memory/`, `.nexus/tmp/`, and `.nexus/toc.md` are **NEVER touched**

---

## 9. Architecture Decisions

### ADR-1: Workflow Files Separate from SKILL.md

**Decision**: Keep workflow definitions in `workflows/*.md` rather than inline in SKILL.md.

**Rationale**: The 7 workflows total ~2000 lines. Inlining them would make SKILL.md unreadable and exceed context windows. Separate files allow targeted loading — the agent only reads the workflow it needs.

**Trade-off**: Extra file reads per invocation (SKILL.md for routing + workflow file for execution). Acceptable given the clarity benefit.

### ADR-2: Templates Co-Located in Skill

**Decision**: Move templates into the skill at `templates/`.

**Rationale**: Eliminates the `.nexusrc` / `$NEXUS_REPO_PATH` indirection. Templates are read by the workflow definitions, so co-location reduces coupling to an external path.

**Trade-off**: Templates are no longer at the "project level" (`.nexus/templates/`). This is acceptable because templates are consumed by the skill's workflows, not by users directly.

### ADR-3: Phased Migration with Deprecation

**Decision**: Four-phase migration with deprecation notices before removal.

**Rationale**: Users may have workflows, scripts, or muscle memory pointing to `.github/prompts/`. A hard cutover would break existing habits. Deprecation gives time to adapt.

### ADR-4: Keyword Confidence Levels

**Decision**: HIGH confidence keywords proceed without confirmation; MEDIUM keywords prompt for confirmation.

**Rationale**: "plan" is unambiguous. "scope" could mean planning or something else. The confirmation step prevents misrouted workflows without adding friction for obvious commands.

### ADR-5: Slash Commands as Short Aliases

**Decision**: Support both `/plan` and `/nexus-workflows plan`.

**Rationale**: `/plan` is fast for experienced users. `/nexus-workflows plan` is discoverable for new users who see it in skill documentation. The SKILL.md maps both forms.

---

## 10. File Mapping (Source → Destination)

| Source | Destination | Action |
|--------|------------|--------|
| `.github/prompts/nexus-planning.prompt.md` | `skills/nexus-workflows/workflows/planning.md` | Migrate (strip frontmatter, update paths) |
| `.github/prompts/nexus-execution.prompt.md` | `skills/nexus-workflows/workflows/execution.md` | Migrate (strip frontmatter, update paths) |
| `.github/prompts/nexus-review.prompt.md` | `skills/nexus-workflows/workflows/review.md` | Migrate (strip frontmatter, update paths) |
| `.github/prompts/nexus-sync.prompt.md` | `skills/nexus-workflows/workflows/sync.md` | Migrate (strip frontmatter, update paths) |
| `.github/prompts/nexus-summary.prompt.md` | `skills/nexus-workflows/workflows/summary.md` | Migrate (strip frontmatter, update paths) |
| `.github/prompts/nexus-hotfix.prompt.md` | `skills/nexus-workflows/workflows/hotfix.md` | Migrate (strip frontmatter, update paths) |
| `.github/prompts/nexus-init.prompt.md` | `skills/nexus-workflows/workflows/init.md` | Migrate (strip frontmatter, update paths) |
| `.nexus/docs/CHEATSHEET.md` | `skills/nexus-workflows/REFERENCE.md` | Rename + migrate |
| `.nexus/docs/workflow-guide.md` | `skills/nexus-workflows/docs/workflow-guide.md` | Move |
| `.nexus/docs/README.md` | `skills/nexus-workflows/docs/` (inform) | Update to point to skill |
| `.nexus/templates/plan.template.md` | `skills/nexus-workflows/templates/plan.template.md` | Copy |
| `.nexus/templates/execution.template.md` | `skills/nexus-workflows/templates/execution.template.md` | Copy |
| `.nexus/templates/review.template.md` | `skills/nexus-workflows/templates/review.template.md` | Copy |
| `.nexus/templates/summary.template.md` | `skills/nexus-workflows/templates/summary.template.md` | Copy |
| `.nexus/templates/hotfix.template.md` | `skills/nexus-workflows/templates/hotfix.template.md` | Copy |
| `.nexus/templates/README.md` | Not migrated (update with pointer) | Deprecation notice |

---

## 11. Verification Checklist

- [ ] `SKILL.md` has valid YAML frontmatter with `name` and `description`
- [ ] All 7 workflow files exist in `workflows/`
- [ ] All 5 templates exist in `templates/`
- [ ] `REFERENCE.md` exists with cheatsheet content
- [ ] `docs/workflow-guide.md` exists
- [ ] `plugin.json` includes `../../skills/nexus-workflows` in skills array
- [ ] `nexus.agent.md` references the workflow skill
- [ ] `AGENTS.md` updated to reference new skill location
- [ ] Satisfaction check (`askQuestion`) is documented in SKILL.md and each workflow
- [ ] Keyword routing table covers all 7 workflows
- [ ] Slash commands documented for all 7 workflows
- [ ] Safety rules inherited from original prompts
- [ ] `.nexus/features/`, `.nexus/memory/`, `.nexus/tmp/`, `.nexus/toc.md` are untouched

---

## Revision History

| Date & Time | Agent | Changes |
|-------------|-------|---------|
| 2026-03-26 12:00:00 | @architect | Initial design document |
