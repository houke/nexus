# Nexus Copilot Hooks

This folder contains Copilot Hooks that automatically log all agent activity to a structured audit trail.

## Setup

### 1. Set the `NEXUS_ROOT` environment variable

Add this to your shell profile (`~/.zshrc`, `~/.bashrc`, or `~/.bash_profile`):

```bash
export NEXUS_ROOT="$HOME/Apps/nexus"  # Adjust to wherever you cloned this repo
```

Then reload your shell:

```bash
source ~/.zshrc  # or ~/.bashrc
```

### 2. Configure VS Code to use the hooks

Add this to your **VS Code User Settings** (`Cmd+Shift+P` → "Preferences: Open User Settings (JSON)"):

```json
{
  "github.copilot.chat.hookFilesLocations": ["${env:NEXUS_ROOT}/.github/hooks"]
}
```

Or use the full path if `${env:NEXUS_ROOT}` doesn't expand:

```json
{
  "github.copilot.chat.hookFilesLocations": [
    "/Users/YOUR_USERNAME/location/to/nexus/.github/hooks"
  ]
}
```

### 3. Restart VS Code

**Critical**: After setting `NEXUS_ROOT` in your shell profile, you must **fully quit and restart VS Code** (not just reload window) for it to inherit the environment variable.

### 4. Verify it works

After your next Copilot session, check for the audit log:

```bash
cat .nexus/logs/audit.jsonl
```

## What Gets Logged

Every Copilot session automatically logs to `.nexus/logs/audit.jsonl` in the **current repository** you're working in:

- Session start/end
- Every user prompt
- Every tool invocation (with auto-detected agent names for `runSubagent`)
- Tool results
- Errors

## Viewing Timelines

```bash
# Full audit timeline
${NEXUS_ROOT}/.github/hooks/scripts/nexus-render-timeline.sh

# Feature-specific timeline
${NEXUS_ROOT}/.github/hooks/scripts/nexus-render-timeline.sh --feature <slug>

# Save feature timeline to file
${NEXUS_ROOT}/.github/hooks/scripts/nexus-render-timeline.sh --feature <slug> --save
```

## Requirements

- **jq**: Install with `brew install jq` (macOS) or `apt install jq` (Linux)
- **Git repository**: The hooks work best in git repos (uses `git rev-parse` to find the root)

## Troubleshooting

**"bash: /.github/hooks/scripts/nexus-log-event.sh: No such file or directory"**:

- This means `NEXUS_ROOT` is not set in VS Code's environment
- Verify in VS Code's terminal: `echo $NEXUS_ROOT` (should show full path)
- If empty, add `export NEXUS_ROOT=...` to your shell profile AND **fully quit/restart VS Code**
- On macOS, VS Code must be restarted to inherit new environment variables

**"line 63: 2026-02-09T21: value too great for base"**:

- This was a bash arithmetic bug, fixed in recent commits
- Pull the latest version of the scripts

**"Command not found" errors**:

- Verify `NEXUS_ROOT` is set: `echo $NEXUS_ROOT`
- Make sure the scripts are executable: `chmod +x ${NEXUS_ROOT}/.github/hooks/scripts/*.sh`

**No audit log appearing**:

- Check `jq` is installed: `which jq`
- Verify `hookFilesLocations` is set correctly in User Settings (not workspace)
- Restart VS Code after changing settings

**Hooks work in Nexus repo but not in other repos**:

- This is expected if `NEXUS_ROOT` is not visible to VS Code
- The hook config uses `${NEXUS_ROOT}` to find scripts
- Make sure you've fully quit and restarted VS Code after setting the env var
