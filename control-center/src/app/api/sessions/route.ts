import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

type JsonRecord = Record<string, unknown>;

type SessionFlowNode = {
  id: string;
  label: string;
  kind: 'user' | 'agent' | 'system' | 'subagent' | 'tool' | 'bundle';
  step: number;
  column: number;
};

type SessionFlowEdge = {
  from: string;
  to: string;
};

type SessionEvent = {
  ts: string;
  event: string;
  sessionId: string;
  agent?: string;
  tool?: string;
  description?: string;
  detail?: string;
  prompt?: string;
  result?: string;
  reason?: string;
  errorName?: string;
  errorMessage?: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
};

type SessionRecord = {
  id: string;
  project: string;
  projectPath: string;
  startTime: string;
  endTime: string | null;
  lastActivity: string;
  status: 'active' | 'completed' | 'inactive';
  title: string | null;
  prompt: string | null;
  transcriptFile: string | null;
  agents: string[];
  models: string[];
  flow: {
    nodes: SessionFlowNode[];
    edges: SessionFlowEdge[];
    stepCount: number;
  };
  summary: {
    eventCount: number;
    userPromptCount: number;
    agentCount: number;
    modelCount: number;
    toolCalls: number;
    successfulToolCalls: number;
    failedToolCalls: number;
    errors: number;
    averageToolLatencyMs: number | null;
    maxToolLatencyMs: number | null;
    eventTypeCounts: Record<string, number>;
  };
  diagnostics: {
    turns: {
      count: number | null;
      source: 'reported' | 'inferred' | 'unavailable';
    };
    tokens: {
      input: number | null;
      output: number | null;
      total: number | null;
      source: 'reported' | 'supplemented' | 'unavailable';
    };
    toolCallsReported: number | null;
    availableSignals: string[];
    unavailableSignals: string[];
  };
  events: SessionEvent[];
};

/* ---------- Utilities ---------- */

function parseJsonLine(line: string): JsonRecord | null {
  try {
    const parsed = JSON.parse(line);
    return parsed && typeof parsed === 'object' ? (parsed as JsonRecord) : null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function setPatchedValue(
  target: JsonRecord,
  pathParts: Array<string | number>,
  value: unknown,
  mode: 'set' | 'append',
) {
  if (pathParts.length === 0) return;

  let current: unknown = target;

  for (let i = 0; i < pathParts.length - 1; i += 1) {
    const key = pathParts[i];
    const nextKey = pathParts[i + 1];

    if (Array.isArray(current)) {
      const idx = Number(key);
      if (!Number.isInteger(idx)) return;
      if (current[idx] === undefined) {
        current[idx] = typeof nextKey === 'number' ? [] : ({} as JsonRecord);
      }
      current = current[idx];
      continue;
    }

    if (!isRecord(current)) return;

    if ((current as JsonRecord)[key as string] === undefined) {
      (current as JsonRecord)[key as string] =
        typeof nextKey === 'number' ? [] : ({} as JsonRecord);
    }
    current = (current as JsonRecord)[key as string];
  }

  const lastKey = pathParts[pathParts.length - 1];

  if (Array.isArray(current)) {
    const idx = Number(lastKey);
    if (!Number.isInteger(idx)) return;

    if (mode === 'append' && Array.isArray(value)) {
      const existing = current[idx];
      if (Array.isArray(existing)) {
        existing.push(...value);
      } else if (existing === undefined) {
        current[idx] = [...value];
      } else {
        current[idx] = [existing, ...value];
      }
      return;
    }

    current[idx] = value;
    return;
  }

  if (!isRecord(current)) return;

  if (mode === 'append' && Array.isArray(value)) {
    const existing = (current as JsonRecord)[lastKey as string];
    if (Array.isArray(existing)) {
      existing.push(...value);
    } else if (existing === undefined) {
      (current as JsonRecord)[lastKey as string] = [...value];
    } else {
      (current as JsonRecord)[lastKey as string] = [existing, ...value];
    }
    return;
  }

  (current as JsonRecord)[lastKey as string] = value;
}

function str(obj: unknown, key: string): string | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function num(obj: unknown, key: string): number | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

function deepStr(obj: unknown, ...keys: string[]): string | undefined {
  let cur: unknown = obj;
  for (const k of keys) {
    if (!isRecord(cur)) return undefined;
    cur = (cur as JsonRecord)[k];
  }
  return typeof cur === 'string' && cur.length > 0 ? cur : undefined;
}

/* ---------- JSONL Patch Parser ---------- */

function parseChatSessionFile(filePath: string): JsonRecord | null {
  try {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
    const state: JsonRecord = {};

    for (const line of lines) {
      const entry = parseJsonLine(line);
      if (!entry) continue;

      const kind = num(entry, 'kind');

      if (kind === 0 && isRecord(entry.v)) {
        for (const [key, value] of Object.entries(entry.v as JsonRecord)) {
          state[key] = value;
        }
        continue;
      }

      const keyPath = entry.k;
      if (!Array.isArray(keyPath)) continue;

      const pathParts = (keyPath as unknown[]).filter(
        (part): part is string | number =>
          typeof part === 'string' || typeof part === 'number',
      );
      if (pathParts.length === 0) continue;

      setPatchedValue(state, pathParts, entry.v, kind === 2 ? 'append' : 'set');
    }

    return state;
  } catch {
    return null;
  }
}

/* ---------- VS Code Workspace Discovery ---------- */

function getWorkspaceStorageRoots(): string[] {
  const home = os.homedir();
  const roots: string[] = [];

  for (const variant of ['Code', 'Code - Insiders']) {
    const dir = path.join(
      home,
      'Library',
      'Application Support',
      variant,
      'User',
      'workspaceStorage',
    );
    if (fs.existsSync(dir)) {
      roots.push(dir);
    }
  }

  return roots;
}

type WorkspaceInfo = {
  storageDir: string;
  projectPath: string;
  projectName: string;
};

function discoverWorkspaces(
  storageRoots: string[],
  filterDirs: string[],
): WorkspaceInfo[] {
  const workspaces: WorkspaceInfo[] = [];

  for (const root of storageRoots) {
    let entries: string[];
    try {
      entries = fs.readdirSync(root);
    } catch {
      continue;
    }

    for (const hash of entries) {
      const storageDir = path.join(root, hash);
      const wsFile = path.join(storageDir, 'workspace.json');

      try {
        const stat = fs.statSync(storageDir);
        if (!stat.isDirectory()) continue;
      } catch {
        continue;
      }

      if (!fs.existsSync(wsFile)) continue;

      try {
        const wsJson = JSON.parse(fs.readFileSync(wsFile, 'utf8'));
        const folderUri: string | undefined = wsJson?.folder;
        if (!folderUri || !folderUri.startsWith('file:///')) continue;

        const projectPath = decodeURIComponent(folderUri.slice(7));
        const projectName = path.basename(projectPath);

        if (filterDirs.length > 0) {
          const matches = filterDirs.some((dir) => projectPath.startsWith(dir));
          if (!matches) continue;
        }

        const sessionsDir = path.join(storageDir, 'chatSessions');
        if (!fs.existsSync(sessionsDir)) continue;

        workspaces.push({ storageDir, projectPath, projectName });
      } catch {
        continue;
      }
    }
  }

  return workspaces;
}

/* ---------- Session Data Extraction ---------- */

type ParsedRequest = {
  timestamp: string | null;
  agent: string | null;
  modelId: string | null;
  messageText: string | null;
  promptTokens: number | null;
  outputTokens: number | null;
  totalElapsedMs: number | null;
  firstProgressMs: number | null;
  toolCalls: Array<{ name: string; id: string }>;
  toolCallRoundCount: number;
  hasError: boolean;
  errorMessage: string | null;
};

function extractRequests(state: JsonRecord): ParsedRequest[] {
  const requests = state.requests;
  if (!Array.isArray(requests)) return [];

  const results: ParsedRequest[] = [];

  for (const req of requests) {
    if (!isRecord(req)) continue;

    const result = isRecord(req.result) ? req.result : {};
    const metadata = isRecord((result as JsonRecord).metadata)
      ? ((result as JsonRecord).metadata as JsonRecord)
      : {};
    const timings = isRecord((result as JsonRecord).timings)
      ? ((result as JsonRecord).timings as JsonRecord)
      : {};
    const message = isRecord(req.message) ? req.message : {};

    const toolCalls: ParsedRequest['toolCalls'] = [];
    let toolCallRoundCount = 0;

    const rounds = (metadata as JsonRecord).toolCallRounds;
    if (Array.isArray(rounds)) {
      toolCallRoundCount = rounds.length;
      for (const round of rounds) {
        if (!isRecord(round)) continue;
        const calls = (round as JsonRecord).toolCalls;
        if (!Array.isArray(calls)) continue;
        for (const call of calls) {
          if (!isRecord(call)) continue;
          toolCalls.push({
            name: str(call, 'name') ?? 'unknown',
            id: str(call, 'id') ?? '',
          });
        }
      }
    }

    const errorDetails = (result as JsonRecord).errorDetails;
    const hasError = errorDetails != null && errorDetails !== false;
    let errorMessage: string | null = null;
    if (isRecord(errorDetails)) {
      errorMessage =
        str(errorDetails, 'message') ?? str(errorDetails, 'error') ?? null;
    } else if (typeof errorDetails === 'string') {
      errorMessage = errorDetails;
    }

    // Count tool invocations from response as fallback
    let responseToolCount = 0;
    const response = req.response;
    if (Array.isArray(response)) {
      for (const part of response) {
        if (
          isRecord(part) &&
          (part as JsonRecord).kind === 'toolInvocationSerialized'
        ) {
          responseToolCount++;
        }
      }
    }

    // Use toolCallRounds when available, fall back to response parts
    const finalToolCalls =
      toolCalls.length > 0
        ? toolCalls
        : Array.from({ length: responseToolCount }, (_, i) => ({
            name: 'tool',
            id: `resp-${i}`,
          }));

    results.push({
      timestamp: str(req, 'timestamp') ?? null,
      agent: str(req, 'agent') ?? null,
      modelId: str(req, 'modelId') ?? null,
      messageText: str(message as JsonRecord, 'text') ?? null,
      promptTokens: num(metadata as JsonRecord, 'promptTokens') ?? null,
      outputTokens: num(metadata as JsonRecord, 'outputTokens') ?? null,
      totalElapsedMs: num(timings as JsonRecord, 'totalElapsed') ?? null,
      firstProgressMs: num(timings as JsonRecord, 'firstProgress') ?? null,
      toolCalls: finalToolCalls,
      toolCallRoundCount:
        toolCallRoundCount > 0
          ? toolCallRoundCount
          : responseToolCount > 0
            ? 1
            : 0,
      hasError,
      errorMessage,
    });
  }

  return results;
}

/* ---------- Event Synthesis ---------- */

function synthesizeEvents(
  sessionId: string,
  creationDate: string,
  requests: ParsedRequest[],
): SessionEvent[] {
  const events: SessionEvent[] = [];

  events.push({
    ts: creationDate,
    event: 'sessionStart',
    sessionId,
    description: 'Chat session opened',
  });

  for (const req of requests) {
    const ts = req.timestamp
      ? new Date(Number(req.timestamp)).toISOString()
      : creationDate;

    events.push({
      ts,
      event: 'userPromptSubmitted',
      sessionId,
      prompt: req.messageText ?? undefined,
      agent: req.agent ?? undefined,
      model: req.modelId ?? undefined,
    });

    for (const tc of req.toolCalls) {
      events.push({
        ts,
        event: 'preToolUse',
        sessionId,
        tool: tc.name,
        agent: req.agent ?? undefined,
        description: tc.name,
      });
    }

    if (req.hasError && req.errorMessage) {
      events.push({
        ts,
        event: 'errorOccurred',
        sessionId,
        errorName: 'RequestError',
        errorMessage: req.errorMessage,
      });
    }

    if (req.promptTokens !== null || req.outputTokens !== null) {
      events.push({
        ts,
        event: 'turnComplete',
        sessionId,
        model: req.modelId ?? undefined,
        inputTokens: req.promptTokens ?? undefined,
        outputTokens: req.outputTokens ?? undefined,
        detail: req.totalElapsedMs
          ? `Completed in ${(req.totalElapsedMs / 1000).toFixed(1)}s`
          : 'Turn completed',
      });
    }
  }

  return events;
}

/* ---------- Flow Builder ---------- */

function getFlowNodeKind(toolName: string): SessionFlowNode['kind'] {
  if (toolName === 'runSubagent') return 'subagent';
  if (
    toolName.startsWith('multi_tool_use.') ||
    toolName.includes('parallel') ||
    toolName.includes('bundle')
  ) {
    return 'bundle';
  }
  return 'tool';
}

function getFlowLabel(toolName: string): string {
  if (toolName === 'runSubagent') return 'Subagent';
  if (toolName.startsWith('multi_tool_use.'))
    return toolName.replace('multi_tool_use.', 'bundle: ');
  return toolName;
}

function buildFlow(requests: ParsedRequest[]) {
  const steps: Array<{
    nodes: Array<{ id: string; label: string; kind: SessionFlowNode['kind'] }>;
  }> = [];

  let nodeId = 0;

  steps.push({
    nodes: [{ id: 'start', label: 'Session start', kind: 'system' }],
  });

  for (let i = 0; i < requests.length; i++) {
    const req = requests[i];

    const promptText =
      req.messageText && req.messageText.length > 40
        ? `${req.messageText.slice(0, 38)}…`
        : (req.messageText ?? 'Prompt');
    steps.push({
      nodes: [{ id: `user-${nodeId++}`, label: promptText, kind: 'user' }],
    });

    if (req.agent) {
      steps.push({
        nodes: [
          {
            id: `agent-${nodeId++}`,
            label: req.agent,
            kind: 'agent',
          },
        ],
      });
    }

    // Group tool calls by round to show parallelism
    if (req.toolCalls.length > 0) {
      // For simplicity, show all tools in a request as one parallel step
      const toolNodes = req.toolCalls.slice(0, 8).map((tc) => ({
        id: `tool-${nodeId++}`,
        label: getFlowLabel(tc.name),
        kind: getFlowNodeKind(tc.name),
      }));

      if (req.toolCalls.length > 8) {
        toolNodes.push({
          id: `tool-${nodeId++}`,
          label: `+${req.toolCalls.length - 8} more`,
          kind: 'bundle' as const,
        });
      }

      steps.push({ nodes: toolNodes });
    }

    if (req.hasError) {
      steps.push({
        nodes: [
          {
            id: `error-${nodeId++}`,
            label: 'Error',
            kind: 'system',
          },
        ],
      });
    }
  }

  const flatNodes: SessionFlowNode[] = [];
  const flatEdges: SessionFlowEdge[] = [];
  let prevStepNodeIds: string[] = [];

  steps.forEach((step, stepIndex) => {
    const currentIds: string[] = [];
    step.nodes.forEach((node, colIndex) => {
      flatNodes.push({ ...node, step: stepIndex, column: colIndex });
      currentIds.push(node.id);
    });
    for (const fromId of prevStepNodeIds) {
      for (const toId of currentIds) {
        flatEdges.push({ from: fromId, to: toId });
      }
    }
    prevStepNodeIds = currentIds;
  });

  return {
    nodes: flatNodes,
    edges: flatEdges,
    stepCount: steps.length,
  };
}

/* ---------- Session Builder ---------- */

function buildSession(
  state: JsonRecord,
  workspace: WorkspaceInfo,
): SessionRecord | null {
  const sessionId = str(state, 'sessionId');
  if (!sessionId) return null;

  const creationMs = num(state, 'creationDate');
  const creationDate = creationMs
    ? new Date(creationMs).toISOString()
    : new Date().toISOString();

  const title = str(state, 'customTitle') ?? str(state, 'title') ?? null;

  const requests = extractRequests(state);

  const firstPrompt = requests[0]?.messageText ?? null;

  const agents = Array.from(
    new Set(
      requests
        .map((r) => r.agent)
        .filter((a): a is string => a !== null && a.length > 0),
    ),
  );

  const models = new Set<string>();
  const selectedModel = deepStr(
    state,
    'inputState',
    'selectedModel',
    'identifier',
  );
  if (selectedModel) models.add(selectedModel);
  for (const req of requests) {
    if (req.modelId) models.add(req.modelId);
  }

  // Tokens
  let totalInput = 0;
  let totalOutput = 0;
  let hasTokens = false;

  for (const req of requests) {
    if (req.promptTokens !== null) {
      totalInput += req.promptTokens;
      hasTokens = true;
    }
    if (req.outputTokens !== null) {
      totalOutput += req.outputTokens;
      hasTokens = true;
    }
  }

  // Tool calls total
  const totalToolCalls = requests.reduce(
    (sum, r) => sum + r.toolCalls.length,
    0,
  );

  // Errors
  const errorCount = requests.filter((r) => r.hasError).length;

  // Timing - estimate average tool latency from totalElapsed / toolCallRounds
  const roundsWithTiming = requests.filter(
    (r) => r.totalElapsedMs !== null && r.toolCallRoundCount > 0,
  );
  const avgToolLatency =
    roundsWithTiming.length > 0
      ? Math.round(
          roundsWithTiming.reduce(
            (sum, r) => sum + (r.totalElapsedMs ?? 0) / r.toolCallRoundCount,
            0,
          ) / roundsWithTiming.length,
        )
      : null;

  // Last activity: use the last request timestamp or creation date
  const lastRequestTs = requests
    .map((r) => (r.timestamp ? Number(r.timestamp) : 0))
    .filter((t) => t > 0);
  const lastActivityMs =
    lastRequestTs.length > 0
      ? Math.max(...lastRequestTs)
      : (creationMs ?? Date.now());
  const lastActivity = new Date(lastActivityMs).toISOString();

  // Status
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const status: SessionRecord['status'] =
    lastActivityMs >= cutoff ? 'active' : 'inactive';

  // Synthesize events for timeline
  const events = synthesizeEvents(sessionId, creationDate, requests);

  // Event type counts
  const eventTypeCounts: Record<string, number> = {};
  for (const e of events) {
    eventTypeCounts[e.event] = (eventTypeCounts[e.event] ?? 0) + 1;
  }

  // Available / unavailable signals
  const availableSignals: string[] = ['turns'];
  const unavailableSignals: string[] = [];

  if (hasTokens) {
    availableSignals.push('token usage');
  } else {
    unavailableSignals.push('token usage');
  }

  if (models.size > 0) {
    availableSignals.push('model names');
  } else {
    unavailableSignals.push('model names');
  }

  if (totalToolCalls > 0) {
    availableSignals.push('tool calls');
  }

  return {
    id: sessionId,
    project: workspace.projectName,
    projectPath: workspace.projectPath,
    startTime: creationDate,
    endTime: null,
    lastActivity,
    status,
    title,
    prompt: firstPrompt,
    transcriptFile: null,
    agents,
    models: Array.from(models),
    flow: buildFlow(requests),
    summary: {
      eventCount: events.length,
      userPromptCount: requests.length,
      agentCount: agents.length,
      modelCount: models.size,
      toolCalls: totalToolCalls,
      successfulToolCalls: totalToolCalls - errorCount,
      failedToolCalls: errorCount,
      errors: errorCount,
      averageToolLatencyMs: avgToolLatency,
      maxToolLatencyMs: null,
      eventTypeCounts,
    },
    diagnostics: {
      turns: { count: requests.length, source: 'reported' },
      tokens: hasTokens
        ? {
            input: totalInput,
            output: totalOutput,
            total: totalInput + totalOutput,
            source: 'reported',
          }
        : { input: null, output: null, total: null, source: 'unavailable' },
      toolCallsReported: totalToolCalls,
      availableSignals,
      unavailableSignals,
    },
    events,
  };
}

/* ---------- GET handler ---------- */

export async function GET() {
  const storageRoots = getWorkspaceStorageRoots();
  const workspaces = discoverWorkspaces(storageRoots, []);

  const allSessions: SessionRecord[] = [];
  let totalSessionFiles = 0;

  for (const ws of workspaces) {
    const sessionsDir = path.join(ws.storageDir, 'chatSessions');
    let files: string[];

    try {
      files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith('.jsonl'));
    } catch {
      continue;
    }

    totalSessionFiles += files.length;

    for (const file of files) {
      const filePath = path.join(sessionsDir, file);
      const state = parseChatSessionFile(filePath);
      if (!state) continue;

      const session = buildSession(state, ws);
      if (session) allSessions.push(session);
    }
  }

  allSessions.sort(
    (a, b) =>
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime(),
  );

  return NextResponse.json({
    sessions: allSessions,
    foundLogs: totalSessionFiles,
  });
}
