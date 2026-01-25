# Custom Instructions for GitHub Copilot

These instructions apply to all interactions with GitHub Copilot in this repository.

## Agent Memory System

This repository uses a persistent memory system for agents. Each agent has a memory file in `.nexus/memory/` that stores user preferences, patterns, and learned behaviors.

### Memory Files Location

```
.nexus/memory/
├── architect.memory.md
├── devops.memory.md
├── gamer.memory.md
├── product-manager.memory.md
├── qa-engineer.memory.md
├── security.memory.md
├── software-developer.memory.md
├── tech-lead.memory.md
├── ux-designer.memory.md
└── visual-designer.memory.md
```

### Reading Agent Memory

**REQUIRED**: Before starting any task, agents MUST read their memory file to check for user preferences:

```bash
# Example: software-developer reading their memory
cat .nexus/memory/software-developer.memory.md
```

Apply any recorded preferences to your work. If a user previously said "work mobile-first", honor that in all implementations.

### Updating Agent Memory

When a user says phrases like:
- "remember to..."
- "always..."
- "never..."
- "please remember..."
- "from now on..."
- "going forward..."

The addressed agent MUST update their memory file.

#### Memory Update Format

Add a new entry under the appropriate section in the agent's memory file:

```markdown
### [Descriptive Title]
- **Preference**: [What to remember]
- **Reason**: [Why, if provided]
- **Added**: [YYYY-MM-DD]
```

#### Example Memory Update

User: "@software-developer please remember to work mobile-first"

Add to `.nexus/memory/software-developer.memory.md`:

```markdown
## Project Preferences

### Mobile-First Development
- **Preference**: Always implement mobile-first, starting with mobile breakpoints
- **Reason**: User preference for responsive design starting from smallest screens
- **Added**: 2026-01-25
```

### Memory Categories

Each memory file has sections for different types of preferences:

| Agent | Categories |
|-------|------------|
| architect | Project Preferences, Architecture Patterns, Technology Choices, Constraints |
| devops | Project Preferences, CI/CD Preferences, Deployment Targets, Security Configs |
| gamer | Project Preferences, Gamification Patterns, Reward Systems, Psychology Notes |
| product-manager | Project Preferences, User Personas, Priority Guidelines, Success Metrics |
| qa-engineer | Project Preferences, Testing Priorities, Known Edge Cases, A11y Requirements |
| security | Project Preferences, Security Requirements, Compliance Standards, Vulnerabilities |
| software-developer | Project Preferences, Coding Standards, Tech Preferences, Patterns (Follow/Avoid) |
| tech-lead | Project Preferences, Code Quality Standards, Architecture Decisions, Refactoring |
| ux-designer | Project Preferences, User Flow Patterns, Interaction Guidelines, A11y Standards |
| visual-designer | Project Preferences, Color Palette, Typography, Animation Guidelines, Design System |

### Memory Persistence Rules

1. **Never delete** existing memory entries unless explicitly asked
2. **Update** entries if new information supersedes old
3. **Categorize** entries appropriately
4. **Date** all entries for context
5. **Be specific** - vague memories are useless

### Conflict Resolution

If a new preference conflicts with an existing one:
1. Ask the user for clarification
2. If confirmed, update the old entry (don't duplicate)
3. Note the change in the entry

## Document Tracking (TOC System)

This repository tracks all documents related to a feature using TOC (Table of Contents) files.

### When TOC Files Are Created

A TOC file is created when execution begins on a plan (via `project-execution` prompt).

### TOC File Naming

Files are named based on the feature being built:
- `snake-game.toc.md` - Building a snake game
- `user-auth.toc.md` - Authentication feature
- `pinterest-clone.toc.md` - Pinterest clone app

### TOC Updates

All workflow prompts (execution, review, summary) MUST update the relevant TOC file when creating documents.

## General Guidelines

1. **Read AGENTS.md** at project root for full context
2. **Check memory** before starting work
3. **Update memory** when instructed to remember
4. **Track documents** in TOC files
5. **Follow safety rules** - never delete `.nexus/`, `.github/`, or `.vscode/`
