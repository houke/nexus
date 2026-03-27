# AGENTS.md

Instructions for AI coding agents working on this repository.

## Project Overview

Nexus is a template repository that provides a multi-agent orchestration system for VS Code. It includes specialized AI agent personas, workflow prompts, and skills that work together to plan, build, and review software projects.

## Repository Structure

```
.github/
├── plugin/
│   └── marketplace.json             # Plugin marketplace catalog
└── copilot-instructions.md      # Custom instructions for GitHub Copilot

plugins/
└── nexus/                   # Nexus agent plugin
    ├── .github/
    │   └── plugin/
    │       └── plugin.json  # Plugin manifest
    ├── .mcp.json            # MCP server definitions
    ├── agents/              # Agent persona definitions (chatagent format)
    └── skills/              # Specialized skill instructions (SKILL.md files)

.nexus/           # Generated outputs directory
├── toc.md        # Master feature index (START HERE)
├── features/     # Feature folders (one per feature)
│   └── <feature-slug>/
│       ├── plan.md
│       ├── execution.md
│       ├── review.md
│       └── notes/
├── memory/       # Agent preference files
└── tmp/          # Temporary working files

.vscode/
└── mcp.json      # MCP server configuration
```

## Agent System

This repository uses a multi-agent architecture with an **Orchestrator** that coordinates all agents.

### The Orchestrator

As the Orchestrator, **you**:

- **Triage** incoming requests to determine which agent(s) are needed
- **Delegate** work to specialized agents using `@agent-name`
- **Synthesize** multi-agent responses into unified answers
- **Maintain context** across agent interactions

See `.github/copilot-instructions.md` for detailed Orchestrator guidelines.

### Specialized Agents

Key agents are defined in `plugins/nexus/agents/`:

| Agent              | File                                               | Purpose                                                      |
| ------------------ | -------------------------------------------------- | ------------------------------------------------------------ |
| Nexus              | `plugins/nexus/agents/nexus.agent.md`              | **Orchestrator** - Triages and delegates to all other agents |
| Architect          | `plugins/nexus/agents/architect.agent.md`          | System design, schemas, local-first architecture             |
| Software Developer | `plugins/nexus/agents/software-developer.agent.md` | Implementation, TDD, production code                         |
| Tech Lead          | `plugins/nexus/agents/tech-lead.agent.md`          | Code quality, patterns, architectural decisions              |
| QA Engineer        | `plugins/nexus/agents/qa-engineer.agent.md`        | Testing, edge cases, accessibility                           |
| Security Agent     | `plugins/nexus/agents/security.agent.md`           | Security audits, OWASP, vulnerabilities                      |
| Product Manager    | `plugins/nexus/agents/product-manager.agent.md`    | Requirements, priorities, acceptance criteria                |
| UX Designer        | `plugins/nexus/agents/ux-designer.agent.md`        | User flows, wireframes, interactions                         |
| Visual Designer    | `plugins/nexus/agents/visual-designer.agent.md`    | UI polish, animations, styling                               |
| DevOps             | `plugins/nexus/agents/devops.agent.md`             | CI/CD, infrastructure, deployment                            |
| Gamer              | `plugins/nexus/agents/gamer.agent.md`              | Gamification mechanics, engagement                           |
| SEO Specialist     | `plugins/nexus/agents/seo-specialist.agent.md`     | Technical SEO, content optimization, search rankings         |

**Utility files:**
| File | Purpose |
| ---- | ------- |
| `plugins/nexus/agents/_template.agent.md` | Template for creating new agents (if present) |

**Note**: The Nexus orchestrator should be invoked via `@nexus` when you want pure orchestration without direct implementation. It exclusively delegates using `runSubagent` and never writes code itself.

For Nexus behavior, treat delegation as the default for substantive work. Nexus may answer direct user Q&A itself when the interaction is purely conversational, explanatory, or clarifying, but every final Nexus response should still end with a user satisfaction check.

When working on this codebase, respect the separation of concerns defined by each agent's expertise.

### Inter-Agent Communication

Agents collaborate using these patterns (see `.github/copilot-instructions.md` for full details):

| Pattern            | When to Use                    | Example                                              |
| ------------------ | ------------------------------ | ---------------------------------------------------- |
| **Direct Handoff** | Transfer work to another agent | `@architect → @software-developer: "Implement this"` |
| **Consultation**   | Get advice without handing off | `@dev asks @security: "Is this validation safe?"`    |
| **Escalation**     | Decision beyond expertise      | `@dev escalates to @tech-lead: "Which approach?"`    |

## Feature-Based Workflow

All work is organized by **feature**, not by workflow phase. This provides:

- **Everything in one place** - No hunting across phase directories
- **Natural mental model** - Think "auth feature" not "execution phase"
- **Parallel work** - Multiple features at different stages simultaneously
- **Better traceability** - Clear lineage from plan to completion

### Feature Folder Structure

```
.nexus/features/<feature-slug>/
├── plan.md        # What we're building (from nexus-planning)
├── execution.md   # How we built it (from nexus-execution)
├── review.md      # Review findings (from nexus-review)
├── summary.md     # Status snapshot (from nexus-summary)
└── notes/         # Supporting materials
```

### Master TOC

The file `.nexus/toc.md` is the **single source of truth** for all features:

| Feature   | Status   | Files                   | Agents           | Last Edited |
| --------- | -------- | ----------------------- | ---------------- | ----------- |
| user-auth | complete | plan, execution, review | @architect, @dev | 2026-01-26  |

**Always update toc.md** when creating or modifying feature documents.

### Feature Status Lifecycle

```
draft → in-progress → review → complete
```

| Status        | Meaning                        | Set By            |
| ------------- | ------------------------------ | ----------------- |
| `draft`       | Planned but not started        | `nexus-planning`  |
| `in-progress` | Currently being implemented    | `nexus-execution` |
| `review`      | Implementation done, reviewing | `nexus-review`    |
| `complete`    | Reviewed and finished          | `nexus-review`    |

Additional: `on-hold`, `archived`

## Core Workflows

> 💡 **Orchestration Requirement**: All core workflows below are **restricted to the @Nexus agent**. These prompts are designed for orchestration and delegation, ensuring consistent quality and cross-agent coordination.
>
> **Canonical location**: `plugins/nexus/skills/nexus-workflows/` (the `nexus-workflows` skill).

### Slash Commands

| Command    | Workflow                 | Purpose                                 |
| ---------- | ------------------------ | --------------------------------------- |
| `/plan`    | `workflows/planning.md`  | Orchestrate comprehensive feature plans |
| `/execute` | `workflows/execution.md` | Coordinate implementation from plans    |
| `/review`  | `workflows/review.md`    | Code review with automatic fixes        |
| `/sync`    | `workflows/sync.md`      | Reconcile docs with actual work         |
| `/summary` | `workflows/summary.md`   | Project status snapshot (have vs need)  |
| `/hotfix`  | `workflows/hotfix.md`    | Expedited bug fixes with traceability   |
| `/init`    | `workflows/init.md`      | Initialize Nexus in a new repository    |

### Planning (`/plan`)

- Orchestrates all agents to create comprehensive plans
- Creates `.nexus/features/<slug>/plan.md`
- Updates toc.md with new feature (status: `draft`)
- Plans should NOT execute code, only document decisions

### Execution (`/execute`)

- Takes plans and coordinates implementation
- Creates `.nexus/features/<slug>/execution.md`
- Updates plan status to `in-progress`
- Updates toc.md

### Review (`/review`)

- Comprehensive code review and **automatic fix** phase
- Creates `.nexus/features/<slug>/review.md`
- Updates plan status to `complete`
- Updates toc.md

### Sync (`/sync`)

- Reconciles documentation with actual work done
- Use when work happens outside formal workflows
- Updates all out-of-sync feature documents
- Updates toc.md

### Summary (`/summary`)

- Project status snapshot comparing "have" vs "need"
- Creates/updates `.nexus/features/<slug>/summary.md`
- Updates toc.md

### Hotfix (`/hotfix`)

- Expedited workflow for small, well-understood bugs
- Creates `.nexus/features/_hotfixes/<date>-<slug>.md`
- Minimal ceremony, full traceability
- Use instead of full workflow for quick fixes
- Updates plan status to `complete`
- Updates toc.md

## Checkpoint System

Long execution sessions can save and resume progress using checkpoints.

### Checkpoint Commands

| Command              | Action                        | When to Use                  |
| -------------------- | ----------------------------- | ---------------------------- |
| `/checkpoint save`   | Save progress to execution.md | Before ending a long session |
| `/checkpoint resume` | Continue from saved state     | Starting a new session       |
| `/checkpoint status` | Show completed vs pending     | Checking progress            |

### Automatic Triggers

The orchestrator automatically triggers checkpoints:

- After 30+ minutes of continuous work
- After completing major action items
- Before delegating to different agents
- When hitting blockers

## Workflow Best Practices

### Ideal Flow (Fully Tracked)

```
1. Planning → creates features/<slug>/plan.md (status: draft)
2. Execution → creates features/<slug>/execution.md (status: in-progress)
3. Review → creates features/<slug>/review.md (status: complete)
```

### When Bypassing Workflows

When you talk directly to agents (e.g., "@software-developer fix this bug"):

1. ⚠️ **Problem**: Feature status doesn't update, execution not logged
2. ✅ **Solution**: Run sync workflow periodically
3. 🔄 **Sync detects**: Changes in git history, updates documentation

### When to Run Sync

- ✅ You've done work by chatting directly with agents
- ✅ Feature status seems out of date
- ✅ Execution log is missing or stale
- ✅ Before starting a formal review (to catch up)

## Agent Memory System

Each agent has a persistent memory file in `.nexus/memory/` that stores user preferences.

### Memory Files

```
.nexus/memory/
├── architect.memory.md
├── software-developer.memory.md
├── qa-engineer.memory.md
└── ...
```

### How Memory Works

**Reading**: Agents check their memory file before starting work.

**Writing**: When users say "please remember...", "always...", or "never...", the agent updates their memory file.

## Skills System

Skills in `plugins/nexus/skills/` provide domain-specific instructions:

- `accessibility-audit` - WCAG compliance auditing
- `frontend-ui-polish` - UI/UX excellence and animations
- `gamification-patterns` - Achievements, XP, rewards
- `google-official-seo-guide` - Official Google SEO documentation and best practices
- `implementation-patterns` - TDD, coding standards
- `local-first-patterns` - OPFS, SQLite, sync strategies
- `security-audit` - Security vulnerability assessment
- `seo-aeo-best-practices` - SEO and AEO optimization strategies
- `test-generation` - Vitest, RTL, Playwright tests
- `user-flow-design` - Journey mapping, wireframes
- `verify-code` - Code quality verification

## File Naming Conventions

### Feature Folders

Use kebab-case for feature slugs:

- `user-authentication`
- `snake-game`
- `data-sync-engine`

### Agent Files

Agent definitions use kebab-case: `software-developer.md`, `qa-engineer.md`

### Skill Files

Each skill has a `SKILL.md` file in its directory.

## Code Style Preferences

When adding or modifying code:

1. **Use TypeScript** with strict mode enabled
2. **Prefer functional patterns** where appropriate
3. **Document "why", not "what"** - code is self-documenting
4. **Handle errors explicitly** - never swallow exceptions
5. **Write tests first** when implementing features (TDD)

## Testing Instructions

```bash
# Detect package manager: check for pnpm-lock.yaml, yarn.lock, or package-lock.json
# Use ${PM:-npm} throughout - this uses $PM if set, otherwise defaults to npm

# Run all tests
${PM:-npm} run test

# Run with coverage
${PM:-npm} run test:coverage

# Type checking
${PM:-npm} run typecheck

# Linting
${PM:-npm} run lint
```

## Verification Checklist

Before completing any task:

- [ ] Code follows established patterns
- [ ] Tests pass (if applicable)
- [ ] TypeScript types are correct
- [ ] No linting errors
- [ ] Security considerations addressed
- [ ] Accessibility requirements met (for UI)
- [ ] toc.md updated (if feature documents changed)

## Important Notes

1. **Model Preference**: Claude Opus 4.5 is recommended for complex orchestration tasks
2. **MCP Servers**: Check `.vscode/mcp.json` for available MCP integrations
3. **Generated Files**: Content in `.nexus/` is generated - respect the structure
4. **Template Repository**: This is a GitHub template - users create new repos from it

## ⛔ Critical Safety Rules

These rules are **ABSOLUTE** and must **NEVER** be violated by any agent:

### 1. NEVER Run Interactive Commands

Commands that require user input will hang:

```bash
# ❌ FORBIDDEN
npm init                     # Asks questions
git clean -i                 # Interactive mode

# ✅ REQUIRED
npm init -y                  # Auto-accept defaults
```

### 2. NEVER Delete the `.nexus/` Directory

The `.github`, `.nexus/` and `.vscode` directories contain irreplaceable project artifacts:

```bash
# ❌ ABSOLUTELY FORBIDDEN
rm -rf .nexus
git clean -fd                # Deletes untracked files including .nexus!
git reset --hard             # Can lose .nexus changes
```

### 3. Handle "Dirty" Directories Safely

If the working directory has uncommitted changes:

- **DO NOT** auto-clean, reset, or remove files
- **DO** use `git stash` to safely preserve changes
- **WHEN IN DOUBT**: Stop and ask

### 4. Project Scaffolding in Template Directories

Scaffold commands that require empty directories will FAIL. Work around template files:

```bash
# ✅ CORRECT - Scaffold to temp dir, then merge
mkdir _temp_scaffold && cd _temp_scaffold
npm create vite@latest . -- --template vanilla-ts
cd .. && cp -rn _temp_scaffold/* . && rm -rf _temp_scaffold

# ✅ PREFERRED - Manual setup
npm init -y && npm install -D vite typescript
```

**Template files are SACRED. Work around them, never remove them.**

### 5. Use `.nexus/tmp/` Instead of System `/tmp`

All temporary files MUST be written to `.nexus/tmp/` instead of system `/tmp`:

```bash
# ❌ FORBIDDEN - System temp directory
/tmp/my-temp-file.txt
/tmp/test-output/

# ✅ REQUIRED - Project temp directory
.nexus/tmp/my-temp-file.txt
.nexus/tmp/test-output/
```

**Why**: System `/tmp` is shared, may have permission issues, and doesn't keep artifacts with the project for debugging.

### 6. Clean Up After Yourself

Agents MUST clean up any temporary files they create in `.nexus/tmp/`:

```bash
# Create temp files for your work
mkdir -p .nexus/tmp/my-agent-work
# ... do work ...

# REQUIRED: Clean up when done
rm -rf .nexus/tmp/my-agent-work
```

**Exception**: If debugging requires preserving temp files, document what was left and why in the execution log.

## Context for New Features

When adding new features:

1. Check if a relevant agent exists in `plugins/nexus/agents/`
2. Check if a relevant skill exists in `plugins/nexus/skills/`
3. Follow the patterns established in similar existing files
4. Update this AGENTS.md if adding new agents or significant capabilities
