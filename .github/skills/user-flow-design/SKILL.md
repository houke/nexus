---
name: user-flow-design
description: User journey mapping, wireframe conventions, interaction patterns for designing intuitive user experiences.
---

# User Flow Design Skill

This skill provides patterns for designing intuitive user experiences in Terra Quest.

## User Flow Notation

### Basic Flow

```
[State A] → (Action) → [State B]
```

### Branching Flow

```
[State A] → (Action) → [State B]
               │
               ├─ (Alternative) → [State C]
               │
               └─ (Error) → [Error State]
```

### Complete Flow Template

> [!TIP]
> Use [wireframe-checklist.md](./wireframe-checklist.md) when creating wireframes.

```markdown
## Flow: [Name]

**Trigger**: [What initiates this flow]
**Goal**: [What user wants to accomplish]
**Personas**: [Which users use this flow]

### Happy Path

[Start] → (Action 1) → [State 1] → (Action 2) → [End State]

### Alternative Paths

#### Path A: [Variation Name]

[Start] → (Alt Action) → [Alt State] → [End State]

### Error Paths

#### Error: [Error Name]

[State] → (Failing Action) → [Error State] → (Retry) → [State]

### States

| State       | Description   | Key Elements  |
| ----------- | ------------- | ------------- |
| [Start]     | [Description] | [UI elements] |
| [State 1]   | [Description] | [UI elements] |
| [End State] | [Description] | [UI elements] |
```

## Wireframe Conventions

### Layout Template

```
┌─────────────────────────────────────┐
│            Status Bar               │  <- System UI
├─────────────────────────────────────┤
│  ←  Title                     ⋮     │  <- App Header
├─────────────────────────────────────┤
│                                     │
│                                     │
│           Main Content              │  <- Scrollable Area
│                                     │
│                                     │
├─────────────────────────────────────┤
│    [Primary Action Button]          │  <- Sticky Footer (optional)
├─────────────────────────────────────┤
│  🏠    🗺️    📘    👤              │  <- Tab Bar
└─────────────────────────────────────┘
```

### Component Notation

| Symbol          | Meaning           |
| --------------- | ----------------- |
| `[Button Text]` | Tappable button   |
| `( Radio )`     | Radio option      |
| `[x] Checkbox`  | Checkbox          |
| `[___________]` | Text input        |
| `[▼ Dropdown ]` | Select/dropdown   |
| `< Slider >`    | Slider control    |
| `[Image 16:9]`  | Image placeholder |
| `← →`           | Navigation arrows |
| `⋮`             | More menu         |
| `×`             | Close button      |

### Annotations

```
┌───────────────────┐
│   Component       │ ← 1. Annotation text
├───────────────────┤    explaining behavior
│   Content         │
│                   │ ← 2. Another annotation
└───────────────────┘
```

## Interaction States

Every interactive element should define these states:

```markdown
### [Component Name] States

| State    | Visual        | Behavior              |
| -------- | ------------- | --------------------- |
| Default  | [Description] | Ready for interaction |
| Hover    | [Description] | Desktop only          |
| Pressed  | [Description] | Active touch/click    |
| Focused  | [Description] | Keyboard navigation   |
| Disabled | [Description] | Not available         |
| Loading  | [Description] | Async operation       |
| Error    | [Description] | Invalid/failed        |
| Success  | [Description] | Completed             |
```

## Gesture Patterns

### Standard Gestures

| Gesture          | Use For          | Example                      |
| ---------------- | ---------------- | ---------------------------- |
| Tap              | Primary action   | Select item, activate button |
| Long Press       | Secondary action | Show context menu            |
| Swipe Left/Right | Reveal actions   | Delete, archive              |
| Swipe Down       | Refresh, dismiss | Pull to refresh              |
| Swipe Up         | Expand           | Bottom sheet to full         |
| Pinch            | Zoom             | Map zoom                     |
| Two-finger pan   | Map movement     | Move map (when zoomed)       |

### Gesture Documentation

```markdown
### Gestures: [Screen Name]

| Element   | Gesture    | Action        | Feedback       |
| --------- | ---------- | ------------- | -------------- |
| List item | Swipe left | Reveal delete | Red background |
| Map       | Pinch out  | Zoom in       | Animated zoom  |
| Sheet     | Swipe down | Dismiss       | Slide away     |
```

## Accessibility Requirements

### Per-Element Checklist

- [ ] Has accessible name (aria-label or visible text)
- [ ] Touch target ≥ 44×44px
- [ ] Color contrast ≥ 4.5:1 (text) or 3:1 (large text)
- [ ] Not color-only indicator
- [ ] Keyboard reachable
- [ ] Focus visible
- [ ] Screen reader announces state changes

### Flow-Level Checklist

- [ ] Focus order matches visual order
- [ ] Modals trap focus
- [ ] Escape closes modals
- [ ] Loading states announced
- [ ] Errors associated with inputs
- [ ] Skip links for repetitive content

## Empty States

Every screen/view should define:

```markdown
### Empty State: [Screen Name]

**When**: [Condition for empty state]

**Display**:

- Illustration: [Description or name]
- Headline: "[Encouraging message]"
- Body: "[Explanation and guidance]"
- CTA: [Action button if applicable]

**Example**:
┌─────────────────────────────────────┐
│ │
│ 🗺️ (illustration) │
│ │
│ No stamps collected yet │
│ │
│ Start exploring to fill your │
│ passport with discoveries! │
│ │
│ [ Start Exploring ] │
│ │
└─────────────────────────────────────┘
```

## Loading States

```markdown
### Loading: [Operation Name]

**Duration**: [Expected time range]
**Pattern**: Skeleton | Spinner | Progress Bar

**Skeleton Example**:
┌─────────────────────────────────────┐
│ ████████████ │ ██████ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────┘
```

## After Flow Design

> [!IMPORTANT]
> After designing flows, you MUST:
>
> 1. Verify all interaction states are defined
> 2. Document empty, loading, and error states
> 3. Include accessibility annotations
> 4. Get review from @visual-designer before handoff to @software-developer
