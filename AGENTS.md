# AGENTS.md

Instructions for AI coding agents working on this repository.

## Project Overview

Nexus is a template repository that provides a multi-agent orchestration system for VS Code. It includes specialized AI agent personas, workflow prompts, and skills that work together to plan, build, and review software projects.

## Repository Structure

```
.github/
├── agents/       # Agent persona definitions (chatagent format)
├── copilot-instructions.md  # Custom instructions for GitHub Copilot
├── prompts/      # Workflow prompts for planning, execution, review, summary
└── skills/       # Specialized skill instructions (SKILL.md files)

.nexus/           # Generated outputs directory
├── toc.md        # Master feature index (START HERE)
├── features/     # Feature folders (one per feature)
│   └── <feature-slug>/
│       ├── plan.md
│       ├── execution.md
│       ├── review.md
│       └── notes/
├── templates/    # Document templates
├── memory/       # Agent preference files
└── docs/         # Guides and reference

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

Key agents are defined in `.github/agents/`:

| Agent              | File                    | Purpose                                          |
| ------------------ | ----------------------- | ------------------------------------------------ |
| Architect          | `architect.md`          | System design, schemas, local-first architecture |
| Software Developer | `software-developer.md` | Implementation, TDD, production code             |
| Tech Lead          | `tech-lead.md`          | Code quality, patterns, architectural decisions  |
| QA Engineer        | `qa-engineer.md`        | Testing, edge cases, accessibility               |
| Security Agent     | `security.md`           | Security audits, OWASP, vulnerabilities          |
| Product Manager    | `product-manager.md`    | Requirements, priorities, acceptance criteria    |
| UX Designer        | `ux-designer.md`        | User flows, wireframes, interactions             |
| Visual Designer    | `visual-designer.md`    | UI polish, animations, styling                   |
| DevOps             | `devops.md`             | CI/CD, infrastructure, deployment                |
| Gamer              | `gamer.md`              | Gamification mechanics, engagement               |

When working on this codebase, respect the separation of concerns defined by each agent's expertise.

## Feature-Based Workflow

All work is organized by **feature**, not by workflow phase. This provides:

- **Everything in one place** - No hunting across phase directories
- **Natural mental model** - Think "auth feature" not "execution phase"
- **Parallel work** - Multiple features at different stages simultaneously
- **Better traceability** - Clear lineage from plan to completion

### Feature Folder Structure

```
.nexus/features/<feature-slug>/
├── plan.md        # What we're building (from project-planning)
├── execution.md   # How we built it (from project-execution)
├── review.md      # Review findings (from project-review)
├── summary.md     # Status snapshot (from project-summary)
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

| Status        | Meaning                        | Set By              |
| ------------- | ------------------------------ | ------------------- |
| `draft`       | Planned but not started        | `project-planning`  |
| `in-progress` | Currently being implemented    | `project-execution` |
| `review`      | Implementation done, reviewing | `project-review`    |
| `complete`    | Reviewed and finished          | `project-review`    |

Additional: `on-hold`, `archived`

## Core Workflows

### Planning (`project-planning.prompt.md`)

- Orchestrates all agents to create comprehensive plans
- Creates `.nexus/features/<slug>/plan.md`
- Updates toc.md with new feature (status: `draft`)
- Plans should NOT execute code, only document decisions

### Execution (`project-execution.prompt.md`)

- Takes plans and coordinates implementation
- Creates `.nexus/features/<slug>/execution.md`
- Updates plan status to `in-progress`
- Updates toc.md

### Review (`project-review.prompt.md`)

- Comprehensive code review and **automatic fix** phase
- Creates `.nexus/features/<slug>/review.md`
- Updates plan status to `complete`
- Updates toc.md

### Sync (`project-sync.prompt.md`)

- Reconciles documentation with actual work done
- Use when work happens outside formal workflows
- Updates all out-of-sync feature documents
- Updates toc.md

### Summary (`project-summary.prompt.md`)

- Project status snapshot comparing "have" vs "need"
- Creates/updates `.nexus/features/<slug>/summary.md`
- Updates toc.md

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

Skills in `.github/skills/` provide domain-specific instructions:

- `accessibility-audit` - WCAG compliance auditing
- `frontend-ui-polish` - UI/UX excellence and animations
- `gamification-patterns` - Achievements, XP, rewards
- `implementation-patterns` - TDD, coding standards
- `local-first-patterns` - OPFS, SQLite, sync strategies
- `security-audit` - Security vulnerability assessment
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

## Context for New Features

When adding new features:

1. Check if a relevant agent exists in `.github/agents/`
2. Check if a relevant skill exists in `.github/skills/`
3. Follow the patterns established in similar existing files
4. Update this AGENTS.md if adding new agents or significant capabilities
