---
feature: '<feature-slug>'
status: 'in-progress' # in-progress | blocked | complete
started: 'YYYY-MM-DD'
updated: 'YYYY-MM-DD'
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

| Date       | Agent                   | Changes                   |
| ---------- | ----------------------- | ------------------------- |
| YYYY-MM-DD | @execution-orchestrator | Initial log created       |
| YYYY-MM-DD | @sync-orchestrator      | Reconciled untracked work |
