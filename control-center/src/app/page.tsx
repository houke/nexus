'use client';

import { useEffect, useState } from 'react';

const ARCHIVED_SESSIONS_KEY = 'nexusArchivedSessions';
const ARCHIVED_PROJECTS_KEY = 'nexusArchivedProjects';
const SHOW_ARCHIVED_KEY = 'nexusShowArchivedSessions';
const HIDE_INACTIVE_KEY = 'nexusHideInactiveSessions';

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

type Session = {
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

type SessionsPayload = {
  sessions: Session[];
  foundLogs: number;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatDuration(durationMs: number | null) {
  if (durationMs === null) {
    return 'n/a';
  }

  if (durationMs < 1000) {
    return `${durationMs} ms`;
  }

  return `${(durationMs / 1000).toFixed(1)} s`;
}

function formatNumber(value: number | null) {
  if (value === null) {
    return 'Unavailable';
  }

  return new Intl.NumberFormat('en-US').format(value);
}

function openVscode(targetPath: string) {
  window.location.href = `vscode://file${encodeURI(targetPath)}`;
}

function getEventTitle(event: SessionEvent) {
  if (event.event === 'sessionStart') {
    return 'Session started';
  }
  if (event.event === 'sessionEnd') {
    return 'Session ended';
  }
  if (event.event === 'userPromptSubmitted') {
    return 'User prompt';
  }
  if (event.event === 'preToolUse') {
    return `Tool call: ${event.tool ?? 'unknown'}`;
  }
  if (event.event === 'turnComplete') {
    return 'Turn complete';
  }
  if (event.event === 'errorOccurred') {
    return event.errorName ? `Error: ${event.errorName}` : 'Error';
  }

  return event.event;
}

function getEventDetail(event: SessionEvent) {
  if (event.event === 'sessionStart') {
    return event.description ?? 'Session opened';
  }
  if (event.event === 'sessionEnd') {
    return event.reason ?? 'Completed';
  }
  if (event.event === 'userPromptSubmitted') {
    return event.prompt ?? 'Prompt content unavailable';
  }
  if (event.event === 'preToolUse') {
    return event.description ?? event.tool ?? 'Tool invocation';
  }
  if (event.event === 'turnComplete') {
    const parts: string[] = [];
    if (event.inputTokens)
      parts.push(`${event.inputTokens.toLocaleString()} input tokens`);
    if (event.outputTokens)
      parts.push(`${event.outputTokens.toLocaleString()} output tokens`);
    return parts.length > 0
      ? parts.join(', ')
      : (event.detail ?? 'Turn completed');
  }
  if (event.event === 'errorOccurred') {
    return event.errorMessage ?? event.detail ?? 'Unknown error';
  }

  return event.detail ?? event.description ?? '';
}

function FlowChart({ flow }: { flow: Session['flow'] }) {
  const { nodes, edges, stepCount } = flow;

  if (nodes.length === 0) {
    return <div className='empty-inline'>No agent flow recorded.</div>;
  }

  const nodeW = 140;
  const nodeH = 44;
  const colGap = 20;
  const stepGap = 36;
  const padX = 40;
  const padTop = 18;

  const maxCols = Math.max(
    ...Array.from(
      { length: stepCount },
      (_, s) => nodes.filter((n) => n.step === s).length,
    ),
    1,
  );

  const width = Math.max(
    440,
    padX * 2 + maxCols * nodeW + (maxCols - 1) * colGap,
  );
  const height = padTop + stepCount * (nodeH + stepGap);

  const pos = (node: SessionFlowNode) => {
    const siblings = nodes.filter((n) => n.step === node.step).length;
    const totalW = siblings * nodeW + (siblings - 1) * colGap;
    const startX = (width - totalW) / 2;
    return {
      x: startX + node.column * (nodeW + colGap) + nodeW / 2,
      y: padTop + node.step * (nodeH + stepGap) + nodeH / 2,
    };
  };

  const positions = new Map(nodes.map((n) => [n.id, pos(n)]));

  return (
    <div className='flow-shell'>
      <div className='flow-legend'>
        <span className='legend-chip legend-chip-system'>System</span>
        <span className='legend-chip legend-chip-user'>User</span>
        <span className='legend-chip legend-chip-agent'>Agent</span>
        <span className='legend-chip legend-chip-subagent'>Subagent</span>
        <span className='legend-chip legend-chip-tool'>Tool</span>
        <span className='legend-chip legend-chip-bundle'>Bundle</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className='flow-chart'
        role='img'
        aria-label='Agent flow chart'
      >
        <defs>
          <marker
            id='flow-arrow'
            viewBox='0 0 10 10'
            refX='10'
            refY='5'
            markerWidth='8'
            markerHeight='8'
            orient='auto-start-reverse'
          >
            <path d='M 0 0 L 10 5 L 0 10 z' fill='rgba(87,210,192,0.6)' />
          </marker>
        </defs>

        {edges.map((edge) => {
          const from = positions.get(edge.from);
          const to = positions.get(edge.to);
          if (!from || !to) return null;

          const x1 = from.x;
          const y1 = from.y + nodeH / 2;
          const x2 = to.x;
          const y2 = to.y - nodeH / 2;

          const pathData =
            Math.abs(x2 - x1) < 2
              ? `M ${x1} ${y1} L ${x2} ${y2}`
              : `M ${x1} ${y1} C ${x1} ${y1 + stepGap * 0.5}, ${x2} ${y2 - stepGap * 0.5}, ${x2} ${y2}`;

          return (
            <path
              key={`${edge.from}-${edge.to}`}
              d={pathData}
              className='flow-edge'
              markerEnd='url(#flow-arrow)'
            />
          );
        })}

        {nodes.map((node) => {
          const p = positions.get(node.id)!;
          return (
            <g key={node.id}>
              <rect
                x={p.x - nodeW / 2}
                y={p.y - nodeH / 2}
                width={nodeW}
                height={nodeH}
                rx='14'
                className={`flow-node flow-node-${node.kind}`}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor='middle'
                className='flow-node-label'
              >
                {node.label.length > 18
                  ? `${node.label.slice(0, 16)}…`
                  : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [foundLogs, setFoundLogs] = useState(0);
  const [detailTab, setDetailTab] = useState<'timeline' | 'flow'>('timeline');
  const [archivedSessionIds, setArchivedSessionIds] = useState<string[]>([]);
  const [archivedProjectPaths, setArchivedProjectPaths] = useState<string[]>(
    [],
  );
  const [showArchived, setShowArchived] = useState(false);
  const [hideInactive, setHideInactive] = useState(false);

  const loadSessions = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const data = (await response.json()) as SessionsPayload;
      setSessions(data.sessions ?? []);
      setFoundLogs(data.foundLogs ?? 0);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to load sessions.',
      );
      setSessions([]);
      setFoundLogs(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedArchived = window.localStorage.getItem(ARCHIVED_SESSIONS_KEY);
    if (savedArchived) {
      try {
        const parsedArchived = JSON.parse(savedArchived) as string[];
        if (Array.isArray(parsedArchived)) {
          setArchivedSessionIds(
            parsedArchived.filter(
              (value): value is string =>
                typeof value === 'string' && value.length > 0,
            ),
          );
        }
      } catch {
        window.localStorage.removeItem(ARCHIVED_SESSIONS_KEY);
      }
    }

    const savedArchivedProjects = window.localStorage.getItem(
      ARCHIVED_PROJECTS_KEY,
    );
    if (savedArchivedProjects) {
      try {
        const parsedArchivedProjects = JSON.parse(
          savedArchivedProjects,
        ) as string[];
        if (Array.isArray(parsedArchivedProjects)) {
          setArchivedProjectPaths(
            parsedArchivedProjects.filter(
              (value): value is string =>
                typeof value === 'string' && value.length > 0,
            ),
          );
        }
      } catch {
        window.localStorage.removeItem(ARCHIVED_PROJECTS_KEY);
      }
    }

    const savedShowArchived = window.localStorage.getItem(SHOW_ARCHIVED_KEY);
    if (savedShowArchived === 'true') {
      setShowArchived(true);
    }

    const savedHideInactive = window.localStorage.getItem(HIDE_INACTIVE_KEY);
    if (savedHideInactive === 'true') {
      setHideInactive(true);
    }

    void loadSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setDetailTab('timeline');
    }
  }, [selectedSession?.id]);

  useEffect(() => {
    if (!selectedSession) {
      return;
    }

    const isArchived = archivedSessionIds.includes(selectedSession.id);
    const isProjectArchived = archivedProjectPaths.includes(
      selectedSession.projectPath,
    );
    const isHiddenByArchive =
      (isArchived || isProjectArchived) && !showArchived;
    const isHiddenByStatus =
      hideInactive && selectedSession.status === 'inactive';

    if (isHiddenByArchive || isHiddenByStatus) {
      setSelectedSession(null);
    }
  }, [
    archivedProjectPaths,
    archivedSessionIds,
    hideInactive,
    selectedSession,
    showArchived,
  ]);

  useEffect(() => {
    window.localStorage.setItem(
      ARCHIVED_SESSIONS_KEY,
      JSON.stringify(archivedSessionIds),
    );
  }, [archivedSessionIds]);

  useEffect(() => {
    window.localStorage.setItem(
      ARCHIVED_PROJECTS_KEY,
      JSON.stringify(archivedProjectPaths),
    );
  }, [archivedProjectPaths]);

  useEffect(() => {
    window.localStorage.setItem(SHOW_ARCHIVED_KEY, String(showArchived));
  }, [showArchived]);

  useEffect(() => {
    window.localStorage.setItem(HIDE_INACTIVE_KEY, String(hideInactive));
  }, [hideInactive]);

  const toggleArchived = (sessionId: string) => {
    setArchivedSessionIds((current) =>
      current.includes(sessionId)
        ? current.filter((value) => value !== sessionId)
        : [...current, sessionId],
    );
  };

  const toggleProjectArchived = (projectPath: string) => {
    setArchivedProjectPaths((current) =>
      current.includes(projectPath)
        ? current.filter((value) => value !== projectPath)
        : [...current, projectPath],
    );
  };

  const archiveInactiveSessions = () => {
    const inactiveIds = sessions
      .filter((session) => session.status === 'inactive')
      .map((session) => session.id);

    if (inactiveIds.length === 0) {
      return;
    }

    setArchivedSessionIds((current) =>
      Array.from(new Set([...current, ...inactiveIds])),
    );
  };

  const clearArchived = () => {
    setArchivedSessionIds([]);
    setArchivedProjectPaths([]);
  };

  const archivedSessions = new Set(archivedSessionIds);
  const archivedProjects = new Set(archivedProjectPaths);
  const visibleSessions = sessions.filter((session) => {
    const isArchived = archivedSessions.has(session.id);
    const isProjectArchived = archivedProjects.has(session.projectPath);

    if (!showArchived && (isArchived || isProjectArchived)) {
      return false;
    }

    if (hideInactive && session.status === 'inactive') {
      return false;
    }

    return true;
  });

  const archivedCount = sessions.filter((session) =>
    archivedSessions.has(session.id),
  ).length;
  const archivedProjectCount = archivedProjectPaths.length;
  const inactiveCount = sessions.filter(
    (session) => session.status === 'inactive',
  ).length;

  const totalEvents = visibleSessions.reduce(
    (sum, session) => sum + session.summary.eventCount,
    0,
  );
  const totalErrors = visibleSessions.reduce(
    (sum, session) => sum + session.summary.errors,
    0,
  );
  const totalTools = visibleSessions.reduce(
    (sum, session) => sum + session.summary.toolCalls,
    0,
  );
  const totalTurns = visibleSessions.reduce(
    (sum, session) => sum + (session.diagnostics.turns.count ?? 0),
    0,
  );
  const totalTokens = visibleSessions.reduce(
    (sum, session) => sum + (session.diagnostics.tokens.total ?? 0),
    0,
  );
  const hasTokenTotals = visibleSessions.some(
    (session) => session.diagnostics.tokens.total !== null,
  );

  return (
    <div className='shell'>
      <div className='shell-glow shell-glow-left' />
      <div className='shell-glow shell-glow-right' />

      <main className='page'>
        <header className='hero'>
          <div>
            <p className='eyebrow'>Agent observability</p>
            <h1>Nexus Control Center</h1>
            <p className='hero-copy'>
              Inspect session turns, tool traffic, errors, event timelines, and
              agent flow from VS Code chat session data.
            </p>
          </div>
          <div className='hero-actions'>
            <button className='button' onClick={() => void loadSessions()}>
              Refresh
            </button>
          </div>
        </header>

        <section className='overview-grid'>
          <article className='metric-card'>
            <span className='metric-label'>Sessions</span>
            <strong>{visibleSessions.length}</strong>
            <small>
              {sessions.length} total, {archivedCount} session archived,{' '}
              {archivedProjectCount} project archived
            </small>
          </article>
          <article className='metric-card'>
            <span className='metric-label'>Turns</span>
            <strong>{formatNumber(totalTurns)}</strong>
            <small>From VS Code chat session data</small>
          </article>
          <article className='metric-card'>
            <span className='metric-label'>Tool calls</span>
            <strong>{formatNumber(totalTools)}</strong>
            <small>Tool invocations across all sessions</small>
          </article>
          <article className='metric-card'>
            <span className='metric-label'>Errors</span>
            <strong>{formatNumber(totalErrors)}</strong>
            <small>Request errors across all sessions</small>
          </article>
          <article className='metric-card'>
            <span className='metric-label'>Events</span>
            <strong>{formatNumber(totalEvents)}</strong>
            <small>Synthesized timeline entries</small>
          </article>
          <article className='metric-card'>
            <span className='metric-label'>Total tokens</span>
            <strong>
              {hasTokenTotals ? formatNumber(totalTokens) : 'Unavailable'}
            </strong>
            <small>From VS Code chat session metadata</small>
          </article>
        </section>

        <section className='panel panel-meta'>
          <div>
            <span className='panel-kicker'>Data source</span>
            <p>
              All data comes directly from VS Code chat session storage (both
              Code and Code Insiders). Token counts match the debug panel.
            </p>
          </div>
        </section>

        <section className='panel panel-toolbar'>
          <div className='filter-group'>
            <button
              className={`filter-chip ${hideInactive ? 'filter-chip-active' : ''}`}
              onClick={() => setHideInactive((current) => !current)}
              type='button'
            >
              {hideInactive ? 'Showing active/completed only' : 'Hide inactive'}
            </button>
            <button
              className={`filter-chip ${showArchived ? 'filter-chip-active' : ''}`}
              onClick={() => setShowArchived((current) => !current)}
              type='button'
            >
              {showArchived ? 'Showing archived' : 'Hide archived'}
            </button>
          </div>
          <div className='hero-actions'>
            <span className='toolbar-copy'>
              Archive is local to this Control Center view. It does not remove
              or modify VS Code chats.
            </span>
            {inactiveCount > 0 ? (
              <button
                className='button button-muted'
                onClick={archiveInactiveSessions}
                type='button'
              >
                Archive all inactive
              </button>
            ) : null}
            {archivedCount > 0 || archivedProjectCount > 0 ? (
              <button
                className='button button-muted'
                onClick={clearArchived}
                type='button'
              >
                Clear all archive rules
              </button>
            ) : null}
          </div>
        </section>

        <section className='panel panel-table'>
          {loading ? (
            <div className='empty-state'>
              <div className='loader' />
              <p>Scanning for Nexus sessions and building diagnostics...</p>
            </div>
          ) : errorMessage ? (
            <div className='empty-state'>
              <h2>Unable to load sessions</h2>
              <p>{errorMessage}</p>
            </div>
          ) : visibleSessions.length === 0 ? (
            <div className='empty-state'>
              <h2>No visible sessions</h2>
              <p>
                Adjust the inactive or archive filters, or start a Copilot chat
                in VS Code to generate session data.
              </p>
            </div>
          ) : (
            <div className='table-wrap'>
              <table className='sessions-table'>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Project</th>
                    <th>Session</th>
                    <th>Turns</th>
                    <th>Tools</th>
                    <th>Errors</th>
                    <th>Last activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleSessions.map((session) => {
                    const isArchived = archivedSessions.has(session.id);
                    const isProjectArchived = archivedProjects.has(
                      session.projectPath,
                    );

                    return (
                      <tr key={session.id}>
                        <td>
                          <div className='status-stack'>
                            <span
                              className={`status-pill status-${session.status}`}
                            >
                              {session.status}
                            </span>
                            {isArchived ? (
                              <span className='status-pill status-archived'>
                                archived
                              </span>
                            ) : null}
                            {isProjectArchived ? (
                              <span className='status-pill status-project-archived'>
                                project archived
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <div className='project-cell'>
                            <strong>{session.project}</strong>
                            <span>
                              {session.agents.join(' | ') ||
                                'No agents detected'}
                            </span>
                          </div>
                        </td>
                        <td className='prompt-cell'>
                          <div className='session-cell'>
                            <strong className='session-title'>
                              {session.title ?? 'Untitled chat'}
                            </strong>
                            {session.prompt ? (
                              <span className='session-prompt'>
                                {session.prompt}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <div className='stat-stack'>
                            <strong>
                              {session.diagnostics.turns.count ?? 'n/a'}
                            </strong>
                            <span className='signal-chip'>
                              {session.diagnostics.turns.source}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className='stat-stack'>
                            <strong>{session.summary.toolCalls}</strong>
                            <span>
                              {session.summary.successfulToolCalls} ok /{' '}
                              {session.summary.failedToolCalls} fail
                            </span>
                          </div>
                        </td>
                        <td>{session.summary.errors}</td>
                        <td>{formatDate(session.lastActivity)}</td>
                        <td>
                          <div className='action-row'>
                            <button
                              className='button button-muted'
                              onClick={() => setSelectedSession(session)}
                            >
                              Inspect
                            </button>
                            <button
                              className='button'
                              onClick={() => openVscode(session.projectPath)}
                            >
                              Workspace
                            </button>
                            <button
                              className='button button-muted'
                              onClick={() => toggleArchived(session.id)}
                              type='button'
                            >
                              {isArchived ? 'Unarchive' : 'Archive'}
                            </button>
                            <button
                              className='button button-muted'
                              onClick={() =>
                                toggleProjectArchived(session.projectPath)
                              }
                              type='button'
                            >
                              {isProjectArchived
                                ? 'Unarchive project'
                                : 'Archive project'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {selectedSession ? (
        <div className='modal-overlay' onClick={() => setSelectedSession(null)}>
          <div className='modal' onClick={(event) => event.stopPropagation()}>
            <header className='modal-header'>
              <div>
                <p className='eyebrow'>Session diagnostics</p>
                <h2>{selectedSession.project}</h2>
                <p className='modal-subtitle'>{selectedSession.id}</p>
              </div>
              <div className='action-row'>
                <button
                  className='button button-muted'
                  onClick={() =>
                    toggleProjectArchived(selectedSession.projectPath)
                  }
                  type='button'
                >
                  {archivedProjects.has(selectedSession.projectPath)
                    ? 'Unarchive project'
                    : 'Archive project'}
                </button>
                <button
                  className='button button-muted'
                  onClick={() => toggleArchived(selectedSession.id)}
                  type='button'
                >
                  {archivedSessions.has(selectedSession.id)
                    ? 'Unarchive'
                    : 'Archive'}
                </button>
                <button
                  className='button button-muted'
                  onClick={() => setSelectedSession(null)}
                >
                  Close
                </button>
              </div>
            </header>

            <div className='modal-body'>
              <section className='session-grid'>
                <article className='session-card'>
                  <span className='metric-label'>Turns</span>
                  <strong>
                    {selectedSession.diagnostics.turns.count ?? 'n/a'}
                  </strong>
                  <small>{selectedSession.diagnostics.turns.source}</small>
                </article>
                <article className='session-card'>
                  <span className='metric-label'>Tool calls</span>
                  <strong>{selectedSession.summary.toolCalls}</strong>
                  <small>
                    {selectedSession.summary.successfulToolCalls} ok /{' '}
                    {selectedSession.summary.failedToolCalls} fail
                  </small>
                </article>
                <article className='session-card'>
                  <span className='metric-label'>Total tokens</span>
                  <strong>
                    {formatNumber(selectedSession.diagnostics.tokens.total)}
                  </strong>
                  <small>
                    {selectedSession.diagnostics.tokens.source === 'reported'
                      ? 'VS Code session data'
                      : selectedSession.diagnostics.tokens.source}
                  </small>
                </article>
                <article className='session-card'>
                  <span className='metric-label'>Errors</span>
                  <strong>{selectedSession.summary.errors}</strong>
                  <small>{selectedSession.summary.eventCount} events</small>
                </article>
                <article className='session-card'>
                  <span className='metric-label'>Average tool latency</span>
                  <strong>
                    {formatDuration(
                      selectedSession.summary.averageToolLatencyMs,
                    )}
                  </strong>
                  <small>
                    Peak{' '}
                    {formatDuration(selectedSession.summary.maxToolLatencyMs)}
                  </small>
                </article>
                <article className='session-card'>
                  <span className='metric-label'>Models</span>
                  <strong>
                    {selectedSession.models.length > 0
                      ? selectedSession.models.join(', ')
                      : 'Unavailable'}
                  </strong>
                  <small>From VS Code chat session data</small>
                </article>
              </section>

              <section className='detail-columns'>
                <article className='detail-card detail-card-main'>
                  <div className='detail-head detail-head-stack'>
                    <div>
                      <h3>Activity inspector</h3>
                      <span>
                        Switch between the raw event timeline and inferred flow.
                      </span>
                    </div>
                    <div className='detail-actions'>
                      <div
                        className='detail-tabs'
                        role='tablist'
                        aria-label='Session detail views'
                      >
                        <button
                          type='button'
                          className={detailTab === 'timeline' ? 'active' : ''}
                          onClick={() => setDetailTab('timeline')}
                          role='tab'
                          aria-selected={detailTab === 'timeline'}
                        >
                          Timeline
                        </button>
                        <button
                          type='button'
                          className={detailTab === 'flow' ? 'active' : ''}
                          onClick={() => setDetailTab('flow')}
                          role='tab'
                          aria-selected={detailTab === 'flow'}
                        >
                          Flowchart
                        </button>
                      </div>
                      <div className='action-row'>
                        <button
                          className='button button-muted'
                          onClick={() =>
                            openVscode(selectedSession.projectPath)
                          }
                        >
                          Open workspace
                        </button>
                        {selectedSession.transcriptFile ? (
                          <button
                            className='button'
                            onClick={() =>
                              openVscode(selectedSession.transcriptFile!)
                            }
                          >
                            Open transcript
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {detailTab === 'timeline' ? (
                    <div className='timeline'>
                      {selectedSession.events.map((event, index) => (
                        <article
                          key={`${event.ts}-${event.event}-${index}`}
                          className='timeline-event'
                        >
                          <div className='timeline-meta'>
                            <span>{formatDate(event.ts)}</span>
                            {event.agent ? <span>{event.agent}</span> : null}
                            {event.model ? <span>{event.model}</span> : null}
                          </div>
                          <h4>{getEventTitle(event)}</h4>
                          <p>{getEventDetail(event)}</p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className='inspector-panel'>
                      <p className='inspector-note'>
                        Subagents and bundled tool invocations are surfaced as
                        their own nodes.
                      </p>
                      <div className='detail-head detail-head-inline'>
                        <h3>Agent flow</h3>
                        <span>{selectedSession.flow.nodes.length} steps</span>
                      </div>
                      <FlowChart flow={selectedSession.flow} />
                    </div>
                  )}
                </article>

                <article className='detail-card detail-card-side'>
                  <div className='detail-head'>
                    <h3>Signal coverage</h3>
                    <span>Available data signals from VS Code</span>
                  </div>
                  <div className='signal-groups'>
                    <div>
                      <span className='signal-title'>Available</span>
                      <div className='signal-list'>
                        {selectedSession.diagnostics.availableSignals.map(
                          (signal) => (
                            <span
                              key={signal}
                              className='signal-chip signal-chip-available'
                            >
                              {signal}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <span className='signal-title'>Unavailable</span>
                      <div className='signal-list'>
                        {selectedSession.diagnostics.unavailableSignals.map(
                          (signal) => (
                            <span
                              key={signal}
                              className='signal-chip signal-chip-missing'
                            >
                              {signal}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='event-mix'>
                    {Object.entries(
                      selectedSession.summary.eventTypeCounts,
                    ).map(([eventType, count]) => (
                      <div key={eventType} className='event-row'>
                        <span>{eventType}</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
