# Nexus

Multi-agent orchestration plugin for GitHub Copilot.

Nexus provides a team of specialized AI personas that collaborate to plan, build, and review software through a consistent workflow system.

## Installation

### VS Code Agent Plugins

1. Open this URL in your browser: `vscode://chat-plugin/add-marketplace?ref=houke/nexus`
2. In VS Code, open Extensions (`Cmd/Ctrl+Shift+X`)
3. Search for `@agentPlugins houke` and install **Nexus**
4. Open Copilot Chat and choose the **Nexus** agent

### Copilot CLI

```bash
copilot plugin marketplace add houke/nexus
copilot plugin install nexus@houke-nexus
copilot plugin list
```

## What You Get

### Agents

| Agent                | Description |
| -------------------- | ----------- |
| `nexus`              | Orchestrator: triages requests and delegates to specialized agents via `runSubagent`. |
| `architect`          | System architecture, schemas, local-first and infra design. |
| `software-developer` | Production implementation, TDD, debugging. |
| `tech-lead`          | Code quality, architecture integrity, refactoring. |
| `qa-engineer`        | Testing strategy, edge cases, accessibility checks. |
| `security-agent`     | OWASP security review, dependency and threat checks. |
| `product-manager`    | User stories, acceptance criteria, prioritization. |
| `business-analyst`   | Requirements, process mapping, cross-platform documentation ownership. |
| `ux-designer`        | User flows, IA, interaction design. |
| `visual-designer`    | UI polish, visual hierarchy, motion and layout refinement. |
| `devops`             | CI/CD, release automation, operational hardening. |
| `gamer`              | Gamification loops, progression, retention mechanics. |
| `seo-specialist`     | Technical SEO, structured data, search optimization. |

### Skills

| Skill | Description |
| ----- | ----------- |
| `accessibility-audit` | WCAG 2.2 accessibility auditing. |
| `frontend-ui-polish` | Visual polish, animation, design token usage. |
| `gamification-patterns` | XP, achievements, streak and reward systems. |
| `google-official-seo-guide` | Official Google SEO guidance. |
| `implementation-patterns` | TDD and production implementation conventions. |
| `local-first-patterns` | Offline-first storage and sync patterns. |
| `nexus-workflows` | Planning, execution, review, sync, summary, hotfix, init orchestration. |
| `requirements-engineering` | User stories, acceptance criteria, PRD structure. |
| `security-audit` | OWASP security audit checklists and patterns. |
| `seo-aeo-best-practices` | SEO + AEO implementation guidance. |
| `test-generation` | Vitest, RTL, Playwright test generation. |
| `user-flow-design` | Journey mapping and interaction workflows. |
| `verify-code` | Code quality and type safety validation. |
| `webgpu-threejs-tsl` | WebGPU + Three.js TSL guidance. |

### MCP Servers

| Server | Description |
| ------ | ----------- |
| `filesystem` | Filesystem operations via MCP. |
| `playwright` | Browser automation for E2E and UI validation. |
| `sequential-thinking` | Structured multi-step reasoning support. |

## Workflows

Nexus ships with workflow prompts in `plugins/nexus/skills/nexus-workflows/workflows/`.

| Workflow | Slash Command | Purpose |
| -------- | ------------- | ------- |
| `plan.md` | `/nexus-workflows plan` | Multi-agent planning session with requirements and architecture alignment. |
| `execution.md` | `/nexus-workflows execute` | Coordinate implementation from an approved plan. |
| `review.md` | `/nexus-workflows review` | Multi-agent review and fix pass with documented findings. |
| `hotfix.md` | `/nexus-workflows hotfix` | Fast path for small, well-understood bug fixes. |
| `sync.md` | `/nexus-workflows sync` | Reconcile documentation with actual repository changes. |
| `summary.md` | `/nexus-workflows summary` | Snapshot of progress and gaps. |
| `init.md` | `/nexus-workflows init` | Scaffold `.nexus/`, feature index, memory files, and required baseline docs. |

## Orchestration Rules

- Nexus defaults to delegation for substantive work.
- Direct Q&A is allowed for lightweight explanation or clarification.
- If workflow keywords are detected, workflow routing takes priority over Q&A mode.
- If a workflow expects output files, those files must be persisted before user satisfaction prompts.

## Output Structure

Nexus organizes work under `.nexus/` using feature folders:

```text
.nexus/
  toc.md
  features/
    <feature-slug>/
      plan.md
      execution.md
      review.md
      summary.md
      notes/
    _hotfixes/
  memory/
  tmp/
```

## Repository Layout (Flat Plugin Documentation)

```text
.
├── README.md
├── AGENTS.md
├── plugins/
│   └── nexus/
│       ├── agents/
│       ├── skills/
│       └── .mcp.json
└── control-center/
```

## Source

Nexus repository: <https://github.com/houkebv/nexus>

## License

MIT
