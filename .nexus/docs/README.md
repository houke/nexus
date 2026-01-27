# Documentation Index

This directory contains guides and reference documentation for the Nexus workflow system.

## Quick Start

1. **Create a feature**: Run `nexus-planning` prompt
2. **Implement it**: Run `nexus-execution` prompt
3. **Review it**: Run `nexus-review` prompt
4. **Track progress**: Check `.nexus/toc.md`

## Structure

```
.nexus/
├── toc.md              # Master feature index (START HERE)
├── features/           # Feature folders (one per feature)
│   └── <feature-slug>/
│       ├── plan.md
│       ├── execution.md
│       ├── review.md
│       └── notes/
├── templates/          # Document templates
│   ├── plan.template.md
│   ├── execution.template.md
│   ├── review.template.md
│   └── summary.template.md
├── memory/             # Agent preference files
│   ├── architect.memory.md
│   ├── software-developer.memory.md
│   └── ...
└── docs/               # This directory - guides and reference
    ├── README.md
    └── workflow-guide.md
```

## Guides

| Guide                                            | Purpose                                      |
| ------------------------------------------------ | -------------------------------------------- |
| [workflow-guide.md](workflow-guide.md)           | How to use the feature-based workflow system |
| [../toc.md](../toc.md)                           | Master index of all features                 |
| [../templates/README.md](../templates/README.md) | How to use templates                         |

## Key Concepts

### Feature-Based Organization

All work is organized by **feature**, not by workflow phase:

- ✅ `features/user-auth/plan.md` - Auth feature plan
- ✅ `features/user-auth/execution.md` - Auth feature work log
- ❌ ~~`plan/0001-user-auth.md`~~ - Old phase-based approach

### Master TOC

The file `toc.md` is the single source of truth for all features:

| Feature   | Status   | Files                   | Agents           | Last Edited |
| --------- | -------- | ----------------------- | ---------------- | ----------- |
| user-auth | complete | plan, execution, review | @architect, @dev | 2026-01-26  |

### Workflow Prompts

| Prompt            | Creates                        | Updates              |
| ----------------- | ------------------------------ | -------------------- |
| `nexus-planning`  | `features/<slug>/plan.md`      | toc.md               |
| `nexus-execution` | `features/<slug>/execution.md` | plan status, toc.md  |
| `nexus-review`    | `features/<slug>/review.md`    | plan status, toc.md  |
| `nexus-summary`   | `features/<slug>/summary.md`   | toc.md               |
| `nexus-sync`      | Missing docs                   | All out-of-sync docs |

## See Also

- [AGENTS.md](../../AGENTS.md) - Full project documentation
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md) - Copilot custom instructions
- [.github/prompts/](../../.github/prompts/) - Workflow prompt files
