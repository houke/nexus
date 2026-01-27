# 🚀 Nexus

**Transform VS Code into an Autonomous Command Center**

Nexus unites specialized AI agents, from strategic Architects to rigorous Security Agents, to orchestrate your entire software lifecycle. Transform your IDE into a collaborative ecosystem where your digital squad plans, builds, and secures code in real-time.

---

## ✨ What is Nexus?

Nexus is a **template repository** designed to supercharge any new project with a team of specialized AI agents. Instead of working with a single AI assistant, Nexus gives you access to an entire digital team:

| Agent                     | Expertise                                                 |
| ------------------------- | --------------------------------------------------------- |
| 🏛️ **Architect**          | System design, database schemas, local-first architecture |
| 👔 **Product Manager**    | Requirements, priorities, acceptance criteria             |
| 🎨 **UX Designer**        | User flows, wireframes, interaction patterns              |
| 💻 **Software Developer** | Implementation, TDD, production-ready code                |
| 🎯 **Tech Lead**          | Code quality, architectural decisions, patterns           |
| 🖌️ **Visual Designer**    | UI polish, animations, "the juice"                        |
| 🎮 **Gamer**              | Gamification mechanics, engagement, rewards               |
| 🧪 **QA Engineer**        | Testing, edge cases, accessibility audits                 |
| ⚙️ **DevOps**             | CI/CD, infrastructure, deployment                         |
| 🔐 **Security Agent**     | Security audits, OWASP, vulnerability assessment          |

---

## 🛠️ Getting Started

### Prerequisites

- **VS Code** with GitHub Copilot extension
- **Claude Opus 4.5** (recommended model for best results)
- MCP servers configured (see `.vscode/mcp.json`)

### Using This Template

1. Click **"Use this template"** on GitHub to create a new repository
2. Clone your new repository
3. Open in VS Code
4. Start with the **Planning Prompt** to begin your project

---

## 🔄 The Nexus Workflow

Nexus provides five core prompts that guide you through the entire software development lifecycle:

### 1️⃣ Planning Phase → `nexus-planning.prompt.md`

**When to use:** At the start of a new feature or project

The Planning prompt orchestrates a comprehensive planning session by invoking ALL specialized agents. Each agent contributes their expertise to create a complete action plan.

**How to use:**

1. Open the Command Palette (`Cmd/Ctrl + Shift + P`)
2. Select "Chat: Run Prompt..."
3. Choose `nexus-planning`
4. Describe what you want to build

**What happens:**

- The Architect defines system design
- The Product Manager clarifies requirements
- The Security Agent identifies risks
- The QA Engineer plans test strategies
- ...and more

**Output:** A comprehensive plan saved to `.nexus/features/<feature-slug>/plan.md` and tracked in `.nexus/toc.md`

---

### 2️⃣ Execution Phase → `nexus-execution.prompt.md`

**When to use:** After planning is complete and you're ready to build

The Execution prompt takes your action plans and coordinates implementation by delegating to the right agents at the right time.

**How to use:**

1. Open the Command Palette
2. Select "Chat: Run Prompt..."
3. Choose `nexus-execution`
4. Reference the feature to execute (or let it detect from `.nexus/toc.md`)

**What happens:**

- Reads the plan from `.nexus/features/<slug>/plan.md`
- Creates execution log at `.nexus/features/<slug>/execution.md`
- Updates toc.md (status: draft → in-progress)
- Analyzes the plan and identifies work items
- Validates requirements with Product Manager
- Delegates implementation to Software Developer
- Coordinates QA Engineer for test coverage
- Runs verification: `npm run test && npm run lint && npm run typecheck`

**Output:** Implemented features with tests, following the plan, logged in `.nexus/features/<slug>/execution.md`

---

### 3️⃣ Review & Fix Phase → `nexus-review.prompt.md`

**When to use:** After implementation, before merging

The Review prompt runs a comprehensive code review using ALL agent personas. This is an **active review**: each agent not only identifies issues but also **immediately implements fixes** for anything within their area of expertise.

**How to use:**

1. Open the Command Palette
2. Select "Chat: Run Prompt..."
3. Choose `nexus-review`
4. Optionally specify files or features to review

**What happens:**

- Security Agent audits and **fixes** vulnerabilities
- QA Engineer checks test coverage and **adds** missing edge cases
- Architect validates design and **refactors** patterns
- Tech Lead reviews code quality and **resolves** lint/style issues
- ...every agent contributes AND executes fixes

**Output:** A detailed review and fix report saved to `.nexus/features/<feature-slug>/review.md`

---

### 4️⃣ Sync Phase → `nexus-sync.prompt.md`

**When to use:** When work happens outside formal workflows

The Sync prompt reconciles documentation with reality when you've been chatting directly with agents (e.g., "@software-developer fix this bug") instead of using the execution workflow.

**How to use:**

1. Open the Command Palette
2. Select "Chat: Run Prompt..."
3. Choose `nexus-sync`

**What happens:**

- Analyzes git history to detect actual changes
- Compares changes against plan action items
- Updates feature status (draft → in-progress → complete)
- Creates or updates execution logs retroactively
- Updates `.nexus/toc.md` with current reality
- Provides status summary and next steps

**Output:** Updated feature documents and toc.md in `.nexus/`

> ⚠️ **Important:** Sync is your safety net when you bypass the formal workflow. It prevents documentation drift by keeping plans synchronized with what you've actually built.

**When to run sync:**

- ✅ After chatting directly with agents
- ✅ When plan status seems out of date
- ✅ Before running a formal review
- ✅ When execution logs are missing or stale

---

### 5️⃣ Summary Phase → `nexus-summary.prompt.md`

**When to use:** Periodically, to assess project status

The Summary prompt provides a snapshot of your project's current state by comparing "what we have" vs "what we need."

**How to use:**

1. Open the Command Palette
2. Select "Chat: Run Prompt..."
3. Choose `nexus-summary`

**What happens:**

- Analyzes all features in `.nexus/features/` and `.nexus/toc.md`
- Reviews implemented features and their status
- Identifies gaps and missing items
- Provides actionable next steps

**Output:** A status report saved to `.nexus/features/<feature-slug>/summary.md`

> 💡 **Pro tip:** Run the summary prompt every few days or at the start of each work session to stay aligned with project goals.

---

### \* Hotfix Workflow → `nexus-hotfix.prompt.md`

**When to use:** For small, well-understood bug fixes

The Hotfix prompt provides an expedited path for quick fixes that still maintains traceability.

**What happens:**

- @software-developer diagnoses and fixes the bug
- @qa-engineer validates the fix
- Minimal documentation auto-generated
- Logged to `.nexus/features/_hotfixes/`

**Use hotfix when:** Clear bug, isolated fix, <5 files affected  
**Don't use when:** Unclear cause, requires refactoring, feature request

---

## ⏱️ Time Tracking

Nexus automatically tracks time spent by each agent during planning, execution, and review phases. The orchestrator records start/end times when invoking subagents and maintains a `## Time Tracking` table in each feature document.

| Agent               | Task           | Start               | End                 | Duration (s) |
| ------------------- | -------------- | ------------------- | ------------------- | -----------: |
| @architect          | System design  | 2026-01-26T09:00:00 | 2026-01-26T09:08:00 |          480 |
| @software-developer | Implementation | 2026-01-26T09:10:00 | 2026-01-26T09:40:00 |         1800 |

The **Summary prompt** aggregates all time tracking data across phases, showing:

- Total time per agent
- Total time per phase (plan, execution, review)
- Which agents contributed to each feature

This helps identify bottlenecks and understand where development effort is spent.

---

## 💾 Checkpoint System

Long execution sessions can save and resume progress using checkpoints.

### Commands

| Command              | Action                                |
| -------------------- | ------------------------------------- |
| `/checkpoint save`   | Save current progress to execution.md |
| `/checkpoint resume` | Continue from last checkpoint         |
| `/checkpoint status` | Show completed vs pending items       |

### Automatic Triggers

The orchestrator automatically triggers checkpoints:

- After 30+ minutes of continuous work
- After completing major action items
- Before delegating to different agents
- When hitting blockers

---

## 📁 Project Structure

```
.
├── .github/
│   ├── agents/           # Agent persona definitions
│   │   ├── architect.md
│   │   ├── software-developer.md
│   │   ├── security.md
│   │   ├── _template.md      # Template for new agents
│   │   └── ...
│   ├── commit-convention.md # Commit instructions
│   ├── copilot-instructions.md  # Custom instructions for Copilot
│   ├── prompts/          # Core workflow prompts
│   │   ├── nexus-planning.prompt.md
│   │   ├── nexus-execution.prompt.md
│   │   ├── nexus-review.prompt.md
│   │   ├── nexus-sync.prompt.md
│   │   ├── nexus-summary.prompt.md
│   │   ├── nexus-hotfix.prompt.md   # Quick bug fixes
│   └── skills/           # Specialized skill instructions
├── .nexus/               # Generated outputs
│   ├── toc.md            # Master feature index (START HERE)
│   ├── features/         # Feature folders (one per feature)
│   │   ├── <feature-slug>/
│   │   │   ├── plan.md
│   │   │   ├── execution.md
│   │   │   ├── review.md
│   │   │   └── notes/
│   │   ├── _hotfixes/    # Quick fix documentation
│   ├── templates/        # Document templates
│   ├── memory/           # Agent memory files (persistent preferences)
│   └── docs/             # Guides and reference (incl. CHEATSHEET.md)
├── .vscode/
│   └── mcp.json          # MCP server configuration
├── AGENTS.md             # Agent instructions for AI coding tools
└── README.md
```

---

## ⚙️ Recommended Configuration

### Model Selection

**Claude Opus 4.5** is the recommended model for Nexus. It provides:

- Superior reasoning for multi-agent orchestration
- Better context retention across long planning sessions
- More nuanced understanding of architectural decisions

To set Claude Opus 4.5 as your default:

1. Open VS Code Settings
2. Search for "GitHub Copilot: Default Model"
3. Select "Claude Opus 4.5"

### MCP Servers

Nexus works best with these MCP servers enabled (configured in `.vscode/mcp.json`):

- `memory` - Knowledge graph for persistent context
- `filesystem` - File operations
- `sequential-thinking` - Complex problem decomposition
- `playwright` - Browser automation for testing

---

## 🚀 Quick Start Example

```
1. Create a new repo from this template
2. Open in VS Code
3. Run "nexus-planning" prompt:
   "I want to build a task management app with offline support"
4. Review the generated plan in .nexus/features/<feature>/plan.md
5. Check .nexus/toc.md to see your feature tracked
6. Run "nexus-execution" prompt to start building
7. Run "nexus-review" prompt before committing
8. Run "nexus-summary" to track progress

# Alternative: Quick iteration workflow
1. Run "nexus-planning" for initial plan
2. Chat directly with agents: "@software-developer implement auth"
3. Run "nexus-sync" to update documentation
4. Run "nexus-review" for final audit
```

---

## 🗂️ Feature-Based Organization

Nexus organizes all work by **feature**, not by workflow phase. Each feature gets its own folder containing all related documents.

### Feature Structure

```
.nexus/features/<feature-slug>/
├── plan.md        # What we're building and why
├── execution.md   # Implementation tracking
├── review.md      # Code review findings (updated per iteration)
├── summary.md     # Status snapshots (optional)
└── notes/         # Supporting materials
```

### Master TOC

The file `.nexus/toc.md` is the **single source of truth** for all features:

| Feature    | Status      | Files                   | Agents           | Last Edited |
| ---------- | ----------- | ----------------------- | ---------------- | ----------- |
| user-auth  | complete    | plan, execution, review | @architect, @dev | 2026-01-26  |
| snake-game | in-progress | plan, execution         | @dev, @qa        | 2026-01-25  |

### Feature Status Values

- `draft` - Plan created, work not started
- `in-progress` - Currently being implemented
- `review` - Under code review
- `complete` - Reviewed and finished
- `on-hold` / `archived` - Paused or no longer relevant

### Benefits

- **Everything in one place** - No hunting across phase directories
- **Natural mental model** - Think "auth feature" not "execution phase"
- **Parallel work** - Multiple features at different stages simultaneously
- **Better traceability** - Clear lineage from plan to completion

---

## 🧠 Agent Memory System

Each agent has a persistent memory file that stores user preferences and learned patterns.

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

### Teaching Agents

Tell any agent to remember your preferences:

```
@software-developer please remember to work mobile-first
@visual-designer please remember to use #4F46E5 as the brand color
@architect please remember we're targeting SQLite for local storage
```

### Trigger Phrases

Agents will update their memory when you say:

- "remember to..."
- "always..."
- "never..."
- "from now on..."
- "going forward..."

### Memory Entry Format

Preferences are stored with context:

```markdown
### Mobile-First Development

- **Preference**: Always implement mobile-first
- **Reason**: User prefers responsive design from smallest screens
- **Added**: 2026-01-25
```

---

## 📚 Additional Resources

- [AGENTS.md](./AGENTS.md) - Instructions for AI coding agents
- [Workflow Guide](./.nexus/docs/workflow-guide.md) - Keeping plans in sync and managing document status
- [Copilot Instructions](./.github/copilot-instructions.md) - Custom instructions for GitHub Copilot
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [MCP Protocol](https://modelcontextprotocol.io)

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

<p align="center">
  <strong>Built with 🤖 by your AI squad</strong>
</p>
