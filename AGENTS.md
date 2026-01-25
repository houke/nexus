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
├── docs/         # TOC files tracking all documents per feature
├── memory/       # Agent memory files for persistent preferences
├── plan/         # Action plans from planning sessions
├── execution/    # Execution tracking
├── review/       # Code review reports
└── summary/      # Project status summaries

.vscode/
└── mcp.json      # MCP server configuration
```

## Agent System

This repository uses a multi-agent architecture with a **Coordinator** that orchestrates all agents.

### The Coordinator

As the Coordinator, **you**:

- **Triage** incoming requests to determine which agent(s) are needed
- **Delegate** work to specialized agents using `@agent-name`
- **Synthesize** multi-agent responses into unified answers
- **Maintain context** across agent interactions

See `.github/copilot-instructions.md` for detailed Coordinator guidelines.

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

## Core Workflows

### Planning (`project-planning.prompt.md`)

- Orchestrates all agents to create comprehensive action plans
- Plans are saved to `.nexus/plan/NNNN-<slug>.md`
- Plans should NOT execute code, only document decisions
- **Status**: `draft` (created during planning)

### Execution (`project-execution.prompt.md`)

- Takes plans and coordinates implementation
- Delegates to appropriate agents based on task type
- Runs verification after changes
- Creates execution logs in `.nexus/execution/NNNN-<slug>.md`
- **Creates TOC file** in `.nexus/docs/<feature>.toc.md` to track all related documents
- **Status transition**: `draft` → `in-progress`

### Review (`project-review.prompt.md`)

- Comprehensive code review and **automatic fix** phase using all agent perspectives
- Agents are instructed to fix issues they find within their expertise
- Reviews and fix reports saved to `.nexus/review/NNNN-<slug>.md`
- **Updates TOC file** with review document link
- **Status transition**: `in-progress` → `complete`

### Sync (`project-sync.prompt.md`)

- **Purpose**: Reconcile documentation with actual work done
- **Use when**: Work happens outside formal workflows (direct agent chats)
- Updates plan status, execution logs, and generates missing reviews
- **Creates/updates TOC files** for any features with missing document tracking
- Detects drift between plans and reality
- **Critical for**: Keeping `.nexus/` documentation in sync

### Summary (`project-summary.prompt.md`)

- Project status snapshot comparing "have" vs "need"
- Summaries saved to `.nexus/summary/NNNN-<slug>.md`
- **Updates TOC files** with summary document links

## Document Tracking (TOC System)

All documents related to a feature are tracked in a master TOC (Table of Contents) file.

### When TOC Files Are Created

- Created automatically when execution begins on a plan
- Can be created retroactively by the sync workflow

### TOC File Naming

Files are named descriptively based on the feature:

```
.nexus/docs/snake-game.toc.md       # Building a snake game
.nexus/docs/user-auth.toc.md        # Authentication feature
.nexus/docs/pinterest-clone.toc.md  # Pinterest clone app
```

### TOC Update Triggers

| Workflow  | Action                                   |
| --------- | ---------------------------------------- |
| Execution | Creates TOC, adds plan + execution links |
| Review    | Adds review document link                |
| Summary   | Adds summary document link               |
| Sync      | Creates missing TOC, updates all links   |

## Workflow Best Practices

### Ideal Flow (Fully Tracked)

```
1. Planning → creates plan (status: draft)
2. Execution → implements plan (status: in-progress)
3. Review → audits & fixes (status: complete)
```

### Reality (When Bypassing Workflows)

When you talk directly to agents (e.g., "@software-developer fix this bug"):

1. ⚠️ **Problem**: Plan status doesn't update, execution not logged
2. ✅ **Solution**: Run sync workflow periodically
3. 🔄 **Sync detects**: Changes in git history, updates documentation

### Preventing Drift

To keep plans synchronized with reality:

- **Preferred**: Always use execution workflow for implementation
- **Acceptable**: Direct agent work + manual sync afterward
- **Avoid**: Long periods of untracked work without syncing

### When to Run Sync

Run `project-sync` prompt when:

- ✅ You've done work by chatting directly with agents
- ✅ Plan status seems out of date
- ✅ Execution log is missing or stale
- ✅ Review report doesn't exist but work is done
- ✅ Before starting a formal review (to catch up)

## Agent Memory System

Each agent has a persistent memory file in `.nexus/memory/` that stores user preferences and learned patterns.

### Memory Files

```
.nexus/memory/
├── architect.memory.md
├── devops.memory.md
├── gamer.memory.md
├── product-manager.memory.md
├── qa-engineer.memory.md
├── security.memory.md
├── software-developer.memory.md
├── tech-lead.memory.md
├── ux-designer.memory.md
└── visual-designer.memory.md
```

### How Memory Works

**Reading**: Agents should check their memory file before starting work to apply stored preferences.

**Writing**: When users say things like "please remember...", "always...", or "never...", the addressed agent updates their memory file.

Example: `@software-developer please remember to work mobile-first` adds an entry to `software-developer.memory.md`.

### Memory Entry Format

```markdown
### [Descriptive Title]

- **Preference**: [What to remember]
- **Reason**: [Why, if provided]
- **Added**: [YYYY-MM-DD]
```

See `.github/copilot-instructions.md` for full memory system documentation.

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
# Detect package manager: check for pnpm-lock.yaml, yarn.lock, or package-lock.json
# Use the appropriate command: pnpm, yarn, npm, or bun

# Run all tests
npm run test          # or: pnpm test, yarn test, bun test

# Run with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
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
npm init                     # Asks questions
pnpm init                    # Asks questions
yarn init                    # Asks questions
bun init                     # May ask questions
git clean -i                 # Interactive mode
rm -i                        # Interactive mode

# ✅ REQUIRED - Non-interactive alternatives
npm init -y                  # Auto-accept defaults
pnpm init -y                 # Auto-accept defaults
yarn init -y                 # Auto-accept defaults
bun init -y                  # Auto-accept defaults
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

### 4. Project Scaffolding in Template Directories

This is a **template repository**. The directory will ALWAYS have template files (`.github/`, `.nexus/`, `AGENTS.md`, etc.). Scaffold commands that require empty directories will FAIL - this is EXPECTED.

```bash
# ❌ WILL FAIL - Require empty directories
npm create vite@latest .              # Fails: directory not empty
pnpm create vite .                    # Fails: directory not empty
npx create-react-app .                # Fails: directory not empty
npx create-next-app .                 # Fails: directory not empty

# ❌ DO NOT "fix" by cleaning the directory
rm -rf *                              # FORBIDDEN
git clean -fd                         # FORBIDDEN

# ✅ CORRECT - Scaffold to temp dir, then merge carefully
mkdir _temp_scaffold && cd _temp_scaffold
npm create vite@latest . -- --template vanilla-ts  # or use pnpm/yarn/bun
cd .. && cp -rn _temp_scaffold/* . && rm -rf _temp_scaffold

# ✅ PREFERRED - Manual setup (use your package manager)
npm init -y && npm install -D vite typescript
# pnpm init -y && pnpm add -D vite typescript
# yarn init -y && yarn add -D vite typescript
# Then create files manually
```

**Template files are SACRED. Work around them, never remove them.**

## Context for New Features

When adding new features:

1. Check if a relevant agent exists in `.github/agents/`
2. Check if a relevant skill exists in `.github/skills/`
3. Follow the patterns established in similar existing files
4. Update this AGENTS.md if adding new agents or significant capabilities
