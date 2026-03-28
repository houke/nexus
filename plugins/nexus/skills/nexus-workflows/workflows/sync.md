# Project Synchronization & Reconciliation

> Part of the `nexus-workflows` skill. Invoked by the Nexus orchestrator.

> **ORCHESTRATOR ONLY**: This workflow is executed by the **@Nexus** agent. If you are not **@Nexus**, please delegate this task to them.

You are the **Synchronization Orchestrator**. Your role is to reconcile what has _actually been done_ with what's _documented in features_, keeping the tracking system up to date when work happens outside the formal workflow.

## Mandatory Scaffold Preflight

Before running this workflow, check whether both `.nexus/` and `AGENTS.md` exist.

If either is missing:

1. Run `/nexus-workflows init` first.
2. After init completes, resume this sync workflow.

## When to Use This Workflow

Run this prompt when:

- 🔄 Work was done by talking directly to agents (bypassing execution workflow)
- 📝 Feature status is out of date with actual code changes
- 🔍 Review needed but unsure what has changed
- 📊 Need to synchronize `.nexus/` documentation with reality

## Sync Process

### Step 1: Discover Active Features

```bash
# List all features
ls -la .nexus/features/

# Check master TOC
cat .nexus/toc.md
```

Look for:

- Features with `status: 'draft'` or `status: 'in-progress'`
- Features that should be `complete` but aren't marked as such
- Work that isn't tracked in any feature folder

### Step 2: Analyze What Changed

For each active feature:

1. **Read the plan** from `.nexus/features/<slug>/plan.md`
2. **Check git history** to see what was actually modified:
   ```bash
   git log --oneline --since="[plan date]" --name-only
   ```
3. **Compare plan action items** against actual file changes
4. **Identify completed vs. incomplete work**

### Step 3: Update Feature Status

Update the plan's frontmatter based on findings:

```yaml
status: 'in-progress' # if work has started
status: 'complete'    # if all action items done
```

Add a **Sync Notes** section to the plan:

```markdown
---

## Sync Notes

### [Date] - Manual Sync

**Changes detected:**

- ✅ [File/feature] implemented by @[agent]
- ✅ [Component] added
- ⚠️ [Action item] partially complete
- ❌ [Action item] not started

**Updated status:** [draft/in-progress/complete]

**Next steps:**

- [ ] [What still needs to be done]
```

### Step 4: Create or Update Execution Log

Ensure `.nexus/features/<slug>/execution.md` exists and reflects reality:

```markdown
---
feature: '<slug>'
status: 'in-progress'
started: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
---

# Execution Log: [Feature Title]

## Work Completed

### [Date] - Direct Agent Work (Untracked)

- **Agent**: @[agent-name]
- **Changes**:
  - [File modified]: [What changed]
  - [File created]: [Purpose]
- **Status**: [Action items completed]
```

### Step 5: Update Master TOC

**REQUIRED**: Update `.nexus/toc.md` to reflect current reality:

1. Update status for each feature
2. Update Files column with existing documents
3. Update Agents column with all contributors
4. Update Last Edited date

### Step 6: Trigger Review If Needed

If substantial work was completed, generate a review report:

1. **Check if review exists**: `.nexus/features/<slug>/review.md`
2. **If missing or outdated**, invoke the review workflow:
   - Read `workflows/review.md`
   - Follow the review process
   - Save report to `.nexus/features/<slug>/review.md`

## Reconciliation Checklist

Use this checklist for each sync:

- [ ] Listed all features in `.nexus/features/`
- [ ] Compared plan action items vs. actual git changes
- [ ] Updated plan `status` field in frontmatter
- [ ] Added sync notes to plan document
- [ ] Created/updated execution log
- [ ] Updated `.nexus/toc.md` with current state
- [ ] Determined if review is needed
- [ ] Generated or updated review report if applicable

## Detecting Drift

**Signs that sync is needed:**

1. **Git shows changes** but feature status is still `draft`
2. **Execution log doesn't exist** but code has been modified
3. **Review report is stale** or missing despite completed work
4. **Action items marked incomplete** but corresponding files exist
5. **User asks about progress** but documentation is outdated
6. **toc.md doesn't match reality** in feature folders

## Handling Orphaned Work

If you find work that doesn't belong to any feature:

1. **Determine if it should be a feature**
   - If yes: Create new feature folder with plan
   - If no: Document in a notes file

2. **Create retroactive feature folder**:

   ```
   .nexus/features/<new-slug>/
   ├── plan.md       # Write retroactively
   ├── execution.md  # Document what was done
   └── notes/        # Any supporting info
   ```

3. **Add to toc.md**

## Example Sync Session

```markdown
**Input**: User says "I've been working with @software-developer on auth"

**Actions**:

1. Find feature folder for auth (or create one)
2. Check git: Files A, B, C modified
3. Compare: 5 of 8 action items complete
4. Update plan status: draft → in-progress
5. Create/update execution.md with details
6. Update toc.md
7. Report to user: "Synced. Feature now in-progress. 3 items remaining."
```

## Documentation Authorship During Sync

When this workflow creates or updates documentation artifacts (plan updates, execution logs, sync notes, feature summaries), apply the following authorship rule:

- **Who writes**: Delegate all documentation writing to `@business-analyst` (primary) or `@product-manager` (secondary).
- **Who provides inputs**: Technical agents (`@architect`, `@software-developer`, `@qa-engineer`) provide structured notes and findings; the BA/PM shapes these into the final written artifact.
- **Platforms covered**: This applies equally to local markdown (`.nexus/features/`), GitHub issues/wiki, Jira, Confluence, and any other documentation platform.

To create or update a document during sync, delegate to the BA:

```
runSubagent(
  agentName: "business-analyst",
  description: "Update feature documentation after sync",
  prompt: "Here are the structured findings from the sync: [findings]. Please write/update the following document: [document path / platform]. Audience: [internal team / external stakeholders]."
)
```

## Output

After sync, provide the user:

1. **Summary**: What was updated
2. **Status snapshot**: Current feature progress
3. **Recommendations**: What should happen next (review? continue execution?)

**ALWAYS** append an entry to the "## Revision History" section of any documents you create or update with current timestamp (format: YYYY-MM-DD HH:MM:SS), agent @sync-orchestrator (or @orchestrator if made directly from main chat), and a brief description of the sync changes made.

## Mandatory User Satisfaction Verification

**AFTER** completing the synchronization, verify user satisfaction using `ask_questions` tool:

```javascript
ask_questions({
  questions: [
    {
      header: 'Satisfied?',
      question:
        "Does the synchronized documentation accurately reflect the work done? (Select 'Other' to provide specific feedback)",
      allowFreeformInput: true,
      options: [{ label: 'Yes, sync looks accurate!' }],
    },
  ],
});
```

### Handling User Feedback

- **If user selects "Yes"**: Sync is complete, finalize all document updates
- **If user provides feedback (Other/free input)**:
  1. Analyze the feedback to understand discrepancies
  2. Re-analyze git history or code changes as needed
  3. Update feature documents with corrected information
  4. Ask satisfaction question again
  5. Repeat until user is satisfied

**ONLY** after user confirms satisfaction should you:

- Finalize all document updates
- Update toc.md
- Add revision history entries

---

**Remember**: This is a reconciliation workflow, not a replacement for the primary planning → execution → review cycle. Use it to get back on track, then encourage proper workflow usage going forward.
