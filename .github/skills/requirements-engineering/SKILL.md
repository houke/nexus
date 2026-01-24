---
name: requirements-engineering
description: User story templates, acceptance criteria patterns, PRD structures for defining clear product requirements.
---

# Requirements Engineering Skill

This skill provides templates and patterns for defining clear, actionable product requirements.

## User Story Template

> [!TIP]
> Use [user-story-template.md](./user-story-template.md) as a starting point for new stories.

```markdown
## [STORY-ID] Feature Name

**Priority**: P0 (Critical) | P1 (High) | P2 (Medium) | P3 (Low)
**Effort**: XS | S | M | L | XL
**Status**: Draft | Ready | In Progress | Done

### User Story

**As a** [specific user persona]
**I want** [goal or action]
**So that** [benefit or value received]

### Context

[Background information, related features, or prior decisions]

### Acceptance Criteria

- [ ] **AC1**: Given [precondition], when [action], then [expected result]
- [ ] **AC2**: Given [precondition], when [action], then [expected result]
- [ ] **AC3**: Given [precondition], when [action], then [expected result]

### Edge Cases

| Scenario      | Expected Behavior |
| ------------- | ----------------- |
| [Edge case 1] | [How to handle]   |
| [Edge case 2] | [How to handle]   |

### Out of Scope

- [Explicitly excluded item 1]
- [Explicitly excluded item 2]

### Dependencies

- [ ] [Dependency 1]
- [ ] [Dependency 2]

### Success Metrics

| Metric        | Target         | Measurement      |
| ------------- | -------------- | ---------------- |
| [Metric name] | [Target value] | [How to measure] |

### Open Questions

- [ ] [Question 1]?
- [ ] [Question 2]?
```

## Acceptance Criteria Patterns

### Format: Given-When-Then

```markdown
Given [context/precondition]
When [action/trigger]
Then [expected outcome]
And [additional outcome]
```

### Good vs Bad Criteria

| ❌ Bad                 | ✅ Good                                               |
| ---------------------- | ----------------------------------------------------- |
| "Should be fast"       | "Page loads in under 2 seconds on 3G"                 |
| "Should look nice"     | "Follows design system spacing tokens"                |
| "Should handle errors" | "Shows retry button when network fails"               |
| "Should work offline"  | "Cached data displays when navigator.onLine is false" |

### Types of Criteria

**Functional**: What the feature does

```markdown
- [ ] Given user has completed 9 tasks, when they complete the 10th task, then the "Task Master" achievement unlocks
```

**Performance**: How fast/efficient

```markdown
- [ ] Given 10,000 items in database, when user opens the list view, then render completes in under 500ms
```

**Accessibility**: Inclusive design

```markdown
- [ ] Given user navigates with keyboard, when they reach the button, then focus ring is visible
```

**Error Handling**: Failure modes

```markdown
- [ ] Given API request times out, when user tries to fetch data, then cached data displays with "Last updated" timestamp
```

## PRD Template

```markdown
# Product Requirements Document: [Feature Name]

**Author**: [Name]
**Last Updated**: [Date]
**Status**: Draft | In Review | Approved

## Executive Summary

[2-3 sentences describing what and why]

## Problem Statement

### Current State

[What exists today and its limitations]

### User Pain Points

1. [Pain point 1]
2. [Pain point 2]

### Opportunity

[What we can improve and expected impact]

## Goals & Non-Goals

### Goals

- [ ] [Measurable goal 1]
- [ ] [Measurable goal 2]

### Non-Goals

- [Explicitly out of scope item 1]
- [Explicitly out of scope item 2]

## User Stories

[Link to or embed user stories]

## Proposed Solution

### Overview

[High-level description of the solution]

### User Flows

[Link to UX flows or embed diagrams]

### Key Screens/States

[Wireframes or descriptions]

## Technical Considerations

### Dependencies

- [Technical dependency 1]
- [Technical dependency 2]

### Risks

| Risk     | Impact   | Mitigation   |
| -------- | -------- | ------------ |
| [Risk 1] | [Impact] | [Mitigation] |

## Success Metrics

| Metric     | Current    | Target | Timeline |
| ---------- | ---------- | ------ | -------- |
| [Metric 1] | [Baseline] | [Goal] | [When]   |

## Timeline

| Milestone     | Date   | Description        |
| ------------- | ------ | ------------------ |
| [Milestone 1] | [Date] | [What's delivered] |

## Open Questions

- [ ] [Question 1]?
```

## Prioritization Framework

### RICE Scoring

```
Score = (Reach × Impact × Confidence) / Effort
```

| Factor     | Scale           | Definition                      |
| ---------- | --------------- | ------------------------------- |
| Reach      | # users/quarter | How many users affected         |
| Impact     | 0.5, 1, 2, 3    | How much it improves experience |
| Confidence | 50%, 80%, 100%  | How sure are we of estimates    |
| Effort     | Person-weeks    | Development time                |

### MoSCoW Method

- **Must Have**: Critical for release, non-negotiable
- **Should Have**: Important but not critical
- **Could Have**: Nice to have if time permits
- **Won't Have**: Explicitly deferred

## Requirements Checklist

Before marking requirements as "Ready":

- [ ] User value is clearly articulated
- [ ] Acceptance criteria are specific and testable
- [ ] Edge cases are documented
- [ ] Out of scope is explicit
- [ ] Dependencies are identified
- [ ] Success metrics are defined
- [ ] Technical feasibility confirmed with engineering
- [ ] UX flows reviewed with design

## After Requirements Definition

> [!IMPORTANT]
> After defining requirements, you MUST:
>
> 1. Verify all acceptance criteria use Given/When/Then format
> 2. Ensure success metrics are measurable
> 3. Document all edge cases and error states
> 4. Get sign-off from @ux-designer and @tech-lead
