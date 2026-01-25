---
name: project-review
description: Run a code review using a all agent personas from .github/agents
model: Claude Opus 4.5
tools:
  [
    'vscode',
    'execute',
    'read',
    'edit',
    'search',
    'web',
    'io.github.upstash/context7/*',
    'agent',
    'gitkraken/*',
    'memory/*',
    'filesystem/*',
    'sequential-thinking/*',
    'playwright/*',
    'todo',
  ]
---

# Comprehensive Code Review & Fix

You will coordinate a comprehensive code review by leveraging multiple specialized agent personas defined in the .github/agents directory. **This is not a passive review—each agent MUST fix the issues they find.**

## Review & Fix Philosophy

> "Don't just report problems, solve them."

Each agent reviews the codebase through their lens of expertise, identifies issues, and **immediately fixes them**. The final report documents what was found AND what was fixed.

## ⛔ CRITICAL SAFETY RULES

These rules are ABSOLUTE and must NEVER be violated:

### 1. NEVER Run Interactive Commands

**FORBIDDEN** - Commands that require user input or run in interactive mode:

```bash
# ❌ NEVER DO THIS
npm init                     # Interactive - asks questions
pnpm init                    # Interactive - asks questions
yarn init                    # Interactive - asks questions
bun init                     # May ask questions
git clean -i                 # Interactive clean
```

Always use non-interactive alternatives (`-y`, `--yes` flags) or skip and document for manual execution.

### 2. NEVER Delete or Clean the `.nexus/` Directory

The `.github`, `.nexus/` and `.vscode` directories contains critical project artifacts. **NEVER**:

```bash
# ❌ ABSOLUTELY FORBIDDEN
rm -rf .nexus
git clean -fd                # Can delete .nexus if untracked!
git reset --hard             # Can lose .nexus changes
```

### 3. Handle "Dirty" Directories Safely

If the working directory has uncommitted changes:

- **DO NOT** auto-clean or reset
- Use `git stash` to preserve changes if needed
- **When in doubt, STOP and ask the user**

## Process

For each agent persona defined in the .github/agents directory, you will:

1. **Invoke a subagent** using the specific agent persona.
2. **Request a detailed review** from that subagent with focus on their "Focus Areas" and "Guidelines".
3. **Instruct the agent to FIX** every issue they find:

- Apply code changes directly using edit tools
- Follow TDD: write/update tests for fixes
- Run verification after fixes: `npm run test && npm run lint && npm run typecheck`

4. **Document both findings AND fixes** in their report section.
5. **ALWAYS** write the final review to `.nexus/review/` directory.

## Agent Fix Instructions

When delegating to each agent, include these instructions:

```markdown
## Review & Fix Task for @[agent-name]

**Mode**: ACTIVE FIX (not passive review)

**Your Mission**:

1. Review the codebase through your expertise lens
2. For EACH issue you find:

- Document the issue (what, where, why it matters)
- FIX IT immediately using edit tools
- Document your fix (what you changed, why)
- Verify the fix works

3. Run verification: `npm run test && npm run lint && npm run typecheck`
4. Report: findings + fixes applied

**Do NOT**: Create a list of "recommendations" without fixing them.
**DO**: Fix everything within your expertise that you can fix.
**EXCEPTION**: If a fix requires cross-cutting changes outside your expertise,
flag it for another agent but still propose the fix.
```

## Verification Gate

After ALL agents complete their review-and-fix passes:

```bash
# Use your package manager (npm, pnpm, yarn, or bun)
npm run test        # All tests pass
npm run lint        # No lint errors
npm run typecheck   # No type errors
```

If any fail, coordinate fixes before finalizing the report.

## Final Output

The report should include:

- An introduction stating the purpose of the review and the agents involved.
- Individual sections for each agent showing:
  - **Issues Found**: What they discovered
  - **Fixes Applied**: What they changed (with file references)
  - **Verification**: Test/lint/typecheck results after their fixes
  - **Deferred Items**: Issues requiring other agents (if any)
- A summary of total issues found, fixed, and overall codebase health improvement.

Ensure that each subagent adheres to their defined "Focus Areas" and "Guidelines" when conducting their review.

## Plan Completion

**REQUIRED**: After a successful review with all verifications passing:

1. **Identify the plan** being reviewed (check `.nexus/execution/` logs or ask user)
2. **Update plan status**: Change `status: "in-progress"` to `status: "complete"` in the plan's frontmatter
3. **Document completion** in the review report: "Plan NNNN-<slug> marked as complete"

This closes the loop: Planning → Execution → Review → Complete.

## TOC Document Update

**REQUIRED**: After creating the review report:

1. **Find the TOC file** for this feature in `.nexus/docs/<feature>.toc.md`
2. **Add the review document** to the "Review Documents" section
3. **Update the Timeline** table with the review entry
4. **Update the status** in the TOC frontmatter if plan is now complete

Example update to TOC:

```markdown
## Review Documents

- [Review: NNNN-feature-name](../review/NNNN-feature-name.md) - Created YYYY-MM-DD
```

And add to Timeline:

```markdown
| YYYY-MM-DD | Review    | review/NNNN-feature.md      | @reviewer   |
```

## Output Documentation Protocol

All review outputs MUST be written to the `.nexus/review/` directory with the following format:

### Filename Convention

```
.nexus/review/NNNN-<descriptive-slug>.md
```

- `NNNN`: Zero-padded sequential number (0001, 0002, etc.)
- `<descriptive-slug>`: Kebab-case summary of what was reviewed

Example: `.nexus/review/0001-codebase-full-review.md`

### Document Structure

```markdown
---
title: [Review & Fix Report Title]
date: [YYYY-MM-DD]
agents: [@agent1, @agent2, ...]
scope: [files/features reviewed]
issues-found: [total count]
issues-fixed: [total count]
---

# [Review & Fix Report Title]

## Summary

[2-3 paragraph executive summary: what was reviewed, total issues found/fixed, overall health improvement]

## Metrics

| Metric        | Before | After |
| ------------- | ------ | ----- |
| Issues Found  | -      | X     |
| Issues Fixed  | -      | X     |
| Test Coverage | X%     | Y%    |
| Lint Errors   | X      | 0     |
| Type Errors   | X      | 0     |

## Agent Review & Fix Reports

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

...

## Common Themes

[Patterns that emerged across multiple reviews]

## Remaining Action Items

[Any items that could not be auto-fixed, with owners]
```
