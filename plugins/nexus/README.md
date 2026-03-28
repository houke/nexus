# Nexus Plugin

Multi-agent orchestration system for GitHub Copilot. Provides a team of specialized AI personas that collaborate to plan, build, and review software — each with a distinct role, memory, and handoff protocol.

## Installation

```
# Using VS Code Agent Plugins
# Add houke/nexus to chat.plugins.marketplaces, then install (CMD/CTRL + SHIFT + X) from @agentPlugins
```

## What's Included

### Agents

| Agent                | Description                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `nexus`              | **Orchestrator** — triages requests and delegates to all other agents using `runSubagent`. Never writes code itself. |
| `architect`          | Senior System Architect — database schemas, state machines, local-first design, cloud infrastructure.                |
| `software-developer` | Implementation specialist — TDD, production-quality code, debugging.                                                 |
| `tech-lead`          | Tech Lead — code quality, SOLID principles, refactoring, modern React patterns.                                      |
| `qa-engineer`        | QA Engineer — testing, edge cases, accessibility, Playwright E2E.                                                    |
| `security-agent`     | Security Agent — OWASP Top 10, dependency auditing, secure storage.                                                  |
| `product-manager`    | Product Manager — user stories, acceptance criteria, feature priorities.                                             |
| `ux-designer`        | UX Designer — user flows, information architecture, wireframes.                                                      |
| `visual-designer`    | Visual Designer — UI polish, animations, typography, "the juice".                                                    |
| `devops`             | DevOps Engineer — CI/CD, GitHub Actions, release automation, security hardening.                                     |
| `gamer`              | Game Designer — gamification mechanics, engagement loops, retention.                                                 |
| `seo-specialist`     | SEO Specialist — technical SEO, structured data, content optimization.                                               |

### Skills

| Skill                       | Description                                                     |
| --------------------------- | --------------------------------------------------------------- |
| `accessibility-audit`       | WCAG 2.2 compliance auditing with axe-core.                     |
| `frontend-ui-polish`        | Animations, micro-interactions, design tokens, and "the juice". |
| `gamification-patterns`     | XP systems, achievements, streaks, and behavioral psychology.   |
| `google-official-seo-guide` | Official Google SEO documentation and best practices.           |
| `implementation-patterns`   | TDD workflow, clean architecture, Result types.                 |
| `local-first-patterns`      | OPFS, SQLite, sync strategies, offline-first design.            |
| `requirements-engineering`  | User story templates, acceptance criteria, PRD structure.       |
| `security-audit`            | OWASP Top 10, threat modeling, vulnerability assessment.        |
| `seo-aeo-best-practices`    | SEO and AEO (Answer Engine Optimization) strategies.            |
| `test-generation`           | Vitest, React Testing Library, and Playwright test patterns.    |
| `user-flow-design`          | Journey mapping, wireframe conventions, interaction patterns.   |
| `verify-code`               | Comprehensive code quality and type safety verification.        |
| `webgpu-threejs-tsl`        | WebGPU renderer, TSL shaders, node materials, GPU compute.      |

### MCP Servers

| Server                | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| `filesystem`          | Enhanced filesystem operations via `@modelcontextprotocol/server-filesystem`.      |
| `playwright`          | Browser automation for E2E testing via `@executeautomation/playwright-mcp-server`. |
| `sequential-thinking` | Stepwise reasoning for complex multi-step orchestration.                           |

## Workflows

The plugin ships with orchestration workflows in `skills/nexus-workflows/workflows/`:

| Workflow       | Slash Command | Description                                                     |
| -------------- | ------------- | --------------------------------------------------------------- |
| `plan.md`      | `/nexus-workflows plan`      | Orchestrate a comprehensive planning session across all agents. |
| `execution.md` | `/nexus-workflows execute`   | Coordinate feature implementation from a plan.                  |
| `review.md`    | `/nexus-workflows review`    | Comprehensive code review with automatic fixes.                 |
| `hotfix.md`    | `/nexus-workflows hotfix`    | Expedited workflow for small, well-understood bugs.             |
| `sync.md`      | `/nexus-workflows sync`      | Reconcile documentation with actual work done.                  |
| `summary.md`   | `/nexus-workflows summary`   | Project status snapshot — "have" vs "need".                     |
| `init.md`      | `/nexus-workflows init`      | Ensure a downstream repository has `.nexus/`, `AGENTS.md`, `features/.gitkeep`, agent memory files, `toc.md`, and `tmp/`. |

`/nexus-workflows init` ensures `.nexus/features/.gitkeep`, `.nexus/memory/<agent>.memory.md`, `.nexus/toc.md`, `.nexus/tmp/`, and `AGENTS.md` exist before Nexus starts substantive orchestration work.

For safety, Nexus workflows run a scaffold preflight: if `.nexus/` or `AGENTS.md` is missing, Nexus runs `/nexus-workflows init` automatically, then resumes the originally requested workflow.

## How It Works

The **Nexus Orchestrator** (`@nexus`) acts as a team lead. When you invoke a workflow, it:

1. Analyzes your request and determines which specialists are needed
2. Delegates to each agent via `runSubagent` with tailored instructions
3. Synthesizes all responses into a unified output
4. Always closes with a QA + Tech Lead review cycle

### Nexus Response Policy

The `@nexus` orchestrator defaults to assessment and delegation for substantive work. If your request involves planning, implementation, review, research, design, or other action-oriented work, Nexus should route that work to specialist agents instead of doing it directly.

The only normal exception is direct conversational Q&A. If you are asking for explanation, clarification, lightweight brainstorming, or general guidance, Nexus may answer directly without delegation.

In all cases, including direct Q&A, every final Nexus response should end with a user satisfaction check using the question flow.

Agents can also hand off to each other directly — for example, `@architect` hands implementation details to `@software-developer`, which then hands testing to `@qa-engineer`.

## Source

This plugin is part of the [Nexus](https://github.com/houkebv/nexus) multi-agent orchestration template for VS Code Copilot.

## License

MIT
