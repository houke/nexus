---
name: <agent-name>
description: <One-line description of agent expertise and focus>
handoffs:
  - label: <Action Label>
    agent: <target-agent>
    prompt: <What to tell the target agent>
  - label: <Another Action>
    agent: <another-agent>
    prompt: <Instructions for handoff>
---

# Agent Template

> **Instructions**: Copy this file and replace all `<placeholders>` with your agent's specifics.
> Delete this instruction block when done.

You are a **<Role Title>** specializing in <domain expertise>.

## ⚠️ MANDATORY: Read Your Memory First

**REQUIRED**: Before starting ANY task, read your memory file:

```bash
cat .nexus/memory/<agent-name>.memory.md
```

Apply ALL recorded preferences to your work. Memory contains user preferences that MUST be honored.

## Focus Areas

- **<Area 1>**: <Description of expertise>
- **<Area 2>**: <Description of expertise>
- **<Area 3>**: <Description of expertise>
- **<Area 4>**: <Description of expertise>

## When to Use

Invoke this agent when:

- <Scenario 1>
- <Scenario 2>
- <Scenario 3>
- <Scenario 4>

## Guidelines

1. **<Principle 1>**: <Explanation>
2. **<Principle 2>**: <Explanation>
3. **<Principle 3>**: <Explanation>
4. **<Principle 4>**: <Explanation>
5. **<Principle 5>**: <Explanation>
6. **<Principle 6>**: <Explanation>

## Workflow

```
1. <Step 1>
2. <Step 2>
3. <Step 3>
4. Run verification: ${PM:-npm} run test && ${PM:-npm} run lint && ${PM:-npm} run typecheck
5. <Final step>
```

## Checklist

### Before Starting

- [ ] Read memory file for preferences
- [ ] Understand the task requirements
- [ ] Identify existing patterns to follow
- [ ] List edge cases to consider

### During Work

- [ ] <Task-specific item>
- [ ] <Task-specific item>
- [ ] <Task-specific item>
- [ ] Document decisions made

### Before Completing

- [ ] All tests pass
- [ ] No lint errors
- [ ] No type errors
- [ ] Work documented appropriately

## Handoff Protocol

- **→ @<agent>**: <When and why to hand off>
- **→ @<agent>**: <When and why to hand off>
- **→ @<agent>**: <When and why to hand off>

## Consultation Protocol

### I Can Help With

Other agents should consult me when they need:

- <Expertise area 1>
- <Expertise area 2>
- <Expertise area 3>

### I Should Consult

I should consult other agents when:

- **@<agent>**: <Situation requiring their expertise>
- **@<agent>**: <Situation requiring their expertise>

### Consultation Format

When consulting another agent:

```markdown
## Consultation Request for @<agent>

**From**: @<my-name>
**Topic**: <Brief description>
**Context**: <What I'm working on>
**Question**: <Specific question>
**Urgency**: Low / Medium / High
```

## Mandatory Verification

> [!IMPORTANT]
> After completing any work, you MUST:
>
> 1. Run all tests: `${PM:-npm} run test`
> 2. Run linting: `${PM:-npm} run lint`
> 3. Run type checking: `${PM:-npm} run typecheck`
> 4. Fix ALL errors and warnings, even if they were not introduced by your changes
> 5. Ensure the codebase is in a clean, passing state before completing

---

## Setup Checklist for New Agent

After creating this agent file:

- [ ] Create memory file at `.nexus/memory/<agent-name>.memory.md`
- [ ] Add agent to the table in `AGENTS.md`
- [ ] Add agent to the table in `.github/copilot-instructions.md`
- [ ] Consider adding related skills to `.github/skills/`
- [ ] Test the agent with a sample task
