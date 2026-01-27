# Workflow Guide: Feature-Based Development

A guide to managing features and keeping documentation in sync with actual work.

---

## Feature-Based Structure

All work is organized by **feature**, not by workflow phase. Each feature has its own folder:

```
.nexus/features/<feature-slug>/
├── plan.md        # What we're building and why
├── execution.md   # How we built it (work log)
├── review.md      # Code review findings and fixes
├── summary.md     # Status snapshot (optional)
└── notes/         # Supporting materials
```

### Why Feature-Based?

1. **Everything in one place** - No hunting across phase directories
2. **Natural mental model** - You think "auth feature" not "execution phase"
3. **Parallel work** - Multiple features can be at different stages
4. **Better traceability** - Clear lineage from plan to completion

---

## Feature Status Lifecycle

Every feature flows through these states:

```
draft → in-progress → review → complete
```

| Status        | Meaning                        | Set By            |
| ------------- | ------------------------------ | ----------------- |
| `draft`       | Planned but not started        | `nexus-planning`  |
| `in-progress` | Currently being implemented    | `nexus-execution` |
| `review`      | Implementation done, reviewing | `nexus-review`    |
| `complete`    | Reviewed and finished          | `nexus-review`    |

Additional statuses:

- `on-hold` - Paused, not actively worked on
- `archived` - No longer relevant

---

## Master TOC

The file `.nexus/toc.md` is the **master index** of all features:

| Feature   | Status      | Files           | Agents           | Last Edited |
| --------- | ----------- | --------------- | ---------------- | ----------- |
| user-auth | in-progress | plan, execution | @architect, @dev | 2026-01-26  |

**Always update toc.md** when:

- Creating a new feature
- Changing feature status
- Adding new documents to a feature

---

## Workflow Quick Reference

### Starting a New Feature

1. Run `nexus-planning` prompt
2. Creates `.nexus/features/<slug>/plan.md`
3. Updates `.nexus/toc.md` with new row (status: `draft`)

### Implementing a Feature

1. Run `nexus-execution` prompt
2. Creates `.nexus/features/<slug>/execution.md`
3. Updates plan status to `in-progress`
4. Updates toc.md

### Reviewing a Feature

1. Run `nexus-review` prompt
2. Creates `.nexus/features/<slug>/review.md`
3. Updates plan status to `complete`
4. Updates toc.md

### Checking Status

1. Run `nexus-summary` prompt
2. Creates/updates `.nexus/features/<slug>/summary.md`
3. Updates toc.md

---

## The Drift Problem

When you bypass the formal **planning → execution → review** workflow and talk directly to agents (e.g., "@software-developer add this feature"), documentation falls out of sync:

- ❌ Plan status stays `draft` even though work is done
- ❌ Execution log doesn't exist or is incomplete
- ❌ toc.md not updated
- ❌ No record of what changed or why

---

## The Solution: Sync Workflow

Use `nexus-sync` to reconcile documentation with actual work.

### When to Run Sync

```bash
# Scenario 1: Direct agent work
You: "@software-developer fix the auth bug"
# → Work happens, but plan doesn't update
# → Solution: Run nexus-sync prompt

# Scenario 2: Multiple ad-hoc changes
You: "@ux-designer tweak the header"
You: "@visual-designer adjust colors"
# → Multiple changes, no tracking
# → Solution: Run nexus-sync prompt

# Scenario 3: Before formal review
You: "Let's run a code review"
# → But work wasn't tracked via execution workflow
# → Solution: Run nexus-sync first, then review
```

### What Sync Does

1. **Analyzes git history** to see what actually changed
2. **Finds orphaned work** not connected to any feature
3. **Updates feature status** based on actual state
4. **Creates missing execution logs** retroactively
5. **Updates toc.md** with current reality
6. **Reports** what was reconciled

---

## Recommended Workflows

### Option A: Formal (Best for Large Features)

```
1. Run nexus-planning prompt
   → Creates features/<slug>/plan.md (status: draft)
   → Updates toc.md

2. Run nexus-execution prompt
   → Creates features/<slug>/execution.md
   → Updates plan status to in-progress
   → Implements the feature

3. Run nexus-review prompt
   → Creates features/<slug>/review.md
   → Audits and fixes issues
   → Updates status to complete
```

✅ **Fully tracked, no drift**

---

### Option B: Direct + Sync (Acceptable for Quick Work)

```
1. Run nexus-planning prompt
   → Creates plan (status: draft)

2. Talk directly to agents
   You: "@software-developer implement auth"
   You: "@qa-engineer add tests"
   → Work happens, but not tracked

3. Run nexus-sync prompt
   → Detects changes
   → Updates feature status
   → Creates execution log retroactively
   → Updates toc.md
```

⚠️ **Works, but requires manual sync step**

---

### Option C: Fully Manual (Avoid)

```
1. Talk to agents without planning
2. Make changes
3. Never sync or review
```

❌ **No documentation, can't track progress**

---

## Manual Status Updates

To manually update a feature's status, edit the plan's frontmatter:

```yaml
---
title: Feature Name
date: 2026-01-25
status: 'in-progress' # Change this: draft | in-progress | review | complete
---
```

And update toc.md to match.

---

## Creating a Feature Manually

If you need to create a feature folder manually:

1. Create the folder: `.nexus/features/<slug>/`
2. Copy template: `cp .nexus/templates/plan.template.md .nexus/features/<slug>/plan.md`
3. Edit the plan
4. Add row to `.nexus/toc.md`:

```markdown
| <slug> | draft | plan | @architect | YYYY-MM-DD |
```

---

## Preventing Drift

To keep features synchronized with reality:

- **Preferred**: Always use execution workflow for implementation
- **Acceptable**: Direct agent work + manual sync afterward
- **Avoid**: Long periods of untracked work without syncing

### Run Sync When:

- ✅ You've done work by chatting directly with agents
- ✅ Feature status seems out of date
- ✅ Execution log is missing or stale
- ✅ Before starting a formal review (to catch up)
- ✅ toc.md looks outdated

---

## Quick Reference

| I want to...               | Use this prompt                    |
| -------------------------- | ---------------------------------- |
| Start a new feature        | `nexus-planning`                   |
| Implement a feature        | `nexus-execution`                  |
| Fix something quickly      | Chat with agent, then `nexus-sync` |
| Review and fix issues      | `nexus-review`                     |
| Check feature status       | `nexus-summary`                    |
| Update stale documentation | `nexus-sync`                       |

---

## See Also

- [AGENTS.md](../../AGENTS.md) - Technical documentation for agents
- [toc.md](../toc.md) - Master feature index
- [Templates](../templates/) - Document templates
