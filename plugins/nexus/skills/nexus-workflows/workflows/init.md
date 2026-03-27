# Nexus Initialization Orchestrator

> Part of the `nexus-workflows` skill. Invoked by the Nexus orchestrator.

> **ORCHESTRATOR ONLY**: This prompt is designed exclusively for the **@Nexus** agent. If you are not **@Nexus**, please delegate this task to them.

You are the **Initialization Orchestrator**. Your role is to set up a new repository with the Nexus multi-agent orchestration system. Agents, skills, and templates are provided by the installed Nexus plugin — the init workflow only needs to create the lightweight project scaffolding.

## Initialization Process

Follow these steps in order:

### Step 1: Create .nexus Directory Structure

Create the project-specific Nexus scaffolding:

```bash
echo "📁 Creating .nexus directory structure..."

# Create directories
mkdir -p .nexus/features
mkdir -p .nexus/memory
mkdir -p .nexus/tmp
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

Create a simple AGENTS.md at the repository root:

```bash
cat > AGENTS.md << 'EOF'
# AGENTS.md

If you encounter something surprising or confusing in this project, flag it as a comment.
EOF
echo "✅ Created AGENTS.md"
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
echo "chore: Initialize Nexus multi-agent orchestration system"
```

### Step 5: Verification & Next Steps

Run final verification:

```bash
echo "🔍 Final verification..."

[ -d ".nexus" ] && echo "✅ .nexus directory exists"
[ -d ".nexus/features" ] && echo "✅ features/ directory exists"
[ -d ".nexus/memory" ] && echo "✅ memory/ directory exists"
[ -d ".nexus/tmp" ] && echo "✅ tmp/ directory exists"
[ -f ".nexus/toc.md" ] && echo "✅ toc.md exists"
[ -f "AGENTS.md" ] && echo "✅ AGENTS.md exists"
```

Provide user with next steps:

```markdown
## ✅ Nexus Initialization Complete!

### Next Steps

1. **Commit the changes**:
   ```bash
   git commit -m "chore: Initialize Nexus multi-agent orchestration system"
   ```

2. **Start using Nexus**:
   - **Plan a feature**: `/plan` or invoke `@nexus`
   - **Execute work**: `/execute`
   - **Review code**: `/review`
   - **Get project status**: `/summary`

3. **Customize agents**: Create memory files in `.nexus/memory/` with preferences
```

## Mandatory User Satisfaction Verification

**AFTER** completing all initialization steps, verify user satisfaction using `ask_questions` tool:

```javascript
ask_questions({
  questions: [
    {
      header: 'Satisfied?',
      question:
        "Is the Nexus system initialized correctly in your repository? (Select 'Other' to provide specific feedback)",
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
**After initialization, reload VS Code**:

1. Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
2. Type "Reload Window"
3. Press Enter

MCP servers will be activated on reload.
```

### If Git Tracking Issues

```bash
# If files not tracked properly
git add -f .nexus/ AGENTS.md .gitignore
```

## Important Notes

- Agent memory files are initialized empty for the new repository
- The toc.md starts empty, ready for first feature tracking
