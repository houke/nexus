---
feature: '<feature-slug>'
date: 'YYYY-MM-DD'
review-iteration: 1
agents: ['@agent1', '@agent2']
issues-found: 0
issues-fixed: 0
---

# Review Report: [Feature Title]

> **Purpose**: Document code review findings and fixes for this feature.

**Plan Reference**: [plan.md](./plan.md)  
**Execution Log**: [execution.md](./execution.md)

---

## Summary

[2-3 paragraph executive summary: what was reviewed, total issues found/fixed, overall health assessment]

---

## Metrics

| Metric        | Before | After |
| ------------- | ------ | ----- |
| Issues Found  | —      | X     |
| Issues Fixed  | —      | X     |
| Test Coverage | X%     | Y%    |
| Lint Errors   | X      | 0     |
| Type Errors   | X      | 0     |

---

## Agent Review Reports

### @agent-name

**Focus Areas**: [their expertise]

#### Issues Found

| #   | Issue         | Severity        | File      |
| --- | ------------- | --------------- | --------- |
| 1   | [description] | high/medium/low | [file.ts] |

#### Fixes Applied

| #   | Fix Description          | Files Changed       |
| --- | ------------------------ | ------------------- |
| 1   | [what was fixed and how] | [file.ts, other.ts] |

#### Verification

- Tests: ✅ Passing
- Lint: ✅ Clean
- Types: ✅ Clean

#### Deferred Items

[Issues requiring other agents, if any]

---

### @another-agent

_(Repeat structure above for each reviewing agent)_

---

## Common Themes

[Patterns that emerged across multiple agent reviews]

---

## Remaining Action Items

[Any items that could not be auto-fixed, with owners]

| Item | Description | Owner | Priority |
| ---- | ----------- | ----- | -------- |
| 1    | [what]      | @who  | P1/P2/P3 |

---

## Review Iterations

_(If this document is updated for subsequent reviews)_

### Iteration 2 - YYYY-MM-DD

**Changes Since Last Review:**

- [What changed in codebase]
- [What was fixed from previous review]

**New Issues Found:**
[Only NEW issues not in previous iteration]

**Remaining Issues (from Iteration 1):**
[Issues that weren't fixed]

---

## Revision History

| Date       | Agent                | Changes        |
| ---------- | -------------------- | -------------- |
| YYYY-MM-DD | @review-orchestrator | Initial review |
