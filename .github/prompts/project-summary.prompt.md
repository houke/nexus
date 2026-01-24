---
name: project-summary
description: Get a summary of everything we have vs everything we need from all agent personas from .github/agents
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

Please provide a summary of the current project status.
Compare "Everything we have" vs "Everything we need". Use any of the agents defined in the .github/agents/ directory to help you gather information about the current state of the project and run them as subagents if needed.

Analyze the following key documents to understand the plan and current state:

- The `.nexus/plan/` directory containing all phase plans (e.g. `.nexus/plan/0001-foundation-plan.md`, etc.)
- Active agent definitions in `.github/agents/`

Structure the response as:

### What We Have

- implemented features
- existing infrastructure
- current agents

### What We Need

- missing features (check `.nexus/plan/` files)
- planned but not started items
- gaps in resources or agents

### Next Steps

- Recommended immediate actions

**ALWAYS** write the final summary to `.nexus/summary/` directory.

## Output Documentation Protocol

All summary outputs MUST be written to the `.nexus/summary/` directory with the following format:

### Filename Convention

```
.nexus/summary/NNNN-<descriptive-slug>.md
```

- `NNNN`: Zero-padded sequential number (0001, 0002, etc.)
- `<descriptive-slug>`: Kebab-case summary of the snapshot

Example: `.nexus/summary/0001-project-status-snapshot.md`

### Document Structure

```markdown
---
title: [Summary Title]
date: [YYYY-MM-DD]
agents: [@agent1, @agent2, ...]
---

# [Summary Title]

## Executive Summary

[2-3 paragraph high-level overview of current project state]

## What We Have

[Detailed breakdown of implemented features, infrastructure, and capabilities]

## What We Need

[Gap analysis: missing features, planned items, resource needs]

## Progress Metrics

[Quantitative progress if available: % complete, test coverage, etc.]

## Agent Assessments

### @agent-name Assessment

[Their view of the current state from their expertise]

...

## Recommended Next Steps

[Prioritized action items]
```
