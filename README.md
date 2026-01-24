# 🚀 Nexus

**Transform VS Code into an Autonomous Command Center**

Nexus unites specialized AI agents—from strategic Architects to rigorous Security Agents—to orchestrate your entire software lifecycle. Transform your IDE into a collaborative ecosystem where your digital squad plans, builds, and secures code in real-time.

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

Nexus provides four core prompts that guide you through the entire software development lifecycle:

### 1️⃣ Planning Phase → `project-planning.prompt.md`

**When to use:** At the start of a new feature or project

The Planning prompt orchestrates a comprehensive planning session by invoking ALL specialized agents. Each agent contributes their expertise to create a complete action plan.

**How to use:**

1. Open the Command Palette (`Cmd/Ctrl + Shift + P`)
2. Select "Chat: Run Prompt..."
3. Choose `project-planning`
4. Describe what you want to build

**What happens:**

- The Architect defines system design
- The Product Manager clarifies requirements
- The Security Agent identifies risks
- The QA Engineer plans test strategies
- ...and more

**Output:** A comprehensive plan saved to `.nexus/plan/NNNN-<feature>.md`

---

### 2️⃣ Execution Phase → `project-execution.prompt.md`

**When to use:** After planning is complete and you're ready to build

The Execution prompt takes your action plans and coordinates implementation by delegating to the right agents at the right time.

**How to use:**

1. Open the Command Palette
2. Select "Chat: Run Prompt..."
3. Choose `project-execution`
4. Reference the plan file you want to execute

**What happens:**

- Analyzes the plan and identifies work items
- Validates requirements with Product Manager
- Delegates implementation to Software Developer
- Coordinates QA Engineer for test coverage
- Runs verification: `npm run test && npm run lint && npm run typecheck`

**Output:** Implemented features with tests, following the plan

---

### 3️⃣ Review & Fix Phase → `project-review.prompt.md`

**When to use:** After implementation, before merging

The Review prompt runs a comprehensive code review using ALL agent personas. This is an **active review**: each agent not only identifies issues but also **immediately implements fixes** for anything within their area of expertise.

**How to use:**

1. Open the Command Palette
2. Select "Chat: Run Prompt..."
3. Choose `project-review`
4. Optionally specify files or features to review

**What happens:**

- Security Agent audits and **fixes** vulnerabilities
- QA Engineer checks test coverage and **adds** missing edge cases
- Architect validates design and **refactors** patterns
- Tech Lead reviews code quality and **resolves** lint/style issues
- ...every agent contributes AND executes fixes

**Output:** A detailed review and fix report saved to `.nexus/review/NNNN-<review>.md`

---

### 4️⃣ Summary Phase → `project-summary.prompt.md`

**When to use:** Periodically, to assess project status

The Summary prompt provides a snapshot of your project's current state by comparing "what we have" vs "what we need."

**How to use:**

1. Open the Command Palette
2. Select "Chat: Run Prompt..."
3. Choose `project-summary`

**What happens:**

- Analyzes all plan files in `.nexus/plan/`
- Reviews implemented features
- Identifies gaps and missing items
- Provides actionable next steps

**Output:** A status report saved to `.nexus/summary/NNNN-<summary>.md`

> 💡 **Pro tip:** Run the summary prompt every few days or at the start of each work session to stay aligned with project goals.

---

## 📁 Project Structure

```
.
├── .github/
│   ├── agents/           # Agent persona definitions
│   │   ├── architect.md
│   │   ├── software-developer.md
│   │   ├── security.md
│   │   └── ...
│   ├── prompts/          # Core workflow prompts
│   │   ├── project-planning.prompt.md
│   │   ├── project-execution.prompt.md
│   │   ├── project-review.prompt.md
│   │   └── project-summary.prompt.md
│   └── skills/           # Specialized skill instructions
├── .nexus/               # Generated outputs
│   ├── plan/             # Action plans
│   ├── execution/        # Execution logs
│   ├── review/           # Code reviews
│   └── summary/          # Status summaries
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

- `context7` - Up-to-date library documentation
- `gitkraken` - Git operations and PR management
- `memory` - Knowledge graph for persistent context
- `filesystem` - File operations
- `sequential-thinking` - Complex problem decomposition
- `playwright` - Browser automation for testing

---

## 🚀 Quick Start Example

```
1. Create a new repo from this template
2. Open in VS Code
3. Run "project-planning" prompt:
   "I want to build a task management app with offline support"
4. Review the generated plan in .nexus/plan/
5. Run "project-execution" prompt to start building
6. Run "project-review" prompt before committing
7. Run "project-summary" to track progress
```

---

## 📚 Additional Resources

- [AGENTS.md](./AGENTS.md) - Instructions for AI coding agents
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [MCP Protocol](https://modelcontextprotocol.io)

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

<p align="center">
  <strong>Built with 🤖 by your AI squad</strong>
</p>
