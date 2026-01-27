---
feature: '<feature-slug>'
status: 'in-progress' # in-progress | blocked | complete
started: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
checkpoint: null # null | 'saved' | 'resumed'
---

# Execution Log: [Feature Title]

> **Purpose**: Track implementation progress for this feature.

**Plan Reference**: [plan.md](./plan.md)

> ⚠️ **Note**: This log should be updated during execution workflow. If work happens outside the workflow (direct agent chats), run `project-sync` to update retroactively.

---

## Overview

**Feature**: [Feature name]  
**Started**: YYYY-MM-DD  
**Status**: in-progress | blocked | complete  
**Last Updated**: YYYY-MM-DD

**Progress Summary**:

- ✅ Completed: X action items
- 🔄 In Progress: Y action items
- ⏳ Not Started: Z action items
- **Overall**: XX% complete

---

## Checkpoints

> Use checkpoints to save and resume long execution sessions.
> Commands: `/checkpoint save`, `/checkpoint resume`, `/checkpoint status`

### Latest Checkpoint

**Status**: No checkpoint saved yet

<!--
When a checkpoint is saved, update this section:

**Status**: Saved at YYYY-MM-DD HH:MM:SS
**Completed Items**: IMPL-001, IMPL-002, IMPL-003
**In Progress**: IMPL-004 (50% complete)
**Next Steps**: Finish IMPL-004, then start IMPL-005
**Context to Preserve**:
- Variable X is set to Y because...
- We chose approach A over B because...
- Waiting on: [any blockers]
-->

### Checkpoint History

| Timestamp | Action | Items Completed | Notes              |
| --------- | ------ | --------------- | ------------------ |
| —         | —      | —               | No checkpoints yet |

---

## Traceability

> Links between requirements, code, and tests for audit trail.

### Requirement → Code Mapping

| Requirement ID | Description | Implementation       | Tests                       |
| -------------- | ----------- | -------------------- | --------------------------- |
| IMPL-001       | [From plan] | `src/file.ts:10-50`  | `tests/file.test.ts:5-30`   |
| IMPL-002       | [From plan] | `src/other.ts:20-80` | `tests/other.test.ts:10-45` |

### Code Comment Convention

When implementing, add traceability comments:

```typescript
// @requirement IMPL-001 from features/<slug>/plan.md#action-items
// @decision Q2 resolved by @architect on YYYY-MM-DD
function implementedFeature() {
  // Implementation
}
```

---

## Work Sessions

### [YYYY-MM-DD] - [Session Title]

**Agent(s)**: @[primary-agent]  
**Duration**: [Approximate time]  
**Workflow**: Formal execution | Direct agent chat | Ad-hoc work

#### Changes Made

| File/Component          | Action   | Notes                  |
| ----------------------- | -------- | ---------------------- |
| `src/feature.ts`        | Created  | Implemented core logic |
| `src/types.ts`          | Modified | Added new interfaces   |
| `tests/feature.test.ts` | Created  | Unit tests added       |

#### Action Items Completed

- [x] **IMPL-001**: [Task description from plan]
- [x] **IMPL-003**: [Another completed task]

#### Challenges & Decisions

- **Challenge**: [Problem encountered]
  - **Resolution**: [How it was solved]
  - **Impact**: [Effect on plan/timeline]

- **Decision**: [Technical decision made]
  - **Rationale**: [Why this choice]
  - **Affected**: [What this impacts]

#### Blockers

- [ ] **BLOCKER-001**: [Description of blocker]
  - **Impact**: [How this affects progress]
  - **Owner**: @[agent]
  - **Resolution plan**: [Next steps]

#### Questions Resolved 🔧

_(Questions deferred from planning that were answered during this session)_

| ID  | Question             | Answer            | Answered By |
| --- | -------------------- | ----------------- | ----------- |
| Q#  | [Question from plan] | [Answer provided] | @[agent]    |

> **Note**: When resolving deferred questions, also update the plan's "Resolved During Execution 🔧" table.

---

### [YYYY-MM-DD] - [Another Session]

_(Repeat above structure for each work session)_

---

## Deviations from Plan

### Added (Not in Original Plan)

- **Addition**: [What was added]
  - **Why**: [Justification]
  - **Affected**: [Plan sections to update]

### Skipped (In Plan, Not Done)

- **Skipped**: [What was not done]
  - **Why**: [Reason for skip]
  - **Impact**: [Consequences]

### Modified Approach

- **Original**: [What the plan said]
- **Actual**: [What was done instead]
- **Rationale**: [Why the change]

---

## Dependencies & External Factors

| Dependency     | Status      | Impact | Notes                |
| -------------- | ----------- | ------ | -------------------- |
| [External API] | ✅ Ready    | None   | Docs available       |
| [Library X]    | ⚠️ Unstable | High   | Consider alternative |

---

## Testing Status

| Test Type   | Status         | Coverage | Notes               |
| ----------- | -------------- | -------- | ------------------- |
| Unit        | ✅ Passing     | 85%      | Target: 90%         |
| Integration | 🔄 In Progress | 60%      | 3 tests remaining   |
| E2E         | ⏳ Not Started | 0%       | Blocked by IMPL-007 |
| A11y        | ✅ Passing     | 100%     | axe-core audit done |

---

## Next Steps

### Immediate (This Session)

- [ ] [Task to complete now]
- [ ] [Another immediate task]

### Short-Term (Next Session)

- [ ] [Upcoming work]
- [ ] [Follow-up tasks]

### Ready for Review

- [ ] All action items complete
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Ready to invoke review workflow

---

## Sync Notes

_(Used by sync workflow to reconcile untracked work)_

### [YYYY-MM-DD] - Manual Sync

**Detected changes:**

- [List of files/features found during sync]

**Reconciliation actions:**

- [How the log was brought up to date]

---

## Revision History

| Date & Time         | Agent                   | Changes                       |
| ------------------- | ----------------------- | ----------------------------- |
| YYYY-MM-DD HH:MM:SS | @execution-orchestrator | Initial log created           |
| YYYY-MM-DD HH:MM:SS | @sync-orchestrator      | Reconciled untracked work     |
| YYYY-MM-DD HH:MM:SS | @orchestrator           | [Description of changes made] |
| YYYY-MM-DD HH:MM:SS | @[agent-name]           | [Agent-specific changes]      |
