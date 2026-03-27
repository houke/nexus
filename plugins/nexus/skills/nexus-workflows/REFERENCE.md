# Nexus Quick Commands Cheatsheet

> Your one-page reference for the Nexus workflow.
>
> Migrated from `.nexus/docs/CHEATSHEET.md` to the `nexus-workflows` skill.

---

## 🚀 Starting Work

| I want to...          | Slash Command | How                                                                 |
| --------------------- | ------------- | ------------------------------------------------------------------- |
| Plan a new feature    | `/plan`       | Invoke @nexus or use slash command                                  |
| Start implementing    | `/execute`    | Invoke @nexus or use slash command                                  |
| Review completed work | `/review`     | Invoke @nexus or use slash command                                  |
| Get project status    | `/summary`    | Invoke @nexus or use slash command                                  |
| Sync out-of-date docs | `/sync`       | Invoke @nexus or use slash command                                  |
| Quick bug fix         | `/hotfix`     | Invoke @nexus or use slash command                                  |
| Initialize new repo   | `/init`       | Initialize lightweight Nexus scaffolding in a downstream repository |

`/init` ensures these exist: `.nexus/features/.gitkeep`, `.nexus/memory/<agent>.memory.md`, `.nexus/toc.md`, `.nexus/tmp/`, and `AGENTS.md`.

---

## 🤖 Talking to Agents

### Direct Agent Commands

| I want to...        | Talk to             | Example Prompt                                  |
| ------------------- | ------------------- | ----------------------------------------------- |
| Design a system     | @architect          | "Design the data model for user authentication" |
| Write code          | @software-developer | "Implement the login form component"            |
| Review code quality | @tech-lead          | "Review this hook for best practices"           |
| Check security      | @security           | "Audit this API endpoint for vulnerabilities"   |
| Write tests         | @qa-engineer        | "Write E2E tests for the checkout flow"         |
| Polish UI           | @visual-designer    | "Add hover animations to the card component"    |
| Add gamification    | @gamer              | "Design an achievement system for streaks"      |
| Define requirements | @product-manager    | "Write acceptance criteria for this feature"    |
| Design UX flow      | @ux-designer        | "Map the user journey for onboarding"           |
| Set up CI/CD        | @devops             | "Configure GitHub Actions for deployment"       |

### Agent Consultation

```markdown
@architect, can you review @software-developer's implementation for scalability concerns?
```

---

## 📁 Feature Structure

```
.nexus/features/<feature-slug>/
├── plan.md        ← What we're building
├── execution.md   ← How we built it
├── review.md      ← Review findings
├── summary.md     ← Status snapshot
└── notes/         ← Supporting docs
```

---

## 📊 Feature Status

| Status        | Meaning              | Set By     |
| ------------- | -------------------- | ---------- |
| `draft`       | Planned, not started | `/plan`    |
| `in-progress` | Currently building   | `/execute` |
| `review`      | Under code review    | `/review`  |
| `complete`    | Done and approved    | `/review`  |
| `on-hold`     | Paused               | Manual     |
| `archived`    | No longer needed     | Manual     |

---

## ✅ Verification Commands

```bash
# Run all checks (use your package manager)
npm run test && npm run lint && npm run typecheck

# Or with auto-detection
${PM:-npm} run test && ${PM:-npm} run lint && ${PM:-npm} run typecheck
```

### Individual Commands

| Check | Command                                             | What It Does      |
| ----- | --------------------------------------------------- | ----------------- |
| Tests | `npm run test`                                      | Runs Vitest/Jest  |
| E2E   | `npm run test:e2e`                                  | Runs Playwright   |
| Lint  | `npm run lint`                                      | ESLint check      |
| Types | `npm run typecheck`                                 | TypeScript check  |
| All   | `npm run test && npm run lint && npm run typecheck` | Full verification |

---

## 🔄 Checkpoint Commands

During long execution sessions:

| Command              | Action                        |
| -------------------- | ----------------------------- |
| `/checkpoint save`   | Save current progress         |
| `/checkpoint resume` | Continue from last checkpoint |
| `/checkpoint status` | Show what's done vs pending   |

---

## 📍 Traceability Links

### In Code Comments

```typescript
// @requirement IMPL-003 from features/user-auth/plan.md#action-items
// @decision Q2 resolved by @architect on 2026-01-26
function validateToken() { ... }
```

### In Plan Documents

```markdown
## Action Items

- [x] **IMPL-003**: Implement JWT validation — @software-developer
  - **Implementation**: `src/auth/jwt.ts:45-89`
  - **Tests**: `src/auth/jwt.test.ts:12-45`
```

---

## 🆘 When Things Go Wrong

| Problem                  | Solution                                 |
| ------------------------ | ---------------------------------------- |
| Docs out of sync         | Run `/sync` workflow                     |
| Execution failed midway  | Use `/checkpoint resume`                 |
| Agent not following plan | Re-read plan, add clarifying details     |
| Tests breaking           | Run `git diff`, identify breaking change |
| Need quick fix           | Use `/hotfix` instead of full flow       |

---

## 🧠 Agent Memory

Agents remember your preferences! Say things like:

- "Please remember to work mobile-first"
- "Always use TypeScript strict mode"
- "Never use `any` type"
- "From now on, include JSDoc comments"

Memory is stored in `.nexus/memory/<agent-name>.memory.md`

---

## 📋 Common Workflows

### New Feature (Full Flow)

```
1. /plan     → Creates plan.md
2. /execute  → Creates execution.md
3. /review   → Creates review.md, marks complete
```

### Quick Bug Fix

```
1. /hotfix → Diagnose, fix, verify in one session
```

### Catch Up Documentation

```
1. /sync → Reconciles docs with actual changes
```

### Check Progress

```
1. /summary → Shows have vs need
```

---

## 🔑 Keyboard Shortcuts

| Action               | Shortcut                                   |
| -------------------- | ------------------------------------------ |
| Open Command Palette | `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Win) |
| Run Prompt           | Command Palette → "Chat: Run Prompt..."    |
| Open Chat            | `Cmd+Shift+I` (Mac) / `Ctrl+Shift+I` (Win) |
| New Chat             | `Cmd+L` (Mac) / `Ctrl+L` (Win)             |

---

## 📚 Key Files

| File                                  | Purpose                    |
| ------------------------------------- | -------------------------- |
| `.nexus/toc.md`                       | Master feature index       |
| `AGENTS.md`                           | Agent system documentation |
| `plugins/nexus/agents/nexus.agent.md` | Orchestrator instructions  |
| `.nexus/memory/*.memory.md`           | Agent preferences          |
