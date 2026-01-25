# Document Index (TOC System)

This directory contains Table of Contents (TOC) files that track all documents related to each feature.

## How It Works

When you start executing a plan, a TOC file is created here that links to:
- The original plan document
- Execution logs
- Review reports
- Status summaries

## File Naming

TOC files are named after the feature they track:

```
snake-game.toc.md       # All docs for the snake game feature
user-auth.toc.md        # All docs for authentication
pinterest-clone.toc.md  # All docs for a Pinterest clone
```

## When TOC Files Are Created

| Workflow | Action |
|----------|--------|
| `project-execution` | Creates the TOC file |
| `project-review` | Adds review links |
| `project-summary` | Adds summary links |
| `project-sync` | Creates missing TOCs |

## Benefits

- **Single source of truth** for all feature documentation
- **Easy navigation** between related documents
- **Timeline tracking** of project progress
- **No orphaned documents** - everything is linked

## See Also

- [AGENTS.md](/AGENTS.md) - Full project documentation
- [.github/copilot-instructions.md](/.github/copilot-instructions.md) - Copilot custom instructions
