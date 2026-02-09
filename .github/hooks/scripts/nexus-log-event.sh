#!/bin/bash
# =============================================================================
# Nexus Audit Logger — Copilot Hooks Event Handler
# =============================================================================
# Unified logging script for all Copilot hook events.
# Receives JSON input via stdin, writes structured JSONL to the audit log.
#
# Environment:
#   HOOK_EVENT  — Event type (sessionStart, sessionEnd, userPromptSubmitted,
#                 preToolUse, postToolUse, errorOccurred)
#
# Output:
#   .nexus/logs/audit.jsonl  — Append-only structured log (one JSON line per event)
#
# Dependencies: jq
# =============================================================================
set -euo pipefail

# ---------------------------------------------------------------------------
# Resolve repo root & paths (current workspace being worked on)
# ---------------------------------------------------------------------------
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")"
LOG_DIR="$REPO_ROOT/.nexus/logs"
AUDIT_LOG="$LOG_DIR/audit.jsonl"
SESSION_STATE="$LOG_DIR/.session-state"

mkdir -p "$LOG_DIR"

# ---------------------------------------------------------------------------
# Dependency check
# ---------------------------------------------------------------------------
if ! command -v jq &>/dev/null; then
  echo "[nexus-hooks] WARNING: jq not found — audit logging disabled" >&2
  exit 0
fi

# ---------------------------------------------------------------------------
# Read JSON input from stdin
# ---------------------------------------------------------------------------
INPUT="$(cat)"
EVENT="${HOOK_EVENT:-unknown}"

# ---------------------------------------------------------------------------
# Timestamp conversion (ms epoch → ISO 8601, macOS + Linux compatible)
# ---------------------------------------------------------------------------
TIMESTAMP="$(echo "$INPUT" | jq -r '.timestamp // empty')"
ISO_TS=""

if [[ -n "$TIMESTAMP" ]]; then
  # Use 10# prefix to force base 10 (decimal) and avoid "value too great for base"
  # though for timestamps it's unlikely to start with 0 unless it's very old,
  # but general safety is good.
  # However, the error message "2026-02-09T21: value too great for base (error token is "09T21")"
  # suggests something else.
  
  if [[ "$TIMESTAMP" =~ ^[0-9]+$ ]]; then
    TS_SEC=$((10#$TIMESTAMP / 1000))
    # macOS: date -r <epoch>   |   Linux: date -d @<epoch>
    ISO_TS="$(date -r "$TS_SEC" -u '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null \
           || date -d "@$TS_SEC" -u '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null \
           || echo "$TIMESTAMP")"
  else
    # If it's already a string like "2026-02-09T21..."
    ISO_TS="$TIMESTAMP"
  fi
fi

if [[ -z "$ISO_TS" ]]; then
  ISO_TS="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
fi

# ---------------------------------------------------------------------------
# Session ID management
# A session ID is generated at sessionStart and reused until sessionEnd.
# ---------------------------------------------------------------------------
get_session_id() {
  if [[ -f "$SESSION_STATE" ]]; then
    jq -r '.sessionId // empty' "$SESSION_STATE" 2>/dev/null || echo ""
  fi
}

set_session_state() {
  local sid="$1"
  local feature="${2:-}"
  jq -nc --arg sid "$sid" --arg feat "$feature" \
    '{sessionId: $sid, feature: $feat}' > "$SESSION_STATE"
}

update_feature() {
  local feature="$1"
  if [[ -f "$SESSION_STATE" ]]; then
    local sid
    sid="$(jq -r '.sessionId // ""' "$SESSION_STATE" 2>/dev/null || echo "")"
    set_session_state "$sid" "$feature"
  fi
}

get_current_feature() {
  if [[ -f "$SESSION_STATE" ]]; then
    jq -r '.feature // empty' "$SESSION_STATE" 2>/dev/null || echo ""
  fi
}

# ---------------------------------------------------------------------------
# Feature slug detection
# Scans text for references to .nexus/features/<slug>/ or known patterns.
# ---------------------------------------------------------------------------
detect_feature() {
  local text="$1"
  local slug=""

  # Pattern: .nexus/features/<slug>/
  slug="$(echo "$text" | grep -o '\.nexus/features/[^/]*' 2>/dev/null \
        | head -1 | sed 's|\.nexus/features/||' || echo "")"

  # Pattern: features/<slug>/ (without .nexus prefix)
  if [[ -z "$slug" ]]; then
    slug="$(echo "$text" | grep -o 'features/[a-z0-9_-]*/\(plan\|execution\|review\|summary\|timeline\)' 2>/dev/null \
          | head -1 | sed 's|features/||; s|/.*||' || echo "")"
  fi

  echo "$slug"
}

# ---------------------------------------------------------------------------
# Agent detection from runSubagent tool args
# ---------------------------------------------------------------------------
detect_agent() {
  local tool_name="$1"
  local tool_args="$2"

  if [[ "$tool_name" == "runSubagent" ]]; then
    echo "$tool_args" | jq -r '.agentName // empty' 2>/dev/null || echo ""
  else
    echo ""
  fi
}

# ---------------------------------------------------------------------------
# Build log entry by event type
# ---------------------------------------------------------------------------
SESSION_ID="$(get_session_id)"
FEATURE="$(get_current_feature)"

case "$EVENT" in

  # -------------------------------------------------------------------------
  sessionStart)
  # -------------------------------------------------------------------------
    SOURCE="$(echo "$INPUT" | jq -r '.source // .cwd // "unknown"')"   
    PROMPT="$(echo "$INPUT" | jq -r '.initialPrompt // .transcript_path // ""')"
    set_session_state "$SESSION_ID" ""

    # Detect feature from initial prompt
    FEATURE="$(detect_feature "$PROMPT")"
    if [[ -n "$FEATURE" ]]; then
      update_feature "$FEATURE"
    fi

    ENTRY="$(jq -nc \
      --arg ts "$ISO_TS" \
      --arg event "$EVENT" \
      --arg sid "$SESSION_ID" \
      --arg source "$SOURCE" \
      --arg prompt "$PROMPT" \
      --arg feature "$FEATURE" \
      '{ts: $ts, event: $event, sessionId: $sid, source: $source, prompt: $prompt, feature: $feature}')"
    ;;

  # -------------------------------------------------------------------------
  sessionEnd)
  # -------------------------------------------------------------------------
    REASON="$(echo "$INPUT" | jq -r '.reason // "unknown"')"

    ENTRY="$(jq -nc \
      --arg ts "$ISO_TS" \
      --arg event "$EVENT" \
      --arg sid "$SESSION_ID" \
      --arg reason "$REASON" \
      --arg feature "$FEATURE" \
      '{ts: $ts, event: $event, sessionId: $sid, reason: $reason, feature: $feature}')"

    # Clean up session state
    rm -f "$SESSION_STATE"
    ;;

  # -------------------------------------------------------------------------
  userPromptSubmitted)
  # -------------------------------------------------------------------------
    PROMPT="$(echo "$INPUT" | jq -r '.prompt // ""')"

    # Try to detect/update feature from prompt text
    DETECTED="$(detect_feature "$PROMPT")"
    if [[ -n "$DETECTED" ]]; then
      FEATURE="$DETECTED"
      update_feature "$FEATURE"
    fi

    ENTRY="$(jq -nc \
      --arg ts "$ISO_TS" \
      --arg event "$EVENT" \
      --arg sid "$SESSION_ID" \
      --arg prompt "$PROMPT" \
      --arg feature "$FEATURE" \
      '{ts: $ts, event: $event, sessionId: $sid, prompt: $prompt, feature: $feature}')"
    ;;

  # -------------------------------------------------------------------------
  preToolUse)
  # -------------------------------------------------------------------------
    TOOL_NAME="$(echo "$INPUT" | jq -r '.tool_name // "unknown"')"  
    TOOL_ARGS_RAW="$(echo "$INPUT" | jq -c '.tool_input // {}')"

    # tool_input is already a JSON object, not a string
    TOOL_ARGS_OBJ="$TOOL_ARGS_RAW"

    # Detect agent from runSubagent calls
    AGENT="$(detect_agent "$TOOL_NAME" "$TOOL_ARGS_OBJ")"
    # If not a subagent call, map tool name to agent role
    if [[ -z "$AGENT" ]]; then
      case "$TOOL_NAME" in
        run_in_terminal) AGENT="devops" ;;
        copilot_*eplace*|copilot_*dit*|copilot_*reate*) AGENT="software-developer" ;;
        copilot_*ead*|read_file|grep_search|semantic_search) AGENT="orchestrator" ;;
        get_errors|copilot_*test*) AGENT="qa-engineer" ;;
        *) AGENT="orchestrator" ;;
      esac
    fi

    # Extract a short description of what the tool is doing
    TOOL_DESC=""
    case "$TOOL_NAME" in
      *runSubagent*)
        TOOL_DESC="$(echo "$TOOL_ARGS_OBJ" | jq -r '.description // .prompt // empty' 2>/dev/null || echo "")"
        ;;
      run_in_terminal|bash)
        TOOL_DESC="$(echo "$TOOL_ARGS_OBJ" | jq -r '.command // .explanation // empty' 2>/dev/null | head -c 200 || echo "")"
        ;;
      copilot_*|edit*|create*|replace*)
        TOOL_DESC="$(echo "$TOOL_ARGS_OBJ" | jq -r '.filePath // .path // empty' 2>/dev/null || echo "")"
        ;;
      *)
        TOOL_DESC="$(echo "$TOOL_ARGS_OBJ" | jq -r 'keys | join(", ")' 2>/dev/null || echo "")"
        ;;
    esac

    # Detect feature from tool args
    DETECTED="$(detect_feature "$TOOL_ARGS_RAW")"
    if [[ -n "$DETECTED" ]]; then
      FEATURE="$DETECTED"
      update_feature "$FEATURE"
    fi

    ENTRY="$(jq -nc \
      --arg ts "$ISO_TS" \
      --arg event "$EVENT" \
      --arg sid "$SESSION_ID" \
      --arg tool "$TOOL_NAME" \
      --arg agent "$AGENT" \
      --arg desc "$TOOL_DESC" \
      --arg feature "$FEATURE" \
      '{ts: $ts, event: $event, sessionId: $sid, tool: $tool, agent: $agent, description: $desc, feature: $feature}')"
    ;;

  # -------------------------------------------------------------------------
  postToolUse)
  # -------------------------------------------------------------------------
    TOOL_NAME="$(echo "$INPUT" | jq -r '.tool_name // "unknown"')"  
    TOOL_ARGS_RAW="$(echo "$INPUT" | jq -c '.tool_input // {}')"  
    RESULT_TYPE="success"  
    RESULT_TEXT="$(echo "$INPUT" | jq -r '.tool_response // ""' | head -c 300)"

    # tool_input is already a JSON object
    TOOL_ARGS_OBJ="$TOOL_ARGS_RAW"
    AGENT="$(detect_agent "$TOOL_NAME" "$TOOL_ARGS_OBJ")"
    # If not a subagent call, map tool name to agent role
    if [[ -z "$AGENT" ]]; then
      case "$TOOL_NAME" in
        run_in_terminal) AGENT="devops" ;;
        copilot_*eplace*|copilot_*dit*|copilot_*reate*) AGENT="software-developer" ;;
        copilot_*ead*|read_file|grep_search|semantic_search) AGENT="orchestrator" ;;
        get_errors|copilot_*test*) AGENT="qa-engineer" ;;
        *) AGENT="orchestrator" ;;
      esac
    fi

    ENTRY="$(jq -nc \
      --arg ts "$ISO_TS" \
      --arg event "$EVENT" \
      --arg sid "$SESSION_ID" \
      --arg tool "$TOOL_NAME" \
      --arg agent "$AGENT" \
      --arg result "$RESULT_TYPE" \
      --arg detail "$RESULT_TEXT" \
      --arg feature "$FEATURE" \
      '{ts: $ts, event: $event, sessionId: $sid, tool: $tool, agent: $agent, result: $result, detail: $detail, feature: $feature}')"
    ;;

  # -------------------------------------------------------------------------
  errorOccurred)
  # -------------------------------------------------------------------------
    ERROR_MSG="$(echo "$INPUT" | jq -r '.error.message // "unknown error"')"
    ERROR_NAME="$(echo "$INPUT" | jq -r '.error.name // "Error"')"

    ENTRY="$(jq -nc \
      --arg ts "$ISO_TS" \
      --arg event "$EVENT" \
      --arg sid "$SESSION_ID" \
      --arg name "$ERROR_NAME" \
      --arg message "$ERROR_MSG" \
      --arg feature "$FEATURE" \
      '{ts: $ts, event: $event, sessionId: $sid, errorName: $name, errorMessage: $message, feature: $feature}')"
    ;;

  # -------------------------------------------------------------------------
  *)
  # -------------------------------------------------------------------------
    ENTRY="$(jq -nc \
      --arg ts "$ISO_TS" \
      --arg event "$EVENT" \
      --arg sid "$SESSION_ID" \
      '{ts: $ts, event: $event, sessionId: $sid}')"
    ;;
esac

# ---------------------------------------------------------------------------
# Write to audit log
# ---------------------------------------------------------------------------
echo "$ENTRY" >> "$AUDIT_LOG"

# ---------------------------------------------------------------------------
# Send to Pixel Office (if server is running)
# ---------------------------------------------------------------------------
PIXEL_OFFICE_PORT="${PIXEL_OFFICE_PORT:-3848}"
PIXEL_OFFICE_HOST="${PIXEL_OFFICE_HOST:-localhost}"

# Map hook events to Pixel Office chat events
map_to_chat_event() {
  local hook_event="$1"
  case "$hook_event" in
    sessionStart) echo "chat:start" ;;
    sessionEnd) echo "chat:complete" ;;
    userPromptSubmitted) echo "chat:message" ;;
    preToolUse) echo "chat:message" ;;
    postToolUse) echo "chat:complete" ;;
    errorOccurred) echo "chat:error" ;;
    *) echo "chat:message" ;;
  esac
}

# Map tool names to agent roles
map_tool_to_agent() {
  local tool_name="$1"
  local detected_agent="$2"
  
  # If runSubagent, use the detected agent
  if [[ -n "$detected_agent" ]]; then
    echo "$detected_agent"
    return
  fi
  
  # Map actual Copilot tool names to agents
  case "$tool_name" in
    run_in_terminal|bash) echo "devops" ;;
    copilot_*eplace*|copilot_*dit*|copilot_*reate*|create_file|edit_*) echo "software-developer" ;;
    copilot_*ead*|read_file|grep_search|semantic_search|file_search|list_*) echo "orchestrator" ;;
    get_errors|copilot_*test*) echo "qa-engineer" ;;
    copilot_runSubagent|runSubagent) echo "${detected_agent:-orchestrator}" ;;
    *) echo "orchestrator" ;;
  esac
}

# Build and send Pixel Office event (non-blocking, ignore failures)
send_pixel_office_event() {
  local chat_type
  chat_type="$(map_to_chat_event "$EVENT")"
  
  local agent_role="${AGENT:-orchestrator}"
  if [[ "$EVENT" == "preToolUse" || "$EVENT" == "postToolUse" ]]; then
    agent_role="$(map_tool_to_agent "$TOOL_NAME" "$AGENT")"
  fi
  
  local message="${TOOL_DESC:-$PROMPT}"
  [[ -z "$message" ]] && message="$EVENT"
  
  # Truncate message to 200 chars
  message="${message:0:200}"
  
  local payload
  payload="$(jq -nc \
    --arg type "$chat_type" \
    --arg sessionId "$SESSION_ID" \
    --arg agentRole "$agent_role" \
    --arg message "$message" \
    --argjson timestamp "$(date +%s)000" \
    '{type: $type, sessionId: $sessionId, agentRole: $agentRole, message: $message, timestamp: $timestamp}')"
  
  # Send non-blocking (timeout 1 second, background)
  curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$payload" \
    --connect-timeout 1 \
    --max-time 2 \
    "http://${PIXEL_OFFICE_HOST}:${PIXEL_OFFICE_PORT}/api/chat-event" \
    >/dev/null 2>&1 &
}

# Only send if not already disabled
if [[ "${PIXEL_OFFICE_DISABLED:-}" != "true" ]]; then
  send_pixel_office_event
fi
