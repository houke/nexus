# Checkpoint System

> Part of the `nexus-workflows` skill. Documentation for saving and resuming long execution sessions.

## Overview

Long execution sessions can save and resume progress using checkpoints. This prevents loss of context when sessions are interrupted or need to span multiple conversations.

## Commands

| Command              | Action                        | When to Use                  |
| -------------------- | ----------------------------- | ---------------------------- |
| `/nexus-workflows checkpoint save`   | Save progress to execution.md | Before ending a long session |
| `/nexus-workflows checkpoint resume` | Continue from saved state     | Starting a new session       |
| `/nexus-workflows checkpoint status` | Show completed vs pending     | Checking progress            |

## `/nexus-workflows checkpoint save`

When triggered:

1. Read the current `execution.md` file
2. Update the `## Checkpoints` section with:
   - Current timestamp
   - List of completed action items
   - Current in-progress item and its state
   - Next steps to resume
   - Any important context to preserve
3. Update the frontmatter: `checkpoint: 'saved'`
4. Add entry to Checkpoint History table
5. Confirm to user what was saved

## `/nexus-workflows checkpoint resume`

When triggered:

1. Read the `execution.md` file
2. Parse the `## Checkpoints > Latest Checkpoint` section
3. Display what was saved and when
4. Update frontmatter: `checkpoint: 'resumed'`
5. Continue execution from the "Next Steps" listed
6. Add entry to Checkpoint History table

## `/nexus-workflows checkpoint status`

When triggered:

1. Read the `plan.md` to get all action items
2. Read the `execution.md` to get completed items
3. Display a summary:
   - ✅ Completed items (with count)
   - 🔄 In progress items
   - ⏳ Not started items (with count)
   - Overall percentage complete

## Automatic Triggers

The orchestrator automatically triggers checkpoints:

- After 30+ minutes of continuous work
- After completing major action items (IMPL-XXX)
- Before delegating to different agents
- When hitting blockers

## Agent Checkpoint Requests

Agents can request checkpoints by outputting:

```markdown
## Checkpoint Request from @[agent-name]

**Reason**: [Why checkpoint is needed]
**Completed Items**: [List]
**In Progress**: [Current item]
**Next Steps**: [What to do on resume]
```

When the orchestrator sees this, it executes `/nexus-workflows checkpoint save` with the provided information.

## Checkpoint Data Format

Checkpoints are stored in the `execution.md` file:

```markdown
## Checkpoints

### Latest Checkpoint

**Status**: Saved at YYYY-MM-DD HH:MM:SS
**Completed Items**: IMPL-001, IMPL-002, IMPL-003
**In Progress**: IMPL-004 (50% complete)
**Next Steps**: Finish IMPL-004, then start IMPL-005
**Context to Preserve**:
- Variable X is set to Y because...
- We chose approach A over B because...
- Waiting on: [any blockers]

### Checkpoint History

| Timestamp           | Action  | Items Completed         | Notes              |
| ------------------- | ------- | ----------------------- | ------------------ |
| YYYY-MM-DD HH:MM:SS | save    | IMPL-001, IMPL-002     | Mid-session save   |
| YYYY-MM-DD HH:MM:SS | resume  | —                       | Resumed from save  |
```
