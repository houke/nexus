---
title: "[Plan Title]"
date: "[YYYY-MM-DD]"
type: "new-project | new-feature | refactor | bug-fix"
agents: ["@product-manager", "@architect", "@tech-lead", "@software-developer", "@ux-designer", "@visual-designer", "@qa-engineer", "@security", "@devops", "@gamer"]
status: "draft | approved | in-progress | complete"
---

# [Plan Title]

## 1. Executive Summary

> **What are we building and why?**

_(Owners: @product-manager, @tech-lead)_

### Vision

[2-3 sentences describing the high-level goal and user impact]

### Success Criteria

- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

### Scope

| In Scope                    | Out of Scope               |
| --------------------------- | -------------------------- |
| [Feature/capability]        | [Explicitly excluded item] |
| [Feature/capability]        | [Explicitly excluded item] |

---

## 2. Product Requirements

_(Owner: @product-manager)_

### User Stories

\`\`\`
As a [user type],
I want to [action/capability],
So that [benefit/value].
\`\`\`

### Acceptance Criteria

- [ ] Given [context], when [action], then [expected result]
- [ ] Given [context], when [action], then [expected result]

### User Personas Affected

| Persona          | Impact       | Notes                   |
| ---------------- | ------------ | ----------------------- |
| [Persona name]   | High/Med/Low | [How this affects them] |

### Priority & Timeline

- **Priority**: P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low)
- **Target Date**: [Date or Sprint]
- **Dependencies**: [Other features/plans this depends on]

---

## 3. Technical Architecture

_(Owner: @architect)_

### System Overview

[High-level architecture description - how components interact]

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│  Component  │────▶│  Component  │
└─────────────┘     └─────────────┘     └─────────────┘
\`\`\`

### Core Components

| Component       | Responsibility | New/Modified |
| --------------- | -------------- | ------------ |
| [ComponentName] | [What it does] | New/Modified |

### Data Model

\`\`\`sql
-- New tables or schema changes
CREATE TABLE example (
  id INTEGER PRIMARY KEY,
  ...
);
\`\`\`

\`\`\`typescript
// TypeScript interfaces
interface Example {
  id: string;
  // ...
}
\`\`\`

### External Dependencies

| Dependency     | Version | Purpose          | License        |
| -------------- | ------- | ---------------- | -------------- |
| [package-name] | ^x.x.x  | [Why we need it] | MIT/Apache/etc |

### Performance Constraints

- [ ] [Constraint: e.g., "Page load < 3s on 3G"]
- [ ] [Constraint: e.g., "Memory usage < 100MB"]
- [ ] [Constraint: e.g., "60fps animations"]

---

## 4. Implementation Specifications

_(Owner: @tech-lead)_

### Code Structure

\`\`\`
src/
├── features/
│   └── [feature-name]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
\`\`\`

### Key Interfaces & Types

\`\`\`typescript
// Core types for this feature
\`\`\`

### Algorithm / Logic Overview

[Pseudocode or flowchart for complex logic]

### Migration Strategy

_(For existing projects only)_

- [ ] Database migrations needed?
- [ ] Breaking API changes?
- [ ] Feature flags required?
- [ ] Rollback plan?

---

## 5. User Experience Design

_(Owner: @ux-designer)_

### User Flow

\`\`\`
[Start] → [Step 1] → [Decision Point] → [Step 2] → [End]
                          ↓
                    [Alternative Path]
\`\`\`

### Wireframes

[Description or link to wireframes]

| Screen/State  | Description         | Notes          |
| ------------- | ------------------- | -------------- |
| [Screen name] | [What user sees/does] | [Interactions] |

### Interaction Patterns

- **Primary Action**: [How user triggers main action]
- **Feedback**: [How user knows action succeeded]
- **Error States**: [How errors are communicated]
- **Empty States**: [What user sees when no data]

### Accessibility Requirements

- [ ] Keyboard navigation path defined
- [ ] Screen reader announcements planned
- [ ] Focus management specified
- [ ] Color contrast requirements met

---

## 6. Visual Design & Polish

_(Owner: @visual-designer)_

### Design Direction

[Creative vision - what mood/feeling should this evoke?]

### Typography

| Use Case  | Font Family   | Size/Weight | Notes       |
| --------- | ------------- | ----------- | ----------- |
| [Heading] | [Font choice] | [Specs]     | [Rationale] |

### Color Palette

| Token Name | Value      | Usage        |
| ---------- | ---------- | ------------ |
| [--color-x]| [#hex/hsl] | [Where used] |

### Animation & Motion

| Element   | Animation      | Duration/Easing | Trigger |
| --------- | -------------- | --------------- | ------- |
| [Element] | [What happens] | [Timing]        | [When]  |

### Responsive Breakpoints

| Breakpoint        | Layout Changes |
| ----------------- | -------------- |
| Mobile (<768px)   | [Adaptations]  |
| Tablet (768-1024) | [Adaptations]  |
| Desktop (>1024)   | [Adaptations]  |

---

## 7. Gamification & Engagement

_(Owner: @gamer)_

### Engagement Hooks

| Trigger       | Reward/Feedback | Purpose |
| ------------- | --------------- | ------- |
| [User action] | [What happens]  | [Why]   |

### Progression Elements

- **Points/XP**: [How earned, what for]
- **Achievements**: [Unlockables related to this feature]
- **Streaks**: [Time-based engagement mechanics]

### Feedback Loops

- **Immediate**: [Instant gratification elements]
- **Short-term**: [Session-based rewards]
- **Long-term**: [Persistent progression]

---

## 8. Security Considerations

_(Owner: @security)_

### Threat Model

| Threat          | Risk Level   | Mitigation       |
| --------------- | ------------ | ---------------- |
| [Threat type]   | High/Med/Low | [How we prevent] |

### Data Security

- [ ] Sensitive data identified
- [ ] Encryption requirements defined
- [ ] Access control rules specified

### Input Validation

- [ ] All user inputs validated
- [ ] Sanitization rules defined
- [ ] Rate limiting considered

### Compliance

- [ ] GDPR considerations
- [ ] Data retention policy
- [ ] Privacy requirements

---

## 9. Quality Assurance Strategy

_(Owner: @qa-engineer)_

### Test Scenarios

#### Happy Path

1. [Step] → [Expected result]
2. [Step] → [Expected result]

#### Edge Cases

| Scenario    | Input       | Expected Output |
| ----------- | ----------- | --------------- |
| [Edge case] | [Test data] | [Result]        |

#### Error Scenarios

| Error Condition | User Experience  | Recovery Path    |
| --------------- | ---------------- | ---------------- |
| [Error type]    | [What user sees] | [How to recover] |

### Test Types Required

- [ ] Unit tests (coverage target: ___%)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Accessibility tests (axe-core)
- [ ] Performance tests
- [ ] Security tests

### Mock Data Requirements

[What data needs to be mocked for testing]

---

## 10. Infrastructure & Deployment

_(Owner: @devops)_

### Build Configuration

- [ ] Build scripts updated
- [ ] Environment variables defined
- [ ] CI/CD pipeline changes

### Deployment Strategy

- **Rollout**: [All at once / Canary / Feature flag]
- **Rollback Plan**: [How to revert if issues]

### Monitoring & Observability

- [ ] Error tracking configured
- [ ] Performance metrics defined
- [ ] Alerts set up

### Offline/PWA Considerations

- [ ] Service worker updates needed
- [ ] Cache strategy defined
- [ ] Offline behavior specified

---

## 11. Action Items

_(Collaborative: All agents)_

### Phase 1: Foundation

- [ ] **SETUP-001**: [Task description] — @[owner]
- [ ] **SETUP-002**: [Task description] — @[owner]

### Phase 2: Core Implementation

- [ ] **IMPL-001**: [Task description] — @[owner]
- [ ] **IMPL-002**: [Task description] — @[owner]

### Phase 3: Polish & Testing

- [ ] **POLISH-001**: [Task description] — @[owner]
- [ ] **TEST-001**: [Task description] — @[owner]

### Phase 4: Review & Deploy

- [ ] **REVIEW-001**: Code review — @tech-lead
- [ ] **DEPLOY-001**: Production deployment — @devops

---

## 12. Risk Register

_(Collaborative: All agents)_

| Risk               | Probability  | Impact       | Mitigation            | Owner    |
| ------------------ | ------------ | ------------ | --------------------- | -------- |
| [Risk description] | High/Med/Low | High/Med/Low | [Prevention/response] | @[agent] |

---

## 13. Open Questions

_(Track decisions needed before/during implementation)_

- [ ] **Q1**: [Question] — Assigned to: @[agent]
- [ ] **Q2**: [Question] — Assigned to: @[agent]

---

## 14. Glossary

_(Define project-specific terms)_

| Term   | Definition        |
| ------ | ----------------- |
| [Term] | [What it means]   |

---

## Revision History

| Date       | Author   | Changes       |
| ---------- | -------- | ------------- |
| YYYY-MM-DD | @[agent] | Initial draft |
