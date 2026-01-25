# Keeping Plans in Sync

## The Problem

When you bypass the formal **planning → execution → review** workflow and talk directly to agents (e.g., "@software-developer add this feature"), the documentation in `.nexus/` falls out of sync with reality:

- ❌ Plan status stays `draft` even though work is done
- ❌ Execution log doesn't exist or is incomplete
- ❌ Review report never generated
- ❌ No record of what changed or why

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
5. **Generates review report** if work is complete
6. **Reports back** with status and next steps

## Recommended Workflow

### Option A: Formal (Best for Large Features)

```
1. Run project-planning prompt
   → Creates .nexus/plan/0001-feature.md (status: draft)

2. Run project-execution prompt
   → Updates status to in-progress
   → Creates .nexus/execution/0001-feature.md
   → Implements the plan

3. Run project-review prompt
   → Audits and fixes issues
   → Creates .nexus/review/0001-feature.md
   → Updates status to complete
```

✅ **Fully tracked, no drift**

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
   → Brings documentation up to date

4. (Optional) Run project-review prompt
   → Final audit and fixes
```

⚠️ **Works, but requires manual sync step**

### Option C: Fully Manual (Avoid)

```
1. Talk to agents without planning
2. Make changes
3. Never sync or review
```

❌ **No documentation, can't track progress**

## Quick Sync Checklist

When running `project-sync`, it will:

- [ ] Find all plans with `status: draft` or `in-progress`
- [ ] Check git log for changes since plan creation
- [ ] Compare plan action items vs. actual files
- [ ] Update plan frontmatter with new status
- [ ] Add "Sync Notes" section to plan
- [ ] Create/update execution log
- [ ] Generate review report if work is complete
- [ ] Provide status summary

## Automation Ideas

To reduce manual sync needs, consider:

1. **Git hooks**: Auto-update plan status on commit
2. **Agent logging**: Have agents append to execution log
3. **Status command**: Quick CLI to check plan vs. reality
4. **Periodic sync**: Run sync daily or before standups

## Files Created by Sync

After running sync, you'll see:

```
.nexus/
├── plan/
│   └── 0001-feature.md          # Status updated, sync notes added
├── execution/
│   └── 0001-feature.md          # Retroactive log of changes
├── review/
│   └── 0001-feature.md          # Review report (if complete)
└── summary/
    └── 0001-status.md           # Overall project status
```

## Example Sync Session

```markdown
**You**: "Run project-sync"

**Sync Coordinator**:

- Found plan 0003-auth-system.md (status: draft)
- Git history shows 12 files changed since plan date
- Detected: 6 of 8 action items completed
- Updated plan status: draft → in-progress
- Created execution log with retroactive entries
- Work is 75% complete, review not yet needed
- Next steps: Complete IMPL-007 and IMPL-008

**You**: "Thanks! Continue execution"
```

## Best Practices

1. **Run sync regularly** if working outside formal workflows
2. **Before reviews**, sync first to ensure accurate audit
3. **Use execution workflow** when possible to avoid drift
4. **Document decisions** in sync notes for future reference
5. **Don't wait too long** - sync weekly at minimum

---

**Remember**: Sync is your safety net, not your primary workflow. Use formal planning → execution → review when possible.
