# Feature Folder Template

When creating a new feature, create a folder with this structure:

```
.nexus/features/<feature-slug>/
├── plan.md           # From templates/plan.template.md
├── execution.md      # From templates/execution.template.md (created during execution)
├── review.md         # From templates/review.template.md (created during review)
├── summary.md        # From templates/summary.template.md (optional)
└── notes/            # Additional research, sketches, references
    └── .gitkeep
```

## Naming Convention

Use kebab-case for feature slugs:

- `user-authentication`
- `snake-game`
- `data-sync-engine`
- `pinterest-clone`

## Workflow

1. **Planning**: Copy `plan.template.md` → `<feature>/plan.md`
2. **Execution**: Copy `execution.template.md` → `<feature>/execution.md`
3. **Review**: Copy `review.template.md` → `<feature>/review.md`
4. **Summary**: Copy `summary.template.md` → `<feature>/summary.md`

## Remember

- Update `.nexus/toc.md` when creating a new feature
- Keep all feature documents in the feature folder
- Use `notes/` for supporting materials
