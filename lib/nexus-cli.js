#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WORKFLOW_DEFINITIONS = {
  init: { slug: 'nexus-init', label: 'init' },
  planning: { slug: 'nexus-planning', label: 'planning' },
  execution: { slug: 'nexus-execution', label: 'execution' },
  review: { slug: 'nexus-review', label: 'review' },
  summary: { slug: 'nexus-summary', label: 'summary' },
  sync: { slug: 'nexus-sync', label: 'sync' },
  hotfix: { slug: 'nexus-hotfix', label: 'hotfix' },
};

const WORKFLOW_ALIASES = {
  init: 'init',
  initialize: 'init',
  plan: 'planning',
  planning: 'planning',
  execute: 'execution',
  execution: 'execution',
  exec: 'execution',
  review: 'review',
  summary: 'summary',
  summarize: 'summary',
  sync: 'sync',
  reconcile: 'sync',
  hotfix: 'hotfix',
  fix: 'hotfix',
};

const TOOL_EXPLANATIONS = {
  vscode:
    'Editor-integrated affordances such as asking follow-up questions, surfacing files, or invoking editor commands. In a generic CLI agent, this usually maps to plain terminal prompts and local file paths.',
  execute:
    'Shell command execution. The runtime must be able to run non-interactive commands and preserve working-directory context.',
  read: 'File reads. The runtime should be able to inspect prompt files, plans, templates, logs, and source code.',
  edit: 'File creation and patch-style edits. The runtime should support safe, explicit code modifications instead of opaque regeneration.',
  search:
    'Fast file and text search, ideally with ripgrep or equivalent, to discover plans, prompts, agents, and implementation files.',
  web: 'Optional web fetch capability for documentation or external references used during planning, review, or research.',
  agent:
    'Subagent delegation. If the CLI framework supports multiple agents, map this directly. If not, emulate delegation by running the same workflow in staged persona-specific passes.',
  'filesystem/*':
    'Structured file-system operations such as listing, creating, moving, and reading multiple files. Useful for templates, feature folders, and generated docs.',
  'sequential-thinking/*':
    'Explicit stepwise reasoning or planning scratchpad support. Helpful for orchestration and review workflows with multiple decision points.',
  'playwright/*':
    'Browser automation for E2E verification, UI inspection, and reproduction of user-facing issues.',
  todo: 'Task-plan tracking for multi-step orchestration. A simple todo list or plan file is sufficient if the runtime lacks a dedicated planner.',
};

const CANONICAL_WORKFLOWS_REL = path.join('plugins', 'nexus', 'skills', 'nexus-workflows', 'workflows');
const CANONICAL_AGENTS_REL = path.join('plugins', 'nexus', 'agents');
const ROOT_MARKERS = ['AGENTS.md', path.join('plugins', 'nexus'), '.nexus'];

function findRepoRoot(startDir) {
  let currentDir = path.resolve(startDir);

  while (true) {
    const found = ROOT_MARKERS.some((marker) =>
      fs.existsSync(path.join(currentDir, marker)),
    );
    if (found) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return null;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { attributes: { tools: [] }, body: markdown };
  }

  const frontmatter = match[1];
  const body = match[2];
  const attributes = {};

  for (const field of ['name', 'description', 'agent', 'model']) {
    const fieldMatch = frontmatter.match(
      new RegExp(`^${field}:\\s*(.+)$`, 'm'),
    );
    if (fieldMatch) {
      attributes[field] = fieldMatch[1].trim().replace(/^[\'"]|[\'"]$/g, '');
    }
  }

  const toolsMatch = frontmatter.match(/tools:\s*\[([\s\S]*?)\]/m);
  attributes.tools = toolsMatch
    ? toolsMatch[1]
        .split(',')
        .map((value) => value.trim().replace(/^[\'"]|[\'"]$/g, ''))
        .filter(Boolean)
    : [];

  return { attributes, body };
}

function resolveWorkflow(name) {
  const normalized = WORKFLOW_ALIASES[name];
  if (!normalized) {
    return null;
  }

  return WORKFLOW_DEFINITIONS[normalized];
}

function listWorkflows() {
  return Object.values(WORKFLOW_DEFINITIONS).map((workflow) => workflow.label);
}

function loadWorkflowPrompt(repoRoot, workflowName) {
  const workflow = resolveWorkflow(workflowName);
  if (!workflow) {
    return null;
  }

  const promptPath = path.join(
    repoRoot,
    CANONICAL_WORKFLOWS_REL,
    `${workflow.label}.md`,
  );

  if (!fs.existsSync(promptPath)) {
    return { error: 'missing', workflow, promptPath };
  }

  try {
    const content = fs.readFileSync(promptPath, 'utf8');
    const parsed = parseFrontmatter(content);

    return {
      workflow,
      promptPath,
      raw: content,
      ...parsed,
    };
  } catch (err) {
    return { error: 'unreadable', workflow, promptPath, detail: err.message };
  }
}

function formatToolGuide(tools) {
  const uniqueTools = [...new Set(tools)];
  if (uniqueTools.length === 0) {
    return 'No tool metadata declared.';
  }

  return uniqueTools
    .map((tool) => {
      const explanation =
        TOOL_EXPLANATIONS[tool] || 'No mapping documented yet.';
      return `- ${tool}: ${explanation}`;
    })
    .join('\n');
}

function renderWorkflowBrief(loadedPrompt, userRequest) {
  const requestBlock = userRequest
    ? `\n## Requested User Context\n\n${userRequest.trim()}\n`
    : '';

  return [
    `# Nexus CLI Workflow: ${loadedPrompt.workflow.label}`,
    '',
    `Source prompt: ${loadedPrompt.promptPath}`,
    `Agent: ${loadedPrompt.attributes.agent || 'Nexus'}`,
    `Model: ${loadedPrompt.attributes.model || 'Unspecified'}`,
    `Description: ${loadedPrompt.attributes.description || 'No description provided.'}`,
    '',
    '## Runtime Capability Contract',
    '',
    formatToolGuide(loadedPrompt.attributes.tools),
    '',
    '## Prompt',
    '',
    loadedPrompt.raw.trim(),
    requestBlock.trimEnd(),
  ]
    .filter(Boolean)
    .join('\n');
}

function printHelp(stdout) {
  stdout.write(`Nexus CLI\n\n`);
  stdout.write(`Usage:\n`);
  stdout.write(`  nexus doctor             Check repo health\n`);
  stdout.write(`  nexus list               List available workflows\n`);
  stdout.write(`  nexus tools [workflow]   Show tool requirements\n`);
  stdout.write(`  nexus <workflow> [request...]\n\n`);
  stdout.write(`Workflows:\n`);
  stdout.write(`  ${listWorkflows().join(', ')}\n\n`);
  stdout.write(`Examples:\n`);
  stdout.write(`  nexus planning "Plan an offline-first kanban app"\n`);
  stdout.write(`  nexus doctor\n`);
}

function runCli(argv, io) {
  const { cwd, stdout, stderr } = io;
  const repoRoot = findRepoRoot(cwd);
  const [command, ...rest] = argv;

  if (
    !command ||
    command === 'help' ||
    command === '--help' ||
    command === '-h'
  ) {
    printHelp(stdout);
    return 0;
  }

  if (command === 'list') {
    stdout.write(`${listWorkflows().join('\n')}\n`);
    return 0;
  }

  if (command === 'doctor') {
    if (!repoRoot) {
      stdout.write(`Repo root: (not found)\n`);
      stdout.write(`State: pre-init\n`);
      stdout.write(
        `\nNo Nexus repository detected from ${cwd}.\n` +
        `Navigate to a Nexus repo, or run the /init workflow inside your target project.\n`,
      );
      return 1;
    }

    const hasAgentsMd = fs.existsSync(path.join(repoRoot, 'AGENTS.md'));
    const hasAgents = fs.existsSync(path.join(repoRoot, CANONICAL_AGENTS_REL));
    const hasWorkflows = fs.existsSync(
      path.join(repoRoot, CANONICAL_WORKFLOWS_REL),
    );
    const hasNexus = fs.existsSync(path.join(repoRoot, '.nexus'));
    const hasMarketplace = fs.existsSync(
      path.join(repoRoot, '.github', 'plugin', 'marketplace.json'),
    );
    const state = hasNexus
      ? hasAgentsMd && hasAgents && hasWorkflows
        ? 'healthy'
        : 'drifted'
      : 'pre-init';

    stdout.write(`Repo root: ${repoRoot}\n`);
    stdout.write(`\n[Canonical paths]\n`);
    stdout.write(`AGENTS.md: ${hasAgentsMd ? 'ok' : 'missing'}\n`);
    stdout.write(`Agents (${CANONICAL_AGENTS_REL}): ${hasAgents ? 'ok' : 'missing'}\n`);
    stdout.write(`Workflows (${CANONICAL_WORKFLOWS_REL}): ${hasWorkflows ? 'ok' : 'missing'}\n`);
    stdout.write(`.nexus: ${hasNexus ? 'ok' : 'missing'}\n`);
    stdout.write(`Marketplace (info only): ${hasMarketplace ? 'ok' : 'missing'}\n`);
    stdout.write(`\nState: ${state}\n`);

    if (state === 'pre-init') {
      stdout.write(
        `\nNexus has not been initialized yet. Run the /init workflow in a downstream repository or create .nexus/ to get started.\n`,
      );
    } else if (state === 'drifted') {
      stdout.write(
        `\nSome expected canonical Nexus paths are missing. Run /sync to reconcile docs or check AGENTS.md for the current setup contract.\n`,
      );
    }

    return state === 'healthy' ? 0 : 1;
  }

  if (!repoRoot) {
    stderr.write(
      `Could not locate a Nexus repository from ${cwd}.\n` +
      `Navigate to a Nexus repo or run "nexus doctor" for diagnostics.\n`,
    );
    return 1;
  }

  if (command === 'tools') {
    const workflowName = rest[0];
    if (!workflowName) {
      stdout.write(`${formatToolGuide(Object.keys(TOOL_EXPLANATIONS))}\n`);
      return 0;
    }

    const loadedPrompt = loadWorkflowPrompt(repoRoot, workflowName);
    if (!loadedPrompt) {
      stderr.write(`Unknown workflow: ${workflowName}\n`);
      return 1;
    }
    if (loadedPrompt.error) {
      stderr.write(
        `Workflow "${workflowName}" is recognized but its file is ${loadedPrompt.error}.\n`,
      );
      stderr.write(`Expected: ${loadedPrompt.promptPath}\n`);
      stderr.write(`Run "nexus doctor" to check your Nexus installation.\n`);
      return 1;
    }

    stdout.write(`${formatToolGuide(loadedPrompt.attributes.tools)}\n`);
    return 0;
  }

  const loadedPrompt = loadWorkflowPrompt(repoRoot, command);
  if (!loadedPrompt) {
    stderr.write(`Unknown command: ${command}\n\n`);
    printHelp(stderr);
    return 1;
  }
  if (loadedPrompt.error) {
    stderr.write(
      `Workflow "${command}" is recognized but its file is ${loadedPrompt.error}.\n`,
    );
    stderr.write(`Expected: ${loadedPrompt.promptPath}\n`);
    stderr.write(`Run "nexus doctor" to check your Nexus installation.\n`);
    return 1;
  }

  stdout.write(`${renderWorkflowBrief(loadedPrompt, rest.join(' '))}\n`);
  return 0;
}

if (require.main === module) {
  process.stdout.on('error', (err) => {
    if (err.code === 'EPIPE') process.exit(0);
    throw err;
  });
  process.stderr.on('error', (err) => {
    if (err.code === 'EPIPE') process.exit(0);
    throw err;
  });

  const args = process.argv.slice(2);
  const code = runCli(args, {
    cwd: process.cwd(),
    stdout: process.stdout,
    stderr: process.stderr,
  });
  process.exitCode = code;
}

module.exports = {
  CANONICAL_AGENTS_REL,
  CANONICAL_WORKFLOWS_REL,
  ROOT_MARKERS,
  TOOL_EXPLANATIONS,
  WORKFLOW_DEFINITIONS,
  findRepoRoot,
  formatToolGuide,
  listWorkflows,
  loadWorkflowPrompt,
  parseFrontmatter,
  renderWorkflowBrief,
  resolveWorkflow,
  runCli,
};
