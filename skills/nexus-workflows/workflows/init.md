# Nexus Initialization Orchestrator

> Part of the `nexus-workflows` skill. Invoked by the Nexus orchestrator.

> **ORCHESTRATOR ONLY**: This prompt is designed exclusively for the **@Nexus** agent. If you are not **@Nexus**, please delegate this task to them.

You are the **Initialization Orchestrator**. Your role is to ensure a downstream repository has the minimal Nexus scaffolding required by the orchestrator. Agents, skills, and templates are provided by the installed Nexus plugin, so the init workflow only needs to ensure `.nexus/` and `AGENTS.md` exist with the expected baseline structure.

> **Important**: This workflow is for repositories that want to use Nexus, not for the Nexus source repository itself.

## Initialization Process

Follow these steps in order:

### Step 1: Ensure .nexus Directory Structure

Create or repair the project-specific Nexus scaffolding:

```bash
echo "📁 Creating .nexus directory structure..."

# Create directories
mkdir -p .nexus/features
mkdir -p .nexus/memory
mkdir -p .nexus/tmp
touch .nexus/features/.gitkeep
echo "✅ Created .nexus directories"

# Create TOC
cat > .nexus/toc.md << 'EOF'
# Feature Index

This is the master feature index for the project. All features are tracked here.

| Feature | Status | Files | Agents | Last Edited |
|---------|--------|-------|--------|-------------|
| _example | draft | plan | @architect | YYYY-MM-DD |

## Status Values

- `draft` - Planned but not started
- `in-progress` - Currently being implemented
- `review` - Implementation complete, under review
- `complete` - Reviewed and finished
- `on-hold` - Paused
- `archived` - No longer relevant
EOF
echo "✅ Created toc.md"

# Create empty agent memory files
for agent in architect business-analyst devops gamer nexus product-manager qa-engineer security seo-specialist software-developer tech-lead ux-designer visual-designer; do
  touch ".nexus/memory/${agent}.memory.md"
done
echo "✅ Ensured agent memory files"
```

### Step 2: Update .gitignore

Add Nexus-specific ignore rules to .gitignore:

```bash
# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
  touch .gitignore
  echo "Created .gitignore"
fi
```

Use the edit tool to add these rules:

```gitignore
# Nexus temporary files
.nexus/**/tmp/
.nexus/**/*.tmp
.nexus/**/temp/

# Nexus local caches
.nexus/**/.cache/

# Agent memory backups (keep originals)
.nexus/memory/*.backup.md
```

### Step 3: Create AGENTS.md

Create AGENTS.md only if the repository does not already have one:

```bash
if [ ! -f "AGENTS.md" ]; then
  cat > AGENTS.md << 'EOF'
# AGENTS.md

If you encounter something surprising or confusing in this project, flag it as a comment.
EOF
  echo "✅ Created AGENTS.md"
else
  echo "ℹ️ AGENTS.md already exists; leaving it unchanged"
fi
```

### Step 4: Initialize Git Tracking

Ensure the new files are tracked:

```bash
git add .nexus/ AGENTS.md .gitignore
echo "✅ Staged: .nexus/, AGENTS.md, .gitignore"

# Show what's being added
git status

echo ""
echo "💡 Suggested commit message:"
echo "chore: initialize Nexus project scaffolding"
```

### Step 5: Verification & Next Steps

Run final verification:

```bash
echo "🔍 Final verification..."

[ -d ".nexus" ] && echo "✅ .nexus directory exists"
[ -d ".nexus/features" ] && echo "✅ features/ directory exists"
[ -d ".nexus/memory" ] && echo "✅ memory/ directory exists"
[ -f ".nexus/features/.gitkeep" ] && echo "✅ features/.gitkeep exists"
[ -d ".nexus/tmp" ] && echo "✅ tmp/ directory exists"
[ -f ".nexus/toc.md" ] && echo "✅ toc.md exists"
[ -f "AGENTS.md" ] && echo "✅ AGENTS.md exists"
[ -f ".nexus/memory/nexus.memory.md" ] && echo "✅ agent memory files exist"
```

Provide user with next steps:

```markdown
## ✅ Nexus Initialization Complete!

### Next Steps

1. **Commit the changes**: `git commit -m "chore: initialize Nexus project scaffolding"`

2. **Start using Nexus**:
  - **Plan a feature**: `/nexus-workflows plan` or invoke `@nexus`
  - **Execute work**: `/nexus-workflows execute`
  - **Review code**: `/nexus-workflows review`
  - **Get project status**: `/nexus-workflows summary`

3. **Understand scope**:

- `/nexus-workflows init` is for downstream repositories that adopt Nexus
- The Nexus source repository itself does not need to be initialized by Nexus

4. **Customize agents**: Edit the files in `.nexus/memory/` with repository-specific preferences
```

## Mandatory User Satisfaction Verification

**AFTER** completing all initialization steps, verify user satisfaction using `ask_questions` tool:

```javascript
ask_questions({
  questions: [
    {
      header: 'Satisfied?',
      question:
        "Is the Nexus initialization guidance correct for this downstream repository? (Select 'Other' to provide specific feedback)",
      allowFreeformInput: true,
      options: [
        { label: 'Yes, looks perfect!' },
        { label: 'Almost there, minor adjustments needed' },
      ],
    },
  ],
});
```

### Handling User Feedback

- **If user selects "Yes"**: Initialization is complete
- **If user provides feedback (Other/free input)**:
  1. Analyze the feedback to understand what's missing or incorrect
  2. Make the necessary adjustments
  3. Re-run verification
  4. Ask satisfaction question again
  5. Repeat until user is satisfied

## Troubleshooting

### If MCP Servers Don't Load

```markdown
**After initialization, reload VS Code if you are using the plugin surface**:

1. Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
2. Type "Reload Window"
3. Press Enter

Plugin-scoped MCP servers will be activated on reload.
```

### If Git Tracking Issues

```bash
# If files not tracked properly
git add -f .nexus/ AGENTS.md .gitignore
```

## Important Notes

- Agent memory files are initialized empty for the new repository
- The features folder includes a `.gitkeep` so the scaffold survives in git before the first feature is created
- The toc.md starts empty, ready for first feature tracking
- `/nexus-workflows init` is for downstream repositories that want Nexus scaffolding; it is not intended for the Nexus source repository
