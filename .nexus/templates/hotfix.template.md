---
type: hotfix
date: 'YYYY-MM-DD'
severity: 'critical | high | medium | low'
status: 'fixed'
agents: ['@software-developer', '@qa-engineer']
---

# Hotfix: [Bug Summary]

> **Quick Reference**
>
> - **Date**: YYYY-MM-DD
> - **Severity**: Critical / High / Medium / Low
> - **Status**: Fixed ✅

---

## Bug Description

**Summary**: [One-line description of the bug]

**Reproduction Steps**:

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happens]

**Affected Users/Features**: [Who/what is impacted]

---

## Root Cause Analysis

**Root Cause**: [Technical explanation of why this bug occurred]

**Contributing Factors**:

- [Factor 1]
- [Factor 2]

**How it was missed**: [Why tests/review didn't catch it]

---

## Fix Applied

**Solution Summary**: [Brief description of the fix]

### Files Modified

| File               | Change                  | Lines |
| ------------------ | ----------------------- | ----- |
| `path/to/file.ts`  | [Description of change] | 10-25 |
| `path/to/other.ts` | [Description of change] | 45-60 |

### Code Changes

```typescript
// Before
[old code]

// After
[new code]
```

---

## Testing

### Tests Added

| Test File         | Test Case                  | Purpose            |
| ----------------- | -------------------------- | ------------------ |
| `path/to/test.ts` | `should handle [scenario]` | Prevent regression |

### Verification

- [ ] Original bug no longer reproducible
- [ ] All existing tests pass
- [ ] No lint errors
- [ ] No type errors
- [ ] No regression in related functionality
- [ ] Manual testing completed

---

## Time Spent

| Agent               | Task               | Duration  |
| ------------------- | ------------------ | --------- |
| @software-developer | Diagnosis          | X min     |
| @software-developer | Fix implementation | X min     |
| @qa-engineer        | Validation         | X min     |
| **Total**           |                    | **X min** |

---

## Prevention

**How to prevent similar bugs**:

- [ ] [Action item 1 - e.g., add test coverage for edge case]
- [ ] [Action item 2 - e.g., update documentation]
- [ ] [Action item 3 - e.g., add validation]

---

## Revision History

| Date & Time         | Agent                | Changes               |
| ------------------- | -------------------- | --------------------- |
| YYYY-MM-DD HH:MM:SS | @hotfix-orchestrator | Initial hotfix record |
