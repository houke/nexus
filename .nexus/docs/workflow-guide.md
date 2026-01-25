# Workflow Guide: Keeping Plans in Sync

A guide to managing document status and preventing drift between plans and actual work.

---

## Plan Status Lifecycle

Every plan flows through three states:

```
draft → in-progress → complete
```

| Status | Meaning | Set By | When |
|--------|---------|--------|------|
| `draft` | Planned but not started | `project-planning` | Plan is created |
| `in-progress` | Currently being implemented | `project-execution` | Work begins |
| `complete` | Reviewed and finished | `project-review` | Review passes |

---

## The Problem

When you bypass the formal **planning → execution → review** workflow and talk directly to agents (e.g., "@software-developer add this feature"), the documentation in `.nexus/` falls out of sync with reality:

- ❌ Plan status stays `draft` even though work is done
- ❌ Execution log doesn't exist or is incomplete
- ❌ Review report never generated
- ❌ TOC document isn't updated
- ❌ No record of what changed or why

---

## The Solution: Sync Workflow

Use the **project-sync** prompt to reconcile documentation with actual work.

### When to Run Sync

Run sync in these situations:

```bash
# Scenario 1: Direct agent work
You: "@software-developer fix the auth bug"
# → Work happens, but plan doesn't update
# → Solution: Run project-sync prompt

# Scenario 2: Multiple ad-hoc changes
You: "@ux-designer tweak the header"
You: "@visual-designer adjust colors"
# → Multiple changes, no tracking
# → Solution: Run project-sync prompt

# Scenario 3: Before formal review
You: "Let's run a code review"
# → But work wasn't tracked via execution workflow
# → Solution: Run project-sync first, then review
```

### What Sync Does

1. **Analyzes git history** to see what actually changed
2. **Compares with plan action items** to determine progress
3. **Updates plan status** (draft → in-progress → complete)
4. **Creates/updates execution log** with detected changes
5. **Creates/updates TOC file** with all document links
6. **Generates review report** if work is complete
7. **Reports back** with status and next steps

---

## Recommended Workflows

### Option A: Formal (Best for Large Features)

```
1. Run project-planning prompt
   → Creates .nexus/plan/0001-feature.md (status: draft)
   
2. Run project-execution prompt
   → Updates status to in-progress
   → Creates .nexus/execution/0001-feature.md
   → Creates .nexus/docs/feature.toc.md
   → Implements the plan
   
3. Run project-review prompt
   → Audits and fixes issues
   → Creates .nexus/review/0001-feature.md
   → Updates TOC with review link
   → Updates status to complete
```

✅ **Fully tracked, no drift**

---

### Option B: Direct + Sync (Acceptable for Quick Work)

```
1. Run project-planning prompt
   → Creates plan (status: draft)
   
2. Talk directly to agents
   You: "@software-developer implement auth"
   You: "@qa-engineer add tests"
   → Work happens, but not tracked
   
3. Run project-sync prompt
   → Detects changes
   → Updates plan status
   → Creates execution log retroactively
   → Creates/updates TOC file
   → Brings documentation up to date
   
4. (Optional) Run project-review prompt
   → Final audit and fixes
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

If you need to manually update a plan's status, edit the frontmatter:

```yaml
---
title: Feature Name
date: 2026-01-25
status: 'in-progress'  # Change this: draft | in-progress | complete
---
```

**When to manually update:**
- When sync workflow can't determine status automatically
- When marking a plan abandoned or on-hold
- When splitting a plan into multiple smaller plans

**Best practice:** Let the prompts manage status automatically whenever possible.

---

## TOC Updates

The TOC (Table of Contents) file tracks all documents for a feature. It should be updated whenever a new document is created:

### Automatic Updates
- `project-execution` → Creates TOC, adds plan + execution links
- `project-review` → Adds review document link
- `project-summary` → Adds summary document link
- `project-sync` → Creates missing TOC, updates all links

### Manual Updates
If you create a document outside the workflows, manually add it to the TOC:

```markdown
## Custom Documents

- [Design Mockups](../custom/design-mockups.md) - Created YYYY-MM-DD

## Timeline

| Date       | Action  | Document                | Agent       |
| ---------- | ------- | ----------------------- | ----------- |
| YYYY-MM-DD | Custom  | custom/design-mockups.md| @visual-designer |
```

---

## Preventing Drift

To keep plans synchronized with reality:

- **Preferred**: Always use execution workflow for implementation
- **Acceptable**: Direct agent work + manual sync afterward
- **Avoid**: Long periods of untracked work without syncing

### Run Sync When:

- ✅ You've done work by chatting directly with agents
- ✅ Plan status seems out of date
- ✅ Execution log is missing or stale
- ✅ Review report doesn't exist but work is done
- ✅ TOC file is missing or outdated
- ✅ Before starting a formal review (to catch up)

---

## Quick Reference

| I want to... | Use this prompt |
|--------------|----------------|
| Start a new feature | `project-planning` |
| Implement a plan formally | `project-execution` |
| Fix something quickly | Chat with agent, then `project-sync` |
| Review and fix issues | `project-review` |
| Check project status | `project-summary` |
| Update stale documentation | `project-sync` |

---

## See Also

- [AGENTS.md](../../AGENTS.md) - Technical documentation for agents
- [README.md](../../README.md) - Project overview and quick start
- [TOC System](./README.md) - Document tracking system
