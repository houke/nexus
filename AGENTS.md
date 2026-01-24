# AGENTS.md

Instructions for AI coding agents working on this repository.

## Project Overview

Nexus is a template repository that provides a multi-agent orchestration system for VS Code. It includes specialized AI agent personas, workflow prompts, and skills that work together to plan, build, and review software projects.

## Repository Structure

```
.github/
├── agents/       # Agent persona definitions (chatagent format)
├── prompts/      # Workflow prompts for planning, execution, review, summary
└── skills/       # Specialized skill instructions (SKILL.md files)

.nexus/           # Generated outputs directory
├── plan/         # Action plans from planning sessions
├── execution/    # Execution tracking
├── review/       # Code review reports
└── summary/      # Project status summaries

.vscode/
└── mcp.json      # MCP server configuration
```

## Agent System

This repository uses a multi-agent architecture. Key agents are defined in `.github/agents/`:

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

## Core Workflows

### Planning (`project-planning.prompt.md`)

- Orchestrates all agents to create comprehensive action plans
- Plans are saved to `.nexus/plan/NNNN-<slug>.md`
- Plans should NOT execute code, only document decisions

### Execution (`project-execution.prompt.md`)

- Takes plans and coordinates implementation
- Delegates to appropriate agents based on task type
- Runs verification after changes

### Review (`project-review.prompt.md`)

- Comprehensive code review and **automatic fix** phase using all agent perspectives
- Agents are instructed to fix issues they find within their expertise
- Reviews and fix reports saved to `.nexus/review/NNNN-<slug>.md`

### Summary (`project-summary.prompt.md`)

- Project status snapshot comparing "have" vs "need"
- Summaries saved to `.nexus/summary/NNNN-<slug>.md`

## Skills System

Skills in `.github/skills/` provide domain-specific instructions. Available skills:

- `accessibility-audit` - WCAG compliance auditing
- `frontend-ui-polish` - UI/UX excellence and animations
- `gamification-patterns` - Achievements, XP, rewards
- `implementation-patterns` - TDD, coding standards
- `local-first-patterns` - OPFS, SQLite, sync strategies
- `requirements-engineering` - User stories, PRDs
- `security-audit` - Security vulnerability assessment
- `test-generation` - Vitest, RTL, Playwright tests
- `user-flow-design` - Journey mapping, wireframes
- `verify-code` - Code quality verification

To use a skill, read the SKILL.md file from the skill directory.

## File Naming Conventions

### Output Documents

All generated documents use zero-padded sequential numbering:

```
.nexus/plan/0001-feature-name.md
.nexus/review/0001-review-scope.md
.nexus/summary/0001-status-date.md
```

### Agent Files

Agent definitions use kebab-case: `software-developer.md`, `qa-engineer.md`

### Skill Files

Each skill has a `SKILL.md` file in its directory.

## Code Style Preferences

When adding or modifying code in this repository:

1. **Use TypeScript** with strict mode enabled
2. **Prefer functional patterns** where appropriate
3. **Document "why", not "what"** - code is self-documenting
4. **Handle errors explicitly** - never swallow exceptions
5. **Write tests first** when implementing features (TDD)

## Testing Instructions

If tests are added to this repository:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Verification Checklist

Before completing any task:

- [ ] Code follows established patterns
- [ ] Tests pass (if applicable)
- [ ] TypeScript types are correct
- [ ] No linting errors
- [ ] Security considerations addressed
- [ ] Accessibility requirements met (for UI)

## Important Notes

1. **Model Preference**: Claude Opus 4.5 is recommended for complex orchestration tasks
2. **MCP Servers**: Check `.vscode/mcp.json` for available MCP integrations
3. **Generated Files**: Content in `.nexus/` is generated - respect existing numbering
4. **Template Repository**: This is a GitHub template - users create new repos from it

## ⛔ Critical Safety Rules

These rules are **ABSOLUTE** and must **NEVER** be violated by any agent:

### 1. NEVER Run Interactive Commands

Commands that require user input will hang or cause unexpected behavior:

```bash
# ❌ FORBIDDEN - Interactive commands
pnpm init                    # Asks questions
npm init                     # Asks questions
yarn init                    # Asks questions
git clean -i                 # Interactive mode
rm -i                        # Interactive mode

# ✅ REQUIRED - Non-interactive alternatives
pnpm init -y                 # Auto-accept defaults
npm init -y                  # Auto-accept defaults
```

### 2. NEVER Delete the `.nexus/` Directory

The `.github`, `.nexus/` and `.vscode` directories contains irreplaceable project artifacts:

```bash
# ❌ ABSOLUTELY FORBIDDEN
rm -rf .nexus
git clean -fd                # Deletes untracked files including .nexus!
git clean -fdx               # Even more dangerous
git reset --hard             # Can lose .nexus changes
git checkout -- .            # Can overwrite .nexus contents
```

### 3. Handle "Dirty" Directories Safely

If the working directory has uncommitted changes or warnings about cleanliness:

- **DO NOT** auto-clean, reset, or remove files
- **DO** use `git stash` to safely preserve changes
- **DO** document the state and ask for user guidance
- **WHEN IN DOUBT**: Stop and ask rather than risk data loss

## Context for New Features

When adding new features:

1. Check if a relevant agent exists in `.github/agents/`
2. Check if a relevant skill exists in `.github/skills/`
3. Follow the patterns established in similar existing files
4. Update this AGENTS.md if adding new agents or significant capabilities
